(function () {
  var U = FLUI, F = FL, rows = U.$('rows');
  function addRow(d, q, p) {
    var tr = document.createElement('div'); tr.className = 'grid2 line';
    tr.innerHTML = '<label>Description<input class="l-desc" type="text" value="' + (d || '').replace(/"/g, '&quot;') + '"></label><label>Qty<input class="l-qty" type="number" min="0" step="any" value="' + (q || 1) + '"></label><label>Unit price $<input class="l-price" type="number" min="0" step="any" value="' + (p || 0) + '"></label><button type="button" class="btn alt l-del">Remove</button>';
    rows.appendChild(tr); tr.addEventListener('input', render); tr.querySelector('.l-del').addEventListener('click', function () { tr.remove(); render(); });
  }
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var txt = function (id) { return esc(U.$(id).value).replace(/\n/g, '<br>'); };
  function dollars(c) { return '$' + (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function render() {
    var lines = [].map.call(rows.querySelectorAll('.line'), function (r) { return { desc: r.querySelector('.l-desc').value, qty: r.querySelector('.l-qty').value, price: r.querySelector('.l-price').value }; });
    var v = F.invoice(lines, U.n('taxPct'), U.n('discount'));
    var due = U.$('dueDate').value;
    var late = U.$('lateFee').checked ? '<p>Late fee: ' + esc(U.$('lateRate').value || '0') + '% per month may be charged on balances unpaid after the due date, where permitted by law and agreed in writing.</p>' : '';
    var html = '<h2 style="margin-top:0">INVOICE</h2><div class="grid2"><div><strong>From</strong><br>' + txt('fromName') + '<br>' + txt('fromAddr') + '</div><div><strong>Bill to</strong><br>' + txt('toName') + '<br>' + txt('toAddr') + '</div></div>' +
      '<p><strong>Invoice #:</strong> ' + esc(U.$('invNo').value) + ' &nbsp; <strong>Date:</strong> ' + esc(U.$('invDate').value) + (due ? ' &nbsp; <strong>Due:</strong> ' + esc(due) : '') + '</p>' +
      '<table><tr><th>Description</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr>' + v.rows.map(function (r) { return '<tr><td>' + esc(r.desc) + '</td><td>' + r.qty + '</td><td>' + dollars(r.price) + '</td><td>' + dollars(r.amt) + '</td></tr>'; }).join('') + '</table>' +
      '<p style="text-align:right">Subtotal: ' + dollars(v.sub) + (v.disc ? '<br>Discount: -' + dollars(v.disc) : '') + (v.tax ? '<br>Tax (' + U.n('taxPct') + '%): ' + dollars(v.tax) : '') + '<br><strong style="font-size:1.2rem">Total due: ' + dollars(v.total) + '</strong></p>' +
      (U.$('payInfo').value ? '<p><strong>How to pay</strong><br>' + txt('payInfo') + '</p>' : '') + late + (U.$('notes').value ? '<p>' + txt('notes') + '</p>' : '');
    U.$('doc').innerHTML = html;
  }
  var d = new Date(), iso = function (x) { return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
  U.$('invDate').value = iso(d);
  function setDue() { var x = new Date(U.$('invDate').value + 'T12:00:00'); x.setDate(x.getDate() + (+U.$('terms').value)); U.$('dueDate').value = iso(x); }
  U.$('terms').addEventListener('change', function () { setDue(); render(); }); U.$('invDate').addEventListener('change', function () { setDue(); render(); });
  U.$('addRow').addEventListener('click', function () { addRow('', 1, 0); render(); });
  U.$('print').addEventListener('click', function () { window.print(); });
  addRow('Web design, hourly', 10, 75); setDue();
  ['fromName', 'fromAddr', 'toName', 'toAddr', 'invNo', 'dueDate', 'taxPct', 'discount', 'payInfo', 'notes', 'lateFee', 'lateRate'].forEach(function (id) { U.$(id).addEventListener('input', render); U.$(id).addEventListener('change', render); });
  render();
})();
