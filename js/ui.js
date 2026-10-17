/* Tiny helpers shared by calculator pages */
window.FLUI = (function () {
  var $ = function (id) { return document.getElementById(id); };
  var n = function (id) { var e = $(id); if (!e) return 0; var v = parseFloat(String(e.value).replace(/[$,\s]/g, '')); return isFinite(v) ? v : 0; };
  var on = function (ids, fn) { ids.forEach(function (id) { var e = $(id); if (e) { e.addEventListener('input', fn); e.addEventListener('change', fn); } }); fn(); };
  var download = function (name, text, type) {
    var b = new Blob([text], { type: type || 'text/plain' }), a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  var months = function (m) { return m === Infinity ? 'Indefinite (income covers expenses)' : (m).toFixed(1) + ' months'; };
  return { $: $, n: n, on: on, download: download, months: months, fmt: function (x, d) { return FL.fmt(x, d); } };
})();
