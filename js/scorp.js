/* S corp vs sole proprietor calculator. Uses FL.scorp (2026 federal only). Estimates only, not tax advice. */
(function () {
  var U = FLUI, F = FL;
  var ids = ['status', 'profit', 'salary', 'costs', 'qbi'];
  function run() {
    var f = U.fmt, r = F.scorp({ status: U.$('status').value, profit: U.n('profit'), salary: U.n('salary'), costs: U.n('costs'), qbi: U.$('qbi').checked });
    var s = r.s, so = r.sole, out = [], save = r.savings;
    out.push('<p>Estimated yearly federal difference with an S corporation</p><p class="big">' + (save >= 0 ? 'Save ' + f(save) : 'Cost ' + f(-save)) + '</p>');
    out.push('<p>' + (save >= 0 ? 'At these numbers the S corp election comes out ahead by about <strong>' + f(save) + '</strong> a year after the extra costs you entered.' : 'At these numbers staying a sole proprietor is cheaper by about <strong>' + f(-save) + '</strong> a year.') + ' State taxes and fees are not included.</p>');
    out.push('<table><tr><th></th><th>Sole proprietor</th><th>S corporation</th></tr>' +
      '<tr><td>Salary paid to you (W-2)</td><td>n/a</td><td>' + f(s.salary) + '</td></tr>' +
      '<tr><td>Self-employment tax / payroll taxes (both halves + FUTA)</td><td>' + f(so.se) + '</td><td>' + f(s.payroll) + '</td></tr>' +
      '<tr><td>Profit passed through after salary (K-1)</td><td>n/a</td><td>' + f(s.distribution) + '</td></tr>' +
      '<tr><td>Qualified business income deduction</td><td>' + f(so.qbiDed) + '</td><td>' + f(s.qbiDed) + '</td></tr>' +
      '<tr><td>Federal income tax</td><td>' + f(so.incomeTax) + '</td><td>' + f(s.incomeTax) + '</td></tr>' +
      '<tr><td>Extra S corp costs (your estimate)</td><td>$0</td><td>' + f(s.costs) + '</td></tr>' +
      '<tr><td><strong>Total federal tax + extra costs</strong></td><td><strong>' + f(so.total) + '</strong></td><td><strong>' + f(s.total) + '</strong></td></tr></table>');
    if (s.capped) out.push('<p><small>The salary you entered plus the employer payroll taxes is more than the profit left after costs, so we lowered it to ' + f(s.salary) + ', the most the business could pay.</small></p>');
    if (so.qbiNote === 'over' || s.qbiNote === 'over') out.push('<p><small>Taxable income is above the range where we model the qualified business income deduction, so it is left out for that column. Above that range the wage limits make the comparison more complicated; ask a tax professional.</small></p>');
    U.$('result').innerHTML = out.join('');
  }
  U.on(ids, run);
})();
