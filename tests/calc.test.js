// Run: node tests/calc.test.js   (no dependencies)
const assert = require('node:assert/strict');
const FL = require('../js/fl-calc.js');
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= (tol || 0.01), `${msg || ''} got ${a}, want ${b}`);
let n = 0; const t = (name, fn) => { fn(); n++; console.log('ok -', name); };

t('SE tax $60k profit', () => { const s = FL.seTax(60000, 0, 'single'); near(s.se, 8477.73, 0.01); near(s.half, 4238.865, 0.001); });
t('SE tax below $400 net earnings is zero', () => assert.equal(FL.seTax(400, 0).se, 0));
t('SE tax respects Social Security cap', () => { const s = FL.seTax(300000, 0); near(s.ss, 184500 * 0.124, 0.01); near(s.med, 300000 * 0.9235 * 0.029, 0.01); });
t('SE tax uses W-2 wages against the cap', () => { const s = FL.seTax(50000, 170000); near(s.ss, (184500 - 170000) * 0.124, 0.01); });
t('Additional Medicare only on SE earnings above threshold', () => { const s = FL.seTax(100000, 200000, 'single'); near(s.addl, 0.009 * 92350, 0.01); });
t('Income tax single $31,728.91 taxable', () => near(FL.incomeTax(31728.91, 'single'), 3559.47, 0.01));
t('Income tax MFJ top of 12% band', () => near(FL.incomeTax(100800, 'mfj'), 2480 + 0.12 * (100800 - 24800), 0.01));
t('Quarterly: single $60k profit, no other income', () => {
  const q = FL.quarterly({ status: 'single', profit: 60000 });
  near(q.agi, 55761.135, 0.001); near(q.taxableBefore, 39661.135, 0.001); near(q.qbiDed, 7932.23, 0.01);
  near(q.taxable, 31728.905, 0.01); near(q.incomeTax, 3559.47, 0.01); near(q.federal, 12037.20, 0.01);
  near(q.currentYear90, 10833.48, 0.01); near(q.perFull, 12037.20 / 4, 0.01);
});
t('Quarterly: prior-year safe harbor is the smaller number', () => {
  const q = FL.quarterly({ status: 'single', profit: 60000, priorTax: 5000 }); near(q.safeAnnual, 5000, 0.001);
  const q2 = FL.quarterly({ status: 'single', profit: 60000, priorTax: 5000, priorAgiOver150k: true }); near(q2.safeAnnual, 5500, 0.001);
});
t('Quarterly: under $1,000 owed needs no estimates', () => { const q = FL.quarterly({ profit: 3000 }); assert.equal(q.noEstimatesNeeded, true); assert.equal(q.safeEstimates, 0); });
t('Quarterly: withholding reduces estimates', () => {
  const a = FL.quarterly({ profit: 60000 }), b = FL.quarterly({ profit: 60000, withholding: 4000 });
  near(a.fullEstimates - b.fullEstimates, 4000, 0.001);
});
t('Quarterly: QBI skipped above approximate threshold (conservative)', () => { const q = FL.quarterly({ profit: 300000 }); assert.equal(q.qbiDed, 0); assert.equal(q.qbiNote, 'over'); });
t('Quarterly: payments made reduce remaining', () => { const q = FL.quarterly({ profit: 60000, paid: 3000, left: 2 }); near(q.perFull, (12037.20 - 3000) / 2, 0.01); });
t('Mileage 2026 two-rate split', () => { const m = FL.mileage(1000, 1000, 25); near(m.d1, 725, 0.001); near(m.d2, 760, 0.001); near(m.total, 1485, 0.001); near(m.saving, 371.25, 0.001); });
t('Home office simplified caps at 300 sq ft', () => { const h = FL.homeOffice({ office: 400, home: 2000, profit: 50000 }); assert.equal(h.simplified, 1500); });
t('Home office simplified limited by profit', () => assert.equal(FL.homeOffice({ office: 200, home: 1000, profit: 600 }).simplified, 600));
t('Home office actual method', () => { const h = FL.homeOffice({ office: 150, home: 1500, profit: 50000, rent: 18000, utilities: 3000, insurance: 600 }); near(h.pct, 0.1, 1e-9); near(h.actual, 2160, 0.001); });
t('Profit First amounts and sum check', () => { const p = FL.profitFirst(10000, { profit: 5, owner: 50, tax: 15, opex: 30 }); assert.ok(p.ok); assert.equal(p.amounts.owner, 5000); assert.equal(FL.profitFirst(100, { a: 50, b: 40 }).ok, false); });
t('Runway scenarios', () => {
  const r = FL.runway({ cash: 20000, reserve: 5000, expenses: 4000, slow: 1000, avg: 4000 });
  assert.equal(r.usable, 15000); near(r.none.months, 3.75, 1e-9); near(r.slow.months, 5, 1e-9); assert.equal(r.avg.months, Infinity);
});
t('Solo 401(k) / SEP at $100k profit', () => {
  const s = FL.solo(100000, 'under50');
  near(s.se, 14129.55, 0.01); near(s.netEarn, 92935.225, 0.001); near(s.employer, 18587.045, 0.001);
  near(s.soloTotal, 43087.045, 0.001); near(s.sep, 18587.045, 0.001);
});
t('Solo 401(k) total capped at $72,000 base', () => { const s = FL.solo(500000, 'under50'); assert.equal(s.soloBase, 72000); assert.equal(s.sep, 72000); });
t('Solo 401(k) catch-up added on top of the limit', () => { const s = FL.solo(500000, '60-63'); assert.equal(s.soloTotal, 72000 + 11250); });
t('Solo 401(k) low earnings cannot exceed net earnings', () => { const s = FL.solo(10000, 'under50'); near(s.soloTotal, s.netEarn, 0.001); });
t('Invoice totals in cents', () => {
  const v = FL.invoice([{ desc: 'a', qty: 3, price: 33.33 }, { desc: 'b', qty: 1.5, price: 100 }], 8.25, 10);
  assert.equal(v.sub, 9999 + 15000); assert.equal(v.disc, 1000); assert.equal(v.tax, Math.round((24999 - 1000) * 0.0825)); assert.equal(v.total, 24999 - 1000 + v.tax);
});
t('ICS has valid structure', () => { const s = FL.ics([{ date: '2027-01-15', title: 'Pay', desc: 'x, y' }]); assert.ok(s.startsWith('BEGIN:VCALENDAR')); assert.ok(s.includes('DTSTART;VALUE=DATE:20270115')); assert.ok(s.includes('DTEND;VALUE=DATE:20270116')); assert.ok(s.includes('x\\, y')); });
t('Due-date list covers 8 payments in order', () => { assert.equal(FL.DUE.length, 8); for (let i = 1; i < 8; i++) assert.ok(FL.DUE[i][0] > FL.DUE[i - 1][0]); });
console.log(`\n${n} tests passed`);
