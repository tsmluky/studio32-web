"""Pruebas sin escritura ni red del límite de confianza editorial."""
import copy
import importlib.util
from pathlib import Path
import unittest
import tempfile

spec = importlib.util.spec_from_file_location('renderer', Path(__file__).with_name('generar-discovery.py'))
renderer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(renderer)
guard_spec = importlib.util.spec_from_file_location('guard', Path(__file__).with_name('publication-safety.py'))
guard = importlib.util.module_from_spec(guard_spec)
guard_spec.loader.exec_module(guard)


class ContentSecurity(unittest.TestCase):
    def test_public_urls_ignore_comments_but_block_active_local_and_preview(self):
        parser = guard.PublicURLs()
        parser.feed('<!-- <script src="http://localhost:3000/test.js"></script> -->')
        self.assertEqual(parser.errors, [])
        parser.feed('<script src="http://localhost:3000/test.js"></script><a href="https://preview.pages.dev/">test</a>')
        self.assertEqual(parser.errors, ['URL local activa', 'URL de staging activa'])

    def test_private_files_and_credentials_are_redacted(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / '.env.local').write_text('example=true')
            sample = 'sb_' + 'secret_' + 'A' * 24
            (root / 'test.js').write_text('const example = "' + sample + '";')
            errors = guard.check_site(root)
            self.assertEqual(len(errors), 2)
            self.assertNotIn(sample, '\n'.join(errors))

    def test_current_content_valid(self):
        renderer.validate_content(renderer.DATA)

    def test_paths_cannot_escape(self):
        for slug in ('../legal', '/tmp', 'recursos/../legal', 'recursos/%2e%2e', 'recursos\\foo', 'recursos//foo'):
            with self.subTest(slug=slug), self.assertRaises(ValueError):
                renderer.safe_slug(slug)

    def test_sources_reject_active_schemes_and_credentials(self):
        for url in ('javascript:alert(1)', 'data:text/html,test', '//example.com', 'http://example.com', 'https://u:p@example.com', 'https://example.com\n/x', 'https://example.com\\@evil.com'):
            with self.subTest(url=url), self.assertRaises(ValueError):
                renderer.safe_source_url(url)
        self.assertEqual(renderer.safe_source_url('https://example.com/a?q=1&b=2#c'), 'https://example.com/a?q=1&b=2#c')

    def test_raw_html_and_json_cannot_break_markup(self):
        rendered = renderer.text('<img src=x onerror=alert(1)> [[recursos/test|<script>]]', 'recursos/test')
        self.assertNotIn('<img', rendered)
        self.assertNotIn('<script>', rendered)
        self.assertIn('&lt;img', rendered)
        self.assertIn('href="../../recursos/test/"', rendered)
        self.assertNotIn('</script><script>', renderer.jsonld({'name': '</script><script>alert(1)</script>'}))

    def test_inconsistent_data_fails_before_generation(self):
        for change in ('duplicate', 'missing-related', 'bad-source'):
            data = copy.deepcopy(renderer.DATA)
            if change == 'duplicate': data['pages'].append(data['pages'][0])
            elif change == 'missing-related': data['pages'][0]['related'] = ['recursos/inexistente']
            else: next(iter(data['sources'].values()))['url'] = 'javascript:alert(1)'
            with self.subTest(change=change), self.assertRaises(ValueError):
                renderer.validate_content(data)


if __name__ == '__main__':
    unittest.main()
