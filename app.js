const cats=["all",...new Set(TOOLS.map(t=>t[2]))];let cur="all";
const f=document.getElementById('filters'),g=document.getElementById('grid');
function render(){f.innerHTML=cats.map(c=>`<button class="${c==cur?'on':''}" data-c="${c}">${c}</button>`).join('');
g.innerHTML=TOOLS.filter(t=>cur=="all"||t[2]==cur).map(([n,u,c,p,v])=>`<a class="card" href="${u}" target="_blank" rel="noopener"><span class="tag">${c}</span><h3>${n}</h3><p class="price">${p}</p><p>${v}</p></a>`).join('');}
f.onclick=e=>{if(e.target.dataset.c){cur=e.target.dataset.c;render()}};
function calc(){const c=Math.max(0,+cash.value||0),b=+burn.value||0;runOut.textContent=b>0?`Runway: ${(c/b).toFixed(1)} months`:'Enter a monthly burn above $0';
taxOut.textContent=`Set aside: $${(Math.max(0,+inc.value||0)*Math.min(100,Math.max(0,+rate.value||0))/100).toLocaleString(undefined,{maximumFractionDigits:0})}`;}
document.querySelectorAll('input[type=number]').forEach(i=>i.oninput=calc);render();calc();
