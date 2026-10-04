"""Fallos y límites del informe comercial; no usa red."""
import unittest
from auditar import analyse, public_url, sitemap_urls


class AuditTests(unittest.TestCase):
    def test_failed_response_never_passes_as_healthy(self):
        findings=analyse({'status':403,'error':'Forbidden'})
        self.assertEqual(findings[0]['priority'],'Alta')
        self.assertIn('403',findings[0]['evidence'])

    def test_noindex_is_review_not_automatic_error(self):
        page={'status':200,'final_url':'https://example.com/legal/','headers':{'Content-Type':'text/html'},'redirects':[], 'body':'<html lang="es"><title>Legal</title><meta name="description" content="Legal"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><link rel="canonical" href="https://example.com/legal/"><h1>Legal</h1></html>'}
        findings=analyse(page)
        self.assertEqual(len(findings),1)
        self.assertEqual(findings[0]['priority'],'Revisar')

    def test_sitemap_does_not_expand_other_domains(self):
        result={'status':200,'body':'<urlset><url><loc>https://example.com/a/</loc></url><url><loc>https://other.test/</loc></url></urlset>'}
        self.assertEqual(sitemap_urls(result,'example.com'),['https://example.com/a/'])
        self.assertEqual(sitemap_urls({'status':200,'body':'<sitemapindex/>'},'example.com'),[])

    def test_credentials_rejected_and_query_not_reported(self):
        with self.assertRaises(ValueError):public_url('https://user:secret@example.com/')
        self.assertEqual(public_url('https://example.com/?email=private#token'),'https://example.com/')


if __name__=='__main__':unittest.main()
