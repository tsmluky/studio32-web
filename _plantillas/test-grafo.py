"""Escenarios de grafo y resolución de enlaces; no accede a la red."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('graph', Path(__file__).with_name('revisar-grafo.py'))
graph = importlib.util.module_from_spec(spec)
spec.loader.exec_module(graph)


class GraphTests(unittest.TestCase):
    def test_cycle_orphan_and_shortest_path(self):
        incoming, depth = graph.analyse({'/': {'a', 'c'}, 'a': {'b'}, 'b': {'c'}, 'c': {'a'}, 'orphan': set()}, '/')
        self.assertEqual(depth['c'], 1)
        self.assertEqual(depth['b'], 2)
        self.assertNotIn('orphan', depth)
        self.assertFalse(incoming['orphan'])
        self.assertEqual(incoming['a'], {'/', 'c'})

    def test_local_absolute_query_and_encoded_paths(self):
        with tempfile.TemporaryDirectory() as folder:
            site = Path(folder)
            (site / 'recursos').mkdir()
            (site / 'recursos/index.html').write_text('')
            (site / 'demo espacio.html').write_text('')
            base = 'https://www.studio32.es/recursos/guia/'
            self.assertEqual(graph.destination(base, '/recursos/?q=1#id', site), site / 'recursos/index.html')
            self.assertEqual(graph.destination(base, '../', site), site / 'recursos/index.html')
            self.assertEqual(graph.destination(base, 'https://studio32.es/demo%20espacio.html', site), site / 'demo espacio.html')
            self.assertIsNone(graph.destination(base, 'https://www.studio32.es.evil.example/', site))
            self.assertIsNone(graph.destination(base, 'mailto:info@studio32.es', site))

    def test_only_real_anchor_links(self):
        parser = graph.Links()
        parser.feed('<!-- <a href="fake"> --> <link href="style.css"><a href="/real/">Real</a>')
        self.assertEqual(parser.hrefs, ['/real/'])


if __name__ == '__main__':
    unittest.main()
