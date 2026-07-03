import test from 'node:test';
import assert from 'node:assert';
import { RiskScoringService } from '../src/services/RiskScoringService.js';
import { AnomalyDetectionService } from '../src/services/AnomalyDetectionService.js';

test('unbalanced + off-hours + round amount scores high', ()=>{
    const r = new RiskScoringService().score({
        amount:250000, debit:250000, credit:0,
        description: 'misc adjustment', postingDate: '2026-06-21T02:00:00Z',
    });
    assert.equal(r.riskScore, 0.9);
    assert.equal(r.severity, 'high');
});

test('balance anomaly is emitted on the debt field',()=>{
    const signals = new AnomalyDetectionService().detect({
        amount:100, debit:100, credit:0, description: 'ok', postingDate: '2026-06-21T02:00:00Z',
    });

    assert.ok(signals.some(s => s.type === 'balance_anomaly' && s.field === 'debit'));
});
