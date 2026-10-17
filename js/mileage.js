(function () {
  var U = FLUI, F = FL;
  U.on(['h1', 'h2', 'rate'], function () {
    var m = F.mileage(U.n('h1'), U.n('h2'), U.n('rate')), f = U.fmt;
    U.$('result').innerHTML = '<p>Standard mileage deduction for 2026</p><p class="big">' + f(m.total, 2) + '</p>' +
      '<table><tr><th>Period</th><th>Miles</th><th>Rate</th><th>Deduction</th></tr>' +
      '<tr><td>Jan 1 – Jun 30</td><td>' + U.n('h1').toLocaleString() + '</td><td>72.5¢</td><td>' + f(m.d1, 2) + '</td></tr>' +
      '<tr><td>Jul 1 – Dec 31</td><td>' + U.n('h2').toLocaleString() + '</td><td>76¢</td><td>' + f(m.d2, 2) + '</td></tr></table>' +
      '<p>Rough tax saving at ' + U.n('rate') + '% combined rate: <strong>' + f(m.saving, 2) + '</strong>. Add parking and tolls on top; they are deductible separately.</p>';
  });
})();
