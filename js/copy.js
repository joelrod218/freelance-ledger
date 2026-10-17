/* Copy-to-clipboard buttons: <button data-copy="id"> copies the text of element #id */
(function () {
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.getElementById(b.getAttribute('data-copy')); if (!el) return;
      var text = el.innerText, done = function (ok) { var o = b.textContent; b.textContent = ok ? 'Copied' : 'Press Ctrl+C to copy'; setTimeout(function () { b.textContent = o; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { sel(el); done(false); });
      else { sel(el); done(false); }
    });
  });
  function sel(el) { var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
})();
