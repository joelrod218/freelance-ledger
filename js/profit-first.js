(function () {
  var U = FLUI, F = FL, keys = ['pf_profit', 'pf_owner', 'pf_tax', 'pf_opex'];
  var names = { pf_profit: 'Profit', pf_owner: 'Owner\'s pay', pf_tax: 'Taxes', pf_opex: 'Operating expenses' };
  U.on(['amount'].concat(keys), function () {
    var pcts = {}; keys.forEach(function (k) { pcts[k] = U.n(k); });
    var p = F.profitFirst(U.n('amount'), pcts), f = U.fmt;
    var rows = keys.map(function (k) { return '<tr><td>' + names[k] + ' (' + pcts[k] + '%)</td><td><strong>' + f(p.amounts[k], 2) + '</strong></td></tr>'; }).join('');
    var html = '<table><tr><th>Bucket</th><th>Move this much</th></tr>' + rows + '</table>';
    if (!p.ok) html = '<div class="warnbox">Your percentages add up to ' + p.sum + '%. They need to total 100%.</div>' + html;
    U.$('result').innerHTML = html;
  });
})();
