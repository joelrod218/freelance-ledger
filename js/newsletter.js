/* Renders newsletter signup blocks into [data-newsletter] containers, but only when
   SITE_CONFIG.newsletter.action is set. Otherwise the containers are removed so visitors never see a dead form. */
(function(){
var cfg=(window.SITE_CONFIG||{}).newsletter||{};
var boxes=document.querySelectorAll('[data-newsletter]');
if(!boxes.length)return;
if(!cfg.action){boxes.forEach(function(b){b.parentNode&&b.parentNode.removeChild(b)});return;}
var n=0;
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
boxes.forEach(function(b){
  n++;var id='nl-email-'+n;
  var hidden=Object.keys(cfg.extra||{}).map(function(k){return '<input type="hidden" name="'+esc(k)+'" value="'+esc(cfg.extra[k])+'">'}).join('');
  b.className='nl';
  b.innerHTML='<h2>'+esc(b.getAttribute('data-heading'))+'</h2><p>'+esc(b.getAttribute('data-blurb'))+'</p>'+
  '<form action="'+esc(cfg.action)+'" method="'+esc(cfg.method||'post')+'"'+(cfg.newTab?' target="_blank"':'')+'>'+
  '<label for="'+id+'">Email address</label><div class="nl-row"><input id="'+id+'" type="email" name="'+esc(cfg.emailName||'email')+'" placeholder="you@example.com" autocomplete="email" required>'+hidden+
  '<button type="submit">'+esc(b.getAttribute('data-button')||'Subscribe')+'</button></div></form>'+
  '<p class="nl-fine">We use your address only to send this newsletter. <a href="/privacy.html">Privacy</a></p>';
});
})();
