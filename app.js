const PRODUCTS=window.PRODUCTS||[];let cart=JSON.parse(localStorage.getItem("bf_cart")||"[]");
const money=n=>"Rs."+Number(n).toLocaleString("en-PK");
const $=s=>document.querySelector(s);
function save(){localStorage.setItem("bf_cart",JSON.stringify(cart));renderCart();updateCount()}
function updateCount(){$("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0)}
function price(p,v){return v==="10ml"?p.p10:p.p5}
function card(p){
 return `<article class="product-card"><div class="product-image"><span class="tag">5ml Tester</span><img src="${p.image}" alt="${p.name}" loading="lazy"><button class="quick" onclick="add(${p.id},'5ml')">Add 5ml to Cart</button></div><div class="brand">${p.brand}</div><h3>${p.name}</h3><div class="variants">5ml Tester &nbsp; • &nbsp; 10ml Tester</div><div class="price">${money(p.p5)} – ${money(p.p10)}</div></article>`
}
function renderProducts(){
 let featured=PRODUCTS.slice(0,12), all=[...PRODUCTS];
 const sort=$("#sort").value;
 if(sort==="low")all.sort((a,b)=>a.p5-b.p5); if(sort==="high")all.sort((a,b)=>b.p5-a.p5); if(sort==="name")all.sort((a,b)=>a.name.localeCompare(b.name));
 $("#featuredGrid").innerHTML=featured.map(card).join("");
 $("#allGrid").innerHTML=all.map(card).join(""); $("#resultCount").textContent=all.length+" products";
}
function add(id,variant){
 const p=PRODUCTS.find(x=>x.id===id), key=id+"-"+variant; let item=cart.find(x=>x.key===key);
 if(item)item.qty++; else cart.push({key,id,variant,qty:1});
 save(); openCart();
}
function renderCart(){
 const box=$("#cartItems");
 if(!cart.length){box.innerHTML='<div style="padding:60px 0;text-align:center;color:#888">Your cart is empty.</div>';$("#subtotal").textContent="Rs.0";$("#shippingNote").textContent="";return}
 let sub=0;
 box.innerHTML=cart.map(x=>{let p=PRODUCTS.find(y=>y.id===x.id), unit=price(p,x.variant);sub+=unit*x.qty;
 return `<div class="cart-line"><img src="${p.image}"><div><h4>${p.name}</h4><p>${p.brand} • ${x.variant}</p><div class="qty"><button onclick="changeQty('${x.key}',-1)">−</button><span>${x.qty}</span><button onclick="changeQty('${x.key}',1)">+</button></div></div><div><b>${money(unit*x.qty)}</b><br><button class="remove" onclick="removeItem('${x.key}')">Remove</button></div></div>`}).join("");
 $("#subtotal").textContent=money(sub); $("#shippingNote").textContent=sub>=12000?"Free shipping applied.":"Free shipping on orders above Rs.12,000.";
}
function changeQty(k,n){let x=cart.find(i=>i.key===k);if(!x)return;x.qty+=n;if(x.qty<=0)cart=cart.filter(i=>i.key!==k);save()}
function removeItem(k){cart=cart.filter(i=>i.key!==k);save()}
function openCart(){renderCart();$("#cartDrawer").classList.add("open")}
function closeCart(){$("#cartDrawer").classList.remove("open")}
$("#cartBtn").onclick=openCart;$("#closeCart").onclick=closeCart;
$("#closeNotice").onclick=()=>document.querySelector(".notice").remove();
$("#menuBtn").onclick=()=>$("#nav").classList.toggle("open");
$("#searchBtn").onclick=()=>{$("#searchbar").classList.toggle("open");$("#searchInput").focus()}
$("#doSearch").onclick=search;$("#searchInput").oninput=search;
function search(){let q=$("#searchInput").value.trim().toLowerCase();let results=PRODUCTS.filter(p=>(p.name+" "+p.brand).toLowerCase().includes(q));$("#allGrid").innerHTML=(q?results:PRODUCTS).map(card).join("");$("#resultCount").textContent=(q?results.length:PRODUCTS.length)+" products"}
$("#sort").onchange=renderProducts;
$("#checkoutBtn").onclick=()=>{if(!cart.length){alert("Your cart is empty.");return}let sub=cart.reduce((s,x)=>s+price(PRODUCTS.find(p=>p.id===x.id),x.variant)*x.qty,0);$("#checkoutTotal").textContent=money(sub);$("#checkoutModal").classList.add("open")};
$("#closeCheckout").onclick=()=>$("#checkoutModal").classList.remove("open");
$("#checkoutForm").onsubmit=e=>{e.preventDefault();let data=Object.fromEntries(new FormData(e.target));let order="BF-"+Date.now().toString().slice(-7);
let items=cart.map(x=>{let p=PRODUCTS.find(p=>p.id===x.id);return `${p.name} (${x.variant}) x${x.qty}`}).join("\n");
let total=cart.reduce((s,x)=>s+price(PRODUCTS.find(p=>p.id===x.id),x.variant)*x.qty,0);
let record={order,customer:data,items,total,created:new Date().toISOString()};localStorage.setItem("bf_last_order",JSON.stringify(record));
$("#orderSuccess").hidden=false;$("#orderSuccess").innerHTML=`<b>Order request created: ${order}</b><br><br>Total: ${money(total)}<br>We have saved your order locally. For a live store, connect this form to your payment/order backend.`;
cart=[];save();e.target.reset()};
window.add=add;window.changeQty=changeQty;window.removeItem=removeItem;
renderProducts();updateCount();renderCart();
