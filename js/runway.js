(function () {
  var U = FLUI, F = FL;
  U.on(['cash', 'reserve', 'expenses', 'slow', 'avg'], function () {
    var r = F.runway({ cash: U.n('cash'), reserve: U.n('reserve'), expenses: U.n('expenses'), slow: U.n('slow'), avg: U.n('avg') }), f = U.fmt;
    function row(label, s) { return '<tr><td>' + label + '</td><td>' + f(s.income) + '</td><td>' + (s.net > 0 ? f(s.net) : 'none') + '</td><td><strong>' + U.months(s.months) + '</strong></td></tr>'; }
    U.$('result').innerHTML = '<p>Cash you can actually spend (after your tax reserve)</p><p class="big">' + f(r.usable) + '</p>' +
      '<table><tr><th>Scenario</th><th>Monthly income</th><th>Monthly shortfall</th><th>Runway</th></tr>' + row('No income', r.none) + row('Slow months', r.slow) + row('Average months', r.avg) + '</table>' +
      (U.n('reserve') > U.n('cash') ? '<div class="warnbox">Your tax reserve is larger than your cash, so nothing is left to spend.</div>' : '');
  });
})();
