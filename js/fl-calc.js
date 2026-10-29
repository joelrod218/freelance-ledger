/* Freelance Ledger calculation library (pure functions, no DOM).
   Works in the browser (window.FL) and Node (module.exports) so the same code is unit-tested.
   Figures: 2026 tax year. Sources are listed on the pages that use them. Estimates only, not tax advice. */
(function (root, factory) {
  var m = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = m; else root.FL = m;
})(typeof self !== 'undefined' ? self : this, function () {
  var T = {
    year: 2026,
    stdDed: { single: 16100, mfj: 32200 },
    brackets: {
      single: [[0, 0.10], [12400, 0.12], [50400, 0.22], [105700, 0.24], [201775, 0.32], [256225, 0.35], [640600, 0.37]],
      mfj: [[0, 0.10], [24800, 0.12], [100800, 0.22], [211400, 0.24], [403550, 0.32], [512450, 0.35], [768700, 0.37]]
    },
    ssWageBase: 184500, seFactor: 0.9235, ssRate: 0.124, medRate: 0.029, addlMed: 0.009,
    addlMedThreshold: { single: 200000, mfj: 250000 },
    qbiApproxThreshold: { single: 200000, mfj: 400000 }, // approximate; QBI limits above this are not modeled
    seMinEarnings: 400,
    mileage: { h1: 0.725, h2: 0.76 }, // business, 2026: Jan 1-Jun 30 and from Jul 1
    homeOffice: { rate: 5, maxSqft: 300 },
    limits: { k401: 24500, catchUp50: 8000, catchUp6063: 11250, c415: 72000, comp: 360000, ira: 7500, iraCatch: 1100, sepMinComp: 800, simple: 17000 }
  };
  var r2 = function (n) { return Math.round((n + Number.EPSILON) * 100) / 100; };
  var num = function (v) { v = +v; return isFinite(v) ? v : 0; };

  function seTax(profit, w2Wages, status) {
    profit = Math.max(0, num(profit)); w2Wages = Math.max(0, num(w2Wages)); status = status || 'single';
    var base = profit * T.seFactor;
    if (base < T.seMinEarnings) return { base: base, ss: 0, med: 0, se: 0, half: 0, addl: 0 };
    var ssRoom = Math.max(0, T.ssWageBase - w2Wages);
    var ss = Math.min(base, ssRoom) * T.ssRate;
    var med = base * T.medRate;
    var thr = T.addlMedThreshold[status];
    var addl = T.addlMed * (Math.max(0, w2Wages + base - thr) - Math.max(0, w2Wages - thr));
    var se = ss + med;
    return { base: base, ss: ss, med: med, se: se, half: se / 2, addl: addl };
  }

  function incomeTax(taxable, status) {
    taxable = Math.max(0, num(taxable)); var b = T.brackets[status || 'single'], tax = 0;
    for (var i = 0; i < b.length; i++) {
      var lo = b[i][0], hi = i + 1 < b.length ? b[i + 1][0] : Infinity;
      if (taxable > lo) tax += (Math.min(taxable, hi) - lo) * b[i][1];
    }
    return tax;
  }
  function marginalRate(taxable, status) {
    var b = T.brackets[status || 'single'], rate = b[0][1];
    for (var i = 0; i < b.length; i++) if (taxable > b[i][0]) rate = b[i][1];
    return rate;
  }

  /* Federal estimate for a self-employed person. i = {status, profit, w2, withholding, other, qbi, statePct,
     priorTax, priorAgiOver150k, paid, left} */
  function quarterly(i) {
    var status = i.status === 'mfj' ? 'mfj' : 'single';
    var profit = Math.max(0, num(i.profit)), w2 = Math.max(0, num(i.w2)), other = Math.max(0, num(i.other));
    var withholding = Math.max(0, num(i.withholding)), paid = Math.max(0, num(i.paid));
    var se = seTax(profit, w2, status);
    var agi = profit + w2 + other - se.half;
    var std = T.stdDed[status];
    var taxableBefore = Math.max(0, agi - std);
    var qbiDed = 0, qbiNote = '';
    if (i.qbi !== false) {
      if (taxableBefore > T.qbiApproxThreshold[status]) {
        qbiNote = 'over';
      } else {
        qbiDed = 0.2 * Math.min(Math.max(0, profit - se.half), taxableBefore);
      }
    }
    var taxable = Math.max(0, taxableBefore - qbiDed);
    var incTax = incomeTax(taxable, status);
    var federal = incTax + se.se + se.addl;
    var state = Math.max(0, agi) * Math.min(100, Math.max(0, num(i.statePct))) / 100;
    var currentYear90 = 0.9 * federal;
    var priorFactor = i.priorAgiOver150k ? 1.1 : 1.0;
    var hasPrior = num(i.priorTax) > 0;
    var priorAmt = hasPrior ? priorFactor * num(i.priorTax) : null;
    var safeAnnual = hasPrior ? Math.min(currentYear90, priorAmt) : currentYear90;
    var owedAfterWithholding = federal - withholding;
    var noEstimatesNeeded = owedAfterWithholding < 1000;
    var safeEstimates = noEstimatesNeeded ? 0 : Math.max(0, safeAnnual - withholding);
    var fullEstimates = Math.max(0, owedAfterWithholding);
    var left = Math.min(4, Math.max(1, Math.round(num(i.left) || 4)));
    var remainSafe = Math.max(0, safeEstimates - paid), remainFull = Math.max(0, fullEstimates - paid);
    return {
      status: status, se: se, agi: agi, std: std, taxableBefore: taxableBefore, qbiDed: qbiDed, qbiNote: qbiNote, taxable: taxable,
      incomeTax: incTax, federal: federal, state: state, marginal: marginalRate(taxable, status),
      currentYear90: currentYear90, priorAmt: priorAmt, safeAnnual: safeAnnual, withholding: withholding,
      noEstimatesNeeded: noEstimatesNeeded, safeEstimates: safeEstimates, fullEstimates: fullEstimates,
      left: left, perSafe: remainSafe / left, perFull: remainFull / left, remainSafe: remainSafe, remainFull: remainFull,
      effective: profit + w2 + other > 0 ? federal / (profit + w2 + other) : 0
    };
  }

  function mileage(h1Miles, h2Miles, savingsRate) {
    h1Miles = Math.max(0, num(h1Miles)); h2Miles = Math.max(0, num(h2Miles));
    var d1 = h1Miles * T.mileage.h1, d2 = h2Miles * T.mileage.h2, total = d1 + d2;
    return { d1: d1, d2: d2, total: total, saving: total * Math.max(0, num(savingsRate)) / 100 };
  }

  function homeOffice(i) {
    var office = Math.max(0, num(i.office)), home = Math.max(0, num(i.home)), profit = Math.max(0, num(i.profit));
    var simpSqft = Math.min(office, T.homeOffice.maxSqft);
    var simplified = Math.min(simpSqft * T.homeOffice.rate, profit);
    var pct = home > 0 ? Math.min(1, office / home) : 0;
    var expenses = ['mortgageInterest', 'propertyTax', 'rent', 'utilities', 'insurance', 'repairs', 'other'].reduce(function (a, k) { return a + Math.max(0, num(i[k])); }, 0);
    var actualRaw = pct * expenses;
    var actual = Math.min(actualRaw, profit);
    return { simpSqft: simpSqft, simplified: simplified, pct: pct, expenses: expenses, actualRaw: actualRaw, actual: actual, capped: actualRaw > profit || simpSqft * T.homeOffice.rate > profit };
  }

  function profitFirst(amount, pcts) {
    amount = Math.max(0, num(amount));
    var keys = Object.keys(pcts), sum = keys.reduce(function (a, k) { return a + num(pcts[k]); }, 0);
    var out = {}; keys.forEach(function (k) { out[k] = r2(amount * num(pcts[k]) / 100); });
    return { sum: sum, ok: Math.abs(sum - 100) < 1e-9, amounts: out };
  }

  function runway(i) {
    var cash = Math.max(0, num(i.cash)), reserve = Math.max(0, num(i.reserve)), exp = Math.max(0, num(i.expenses));
    var usable = Math.max(0, cash - reserve);
    function sc(income) {
      income = Math.max(0, num(income)); var net = exp - income;
      return { income: income, net: net, months: net <= 0 ? Infinity : usable / net };
    }
    return { usable: usable, none: sc(0), slow: sc(i.slow), avg: sc(i.avg) };
  }

  function solo(profit, age) {
    profit = Math.max(0, num(profit));
    var se = seTax(profit, 0, 'single');
    var netEarn = Math.max(0, profit - se.half);
    var comp = Math.min(netEarn, T.limits.comp);
    var employer = Math.min(comp * 0.20, T.limits.c415);
    var catchUp = age === '60-63' ? T.limits.catchUp6063 : age === '50+' ? T.limits.catchUp50 : 0;
    var deferral = Math.min(T.limits.k401, netEarn);
    var base = Math.min(deferral + employer, T.limits.c415, netEarn);
    var catchApplied = Math.min(catchUp, Math.max(0, netEarn - base));
    var sep = Math.min(employer, T.limits.c415);
    return { se: se.se, half: se.half, netEarn: netEarn, employer: employer, deferral: deferral, soloTotal: base + catchApplied, soloBase: base, catchUp: catchApplied, sep: sep };
  }


  /* S corp vs sole proprietor, 2026 federal only. i = {status, profit, salary, costs, qbi}
     profit = business net profit before paying yourself; salary = W-2 pay to the owner; costs = extra yearly S corp costs */
  function scorp(i) {
    var status = i.status === 'mfj' ? 'mfj' : 'single';
    var profit = Math.max(0, num(i.profit)), costs = Math.max(0, num(i.costs)), useQbi = i.qbi !== false;
    var sole = quarterly({ status: status, profit: profit, qbi: useQbi });
    var room = Math.max(0, profit - costs);
    var fica = function (w) { return T.ssRate / 2 * Math.min(w, T.ssWageBase) + T.medRate / 2 * w; };
    var futa = function (w) { return w > 0 ? 0.006 * Math.min(w, 7000) : 0; };
    var w = Math.max(0, num(i.salary)), capped = false;
    if (w + fica(w) + futa(w) > room) {
      capped = true; var lo = 0, hi = room;
      for (var k = 0; k < 60; k++) { var mid = (lo + hi) / 2; if (mid + fica(mid) + futa(mid) > room) hi = mid; else lo = mid; }
      w = lo;
    }
    var er = fica(w), fu = futa(w);
    var ee = fica(w) + T.addlMed * Math.max(0, w - T.addlMedThreshold[status]);
    var k1 = Math.max(0, room - w - er - fu);
    var agi = w + k1, std = T.stdDed[status], taxableBefore = Math.max(0, agi - std), qbiDed = 0, qbiNote = '';
    if (useQbi) { if (taxableBefore > T.qbiApproxThreshold[status]) qbiNote = 'over'; else qbiDed = 0.2 * Math.min(k1, taxableBefore); }
    var taxable = Math.max(0, taxableBefore - qbiDed), inc = incomeTax(taxable, status);
    var payroll = er + ee + fu, total = payroll + inc + costs;
    return {
      sole: { se: sole.se.se + sole.se.addl, incomeTax: sole.incomeTax, qbiDed: sole.qbiDed, qbiNote: sole.qbiNote, total: sole.federal },
      s: { salary: w, capped: capped, employerFica: er, employeeFica: ee, futa: fu, payroll: payroll, distribution: k1, qbiDed: qbiDed, qbiNote: qbiNote,
           incomeTax: inc, costs: costs, total: total },
      savings: sole.federal - total
    };
  }

  // Invoice maths in integer cents to avoid float drift
  function invoice(lines, taxPct, discount) {
    var sub = 0;
    var rows = (lines || []).map(function (l) {
      var q = num(l.qty), p = Math.round(num(l.price) * 100), amt = Math.round(q * p);
      sub += amt; return { desc: l.desc, qty: q, price: p, amt: amt };
    });
    var disc = Math.min(sub, Math.round(Math.max(0, num(discount)) * 100));
    var taxable = sub - disc;
    var tax = Math.round(taxable * Math.max(0, num(taxPct)) / 100);
    return { rows: rows, sub: sub, disc: disc, tax: tax, total: taxable + tax };
  }

  /* due-date helpers */
  var DUE = [['2026-04-15', '1st quarter 2026'], ['2026-06-15', '2nd quarter 2026'], ['2026-09-15', '3rd quarter 2026'], ['2027-01-15', '4th quarter 2026'],
    ['2027-04-15', '1st quarter 2027'], ['2027-06-15', '2nd quarter 2027'], ['2027-09-15', '3rd quarter 2027'], ['2028-01-18', '4th quarter 2027']];
  function ics(events) {
    // events: [{date:'YYYY-MM-DD', title, desc}]
    var esc = function (s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); };
    var stamp = '20260101T000000Z';
    var out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Freelance Ledger//Estimated tax dates//EN', 'CALSCALE:GREGORIAN'];
    events.forEach(function (e, n) {
      var d = e.date.replace(/-/g, ''), dt = new Date(e.date + 'T00:00:00Z'); dt.setUTCDate(dt.getUTCDate() + 1);
      var end = dt.toISOString().slice(0, 10).replace(/-/g, '');
      out.push('BEGIN:VEVENT', 'UID:fl-' + d + '-' + n + '@getfreelanceledger.com', 'DTSTAMP:' + stamp, 'DTSTART;VALUE=DATE:' + d, 'DTEND;VALUE=DATE:' + end,
        'SUMMARY:' + esc(e.title), 'DESCRIPTION:' + esc(e.desc || ''),
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(e.title), 'TRIGGER:-P7D', 'END:VALARM', 'END:VEVENT');
    });
    out.push('END:VCALENDAR');
    return out.join('\r\n') + '\r\n';
  }

  var fmt = function (n, d) { return (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };
  return { T: T, r2: r2, seTax: seTax, incomeTax: incomeTax, marginalRate: marginalRate, quarterly: quarterly, mileage: mileage, homeOffice: homeOffice,
    profitFirst: profitFirst, scorp: scorp, runway: runway, solo: solo, invoice: invoice, DUE: DUE, ics: ics, fmt: fmt };
});
