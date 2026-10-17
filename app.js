/* Home page: filter buttons + tool cards. The 'all' view is prerendered by scripts/build.mjs; this only handles filtering. */
(function(){
var cats=["all"].concat(Array.from(new Set(TOOLS.map(function(t){return t[2]}))));
var f=document.getElementById('filters'),g=document.getElementById('grid'),cur="all";
if(!f||!g)return;
function render(){
  f.innerHTML=cats.map(function(c){return '<button type="button" class="'+(c==cur?'on':'')+'" data-c="'+c+'" aria-pressed="'+(c==cur)+'">'+c+'</button>'}).join('');
  g.innerHTML=TOOLS.filter(function(t){return cur=="all"||t[2]==cur}).map(cardHtml).join('');
}
f.addEventListener('click',function(e){var c=e.target.getAttribute&&e.target.getAttribute('data-c');if(c){cur=c;render();}});
})();
