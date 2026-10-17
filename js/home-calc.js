/* Quick widgets on the home page */
(function(){
var cash=document.getElementById('cash'),burn=document.getElementById('burn'),inc=document.getElementById('inc'),rate=document.getElementById('rate'),runOut=document.getElementById('runOut'),taxOut=document.getElementById('taxOut');
if(!cash)return;
function calc(){
  var c=Math.max(0,+cash.value||0),b=+burn.value||0;
  runOut.textContent=b>0?'Runway: '+(c/b).toFixed(1)+' months':'Enter a monthly burn above $0';
  taxOut.textContent='Set aside: $'+(Math.max(0,+inc.value||0)*Math.min(100,Math.max(0,+rate.value||0))/100).toLocaleString(undefined,{maximumFractionDigits:0});
}
[cash,burn,inc,rate].forEach(function(i){i.addEventListener('input',calc)});calc();
})();
