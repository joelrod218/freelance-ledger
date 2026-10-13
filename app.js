const cats=["all",...new Set(TOOLS.map(t=>t[2]))];let cur="all";
const f=document.getElementById('filters'),g=document.getElementById('grid');
function render(){f.innerHTML=cats.map(c=>`<button class="${c==cur?'on':''}" data-c="${c}">${c}</button>`).join('');
g.innerHTML=TOOLS.filter(t=>cur=="all"||t[2]==cur).map(([n,u,c,p,v])=>`<a class="card" href="${u}" target="_blank" rel="noopener"><span class="tag">${c}</span><h3>${n}</h3><p class="price">${p}</p><p>${v}</p></a>`).join('');}
f.onclick=e=>{if(e.target.dataset.c){cur=e.target.dataset.c;render()}};
function calc(){const c=+cash.value,b=+burn.value;runOut.textContent=b>0?`Runway: ${(c/b).toFixed(1)} months`:'Enter burn';
taxOut.textContent=`Set aside: $${(+inc.value*+rate.value/100).toLocaleString(undefined,{maximumFractionDigits:0})}`;}
document.querySelectorAll('input[type=number]').forEach(i=>i.oninput=calc);render();calc();
