/* Cálculo local; ninguna cifra se guarda ni se envía a analytics. */
(function (root) {
    'use strict';
    function calculate(values) {
        const limits = { enquiries: 1000000, outside: 100, unresolved: 100, conversion: 100, value: 1000000 };
        for (const [key, max] of Object.entries(limits)) {
            const value = values[key];
            if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) throw new RangeError('Revisa los límites de los campos.');
        }
        if (!Number.isInteger(values.enquiries)) throw new RangeError('El número de consultas debe ser entero.');
        const outside = values.enquiries * values.outside / 100;
        const risk = outside * values.unresolved / 100;
        const clients = risk * values.conversion / 100;
        const monthly = clients * values.value;
        const annualFor = (percentage) => outside * percentage / 100 * values.conversion / 100 * values.value * 12;
        return { risk, clients, monthly, annual: monthly * 12,
            low: annualFor(Math.max(0, values.unresolved - 10)), high: annualFor(Math.min(100, values.unresolved + 10)) };
    }
    if (typeof module === 'object' && module.exports) module.exports = { calculate };
    if (!root.document) return;
    const form = root.document.getElementById('consultas-calculator');
    if (!form) return;
    const result = root.document.getElementById('calculator-result');
    const error = root.document.getElementById('calculator-error');
    const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    const number = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });
    const track = (name) => root.Studio32Discovery?.track(name);
    let started = false;
    track('calculator_view');
    form.addEventListener('input', function () {
        result.hidden = true;
        error.textContent = '';
        if (!started) { started = true; track('calculator_start'); }
        track('calculator_input_change');
    });
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        try {
            const values = {};
            for (const name of ['enquiries', 'outside', 'unresolved', 'conversion', 'value']) {
                values[name] = form.elements.namedItem(name).valueAsNumber;
            }
            const estimate = calculate(values);
            if (!started) { started = true; track('calculator_start'); }
            root.document.getElementById('monthly-value').textContent = money.format(estimate.monthly);
            root.document.getElementById('risk-enquiries').textContent = number.format(estimate.risk);
            root.document.getElementById('potential-clients').textContent = number.format(estimate.clients);
            root.document.getElementById('annual-value').textContent = money.format(estimate.annual);
            root.document.getElementById('annual-range').textContent = money.format(estimate.low) + ' – ' + money.format(estimate.high);
            error.textContent = '';
            result.hidden = false;
            track('calculator_complete');
            track('calculator_result_view');
        } catch (failure) {
            result.hidden = true;
            error.textContent = failure.message;
        }
    });
}(typeof window === 'object' ? window : globalThis));
