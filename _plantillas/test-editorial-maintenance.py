import copy
from datetime import date
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('renderer', Path(__file__).with_name('generar-discovery.py'))
renderer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(renderer)
maintenance = renderer.maintenance


class MaintenanceTests(unittest.TestCase):
    def test_draft_rejected_before_any_write(self):
        for status in ('draft', 'review', 'stale', None):
            data = copy.deepcopy(renderer.DATA)
            data['publicationStatus'] = status
            with self.assertRaises(ValueError): renderer.validate_content(data)

    def test_invalid_chronology_and_timezone(self):
        for key, value in (('reviewedAt','2026-10-01'), ('publishedAt','2026-10-04'),
                           ('modifiedAt','2026-10-02T03:06:26'), ('reviewedAt','2099-10-02')):
            data = copy.deepcopy(renderer.DATA); data[key] = value
            with self.assertRaises(ValueError): maintenance.validate(data, date(2026,10,3))

    def test_source_access_and_policy(self):
        for key, value in (('accessed','2026-10-03'), ('reviewDays',0), ('reviewDays',True)):
            data = copy.deepcopy(renderer.DATA); data['sources']['twilio'][key] = value
            with self.assertRaises(ValueError): maintenance.validate(data, date(2026,10,3))

    def test_visible_date_follows_review_date(self):
        self.assertEqual(maintenance.display_date('2027-01-09'),'9 de enero de 2027')
        rendered = renderer.layout('recursos/prueba','Título','Descripción','Respuesta','',reviewed='2027-01-09')
        self.assertIn('datetime="2027-01-09">9 de enero de 2027</time>', rendered)

    def test_due_boundary_affected_pages_and_no_mutation(self):
        original = copy.deepcopy(renderer.DATA)
        before = maintenance.review_queue(original, date(2026,12,30))
        on = maintenance.review_queue(original, date(2026,12,31))
        self.assertFalse(any(t['state']=='due' for t in before))
        twilio = next(t for t in on if t['id']=='twilio')
        self.assertEqual(twilio['state'],'due')
        self.assertIn('recursos/whatsapp-business-api',twilio['pages'])
        self.assertEqual(original, renderer.DATA)


if __name__ == '__main__': unittest.main()
