// Parse data
const dataEl = document.getElementById('portfolio-data');
const DATA = JSON.parse(dataEl.textContent);

// DOM elements
const wall = document.getElementById('wall');
const chips = Array.from(document.querySelectorAll('.chip'));
const searchInput = document.getElementById('searchInput');
const reflectionText = document.getElementById('reflectionText');
const refList = document.getElementById('refList');
const themeToggle = document.getElementById('themeToggle');
const printBtn = document.getElementById('printBtn');
const downloadData = document.getElementById('downloadData');

// Theme toggle (light default)
themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('light');
});

// Print
printBtn.addEventListener('click', ()=> window.print());

// Download JSON
downloadData.addEventListener('click', (e)=>{
  const blob = new Blob([JSON.stringify(DATA, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  downloadData.href = url;
  setTimeout(()=> URL.revokeObjectURL(url), 5000);
});

// Helpers
function makeMedia(m){
  if(!m) return '';
  if(m.type === 'youtube'){
    return `<div class="media"><iframe src="${m.url}" frameborder="0" allowfullscreen title="YouTube embed"></iframe></div>`;
  }
  if(m.type === 'image'){
    return `<div class="media"><img src="${m.url}" alt="${m.alt || ''}"></div>`;
  }
  return '';
}

function makeBadges(arr){
  if(!arr || !arr.length) return '';
  return `<div class="badges">${arr.map(t=>`<span class="badge">${t}</span>`).join('')}</div>`;
}

function makeCard(r){
  const media = makeMedia(r.media);
  const badges = makeBadges(r.inclusion);
  const eylf = (r.eylf||[]).map(e=>`<li>${e}</li>`).join('');
  const howto = (r.howto||[]).map(e=>`<li>${e}</li>`).join('');
  const adaptations = (r.adaptations||[]).map(e=>`<li>${e}</li>`).join('');
  const meta = [`${r.mode}`, `Age ${r.age}`, r.culture].filter(Boolean).join(" • ");

  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.mode = r.mode;
  card.dataset.title = r.title.toLowerCase();
  card.dataset.tags = (r.inclusion||[]).join(' ').toLowerCase() + ' ' + (r.culture||'').toLowerCase();

  card.innerHTML = `
    <header>
      <h3>${r.title}</h3>
      <div class="meta">${meta}</div>
    </header>
    ${media}
    <div class="body">
      ${badges}
      <details>
        <summary>Open details</summary>
        <div>
          <h4>How I’ll use it</h4>
          <ul>${howto}</ul>
          <h4>Adaptations</h4>
          <ul>${adaptations}</ul>
          <h4>EYLF v2.0</h4>
          <ul>${eylf}</ul>
          <h4>Evaluation</h4>
          <p>${r.evaluation}</p>
          <p class="ref"><strong>APA 7:</strong> ${r.reference}</p>
        </div>
      </details>
    </div>
  `;
  return card;
}

// Render wall
function render(resources){
  wall.innerHTML = '';
  resources.forEach(r=> wall.appendChild(makeCard(r)));
}

render(DATA.resources);

// Reflection + references
reflectionText.textContent = DATA.reflection;
refList.innerHTML = DATA.references.map(r=>`<li>${r}</li>`).join('');

// Filtering
let currentFilter = 'all';
chips.forEach(ch=> ch.addEventListener('click', ()=>{
  chips.forEach(c=> c.classList.remove('active'));
  ch.classList.add('active');
  currentFilter = ch.dataset.filter;
  applyFilters();
}));

// Search
searchInput.addEventListener('input', applyFilters);

function applyFilters(){
  const term = searchInput.value.trim().toLowerCase();
  const cards = Array.from(document.querySelectorAll('.card'));
  cards.forEach(card=>{
    const matchesFilter = (currentFilter === 'all') || (card.dataset.mode === currentFilter);
    const hay = (card.dataset.title + ' ' + card.dataset.tags);
    const matchesSearch = !term || hay.includes(term);
    card.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
  });
}
