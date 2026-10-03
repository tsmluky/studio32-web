"""Fechas y estados editoriales; cola local de revisión, sin red ni reescrituras."""
import argparse
from datetime import date, datetime, timedelta
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MONTHS = ('enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre').split()


def iso_date(value):
    parsed = date.fromisoformat(value)
    if parsed.isoformat() != value:
        raise ValueError('Fecha editorial necesita YYYY-MM-DD')
    return parsed


def display_date(value):
    parsed = iso_date(value)
    return f'{parsed.day} de {MONTHS[parsed.month-1]} de {parsed.year}'


def validate(data, today=None):
    today = today or date.today()
    if data.get('publicationStatus') != 'published':
        raise ValueError('No generar contenido público en estado borrador/review/stale')
    if not isinstance(data.get('owner'), str) or not data['owner'].strip():
        raise ValueError('Responsable editorial ausente')
    published, reviewed = iso_date(data['publishedAt']), iso_date(data['reviewedAt'])
    modified = datetime.fromisoformat(data['modifiedAt'])
    if modified.tzinfo is None:
        raise ValueError('dateModified necesita zona horaria')
    if published > reviewed or reviewed > today or not published <= modified.date() <= reviewed:
        raise ValueError('Fechas de publicación/revisión/modificación incoherentes')
    for source in data['sources'].values():
        if iso_date(source['accessed']) > reviewed:
            raise ValueError('Fuente consultada después de la revisión declarada')
        days = source.get('reviewDays')
        if type(days) is not int or not 1 <= days <= 730:
            raise ValueError('Intervalo de revisión de fuente no válido')


def review_queue(data, as_of):
    validate(data, as_of)
    tasks = []
    for key, source in data['sources'].items():
        due = iso_date(source['accessed']) + timedelta(days=source['reviewDays'])
        tasks.append({'kind': 'source', 'id': key, 'due': due.isoformat(),
                      'state': 'due' if due <= as_of else 'scheduled',
                      'pages': [p['slug'] for p in data['pages'] if key in p['sources']]})
    # Revisión conceptual anual; las fuentes de proveedor se revisan antes.
    due = iso_date(data['reviewedAt']) + timedelta(days=365)
    for page in data['pages']:
        tasks.append({'kind': 'page', 'id': page['slug'], 'due': due.isoformat(),
                      'state': 'due' if due <= as_of else 'scheduled', 'pages': [page['slug']]})
    return sorted(tasks, key=lambda task: (task['due'], task['kind'], task['id']))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--as-of', default=date.today().isoformat())
    parser.add_argument('--output', type=Path, help='Informe local opcional; no modifica contenido')
    args = parser.parse_args()
    data = json.loads((ROOT/'_plantillas/discovery-content.json').read_text(encoding='utf-8'))
    tasks = review_queue(data, iso_date(args.as_of))
    report = {'asOf': args.as_of, 'owner': data['owner'], 'tasks': tasks}
    if args.output:
        args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(f'{len(tasks)} revisiones; {sum(t["state"] == "due" for t in tasks)} pendientes por fecha.')
    for task in tasks:
        print(f'{task["due"]} | {task["state"]} | {task["kind"]}: {task["id"]}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
