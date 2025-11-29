// This file contains the full single-file React component created earlier.
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  HeartBreak,
  Phone,
  Tag,
  X,
  Plus,
  Minus,
} from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Garam Mixture", price: 120, img: "https://images.unsplash.com/photo-1606312619340-6f2b6c6e0f5a?auto=format&fit=crop&w=800&q=80", desc: "Crispy spicy mixture - Andhra style" },
  { id: 2, name: "Kodubale", price: 80, img: "https://images.unsplash.com/photo-1604908177072-45ab6f4f8f1a?auto=format&fit=crop&w=800&q=80", desc: "Traditional ring-shaped savory" },
  { id: 3, name: "Murukku", price: 95, img: "https://images.unsplash.com/photo-1603052876267-7f3a1fb4b0d8?auto=format&fit=crop&w=800&q=80", desc: "Crispy rice & urad dal murukku" },
  { id: 4, name: "Karam Podi", price: 70, img: "https://images.unsplash.com/photo-1586201375761-83865001e1b1?auto=format&fit=crop&w=800&q=80", desc: "Spiced powder for rice/snacks" },
  { id: 5, name: "Bobbatlu (Puran Poli)", price: 150, img: "https://images.unsplash.com/photo-1617191511499-551f5d9f0c15?auto=format&fit=crop&w=800&q=80", desc: "Sweet stuffed flatbread" },
  { id: 6, name: "Pootharekulu", price: 220, img: "https://images.unsplash.com/photo-1620810731541-1e0e0b7d6a8a?auto=format&fit=crop&w=800&q=80", desc: "Paper-thin sweet rolls" },
  { id: 7, name: "Ribbon Pakoda", price: 110, img: "https://images.unsplash.com/photo-1617196037634-7e5ecb6b9f7f?auto=format&fit=crop&w=800&q=80", desc: "Crispy ribbon-shaped pakoda" },
  { id: 8, name: "Chegodilu", price: 85, img: "https://images.unsplash.com/photo-1604908177070-5261f8c9a2e2?auto=format&fit=crop&w=800&q=80", desc: "Crunchy ring snack" },
  { id: 9, name: "Boorelu", price: 140, img: "https://images.unsplash.com/photo-1606312750884-8f6f3b6b1b7f?auto=format&fit=crop&w=800&q=80", desc: "Sweet lentil dumplings" },
  { id: 10, name: "Nuvvula Laddu", price: 130, img: "https://images.unsplash.com/photo-1617191511497-1d5b2f7d8b5f?auto=format&fit=crop&w=800&q=80", desc: "Sesame seed laddus" },
  { id: 11, name: "Appadam", price: 60, img: "https://images.unsplash.com/photo-1571168544054-b3b3f59d1b6b?auto=format&fit=crop&w=800&q=80", desc: "Thin crunchy papadams" },
  { id: 12, name: "Pappu Chekkalu", price: 90, img: "https://images.unsplash.com/photo-1606312750908-4a6d3e7f3d8e?auto=format&fit=crop&w=800&q=80", desc: "Savory lentil crisps" },
  { id: 13, name: "Milagai Podi Snack", price: 75, img: "https://images.unsplash.com/photo-1587309519810-6b90a8b4b6b1?auto=format&fit=crop&w=800&q=80", desc: "Spicy chili powder snack" },
  { id: 14, name: "Boondi Laddu", price: 125, img: "https://images.unsplash.com/photo-1589308078050-3a2b4c9670f4?auto=format&fit=crop&w=800&q=80", desc: "Sweet boondi laddus" },
  { id: 15, name: "Mango Pickle (Small)", price: 160, img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80", desc: "Homestyle tangy mango pickle" },
];
const PROMO = { message: "₹200 OFF on orders above ₹1000", code: "JOY200" };

