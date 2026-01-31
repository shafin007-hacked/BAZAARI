
import React, { useState } from 'react';
import { Category, Condition, RentalTarget } from '../types';
import { LOCATIONS, CATEGORY_ICONS } from '../constants';
import { Camera, MapPin, Tag, Type, Trash2, Loader2, Sparkles, CheckCircle, Users, Zap, X, ArrowUpRight, Home, UserCheck, Users2, Clock } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Link } from 'react-router-dom';

const PostAd: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showBoostFlow, setShowBoostFlow] = useState(false);
  const [boostStep, setBoostStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [boostPlan, setBoostPlan] = useState(7);
  const [trxId, setTrxId] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: '' as Category,
    description: '',
    price: '',
    location: '',
    district: '',
    condition: Condition.USED,
    rentalTarget: RentalTarget.FAMILY,
    images: [] as string[]
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((f: any) => URL.createObjectURL(f));
      setFormData({ ...formData, images: [...formData.images, ...newImages] });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const optimizeWithAI = async () => {
    if (!formData.title) return alert("Enter a title first");
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a professional and catchy marketplace description for: ${formData.title}. Category: ${formData.category}. ${formData.category === Category.TO_LET ? `Target audience: ${formData.rentalTarget}.` : ''} Keep it under 200 words and focus on selling points.`
      });
      setFormData({ ...formData, description: response.text || '' });
    } catch (e) {
      console.error(e);
      alert("AI optimization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleBoostPayment = () => {
    if (!trxId) return alert("Enter Transaction ID");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBoostStep(3);
    }, 2000);
  };

  const plans = [
    { days: 3, price: 150 },
    { days: 7, price: 299 },
    { days: 15, price: 550 }
  ];

  const paymentMethods = [
    { name: 'bKash', color: 'bg-[#D12053]', textColor: 'text-white' },
    { name: 'Nagad', color: 'bg-[#F7941D]', textColor: 'text-white' },
    { name: 'Rocket', color: 'bg-[#8C3494]', textColor: 'text-white' }
  ] as const;

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-8">
        {!showBoostFlow ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle className="w-14 h-14" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Ad Posted Successfully!</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
              Your ad is currently being reviewed by our moderators. <br />
              It will go live within <span className="text-teal-600 font-black">2 hours</span>.
            </p>
            <div className="flex flex-col gap-4 pt-6">
              <Link to="/dashboard/ads" className="bg-slate-900 dark:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-xl shadow-slate-900/20">
                Go to My Ads
              </Link>
              <button 
                onClick={() => setShowBoostFlow(true)}
                className="bg-yellow-400 text-slate-900 font-bold py-4 px-8 rounded-2xl hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-400/30 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-current" />
                Boost Now for Fast Sales
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-6 bg-yellow-400 text-slate-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 fill-current" />
                <h3 className="font-black text-xl">Boost Ad: {formData.title}</h3>
              </div>
              <button onClick={() => setShowBoostFlow(false)} className="p-1 hover:bg-black/5 rounded-lg"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-8 space-y-8 text-left">
              {boostStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">1. Choose Duration</label>
                    <div className="grid grid-cols-3 gap-3">
                      {plans.map(p => (
                        <button 
                          key={p.days}
                          onClick={() => setBoostPlan(p.days)}
                          className={`p-4 rounded-2xl border-2 transition-all text-center ${boostPlan === p.days ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 ring-2 ring-teal-500/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
                        >
                          <p className="text-xl font-black text-slate-800 dark:text-slate-100">৳{p.price}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{p.days} Days</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">2. Payment Method</label>
                    <div className="grid grid-cols-3 gap-3">
                      {paymentMethods.map(pm => (
                        <button 
                          key={pm.name}
                          onClick={() => setPaymentMethod(pm.name)}
                          className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === pm.name ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 ring-2 ring-teal-500/20' : 'border-slate-100 dark:border-slate-800'}`}
                        >
                          <div className={`w-full aspect-video ${pm.color} rounded-lg flex items-center justify-center font-bold text-xs ${pm.textColor}`}>
                            {pm.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Instructions:</p>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                      <li className="flex gap-2"><span>1.</span> Send Money ৳{plans.find(p => p.days === boostPlan)?.price} to <span className="font-bold text-slate-900 dark:text-slate-100 underline">01516-595597</span></li>
                      <li className="flex gap-2"><span>2.</span> Use your {paymentMethod} app to complete payment</li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => setBoostStep(2)}
                    className="w-full bg-teal-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                  >
                    I've Sent Money <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {boostStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="text-center space-y-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Verify Transaction</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Please enter the {paymentMethod} Transaction ID.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction ID (TrxID)</label>
                      <input 
                        type="text" 
                        value={trxId} 
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="e.g. BK9A82B3X" 
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-teal-500 outline-none uppercase font-mono font-bold text-center text-xl tracking-widest dark:text-white" 
                      />
                    </div>
                    <button 
                      onClick={handleBoostPayment}
                      disabled={loading}
                      className="w-full bg-teal-600 text-white font-black py-4 rounded-2xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Boost Now"}
                    </button>
                    <button onClick={() => setBoostStep(1)} className="w-full text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors">Back</button>
                  </div>
                </div>
              )}

              {boostStep === 3 && (
                <div className="text-center space-y-8 py-6 animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Clock className="w-10 h-10 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-black text-3xl text-slate-900 dark:text-white tracking-tight">Processing Boost</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                      Our system is verifying your payment with {paymentMethod}. <br />
                      Activation will be completed within <span className="text-teal-600 font-black">2 hours</span>.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link to="/dashboard/ads" className="block w-full bg-slate-900 dark:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-lg transition-transform active:scale-95">
                      Back to Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {step === 1 && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Choose a Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
                <button 
                  key={cat} 
                  onClick={() => { setFormData({ ...formData, category: cat as Category }); handleNext(); }}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.category === cat ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-600'}`}
                >
                  <span className="text-4xl">{icon}</span>
                  <span className="font-bold text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide text-center">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Ad Details</h2>
              <button onClick={handleBack} className="text-sm font-bold text-teal-600 hover:underline">Change Category</button>
            </div>
            
            <div className="space-y-6">
              {/* Conditional Rental Options */}
              {formData.category === Category.TO_LET && (
                <div className="space-y-4 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                   <label className="text-sm font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                     <Home className="w-4 h-4" /> Rent For Who? *
                   </label>
                   <div className="grid grid-cols-3 gap-3">
                     {[
                       { id: RentalTarget.BACHELOR, label: 'Bachelor', icon: UserCheck },
                       { id: RentalTarget.FAMILY, label: 'Family', icon: Home },
                       { id: RentalTarget.BOTH, label: 'Both', icon: Users2 }
                     ].map(opt => (
                       <button
                         key={opt.id}
                         type="button"
                         onClick={() => setFormData({...formData, rentalTarget: opt.id})}
                         className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.rentalTarget === opt.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                       >
                         <opt.icon className="w-5 h-5" />
                         <span className="text-xs font-bold">{opt.label}</span>
                       </button>
                     ))}
                   </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Ad Title *</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Spacious 3BR Flat in Mirpur"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-teal-500 transition-all outline-none dark:text-white" 
                  />
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Price (৳) *</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={formData.price} 
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-teal-500 transition-all outline-none dark:text-white" 
                      />
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">District *</label>
                    <div className="relative">
                      <select 
                        value={formData.district} 
                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-teal-500 transition-all outline-none dark:text-white appearance-none"
                      >
                        <option value="">Select District</option>
                        {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Description *</label>
                    <button 
                      onClick={optimizeWithAI} 
                      disabled={loading}
                      className="text-xs font-bold text-teal-600 flex items-center gap-1 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-full hover:bg-teal-100 transition-all"
                    >
                      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Optimize with AI
                    </button>
                 </div>
                 <textarea 
                   rows={5}
                   value={formData.description}
                   onChange={e => setFormData({ ...formData, description: e.target.value })}
                   className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 px-4 focus:ring-2 focus:ring-teal-500 transition-all outline-none dark:text-white resize-none"
                   placeholder="Write details about your ad..."
                 ></textarea>
              </div>

              <div className="space-y-4">
                 <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Upload Images (Min 1) *</label>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {formData.images.length < 5 && (
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-teal-500 transition-all bg-slate-50 dark:bg-slate-800/50">
                        <Camera className="w-8 h-8 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Add Photo</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                 </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={loading || !formData.title || formData.images.length === 0}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-black py-5 rounded-2xl text-lg shadow-xl shadow-teal-600/20 transition-all mt-8"
              >
                {loading ? <Loader2 className="animate-spin mx-auto w-6 h-6" /> : 'Post My Ad'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostAd;
