/* Tax set-aside calculator. Uses FL.quarterly (2026 federal) + a rough state %. Estimates only. */
(function () {
  var U = FLUI, F = FL;
  var ids = ['status', 'revenue', 'expenses', 'w2', 'withholding', 'statePct', 'qbi', 'payment'];
  function calc(extraProfit) {
    var profit = Math.max(0, U.n('revenue') - U.n('expenses')) + (extraProfit || 0);
    return F.quarterly({ status: U.$('status').value, profit: profit, w2: U.n('w2'), withholding: U.n('withholding'), qbi: U.$('qbi').checked, statePct: U.n('statePct') });
  }
  function pct(x) { return (Math.round(x * 1000) / 10).toFixed(1) + '%'; }
  function run() {
    var f = U.fmt, rev = Math.max(0, U.n('revenue')), q = calc(0);
    var profit = Math.max(0, rev - U.n('expenses'));
    var total = q.federal + q.state, owed = Math.max(0, total - q.withholding);
    var ofRev = rev > 0 ? owed / rev : 0, ofProfit = profit > 0 ? owed / profit : 0;
    var q2 = calc(1000), marg = (q2.federal + q2.state) - total;
    var pay = Math.max(0, U.n('payment')), out = [];
    out.push('<p>Set aside about this share of every client payment</p><p class="big">' + pct(ofRev) + '</p>');
    out.push('<p>On a ' + f(pay) + ' payment, move <strong>' + f(pay * ofRev) + '</strong> to your tax savings account.</p>');
    out.push('<table><tr><th>Your 2026 estimate</th><th></th></tr>' +
      '<tr><td>Net profit (revenue minus expenses)</td><td>' + f(profit) + '</td></tr>' +
      '<tr><td>Self-employment tax</td><td>' + f(q.se.se) + '</td></tr>' +
      (q.se.addl > 0 ? '<tr><td>Additional Medicare tax (0.9%)</td><td>' + f(q.se.addl) + '</td></tr>' : '') +
      '<tr><td>Federal income tax (after standard deduction' + (q.qbiDed > 0 ? ' and QBI deduction' : '') + ')</td><td>' + f(q.incomeTax) + '</td></tr>' +
      '<tr><td>State income tax (your rough %)</td><td>' + f(q.state) + '</td></tr>' +
      (q.withholding > 0 ? '<tr><td>Minus federal tax withheld from W-2 pay</td><td>-' + f(q.withholding) + '</td></tr>' : '') +
      '<tr><td><strong>Tax to cover from freelance income</strong></td><td><strong>' + f(owed) + '</strong></td></tr>' +
      '<tr><td>As a share of profit</td><td>' + pct(ofProfit) + '</td></tr>' +
      '<tr><td>Per month (12 months)</td><td>' + f(owed / 12) + '</td></tr>' +
      '<tr><td>Per quarterly payment (4)</td><td>' + f(owed / 4) + '</td></tr>' +
      '<tr><td>Tax on your next $1,000 of profit</td><td>' + f(marg) + ' (' + pct(marg / 1000) + ')</td></tr></table>');
    if (q.qbiNote === 'over') out.push('<p><small>Your taxable income is above the range where we model the qualified business income deduction, so it is left out. That makes this estimate conservative.</small></p>');
    if (q.federal - q.withholding < 1000) out.push('<p><small>You would owe under $1,000 in federal tax after withholding, so quarterly estimated payments generally are not required. Still keep the money aside for April.</small></p>');
    U.$('result').innerHTML = out.join('');
  }
  U.on(ids, run);
})();
