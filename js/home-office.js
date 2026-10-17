(function () {
  var U = FLUI, F = FL;
  U.on(['office', 'home', 'profit', 'mortgageInterest', 'propertyTax', 'rent', 'utilities', 'insurance', 'repairs', 'other', 'marg'], function () {
    var h = F.homeOffice({ office: U.n('office'), home: U.n('home'), profit: U.n('profit'), mortgageInterest: U.n('mortgageInterest'), propertyTax: U.n('propertyTax'), rent: U.n('rent'), utilities: U.n('utilities'), insurance: U.n('insurance'), repairs: U.n('repairs'), other: U.n('other') });
    var f = U.fmt, rate = (U.n('marg') + 14.13) / 100;
    var better = h.actual > h.simplified ? 'actual' : 'simplified';
    var html = '<table><tr><th>Method</th><th>Deduction</th><th>Rough tax saving*</th></tr>' +
      '<tr><td>Simplified ($5 × ' + h.simpSqft + ' sq ft, max 300)</td><td><strong>' + f(h.simplified) + '</strong></td><td>' + f(h.simplified * rate) + '</td></tr>' +
      '<tr><td>Actual expenses (' + (h.pct * 100).toFixed(1) + '% of ' + f(h.expenses) + ')</td><td><strong>' + f(h.actual) + '</strong></td><td>' + f(h.actual * rate) + '</td></tr></table>' +
      '<p class="big">' + (h.actual === h.simplified ? 'Both methods give the same amount' : (better === 'actual' ? 'Actual expenses is higher by ' + f(h.actual - h.simplified) : 'Simplified is higher by ' + f(h.simplified - h.actual))) + '</p>' +
      '<p><small>*Your marginal income-tax rate plus about 14.1% self-employment tax (15.3% × 92.35%), assuming you are under the Social Security cap. A rough guide only.</small></p>';
    if (h.capped) html += '<div class="warnbox">The deduction is limited to your business profit before the home office deduction, so a loss is not created by it. (Some unused actual-expense amounts can carry forward; the simplified method has no carryover. See Publication 587.)</div>';
    if (U.n('office') > U.n('home') && U.n('home') > 0) html += '<div class="warnbox">Your office is larger than your home. Check the square footage.</div>';
    U.$('result').innerHTML = html;
  });
})();
