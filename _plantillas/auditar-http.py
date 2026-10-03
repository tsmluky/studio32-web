"""Lectura HTTP pública. No cambia cuentas, DNS o políticas de CDN."""
import concurrent.futures
import argparse
from datetime import datetime, timezone
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


def main(argv=None):
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,help='Informe nuevo opcional; nunca sobrescribe uno existente')
    args=parser.parse_args(argv)
    if args.output and args.output.exists():
        parser.error('El informe ya existe; usar un archivo nuevo para conservar el histórico')
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: results=list(pool.map(check,URLS))
    report={'checkedAt':datetime.now(timezone.utc).isoformat(),
            'note':'Lectura pública actual. elapsedMs es descarga, no LCP/CWV. finalUrl sigue redirecciones; status no acredita el código del primer salto.',
            'results':results}
    text=json.dumps(report,indent=2,ensure_ascii=False)+'\n'
    if args.output:
        with args.output.open('x',encoding='utf-8') as output: output.write(text)
    print(text)
    return int(any('error' in result or result['status']!=(404 if 'no-existe-seo-qa' in result['url'] else 200) for result in results))


if __name__=='__main__': raise SystemExit(main())
