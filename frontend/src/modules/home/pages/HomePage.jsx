import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMenuItems, getCategories } from '../services/menuService.js';
import { getOffers } from '../services/offersService.js';
import { ProductCard } from '../components/menu/ProductCard.jsx';
import { CategoryBar } from '../components/menu/CategoryBar.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { useCustomer } from '../hooks/useCustomer.js';
import {
  Pizza,
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  Award,
  Tag,
  ChevronRight,
  Percent,
  Star
} from 'lucide-react';

export const HomePage = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { deliveryMode, setDeliveryMode } = useCustomer();
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [itemsData, catsData, offersData] = await Promise.all([
          getMenuItems({}),
          getCategories(),
          getOffers(),
        ]);
        setBestsellers(itemsData.filter(i => i.isBestseller).slice(0, 6));
        setCategories(catsData);
        setOffers(offersData);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0C1E28] via-slate-900 to-[#006491]/90 text-white overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-20">
        {/* Abstract Background Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E31837]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#006491]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>30-Minute Guaranteed Delivery or Free*</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-wide leading-tight text-white">
                CRAVING HOT & CRISPY <br className="hidden xl:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E31837] to-orange-400">
                  DOMINO'S PIZZA?
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Hand-tossed artisan dough, signature rich marinara, and gooey 100% mozzarella cheese. Delivered fresh to your doorstep in 30 minutes!
              </p>

              {/* Order Mode & CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="danger"
                  size="xl"
                  onClick={() => navigate('/menu')}
                  className="w-full sm:w-auto shadow-[0_8px_20px_-4px_rgba(227,24,55,0.3)] font-bold text-sm sm:text-base tracking-wider"
                >
                  <span>ORDER ONLINE NOW</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  onClick={() => navigate('/offers')}
                  className="w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-bold text-sm sm:text-base tracking-wider"
                >
                  <Percent className="w-5 h-5 mr-2 text-amber-300" />
                  <span>VIEW OFFERS & DEALS</span>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 grid grid-cols-3 gap-6 w-full max-w-lg text-left">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">100%</span>
                  <span className="text-xs text-slate-400 mt-1">Real Mozzarella</span>
                </div>
                <div className="flex flex-col border-l border-white/10 pl-6">
                  <span className="text-2xl font-black text-white">30 MINS</span>
                  <span className="text-xs text-slate-400 mt-1">Hot Delivery</span>
                </div>
                <div className="flex flex-col border-l border-white/10 pl-6">
                  <span className="flex items-center gap-1 text-2xl font-black text-white">4.8 <Star className="w-4 h-4 fill-amber-400 text-amber-400" /></span>
                  <span className="text-xs text-slate-400 mt-1">Over 50k Reviews</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
                  alt="Hot Fresh Domino's Pizza"
                  className="w-full h-full object-cover animate-pulse-subtle"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Floating Deal Badge */}
                <div className="absolute top-4 right-4 bg-dominos-red text-white p-3 rounded-2xl shadow-dominos-red text-center">
                  <span className="block text-xs uppercase font-extrabold tracking-wider">FLAT</span>
                  <span className="block text-2xl font-black font-brand leading-none">50% OFF</span>
                  <span className="block text-[10px] font-bold text-red-200">USE: DOMINOS50</span>
                </div>

                {/* Bottom Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-slate-900 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-black uppercase text-dominos-red tracking-wider block truncate">Featured Today</span>
                    <h4 className="font-bold text-base font-brand truncate">Farmhouse Cheesy Special</h4>
                    <p className="text-xs text-slate-500 truncate">Mushroom, Onion, Capsicum & Tomato</p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => navigate('/menu')}
                    className="font-bold text-xs flex-shrink-0"
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-brand text-slate-900">
              EXPLORE WHAT’S HOT
            </h2>
            <p className="text-xs text-slate-500">Choose from freshly prepared pizza categories and delicious sides</p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-dominos-blue hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <CategoryBar
          categories={categories}
          selectedCategory="all"
          onSelectCategory={(catId) => navigate(catId === 'all' ? '/menu' : `/menu?category=${catId}`)}
        />
      </section>

      {/* Featured Offers & Coupons Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#006491] to-[#004c6d] text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-amber-300" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                  Exclusive Savings
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 text-white tracking-wide">TODAY'S BEST OFFERS</h3>
            </div>
            <Link
              to="/offers"
              className="text-xs font-bold bg-white text-[#006491] px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
            >
              See All Coupons
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.slice(0, 2).map((offer) => (
              <div
                key={offer.code}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/20 flex flex-col justify-between hover:bg-white/15 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-black bg-[#E31837] text-white px-2.5 py-1 rounded uppercase shadow-sm">
                      {offer.badge}
                    </span>
                    <span className="text-xs font-medium text-slate-300 bg-black/20 px-2.5 py-1 rounded-full">{offer.expiry}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white leading-tight">{offer.title}</h4>
                  <p className="text-sm text-slate-200 mt-2 line-clamp-2">{offer.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col xl:flex-row items-center justify-between gap-4">
                  <div className="px-4 py-2 w-full xl:w-auto bg-white/10 border border-white/20 text-white rounded-xl font-black text-sm tracking-wider text-center flex-shrink-0">
                    {offer.code}
                  </div>
                  <Button
                    variant="accent"
                    size="md"
                    onClick={() => navigate('/menu')}
                    className="w-full xl:w-auto shadow-lg flex-shrink-0"
                  >
                    Order & Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestseller Pizzas Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-dominos-red text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-dominos-red" />
              <span>Domino's Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-brand text-slate-900 mt-0.5">
              ALL-TIME BESTSELLERS
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-xs font-bold text-dominos-blue hover:underline flex items-center gap-1"
          >
            <span>Explore Full Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestsellers.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Domino's Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center">
          <h3 className="text-2xl sm:text-3xl font-black font-brand text-slate-900">
            THE DOMINO'S DIFFERENCE
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-2 text-center">
            Every pizza is baked fresh to order using premium quality ingredients and delivered in tamper-proof packaging.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-2xl bg-dominos-blue/10 text-dominos-blue flex items-center justify-center mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 font-brand">30-Minute Speed</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed text-center">
                Our optimized oven baking and smart rider logistics ensure your meal arrives piping hot.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-2xl bg-dominos-red/10 text-dominos-red flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 font-brand">Hygiene & Safety</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed text-center">
                Contactless delivery, sanitizer checkpoints, and strict tamper-evident sealed boxes.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 font-brand">Authentic Taste</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed text-center">
                100% pure dairy mozzarella cheese, vine-ripened tomatoes, and fresh artisan dough daily.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
