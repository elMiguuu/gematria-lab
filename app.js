const AZ='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const primes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101];
const fib=[1,1,2,3,5,8,13,21,34,55,89,144,233,233,144,89,55,34,21,13,8,5,3,2,1,1];
const latin=[1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500];
const standard=AZ.map((_,i)=> i<9?i+1:i<18?(i-8)*10:(i-17)*100);
const ordinal=AZ.map((_,i)=>i+1);
const reverse=[...ordinal].reverse();
const reduction=ordinal.map(n=>((n-1)%9)+1);
const reverseReduction=reverse.map(n=>((n-1)%9)+1);
const satanic=ordinal.map(n=>n+35);
const reverseSatanic=reverse.map(n=>n+35);
const trigonal=ordinal.map(n=>n*(n+1)/2);
const squares=ordinal.map(n=>n*n);

const cipherDefs={
  ordinal:{name:'Ordinal',group:'Base',vals:ordinal},
  reduction:{name:'Reduction',group:'Base',vals:reduction},
  reverse:{name:'Reverse',group:'Base',vals:reverse},
  reverseReduction:{name:'Reverse Reduction',group:'Base',vals:reverseReduction},
  standard:{name:'Standard',group:'Historic / Extended',vals:standard},
  latin:{name:'Latin',group:'Historic / Extended',vals:latin},
  sumerian:{name:'Sumerian 6',group:'Sumerian',vals:ordinal.map(n=>n*6)},
  reverseSumerian:{name:'Reverse Sumerian',group:'Historic / Extended',vals:reverse.map(n=>n*6)},
  satanic:{name:'Satanic',group:'Historic / Extended',vals:satanic},
  reverseSatanic:{name:'Reverse Satanic',group:'Historic / Extended',vals:reverseSatanic},
  primes:{name:'Primes',group:'Mathematical',vals:primes},
  trigonal:{name:'Trigonal',group:'Mathematical',vals:trigonal},
  squares:{name:'Squares',group:'Mathematical',vals:squares},
  fibonacci:{name:'Fibonacci',group:'Mathematical',vals:fib},
  reversePrimes:{name:'Reverse Primes',group:'Mathematical',vals:[...primes].reverse()},
  reverseTrigonal:{name:'Reverse Trigonal',group:'Mathematical',vals:[...trigonal].reverse()},
  reverseSquares:{name:'Reverse Squares',group:'Mathematical',vals:[...squares].reverse()},
};
for(let f=2;f<=40;f++){
  if(f===6) continue;
  cipherDefs['sumerian'+f]={name:`Sumerian ${f}`,group:'Sumerian',vals:ordinal.map(n=>n*f)};
}

const palette=['#ffbb38','#4edc89','#59b8ff','#ee79df','#ff8b56','#b397ff','#5ce4d6','#ff6386'];
Object.values(cipherDefs).forEach((d,i)=>d.color=palette[i%palette.length]);

const defaultActive=['ordinal','reduction','reverse','reverseReduction','standard','latin','sumerian','reverseSumerian','satanic','reverseSatanic','primes','trigonal','squares','fibonacci','reversePrimes','reverseTrigonal','reverseSquares'];
let active=new Set(defaultActive);
let db=[
  ['Golden Gate Bridge','Places'],['San Francisco','Places'],['New York City','Places'],['London','Places'],['Paris','Places'],['Rome','Places'],['Zurich','Places'],['Aarau','Places'],
  ['Michael','Names'],['Daniel','Names'],['Benjamin','Names'],['Amelie','Names'],['Mila','Names'],['Alexander','Names'],['William','Names'],['Russell','Names'],
  ['Apollo','Mythology'],['Mercury','Mythology'],['Saturn','Mythology'],['Jupiter','Mythology'],['Mars','Mythology'],['Venus','Mythology'],
  ['eclipse','General'],['numbers','General'],['gematria','General'],['bridge','General'],['freedom','General'],['history','General'],['future','General'],['ritual','General'],['sacrifice','General'],
  ['Kansas City Chiefs','NFL'],['Las Vegas Raiders','NFL'],['Green Bay Packers','NFL'],['Dallas Cowboys','NFL'],['New York Jets','NFL'],['Buffalo Bills','NFL'],['San Francisco 49ers','NFL'],
].map(([phrase,category])=>({phrase,category}));

