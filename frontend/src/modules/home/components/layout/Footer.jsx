import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza, Phone, Mail, ShieldCheck, Clock, Award, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-dominos-dark text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value props banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-dominos-red text-white flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base font-brand tracking-wide">30-Minute Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hot, fresh oven-baked pizzas delivered fast to your door.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-dominos-blue text-white flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base font-brand tracking-wide">100% Quality & Hygiene</h4>
              <p className="text-xs text-slate-400 mt-0.5">Zero-contact delivery and tamper-proof security sealed boxes.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-amber-500 text-slate-950 flex-shrink-0 font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base font-brand tracking-wide">Domino's Cheesy Rewards</h4>
              <p className="text-xs text-slate-400 mt-0.5">Earn points on every single order and redeem free pizzas.</p>
            </div>
          </div>
        </div>

        {/* Links matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-dominos-blue rounded-lg flex items-center justify-center text-white font-bold">
                <Pizza className="w-5 h-5" />
              </div>
              <span className="font-brand font-black text-xl text-white tracking-wider">DOMINO'S</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              The world's favorite pizza destination. Handcrafted dough, signature sauces, and authentic mozzarella.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Phone className="w-3.5 h-3.5 text-dominos-red" />
              <span>Domino's Care: 1800-208-1234</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-brand">Our Menu</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/menu?category=veg-pizza" className="hover:text-white transition-colors">Veg Pizzas</Link></li>
              <li><Link to="/menu?category=non-veg-pizza" className="hover:text-white transition-colors">Non-Veg Pizzas</Link></li>
              <li><Link to="/menu?category=sides" className="hover:text-white transition-colors">Garlic Bread & Dips</Link></li>
              <li><Link to="/menu?category=desserts" className="hover:text-white transition-colors">Choco Lava Cakes</Link></li>
              <li><Link to="/menu?category=beverages" className="hover:text-white transition-colors">Beverages & Shakes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-brand">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/offers" className="hover:text-white transition-colors">Offers & Coupons</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">My Order History</Link></li>
              <li><Link to="/addresses" className="hover:text-white transition-colors">Saved Addresses</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">All Categories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-brand">Customer Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="text-slate-300">Live Support:</span> 10:00 AM - 03:00 AM</li>
              <li><span className="text-slate-300">Feedback:</span> guestcare@dominos.com</li>
              <li><span className="text-slate-300">Store Locator:</span> 1400+ Stores Nationwide</li>
              <li className="pt-2">
                <span className="inline-block bg-slate-800 text-slate-300 text-[11px] px-2.5 py-1 rounded font-medium">
                  FSSAI Lic No: 10017011004220
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Domino's Pizza Customer Portal. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center justify-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-dominos-red fill-dominos-red" />
            <span>for Pizza Lovers</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
