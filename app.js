const MARKETS=[
  {id:"todos",name:"Todos",icon:"✦"},
  {id:"assai",name:"Assaí",icon:"🟠"},
  {id:"atacadao",name:"Atacadão",icon:"🔴"},
  {id:"carrefour",name:"Carrefour",icon:"🔵"},
  {id:"pao",name:"Pão de Açúcar",icon:"🟢"},
  {id:"savegnago",name:"Savegnago",icon:"🟡"},
  {id:"dia",name:"Dia",icon:"🔴"}
];
const CATEGORIES=[
  {id:"mercearia",name:"Mercearia",icon:"🥫"},
  {id:"hortifruti",name:"Hortifruti",icon:"🥬"},
  {id:"carnes",name:"Carnes",icon:"🥩"},
  {id:"bebidas",name:"Bebidas",icon:"🥤"},
  {id:"limpeza",name:"Limpeza",icon:"🧼"},
  {id:"higiene",name:"Higiene",icon:"🧴"},
  {id:"padaria",name:"Padaria",icon:"🥖"}
];
const addDays=n=>{const d=new Date();d.setHours(23,59,59,999);d.setDate(d.getDate()+n);return d.toISOString()};
const SEED_OFFERS=[
  {id:"o1",title:"Arroz Tipo 1 Camil 5kg",description:"Pacote de 5kg • limite de 3 unidades",price:24.9,oldPrice:31.9,market:"assai",category:"mercearia",emoji:"🍚",validUntil:addDays(0),featured:10,created:12},
  {id:"o2",title:"Café Pilão Torrado 500g",description:"Tradicional ou extraforte",price:14.99,oldPrice:21.49,market:"atacadao",category:"mercearia",emoji:"☕",validUntil:addDays(1),featured:9,created:11},
  {id:"o3",title:"Leite Integral Italac 1L",description:"Caixa com 12 unidades por R$ 47,88",price:3.99,oldPrice:5.49,market:"carrefour",category:"bebidas",emoji:"🥛",validUntil:addDays(2),featured:8,created:10},
  {id:"o4",title:"Picanha Bovina Resfriada kg",description:"Peça inteira embalada a vácuo",price:49.9,oldPrice:69.9,market:"savegnago",category:"carnes",emoji:"🥩",validUntil:addDays(0),featured:10,created:9},
  {id:"o5",title:"Banana Nanica kg",description:"Produto fresco selecionado",price:3.79,oldPrice:5.99,market:"pao",category:"hortifruti",emoji:"🍌",validUntil:addDays(1),featured:7,created:8},
  {id:"o6",title:"Sabão em Pó Omo 2,2kg",description:"Lavagem perfeita, embalagem econômica",price:22.9,oldPrice:31.9,market:"assai",category:"limpeza",emoji:"🧼",validUntil:addDays(3),featured:9,created:7},
  {id:"o7",title:"Refrigerante Coca-Cola 2L",description:"Original ou sem açúcar",price:7.49,oldPrice:10.99,market:"dia",category:"bebidas",emoji:"🥤",validUntil:addDays(0),featured:8,created:6},
  {id:"o8",title:"Pão Francês Fresquinho kg",description:"Produção própria, assado o dia todo",price:11.9,oldPrice:15.9,market:"carrefour",category:"padaria",emoji:"🥖",validUntil:addDays(1),featured:6,created:5},
  {id:"o9",title:"Azeite Gallo Extra Virgem 500ml",description:"Acidez máxima de 0,5%",price:32.9,oldPrice:44.9,market:"atacadao",category:"mercearia",emoji:"🫒",validUntil:addDays(4),featured:7,created:4},
  {id:"o10",title:"Papel Higiênico Neve 12 rolos",description:"Folha dupla, rolos de 30m",price:18.99,oldPrice:25.9,market:"pao",category:"higiene",emoji:"🧻",validUntil:addDays(2),featured:5,created:3},
  {id:"o11",title:"Tomate Italiano kg",description:"Direto do produtor",price:4.59,oldPrice:7.99,market:"savegnago",category:"hortifruti",emoji:"🍅",validUntil:addDays(0),featured:8,created:2},
  {id:"o12",title:"Frango Inteiro Congelado kg",description:"Marcas selecionadas",price:8.99,oldPrice:12.9,market:"dia",category:"carnes",emoji:"🍗",validUntil:addDays(2),featured:6,created:1}
];
const DEFAULT_COMMUNITIES=[
  {id:"c1",name:"Ofertas Assaí da Região",members:"2,8 mil membros",icon:"🛒",active:true},
  {id:"c2",name:"Promoções Campinas e Região",members:"8,2 mil membros",icon:"📍",active:true},
  {id:"c3",name:"Clube do Atacadão",members:"4,1 mil membros",icon:"🏷️",active:true}
];
const NOTIFICATIONS=[
  {icon:"🔥",title:"5 ofertas em destaque",text:"Assaí e Atacadão publicaram novas promoções.",time:"Agora"},
  {icon:"💚",title:"Um favorito baixou de preço",text:"O Café Pilão agora está por R$ 14,99.",time:"Há 25 min"},
  {icon:"📍",title:"Ofertas perto de você",text:"3 promoções válidas somente hoje em Campinas.",time:"Há 1 h"}
];
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const money=n=>Number(n).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const getJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
let state={
  market:"todos",search:"",category:"todos",minDiscount:0,favoritesOnly:false,todayOnly:false,sort:"featured",
  favorites:new Set(getJSON("ofertafacil:favorites",[])),
  customOffers:getJSON("ofertafacil:offers",[]),
  communities:getJSON("ofertafacil:communities",DEFAULT_COMMUNITIES),
  readNotifications:localStorage.getItem("ofertafacil:notifications-read")==="true"
};
const marketBy=id=>MARKETS.find(m=>m.id===id)||{name:id,icon:"🏪"};
const categoryBy=id=>CATEGORIES.find(c=>c.id===id)||{name:id,icon:"🛒"};
const discount=o=>o.oldPrice>o.price?Math.round((1-o.price/o.oldPrice)*100):0;
const isToday=date=>new Date(date).toDateString()===new Date().toDateString();
const allOffers=()=>[...state.customOffers,...SEED_OFFERS];
function filteredOffers(){
  let items=allOffers().filter(o=>{
    const term=state.search.toLocaleLowerCase("pt-BR");
    const hay=[o.title,o.description,marketBy(o.market).name,categoryBy(o.category).name].join(" ").toLocaleLowerCase("pt-BR");
    return(!term||hay.includes(term))&&(state.market==="todos"||o.market===state.market)&&(state.category==="todos"||o.category===state.category)&&discount(o)>=state.minDiscount&&(!state.favoritesOnly||state.favorites.has(o.id))&&(!state.todayOnly||isToday(o.validUntil));
  });
  items.sort((a,b)=>state.sort==="discount"?discount(b)-discount(a):state.sort==="priceAsc"?a.price-b.price:state.sort==="recent"?(b.created||0)-(a.created||0):(b.featured||0)-(a.featured||0));
  return items;
}
function validityText(date){
  const target=new Date(date);target.setHours(23,59,59,999);
  const today=new Date();today.setHours(0,0,0,0);
  const diff=Math.ceil((target-today)/86400000);
  if(diff<0)return"Encerrada";if(diff===0)return"Termina hoje";if(diff===1)return"Até amanhã";
  return"Até "+target.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
}
function renderMarkets(){
  $("#marketChips").innerHTML=MARKETS.map(m=>`<button class="chip ${state.market===m.id?"active":""}" data-market="${m.id}"><span class="market-dot">${m.icon}</span>${m.name}</button>`).join("");
  $$("[data-market]").forEach(b=>b.onclick=()=>{state.market=b.dataset.market;render()});
}
function renderOffers(){
  const items=filteredOffers();$("#heroOfferCount").textContent=allOffers().length;
  $("#offersGrid").innerHTML=items.map(o=>{
    const d=discount(o),fav=state.favorites.has(o.id),today=isToday(o.validUntil);
    return `<article class="offer-card">
      <div class="product-visual">
        ${d?`<span class="discount-tag">-${d}%</span>`:""}
        <button class="favorite-btn ${fav?"active":""}" data-favorite="${o.id}" aria-label="${fav?"Remover dos":"Adicionar aos"} favoritos">${fav?"♥":"♡"}</button>
        <span class="emoji" role="img" aria-label="${o.title}">${o.emoji||"🛒"}</span>
      </div>
      <div class="offer-body">
        <div class="market-line"><span class="market-name">${marketBy(o.market).icon} ${marketBy(o.market).name}</span><span>${categoryBy(o.category).name}</span></div>
        <h3>${escapeHTML(o.title)}</h3><div class="offer-description">${escapeHTML(o.description||"Oferta selecionada para você")}</div>
        <div class="price-row"><div class="price"><strong>${money(o.price)}</strong>${o.oldPrice?`<del>${money(o.oldPrice)}</del>`:""}</div><div class="validity ${today?"today":""}">${validityText(o.validUntil)}</div></div>
      </div>
    </article>`
  }).join("");
  $("#emptyState").classList.toggle("hidden",items.length>0);
  $$("[data-favorite]").forEach(b=>b.onclick=()=>toggleFavorite(b.dataset.favorite));
}
function toggleFavorite(id){
  if(state.favorites.has(id)){state.favorites.delete(id);showToast("Removido dos favoritos")}else{state.favorites.add(id);showToast("Oferta salva nos favoritos")}
  localStorage.setItem("ofertafacil:favorites",JSON.stringify([...state.favorites]));renderOffers();
}
function renderFilterOptions(){
  $("#categoryOptions").innerHTML=[{id:"todos",name:"Todas",icon:"✦"},...CATEGORIES].map(c=>`<button type="button" class="option-button ${state.category===c.id?"active":""}" data-category="${c.id}">${c.icon} ${c.name}</button>`).join("");
  $$("[data-category]").forEach(b=>b.onclick=()=>{state.category=b.dataset.category;renderFilterOptions()});
  $("#discountRange").value=state.minDiscount;$("#discountValue").textContent=state.minDiscount+"%";
  $("#favoritesOnly").checked=state.favoritesOnly;$("#todayOnly").checked=state.todayOnly;
}
function activeFilterCount(){return(state.market!=="todos"?1:0)+(state.category!=="todos"?1:0)+(state.minDiscount>0?1:0)+(state.favoritesOnly?1:0)+(state.todayOnly?1:0)}
function renderActiveFilters(){
  const filters=[];
  if(state.market!=="todos")filters.push(["market",marketBy(state.market).name]);
  if(state.category!=="todos")filters.push(["category",categoryBy(state.category).name]);
  if(state.minDiscount)filters.push(["discount","Desconto "+state.minDiscount+"%+"]);
  if(state.favoritesOnly)filters.push(["favorites","Favoritos"]);
  if(state.todayOnly)filters.push(["today","Válidas hoje"]);
  $("#activeFilters").innerHTML=filters.map(f=>`<button class="active-filter" data-remove-filter="${f[0]}">${f[1]} ×</button>`).join("");
  $("#activeFilters").classList.toggle("hidden",!filters.length);
  $("#filterCount").textContent=filters.length;$("#filterCount").classList.toggle("hidden",!filters.length);
  $$("[data-remove-filter]").forEach(b=>b.onclick=()=>{const k=b.dataset.removeFilter;if(k==="market")state.market="todos";if(k==="category")state.category="todos";if(k==="discount")state.minDiscount=0;if(k==="favorites")state.favoritesOnly=false;if(k==="today")state.todayOnly=false;render()});
}
function renderCommunities(){
  $("#communitiesGrid").innerHTML=state.communities.map(c=>`<article class="community-card"><div class="community-logo">${c.icon}</div><div class="community-info"><strong>${escapeHTML(c.name)}</strong><span>${escapeHTML(c.members)}</span></div><button class="community-toggle ${c.active?"":"off"}" data-community="${c.id}">${c.active?"Alertas ativos":"Ativar alertas"}</button></article>`).join("");
  $$("[data-community]").forEach(b=>b.onclick=()=>{const c=state.communities.find(x=>x.id===b.dataset.community);c.active=!c.active;saveCommunities();renderCommunities();showToast(c.active?"Alertas ativados":"Alertas pausados")});
}
function saveCommunities(){localStorage.setItem("ofertafacil:communities",JSON.stringify(state.communities))}
function renderNotifications(){
  $("#notificationsList").innerHTML=NOTIFICATIONS.map(n=>`<div class="notification-item"><span class="n-icon">${n.icon}</span><div><strong>${n.title}</strong><p>${n.text}</p></div><time>${n.time}</time></div>`).join("");
  $("#notificationBadge").classList.toggle("hidden",state.readNotifications);
}
function renderAdmin(){
  const custom=state.customOffers;$("#adminOfferCount").textContent=custom.length;
  $("#adminOffersList").innerHTML=custom.length?custom.map(o=>`<div class="admin-offer"><span class="mini-product">${o.emoji||"🛒"}</span><div><strong>${escapeHTML(o.title)}</strong><span>${money(o.price)} • ${marketBy(o.market).name}</span></div><button class="delete-btn" data-delete="${o.id}" aria-label="Excluir">🗑</button></div>`).join(""):'<p style="color:var(--muted);font-size:12px">Nenhuma oferta cadastrada por você.</p>';
  $$("[data-delete]").forEach(b=>b.onclick=()=>{state.customOffers=state.customOffers.filter(o=>o.id!==b.dataset.delete);localStorage.setItem("ofertafacil:offers",JSON.stringify(state.customOffers));render();showToast("Oferta excluída")});
}
function render(){renderMarkets();renderOffers();renderActiveFilters();renderCommunities();renderNotifications();renderAdmin()}
function escapeHTML(text=""){return String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function openPanel(id){$$(".side-panel").forEach(p=>{p.classList.remove("open");p.setAttribute("aria-hidden","true")});$("#"+id).classList.add("open");$("#"+id).setAttribute("aria-hidden","false");$("#overlay").classList.remove("hidden");document.body.style.overflow="hidden"}
function closePanels(){$$(".side-panel").forEach(p=>{p.classList.remove("open");p.setAttribute("aria-hidden","true")});$("#overlay").classList.add("hidden");document.body.style.overflow=""}
let toastTimer;function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2600)}
function clearFilters(){state.market="todos";state.category="todos";state.minDiscount=0;state.favoritesOnly=false;state.todayOnly=false;state.search="";$("#searchInput").value="";renderFilterOptions();render()}
$("#searchInput").addEventListener("input",e=>{state.search=e.target.value;renderOffers()});
$("#sortSelect").addEventListener("change",e=>{state.sort=e.target.value;renderOffers()});
$("#openFiltersBtn").onclick=()=>{renderFilterOptions();openPanel("filterPanel")};
$("#notificationBtn").onclick=()=>openPanel("notificationPanel");
$("#avatarBtn").onclick=()=>openPanel("adminPanel");
$("#overlay").onclick=closePanels;$$("[data-close]").forEach(b=>b.onclick=closePanels);
$("#discountRange").oninput=e=>$("#discountValue").textContent=e.target.value+"%";
$("#applyFiltersBtn").onclick=()=>{state.minDiscount=Number($("#discountRange").value);state.favoritesOnly=$("#favoritesOnly").checked;state.todayOnly=$("#todayOnly").checked;closePanels();render()};
$("#resetFiltersBtn").onclick=clearFilters;$("#clearFiltersBtn").onclick=clearFilters;
$("#markReadBtn").onclick=()=>{state.readNotifications=true;localStorage.setItem("ofertafacil:notifications-read","true");renderNotifications();showToast("Notificações marcadas como lidas")};
$("#adminMarket").innerHTML=MARKETS.filter(m=>m.id!=="todos").map(m=>`<option value="${m.id}">${m.name}</option>`).join("");
$("#adminCategory").innerHTML=CATEGORIES.map(c=>`<option value="${c.id}">${c.name}</option>`).join("");
const dateInput=$('[name="validUntil"]');dateInput.min=new Date().toISOString().slice(0,10);dateInput.value=new Date(Date.now()+86400000).toISOString().slice(0,10);
$("#offerForm").onsubmit=e=>{
  e.preventDefault();const f=new FormData(e.currentTarget);const parse=v=>Number(String(v).replace(/\./g,"").replace(",","."));
  const price=parse(f.get("price")),oldPrice=parse(f.get("oldPrice"))||null;
  if(!price||price<=0){showToast("Informe um preço válido");return}
  const offer={id:"custom-"+Date.now(),title:f.get("title").trim(),price,oldPrice,market:f.get("market"),category:f.get("category"),description:f.get("description").trim(),validUntil:new Date(f.get("validUntil")+"T23:59:59").toISOString(),emoji:f.get("emoji").trim()||"🛒",featured:11,created:Date.now()};
  state.customOffers.unshift(offer);localStorage.setItem("ofertafacil:offers",JSON.stringify(state.customOffers));e.currentTarget.reset();dateInput.value=new Date(Date.now()+86400000).toISOString().slice(0,10);closePanels();clearFilters();showToast("Oferta publicada com sucesso!");
};
$("#addCommunityBtn").onclick=()=>{const name=prompt("Qual é o nome da comunidade?");if(!name?.trim())return;state.communities.push({id:"c-"+Date.now(),name:name.trim(),members:"Comunidade adicionada",icon:"💬",active:true});saveCommunities();renderCommunities();showToast("Comunidade adicionada")};
$$("[data-nav]").forEach(b=>b.onclick=()=>{$$(".nav-item").forEach(n=>n.classList.remove("active"));b.classList.add("active");const nav=b.dataset.nav;if(nav==="search"){$("#searchInput").focus();window.scrollTo({top:420,behavior:"smooth"})}if(nav==="favorites"){state.favoritesOnly=true;render();window.scrollTo({top:420,behavior:"smooth"})}if(nav==="admin")openPanel("adminPanel");if(nav==="home"){clearFilters();window.scrollTo({top:0,behavior:"smooth"})}});
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#searchInput").focus()}if(e.key==="Escape")closePanels()});
let installPrompt=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("#installBtn").classList.remove("hidden")});
$("#installBtn").onclick=async()=>{if(!installPrompt)return;installPrompt.prompt();const result=await installPrompt.userChoice;if(result.outcome==="accepted")showToast("OfertaFácil instalado!");installPrompt=null;$("#installBtn").classList.add("hidden")};
window.addEventListener("appinstalled",()=>showToast("Aplicativo instalado com sucesso!"));
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
renderFilterOptions();render();