const $=s=>document.querySelector(s);
function normalize(s){return s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function calcWithVals(text,vals){let total=0; for(const ch of normalize(text)){const i=ch.charCodeAt(0)-65;if(i>=0&&i<26)total+=vals[i];}return total;}
function calc(text,key){return calcWithVals(text,cipherDefs[key].vals);}
function letters(text,key){const vals=cipherDefs[key].vals;return [...normalize(text)].filter(c=>/[A-Z]/.test(c)).map(ch=>({ch,v:vals[ch.charCodeAt(0)-65]}));}

function renderCipherGroups(){
  const root=$('#cipherGroups');root.innerHTML='';
  const groups={};Object.entries(cipherDefs).forEach(([k,d])=>(groups[d.group]??=[]).push([k,d]));
  for(const [g,items] of Object.entries(groups)){
    const div=document.createElement('div');div.className='group';
    div.innerHTML=`<h3>${g}</h3><div class="chips"></div>`; const chips=div.querySelector('.chips');
    for(const [k,d] of items){const lab=document.createElement('label');lab.className='chip';lab.style.setProperty('--cipher',d.color);lab.innerHTML=`<input type="checkbox" data-key="${k}" ${active.has(k)?'checked':''}> ${d.name}`;chips.appendChild(lab)}
    root.appendChild(div);
  }
  root.querySelectorAll('input').forEach(i=>i.addEventListener('change',e=>{const k=e.target.dataset.key;e.target.checked?active.add(k):active.delete(k);renderAll()}));
}
function renderResults(){
  const text=$('#phrase').value; const root=$('#results');root.innerHTML='';
  [...active].forEach(k=>{const d=cipherDefs[k],v=calc(text,k);const el=document.createElement('div');el.className='result';el.style.setProperty('--cipher',d.color);el.innerHTML=`<div class="name">${d.name}</div><div class="value">${v.toLocaleString('de-CH')}</div>`;el.onclick=()=>renderBreakdown(k);root.appendChild(el)});
  const count=[...normalize(text)].filter(c=>/[A-Z]/.test(c)).length;$('#summary').textContent=`${count} Buchstaben · ${active.size} aktive Ciphers`;
}
function renderBreakdown(k){
  const text=$('#phrase').value,d=cipherDefs[k],arr=letters(text,k),b=$('#breakdown');b.classList.remove('hidden');b.style.setProperty('--cipher',d.color);
  b.innerHTML=`<strong>${d.name}</strong> · Total ${calc(text,k).toLocaleString('de-CH')}<div class="letters">${arr.map(x=>`<div class="letterBox"><b>${x.ch}</b><span>${x.v}</span></div>`).join('')}</div>`;
}
function categories(){return [...new Set(db.map(x=>x.category||'General'))].sort()}
function updateCategorySelect(){const s=$('#categoryFilter'),old=s.value;s.innerHTML='<option value="all">Everything</option>'+categories().map(c=>`<option>${c}</option>`).join('');if([...s.options].some(o=>o.value===old))s.value=old}
function updateMinMatches(){const s=$('#minMatches'),n=Math.max(active.size,1),old=+s.value||n;s.innerHTML='';for(let i=n;i>=1;i--){s.insertAdjacentHTML('beforeend',`<option value="${i}">${i} / ${n}</option>`)}s.value=Math.min(old,n)}
function renderMatches(){
  updateMinMatches(); const phrase=$('#phrase').value.trim(),keys=[...active]; const cat=$('#categoryFilter').value; const min=+$('#minMatches').value||keys.length; const exact=$('#exactOnly').checked;
  const head=$('#matchHead'),body=$('#matchBody');
  head.innerHTML=`<tr><th>Phrase</th><th>Kategorie</th><th>Match</th>${keys.map(k=>`<th style="color:${cipherDefs[k].color}">${cipherDefs[k].name}</th>`).join('')}</tr>`;body.innerHTML='';
  if(!phrase||!keys.length){$('#dbStatus').textContent='Phrase eingeben und mindestens einen Cipher aktivieren.';return}
  const target=Object.fromEntries(keys.map(k=>[k,calc(phrase,k)]));
  const rows=[];
  for(const item of db){if(cat!=='all'&&item.category!==cat)continue;const vals={},hits=[];for(const k of keys){vals[k]=calc(item.phrase,k);if(vals[k]===target[k])hits.push(k)}if(hits.length>=min && (!exact || hits.length===keys.length))rows.push({item,vals,hits})}
  rows.sort((a,b)=>b.hits.length-a.hits.length||a.item.phrase.localeCompare(b.item.phrase));
  rows.slice(0,500).forEach(r=>{body.insertAdjacentHTML('beforeend',`<tr><td>${escapeHtml(r.item.phrase)}</td><td>${escapeHtml(r.item.category||'General')}</td><td class="matchBadge">${r.hits.length}/${keys.length}</td>${keys.map(k=>`<td style="color:${cipherDefs[k].color}">${r.vals[k].toLocaleString('de-CH')}${r.hits.includes(k)?' ✓':''}</td>`).join('')}</tr>`)})
  $('#dbStatus').textContent=`${rows.length} Treffer in ${db.length.toLocaleString('de-CH')} Datenbank-Einträgen${rows.length>500?' · erste 500 angezeigt':''}.`;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function renderAll(){renderResults();updateCategorySelect();renderMatches()}

$('#phrase').addEventListener('input',renderAll);$('#clearBtn').onclick=()=>{$('#phrase').value='';renderAll();$('#phrase').focus()};
$('#selectCore').onclick=()=>{active=new Set(['ordinal','reduction','reverse','reverseReduction']);renderCipherGroups();renderAll()};
$('#selectAll').onclick=()=>{active=new Set(Object.keys(cipherDefs));renderCipherGroups();renderAll()};
$('#clearAll').onclick=()=>{active.clear();renderCipherGroups();renderAll()};
$('#minMatches').addEventListener('change',renderMatches);$('#categoryFilter').addEventListener('change',renderMatches);$('#exactOnly').addEventListener('change',renderMatches);
$('#themeBtn').onclick=()=>document.body.classList.toggle('light');
$('#fileInput').addEventListener('change',async e=>{
  const f=e.target.files[0]; if(!f)return; const text=await f.text(); let added=0;
  for(const raw of text.split(/\r?\n/)){const line=raw.trim();if(!line)continue;let phrase=line,category='Imported';if(line.includes(',')){const p=line.split(',');phrase=p.shift().trim();category=p.join(',').trim()||'Imported'}if(phrase){db.push({phrase,category});added++}}
  updateCategorySelect();renderMatches();$('#dbStatus').textContent=`${added.toLocaleString('de-CH')} Einträge importiert · Datenbank jetzt ${db.length.toLocaleString('de-CH')} Einträge.`;
});

renderCipherGroups();updateCategorySelect();$('#phrase').value='Golden Gate Bridge';renderAll();
