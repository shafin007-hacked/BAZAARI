
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_ICONS } from '../constants';
import { Category, Ad, RentalTarget } from '../types';
import { MapPin, TrendingUp, Clock, ChevronRight, Star, Users, Search, PackageOpen } from 'lucide-react';
import { useAppContext } from '../App';
import { supabase } from '../supabase';

const AdCard: React.FC<{ ad: Ad }> = ({ ad }) => {
  return (
    <Link to={`/ad/${ad.id}`} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {ad.isBoosted && (
            <div className="bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-current" />
              FEATURED
            </div>
          )}
          {ad.category === Category.TO_LET && ad.rentalTarget && (
            <div className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm ${
              ad.rentalTarget === RentalTarget.BACHELOR ? 'bg-purple-600 text-white' : 
              ad.rentalTarget === RentalTarget.FAMILY ? 'bg-indigo-600 text-white' : 'bg-teal-600 text-white'
            }`}>
              <Users className="w-3 h-3" />
              {ad.rentalTarget.toUpperCase()}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-medium text-teal-600 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400 px-2 py-0.5 rounded uppercase tracking-wider">{ad.category}</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Recently
          </span>
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">{ad.title}</h3>
        <div className="mt-auto">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-2">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{ad.location}, {ad.district}</span>
          </div>
          <p className="text-lg font-bold text-teal-700 dark:text-teal-500">৳{ad.price.toLocaleString()}{ad.category === Category.TO_LET ? '/mo' : ''}</p>
        </div>
      </div>
    </Link>
  );
};

const Home: React.FC = () => {
  const { t } = useAppContext();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setAds(data as Ad[]);
      }
      setLoading(false);
    };
    fetchAds();
  }, []);

  const boostedAds = ads.filter(ad => ad.isBoosted);
  const regularAds = ads.filter(ad => !ad.isBoosted);

  return (
    <div className="space-y-12 pb-12">
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 dark:from-teal-800 dark:to-slate-950 text-white py-20 px-4 transition-colors relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <h1 className="text-4xl md:text-7xl font-black leading-tight max-w-4xl mx-auto tracking-tight">
            The Secure Marketplace for <span className="text-yellow-400">Bangladesh</span>
          </h1>
          <p className="text-teal-100 text-lg md:text-2xl max-w-2xl mx-auto font-medium opacity-90">
            Buy, sell, and promote with trust. The #1 destination for electronics, properties, and services.
          </p>
          
          <div className="max-w-3xl mx-auto pt-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl py-6 pl-14 pr-32 shadow-2xl focus:ring-4 focus:ring-teal-500/20 outline-none transition-all text-lg font-medium"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-400" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-700 text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-teal-600/20">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('categories')}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-9 gap-4">
          {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
            <Link key={cat} to={`/?category=${cat}`} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-md transition-all text-center group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-400">{cat}</p>
            </Link>
          ))}
        </div>
      </section>

      {boostedAds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-yellow-50/50 dark:bg-yellow-900/10 rounded-[40px] p-6 md:p-12 border border-yellow-100 dark:border-yellow-900/30 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
                <TrendingUp className="text-white w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">{t('featuredAds')}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Promoted items you might like</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {boostedAds.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">{t('recentAds')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Fresh listings from across the country</p>
          </div>
          <Link to="/search" className="text-teal-600 font-bold hover:underline flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {regularAds.concat(boostedAds).map(ad => <AdCard key={ad.id} ad={ad} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
            <PackageOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No ads found yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2">Be the first one to post an ad in your area!</p>
            <Link to="/post-ad" className="mt-6 inline-block bg-teal-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-teal-600/20">Post Ad Now</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
