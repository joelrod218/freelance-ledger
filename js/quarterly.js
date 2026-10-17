(function () {
  var U = FLUI, F = FL;
  var ids = ['status', 'profit', 'w2', 'withholding', 'other', 'qbi', 'statePct', 'priorTax', 'priorOver', 'paid', 'left'];
  var today = new Date(); today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  var due26 = F.DUE.filter(function (d) { return d[1].indexOf('2026') > -1 && d[0] >= '2026-01-01'; }).filter(function (d) { return d[1] !== '4th quarter 2027'; });
  function parse(s) { var p = s.split('-'); return new Date(+p[0], p[1] - 1, +p[2]); }
  var remaining = due26.filter(function (d) { return parse(d[0]) >= today; });
  U.$('left').value = String(Math.min(4, Math.max(1, remaining.length || 1)));
  var last;
  function fmtDate(s) { return parse(s).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  function run() {
    var q = F.quarterly({ status: U.$('status').value, profit: U.n('profit'), w2: U.n('w2'), withholding: U.n('withholding'), other: U.n('other'), qbi: U.$('qbi').checked, statePct: U.n('statePct'), priorTax: U.n('priorTax'), priorAgiOver150k: U.$('priorOver').checked, paid: U.n('paid'), left: U.n('left') });
    last = q; var f = U.fmt, out = [];
    out.push('<p>Estimated 2026 federal tax (income tax + self-employment tax)</p><p class="big">' + f(q.federal) + '</p>');
    if (q.noEstimatesNeeded) out.push('<p><strong>You would owe less than $1,000 after withholding, so estimated payments generally are not required.</strong> Check the IRS rules if your situation is unusual.</p>');
    else {
      out.push('<table><tr><th></th><th>Total for the year</th><th>Each of your ' + q.left + ' remaining payment' + (q.left > 1 ? 's' : '') + '</th></tr>' +
        '<tr><td><strong>Safe-harbor minimum</strong><br><small>lowest amount that avoids the underpayment penalty</small></td><td>' + f(q.safeEstimates) + '</td><td><strong>' + f(q.perSafe) + '</strong></td></tr>' +
        '<tr><td><strong>Pay it all as you go</strong><br><small>covers this year\'s full estimate, so no bill in April</small></td><td>' + f(q.fullEstimates) + '</td><td><strong>' + f(q.perFull) + '</strong></td></tr></table>');
      out.push('<p><small>Safe harbor here is the smaller of 90% of this year\'s tax (' + f(q.currentYear90) + ')' + (q.priorAmt !== null ? ' and ' + (U.$('priorOver').checked ? '110%' : '100%') + ' of last year\'s tax (' + f(q.priorAmt) + ')' : ' (enter last year\'s total tax to see the prior-year option)') + ', minus withholding. Payments you already made are subtracted.</small></p>');
    }
    out.push('<table><tr><th>How we got there</th><th></th></tr>' +
      '<tr><td>Self-employment tax</td><td>' + f(q.se.se) + '</td></tr>' +
      (q.se.addl > 0 ? '<tr><td>Additional Medicare tax (0.9%)</td><td>' + f(q.se.addl) + '</td></tr>' : '') +
      '<tr><td>Adjusted gross income (after half of SE tax)</td><td>' + f(q.agi) + '</td></tr>' +
      '<tr><td>Standard deduction</td><td>' + f(q.std) + '</td></tr>' +
      '<tr><td>Qualified business income deduction</td><td>' + f(q.qbiDed) + '</td></tr>' +
      '<tr><td>Taxable income</td><td>' + f(q.taxable) + '</td></tr>' +
      '<tr><td>Federal income tax (' + Math.round(q.marginal * 100) + '% bracket at the top)</td><td>' + f(q.incomeTax) + '</td></tr>' +
      '<tr><td>Effective federal rate on total income</td><td>' + (q.effective * 100).toFixed(1) + '%</td></tr></table>');
    if (q.state > 0) out.push('<p>Rough state tax at ' + U.n('statePct') + '% of AGI: <strong>' + f(q.state) + '</strong>. Add about <strong>' + f(q.state / q.left) + '</strong> to each payment if your state wants quarterly payments too (check your state\'s dates and rules).</p>');
    if (q.qbiNote === 'over') out.push('<div class="warnbox">Your taxable income is above roughly $200,000 (single) / $400,000 (joint). The qualified business income deduction can be limited or phased out depending on your type of business and wages paid, and this calculator does not model that, so it leaves the deduction out. If you qualify, your real tax is lower. Ask a tax professional.</div>');
    U.$('result').innerHTML = out.join('');
    var list = remaining.map(function (d) { return '<li>' + fmtDate(d[0]) + ' (' + d[1] + ')</li>'; }).join('');
    U.$('dates').innerHTML = list ? '<p>Your remaining 2026 payment date' + (remaining.length > 1 ? 's' : '') + ':</p><ul>' + list + '</ul>' : '<p>All four 2026 payment dates have passed. Any remaining balance is due with your return (April 2027); pay what you can now to limit interest and penalties.</p>';
    U.$('ics').hidden = !remaining.length;
  }
  U.$('ics').addEventListener('click', function () {
    var q = last, f = U.fmt;
    var ev = remaining.map(function (d) { return { date: d[0], title: 'Federal estimated tax payment due (' + d[1] + ')', desc: 'Pay at irs.gov/payments/direct-pay. Estimate from Freelance Ledger calculator: ' + (q.noEstimatesNeeded ? 'no estimate needed' : f(q.perSafe) + ' (safe-harbor minimum) to ' + f(q.perFull) + ' (full estimate)') + '. Estimates only; not tax advice.' }; });
    U.download('estimated-tax-payments-2026.ics', F.ics(ev), 'text/calendar');
  });
  U.on(ids, run);
})();
