"""Lectura HTTP pública. No cambia cuentas, DNS o políticas de CDN."""
import concurrent.futures
import json
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
URLS=['https://studio32.es/','https://www.studio32.es/','https://www.studio32.es/robots.txt','https://www.studio32.es/sitemap.xml','https://www.studio32.es/no-existe-seo-qa-20261002']


def check(url):
    start=time.perf_counter()
    try:
        request=urllib.request.Request(url,headers={'User-Agent':'Studio32-Public-SEO-Audit/1.0'})
        with urllib.request.urlopen(request,timeout=15) as response:
            data=response.read()
            return {'url':url,'status':response.status,'finalUrl':response.url,'bytes':len(data),'elapsedMs':round((time.perf_counter()-start)*1000),
                    'contentType':response.headers.get('Content-Type'),'xRobotsTag':response.headers.get('X-Robots-Tag'),
                    'cacheControl':response.headers.get('Cache-Control')}
    except urllib.error.HTTPError as error:
        return {'url':url,'status':error.code,'elapsedMs':round((time.perf_counter()-start)*1000)}
    except Exception as error:
        return {'url':url,'error':str(error)}


if __name__=='__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: results=list(pool.map(check,URLS))
    (ROOT/'docs/seo/HTTP_BASELINE.json').write_text(json.dumps({'date':'2026-10-02','note':'Sitio previo a despliegue. elapsedMs es descarga, no CWV.','results':results},indent=2)+'\n',encoding='utf-8')
    print(json.dumps(results,indent=2))
