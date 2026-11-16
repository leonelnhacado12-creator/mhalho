const styles = [
  [14, 'Layered Body Wave', 'Wavy', 18],
  [13, 'Sleek Long Layers', 'Straight', 18],
  [15, 'Copper Ombre Curls', 'Curly', 18],
  [16, 'Caramel Side-Swept Waves', 'Wavy', 14],
  [18, 'Centre-Part Curly Bob', 'Curly', 8],
  [19, 'Rooted Blonde Bob', 'Straight', 12],
  [20, 'Honey Highlight Curls', 'Curly', 14],
  [17, 'Short Curly Headband Wig', 'Headband', 8],
  [21, 'Blonde Accent Bob', 'Straight', 8],
  [22, 'Cobalt Blue Bob', 'Straight'],
  [2, 'Side-Part Glam Waves', 'Wavy'],
  [4, 'Defined Centre-Part Curls', 'Curly'],
  [8, 'Long Textured Straight Wig', 'Straight'],
  [5, 'Side-Swept Curly Bob No. 307', 'Curly'],
  [6, 'Long Centre-Part Ringlets', 'Curly'],
  [7, 'Side-Swept Layered Bob', 'Wavy'],
  [1, 'Leopard Headband Curls', 'Headband'],
  [9, 'Full Curly Headband Wig', 'Headband'],
  [10, 'Long Deep Waves', 'Wavy'],
  [11, 'Tight Curl Headband Wig', 'Headband'],
  [12, 'Shoulder-Length Side-Part Curls', 'Curly'],
  [3, 'Voluminous Side-Swept Curls', 'Curly']
];
const whatsappBase = 'https://wa.me/27769655453';
function productWhatsApp(name, length, order = false) {
  const style = length ? `${name} (${length} inches)` : name;
  const message = order
    ? `Hi MHALHO! I'd like to order the ${style}. Could you confirm the price, availability and how to place my order?`
    : `Hi MHALHO! Could you confirm the price and availability of the ${style}?`;
  return `${whatsappBase}?text=${encodeURIComponent(message)}`;
}
const products = document.querySelector('#products');
const filters = document.querySelector('#collection .filters');
const details = document.querySelector('#details');
const savedDialog = document.querySelector('#saved');
let saved = new Set();
try {
  const previous = JSON.parse(localStorage.getItem('mhalho-saved') || '[]');
  if (Array.isArray(previous)) saved = new Set(previous.filter(id => styles.some(([key]) => key === id)));
} catch {}
const meta = (type, length) => length ? `${type} · ${length}″` : type;
const updateCount = () => document.querySelector('#count').textContent = saved.size;
function toggleSaved(id) {
  if (saved.has(id)) saved.delete(id);
  else saved.add(id);
  try { localStorage.setItem('mhalho-saved', JSON.stringify([...saved])); } catch {}
  updateCount();
}
function showDetails(id) {
  const [key, name, type, length] = styles.find(([item]) => item === id);
  const content = document.querySelector('#detail-content');
  content.innerHTML = `<div class="detail-grid"><img src="media/${key}.jpg" alt="${name}"><div><p class="kicker">${meta(type, length)}</p><h2 id="detail-title">${name}</h2><p>Message us for the current price, availability or to place an order.</p><div class="product-actions"><a class="button" href="${productWhatsApp(name, length, true)}" target="_blank" rel="noopener noreferrer">Order on WhatsApp</a><a class="button outline" href="${productWhatsApp(name, length)}" target="_blank" rel="noopener noreferrer">Check price &amp; availability</a><button class="save-style" type="button"></button></div></div></div>`;
  const button = content.querySelector('button');
  const refresh = () => {
    button.textContent = saved.has(id) ? 'Remove from saved' : 'Save this style';
    button.setAttribute('aria-pressed', String(saved.has(id)));
  };
  button.onclick = () => { toggleSaved(id); refresh(); };
  refresh();
  details.showModal();
}
function renderProducts(category) {
  products.innerHTML = styles.filter(([, , type]) => category === 'All styles' || type === category)
    .map(([id, name, type, length]) => `<article class="product"><button type="button" data-id="${id}"><span class="image-frame"><img loading="lazy" src="media/${id}.jpg" alt=""></span><h3>${name}<span class="arrow" aria-hidden="true">↗</span></h3><span class="meta">${meta(type, length)}</span></button><a class="product-enquiry" href="${productWhatsApp(name, length)}" aria-label="Ask on WhatsApp about ${name}" target="_blank" rel="noopener noreferrer">Ask on WhatsApp <span aria-hidden="true">↗</span></a></article>`).join('');
}
function addChoice(parent, label, active, select) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-pressed', String(active));
  button.onclick = () => {
    parent.querySelector('[aria-pressed="true"]')?.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-pressed', 'true');
    select();
  };
  parent.append(button);
}
for (const category of ['All styles', 'Straight', 'Wavy', 'Curly', 'Headband']) {
  addChoice(filters, category, category === 'All styles', () => renderProducts(category));
}
products.onclick = event => {
  const button = event.target.closest('button[data-id]');
  if (button) showDetails(Number(button.dataset.id));
};
function renderSaved() {
  const content = document.querySelector('#saved-content');
  content.innerHTML = saved.size ? styles.filter(([id]) => saved.has(id))
    .map(([id, name]) => `<div class="saved-row"><span>${name}</span><button type="button" data-remove="${id}" aria-label="Remove ${name}">Remove</button></div>`).join('')
    : '<p>Save a style from the collection to see it here.</p>';
}
document.querySelector('#open-saved').onclick = () => { renderSaved(); savedDialog.showModal(); };
document.querySelector('#saved-content').onclick = event => {
  const button = event.target.closest('[data-remove]');
  if (button) {
    toggleSaved(Number(button.dataset.remove));
    renderSaved();
    (document.querySelector('#saved-content button') || document.querySelector('#saved-visit')).focus();
  }
};
document.querySelector('#saved-visit').onclick = () => savedDialog.close();
const film = document.querySelector('#film');
const clips = document.querySelector('#clips');
for (let clip = 1; clip <= 10; clip++) {
  addChoice(clips, `Clip ${clip}`, clip === 1, () => {
    film.removeAttribute('poster');
    film.src = `media/video-${clip}.mp4`;
    film.setAttribute('aria-label', `Lookbook video ${clip}`);
    film.play().catch(() => {});
  });
}
updateCount();
renderProducts('All styles');

