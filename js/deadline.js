/* Shows the next US federal estimated-tax due date in any [data-next-deadline] element.
   Dates are the statutory dates adjusted for weekends/federal holidays; verify yearly against the IRS 1040-ES. */
(function(){
var D=[["2026-04-15","1st"],["2026-06-15","2nd"],["2026-09-15","3rd"],["2027-01-15","4th (2026 tax year)"],
["2027-04-15","1st (2027 tax year)"],["2027-06-15","2nd (2027 tax year)"],["2027-09-15","3rd (2027 tax year)"],["2028-01-18","4th (2027 tax year)"]];
var now=new Date(),t=new Date(now.getFullYear(),now.getMonth(),now.getDate()),hit=null;
for(var i=0;i<D.length;i++){var p=D[i][0].split('-'),d=new Date(+p[0],p[1]-1,+p[2]);if(d>=t){hit={d:d,l:D[i][1]};break;}}
document.querySelectorAll('[data-next-deadline]').forEach(function(el){
  if(!hit){el.parentNode&&el.parentNode.removeChild(el);return;}
  var days=Math.round((hit.d-t)/864e5),txt=hit.d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  el.innerHTML='Next federal estimated-tax due date: <strong>'+txt+'</strong> ('+(days===0?'today':days+' day'+(days===1?'':'s')+' away')+', '+hit.l+' payment).';
});
})();