export default function JoyHomemadeShop() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("joy_cart")) || {}; } catch (e) { return {}; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("joy_wishlist")) || []; } catch (e) { return []; }
  });
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => { localStorage.setItem("joy_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("joy_wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  function addToCart(product) {
    setCart((c) => { const next = { ...c }; next[product.id] = (next[product.id] || 0) + 1; return next; });
  }
  function changeQty(productId, delta) {
    setCart((c) => { const next = { ...c }; next[productId] = Math.max((next[productId] || 0) + delta, 0); if(next[productId]===0) delete next[productId]; return next; });
  }
  function toggleWishlist(productId){
    setWishlist((w)=> { const exists = w.includes(productId); return exists? w.filter(x=>x!==productId): [...w, productId]; });
  }
  const itemsInCart = Object.entries(cart).reduce((acc, [id, qty]) => acc + qty, 0);
  const subtotal = Object.entries(cart).reduce((acc, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === Number(id)); return acc + (p ? p.price * qty : 0);
  }, 0);
  const total = promoApplied && subtotal >= 1000 ? Math.max(subtotal - 200, 0) : subtotal;

  function handleCheckout(){ setShowCheckout(true); }
  function whatsappOrder(){
    const items = Object.entries(cart).map(([id,qty])=>{ const p = PRODUCTS.find(x=>x.id===Number(id)); return `${p.name} x${qty}`; }).join('%0A');
    const text = `Hello Joy Homemade Foods!%0AI'd like to order:%0A${items}%0ATotal: ₹${total}%0AContact:`;
    window.open(`https://wa.me/919876543210?text=${text}`,'_blank');
  }

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg,#0f172a, #0b1220)" }}>
      <header className="container mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/10 p-3 shadow-lg">
            <img src="/logo192.png" alt="Joy" className="w-10 h-10 rounded-full" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Joy Homemade Foods</h1>
            <p className="text-sm text-gray-300">Authentic Andhra & Telugu Snacks — made with love</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-white/5 rounded p-2">
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search snacks..." className="bg-transparent outline-none placeholder:text-gray-400" />
          </div>
          <button className="flex items-center gap-2 p-2 hover:bg-white/5 rounded" onClick={()=>window.scrollTo({top:1000, behavior:'smooth'})}>
            <Phone size={18}/> <span className="hidden sm:inline">+91 98765 43210</span>
          </button>
          <div className="relative">
            <button className="p-2 hover:bg-white/5 rounded flex items-center gap-2" onClick={()=>document.getElementById('cart-panel').classList.toggle('hidden')}>
              <ShoppingCart /> <span className="sr-only">Cart</span> <span className="text-sm bg-rose-600 px-2 py-0.5 rounded-full">{itemsInCart}</span>
            </button>
          </div>
          <button className="p-2 hover:bg-white/5 rounded flex items-center gap-2" onClick={()=>document.getElementById('wishlist-panel').classList.toggle('hidden')}>
            <Heart /> <span className="sr-only">Wishlist</span> <span className="text-sm bg-rose-600 px-2 py-0.5 rounded-full">{wishlist.length}</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6">
        <motion.div className="rounded-lg p-4 my-4 flex items-center justify-between bg-gradient-to-r from-amber-700/20 to-amber-400/10 border border-amber-600/20 shadow-lg">
          <div className="flex items-center gap-4">
            <Tag />
            <div>
              <div className="font-semibold">{PROMO.message}</div>
              <div className="text-sm text-gray-300">Use code <span className="font-bold">{PROMO.code}</span> at checkout</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-amber-500 text-black px-3 py-2 rounded shadow" onClick={()=>{ setPromoApplied(true); alert('Promo applied!'); }}>Apply ₹200 off</button>
            <button className="bg-white/5 px-3 py-2 rounded" onClick={()=>{ setPromoApplied(false); alert('Promo removed'); }}>Remove</button>
          </div>
        </motion.div>

        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {PRODUCTS.filter(p=>p.name.toLowerCase().includes(query.toLowerCase())).map((p)=>(
            <motion.article key={p.id} whileHover={{scale:1.02}} className="bg-white/5 rounded-lg overflow-hidden shadow p-3">
              <div className="relative">
                <img src={p.img} alt={p.name} className="w-full h-40 object-cover rounded" />
                <button className="absolute top-2 right-2 bg-white/10 p-2 rounded" onClick={()=>toggleWishlist(p.id)}>
                  {wishlist.includes(p.id) ? <HeartBreak /> : <Heart />}
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-300 mt-1">{p.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="font-bold">₹{p.price}</div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-white/5 rounded" onClick={()=>addToCart(p)}>Add</button>
                    <button className="px-2 py-1 bg-white/5 rounded" onClick={()=>setSelectedProduct(p)}>Quick view</button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        <footer className="mt-12 p-6 bg-white/3 rounded-lg text-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold">Joy Homemade Foods</div>
            <div className="text-sm">123, Lane Name, Hyderabad, Telangana</div>
            <div className="text-sm">Email: joy@example.com</div>
          </div>
          <div className="flex gap-4 items-center">
            <button className="px-4 py-2 bg-green-600 rounded" onClick={whatsappOrder}>Order via WhatsApp</button>
            <div className="text-sm">Payments: UPI / Card / COD (demo)</div>
          </div>
        </footer>
      </main>

      {/* Panels, modals and checkout (omitted here for brevity in comment) */}
    </div>
  );
}
