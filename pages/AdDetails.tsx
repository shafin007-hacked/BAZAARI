
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { INITIAL_ADS } from '../constants';
import { Category, RentalTarget, UserRole } from '../types';
import { MapPin, Clock, Phone, MessageCircle, Heart, Share2, ShieldCheck, ChevronLeft, ChevronRight, Users, User as UserIcon } from 'lucide-react';
import { UserBadge } from '../App';

const AdDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ad = INITIAL_ADS.find(a => a.id === id);
  const [showNumber, setShowNumber] = useState(false);

  if (!ad) return (
    <div className="max-w-7xl mx-auto p-20 text-center">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Ad Not Found</h2>
      <Link to="/" className="text-teal-600 mt-4 inline-block underline">Back to Home</Link>
    </div>
  );

  const isRental = ad.category === Category.TO_LET;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Media and Description */}
      <div className="lg:col-span-2 space-y-8">
        {/* Breadcrumbs */}
        <nav className="text-xs font-medium text-slate-400 flex gap-2">
          <Link to="/" className="hover:text-teal-600">Home</Link>
          <span>/</span>
          <Link to={`/?category=${ad.category}`} className="hover:text-teal-600">{ad.category}</Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300 truncate">{ad.title}</span>
        </nav>

        {/* Gallery */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {ad.images && ad.images.length > 0 ? (
              <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Users className="w-12 h-12" />
                <span className="font-bold">No Image Available</span>
              </div>
            )}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-slate-900/80 rounded-full flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 shadow-lg transition-all">
              <ChevronLeft />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-slate-900/80 rounded-full flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 shadow-lg transition-all">
              <ChevronRight />
            </button>
          </div>
          <div className="p-4 flex gap-4 overflow-x-auto border-t border-slate-100 dark:border-slate-800">
            {ad.images.map((img, i) => (
              <img key={i} src={img} className="w-20 h-20 object-cover rounded-lg border dark:border-slate-700 cursor-pointer hover:ring-2 ring-teal-500 transition-all" />
            ))}
          </div>
        </div>

        {/* Info Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">{ad.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {ad.location}, {ad.district}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Posted 12 hours ago</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-500 transition-all">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-500 transition-all">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="text-3xl font-black text-teal-700 dark:text-teal-500">৳ {ad.price.toLocaleString()}{isRental ? ' / month' : ''}</div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100 dark:border-slate-800">
            {isRental ? (
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Rent To</p>
                <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-teal-600" />
                  {ad.rentalTarget || RentalTarget.BOTH}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Condition</p>
                <p className="font-bold text-slate-700 dark:text-slate-300">{ad.condition}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Category</p>
              <p className="font-bold text-slate-700 dark:text-slate-300">{ad.category}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Views</p>
              <p className="font-bold text-slate-700 dark:text-slate-300">{ad.views}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Ad ID</p>
              <p className="font-bold text-slate-700 dark:text-slate-300">#{ad.id}982</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Description</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{ad.description}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
            <ShieldCheck className="w-10 h-10 text-teal-600 dark:text-teal-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Safety Tips</h4>
              <ul className="text-sm text-slate-500 dark:text-slate-400 list-disc list-inside mt-1 space-y-1">
                <li>Meet the seller at a safe public place.</li>
                <li>Check the item before you buy it.</li>
                <li>Never pay in advance or via wire transfer.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Seller and Actions */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm sticky top-24">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6">Seller Information</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <Link to={`/profile/${ad.sellerId}`} className="relative group">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-transparent group-hover:border-teal-500 transition-all">
                <UserIcon className="w-8 h-8 text-slate-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900"></div>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link to={`/profile/${ad.sellerId}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-teal-600 transition-colors">Ariful Islam</Link>
                <UserBadge role={UserRole.PREMIUM} size="sm" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Member since May 2021</p>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => setShowNumber(true)}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-600/20"
            >
              <Phone className="w-5 h-5" />
              {showNumber ? '01712 - 345678' : 'Call Seller'}
            </button>
            <Link to="/messenger" className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800 dark:border dark:border-slate-700 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all">
              <MessageCircle className="w-5 h-5" />
              Chat Online
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
             <Link to={`/profile/${ad.sellerId}`} className="text-sm font-bold text-teal-600 dark:text-teal-500 hover:underline">View Seller Profile & Store</Link>
          </div>
        </div>

        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-6 border border-teal-100 dark:border-teal-900/30 text-center space-y-4">
          <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Is this your ad?</p>
          <p className="text-xs text-teal-600 dark:text-teal-400">Boost this ad to reach 10x more buyers and sell faster.</p>
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 rounded-xl shadow-md transition-all">
            Boost Ad Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;
