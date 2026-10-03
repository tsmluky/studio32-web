"""Evitar sobrescritura de evidencia y falsos éxitos; sin peticiones reales."""
import importlib.util
import json
import io
from contextlib import redirect_stdout, redirect_stderr
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('http_audit',Path(__file__).with_name('auditar-http.py'))
audit=importlib.util.module_from_spec(spec); spec.loader.exec_module(audit)


class AuditTests(unittest.TestCase):
    def test_existing_report_is_preserved_without_network(self):
        with tempfile.TemporaryDirectory() as directory:
            output=Path(directory)/'baseline.json'; output.write_text('original')
            with patch.object(audit,'check') as check, redirect_stderr(io.StringIO()):
                with self.assertRaises(SystemExit): audit.main(['--output',str(output)])
                check.assert_not_called()
            self.assertEqual(output.read_text(),'original')

    def test_timestamp_and_soft_404_failure(self):
        with patch.object(audit,'check',side_effect=lambda url:{'url':url,'status':200}), redirect_stdout(io.StringIO()) as stream:
            self.assertEqual(audit.main([]),1)
        report=json.loads(stream.getvalue())
        self.assertIn('+00:00',report['checkedAt'])
        self.assertNotIn('date',report)

    def test_expected_404_and_network_error(self):
        def result(url): return {'url':url,'status':404 if 'no-existe-seo-qa' in url else 200}
        with patch.object(audit,'check',side_effect=result), redirect_stdout(io.StringIO()):
            self.assertEqual(audit.main([]),0)
        with patch.object(audit,'check',side_effect=lambda url:{'url':url,'error':'timeout'}), redirect_stdout(io.StringIO()):
            self.assertEqual(audit.main([]),1)


if __name__=='__main__': unittest.main()
