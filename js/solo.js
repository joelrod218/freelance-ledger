(function () {
  var U = FLUI, F = FL;
  U.on(['profit', 'age'], function () {
    var s = F.solo(U.n('profit'), U.$('age').value), f = U.fmt;
    U.$('result').innerHTML = '<table><tr><th></th><th>Maximum for 2026</th></tr>' +
      '<tr><td><strong>Solo 401(k)</strong>: employee deferral (up to ' + f(F.T.limits.k401) + ') plus employer share (20% of net earnings, ' + f(s.employer) + ')' + (s.catchUp ? ' plus catch-up (' + f(s.catchUp) + ')' : '') + '</td><td><strong>' + f(s.soloTotal) + '</strong></td></tr>' +
      '<tr><td><strong>SEP IRA</strong>: employer contribution only (20% of net earnings)</td><td><strong>' + f(s.sep) + '</strong></td></tr></table>' +
      '<p><small>Net earnings used: ' + f(s.netEarn) + ' (profit minus half of self-employment tax of ' + f(s.se) + '). Total contributions cannot exceed your net earnings. This is a ceiling, not advice on what to contribute.</small></p>';
  });
})();
