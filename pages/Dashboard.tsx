
import React, { useState, useRef, useEffect } from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext, UserBadge } from '../App';
import { Ad, UserRole } from '../types';
import { 
  BarChart3, 
  Package, 
  MessageSquare, 
  Heart, 
  Settings, 
  TrendingUp, 
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  CheckCircle2,
  X,
  Users,
  ShieldCheck,
  Crown,
  Sparkles,
  Clock,
  Verified,
  ShieldAlert,
  CreditCard,
  FileText,
  Camera,
  AlertCircle,
  RefreshCw,
  Scan,
  User as UserIcon,
  PackageOpen,
  Phone,
  Shield,
  Upload,
  LogOut
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { supabase } from '../supabase';

const ADMIN_EMAIL = "heytoxic105@gmail.com";
const PREMIUM_PRICE = 299;
const ORIGINAL_PRICE = 400;

const Verification: React.FC = () => {
  const { user, setUser } = useAppContext();
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalStep, setModalStep] = useState<'plan' | 'nid' | 'payment' | 'success'>('plan');
  
  const [isCapturing, setIsCapturing] = useState<false | 'front' | 'back'>(false);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [nidName, setNidName] = useState('');
  const [nidNumber, setNidNumber] = useState('');
  const [method, setMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [trxId, setTrxId] = useState('');
  
  const isPremium = user?.role === UserRole.PREMIUM || user?.role === UserRole.OWNER;

  const handleStartUpgrade = () => {
    setModalStep('plan');
    setShowUpgradeModal(true);
  };

  const startCamera = async (side: 'front' | 'back') => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(s);
      setIsCapturing(side);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      alert("Camera access denied.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        if (isCapturing === 'front') setFrontImage(dataUrl);
        else if (isCapturing === 'back') setBackImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleNidSubmit = () => {
    if (!nidName || !nidNumber) return alert("Fill all details");
    if (!frontImage || !backImage) return alert("Capture NID photos");
    setModalStep('payment');
  };

  const handleFinalSubmit = () => {
    if (!trxId) return alert("Enter Transaction ID");
    setUpgrading(true);
    setTimeout(() => {
      setUpgrading(false);
      setModalStep('success');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isPremium ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
            <Verified className="w-10 h-10" />
          </div>
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Verification Status</h2>
            <p className="text-slate-500 dark:text-slate-400">
              {isPremium ? 'Your identity is verified. Premium active.' : 'Verify your NID to unlock Premium features.'}
            </p>
          </div>
        </div>
      </div>

      {!isPremium ? (
        <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-[32px] p-1 shadow-2xl shadow-amber-500/20">
          <div className="bg-white dark:bg-slate-950 rounded-[28px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 -mr-20 -mt-20">
              <Sparkles className="w-80 h-80 text-amber-500" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                  Most Trusted Choice
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                  Get <span className="text-amber-500">Verified</span> & Go Premium
                </h3>
                <ul className="space-y-4">
                  {[
                    'Golden NID Verified Badge',
                    'Sell 10x Faster with Priority Search',
                    '20% Discount on Featured Ad Boosts',
                    'Advanced Analytics for Sellers',
                    'Direct 24/7 Support Access'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-2xl font-bold text-slate-400 line-through">৳{ORIGINAL_PRICE}</p>
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Save ৳101</span>
                  </div>
                  <p className="text-6xl font-black text-slate-900 dark:text-white">৳{PREMIUM_PRICE}</p>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest pt-2">Lifetime Verification</p>
                </div>
                
                <div className="w-full">
                  <button 
                    onClick={handleStartUpgrade} 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-5 rounded-2xl text-xl shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-3 group"
                  >
                    <Crown className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                    Apply for Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-3xl p-10 border border-teal-100 dark:border-teal-900/30 text-center space-y-4">
          <div className="w-20 h-20 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Verification Complete!</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Verified via NID. Premium benefits active.</p>
          <div className="flex justify-center pt-4">
            <UserBadge role={user?.role || UserRole.PREMIUM} size="lg" />
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
            <div className="p-8 bg-amber-500 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6" />
                <h3 className="font-black text-xl">Premium Application</h3>
              </div>
              <button onClick={() => { stopCamera(); setShowUpgradeModal(false); }} className="hover:bg-white/10 p-2 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-8 md:p-12">
              {modalStep === 'plan' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="text-center space-y-4">
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Security First</h4>
                    <p className="text-slate-500 dark:text-slate-400">Verify your identity with a valid NID card.</p>
                  </div>
                  <button 
                    onClick={() => setModalStep('nid')}
                    className="w-full bg-slate-900 dark:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl transition-all"
                  >
                    Start Verification
                  </button>
                </div>
              )}

              {modalStep === 'nid' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h4 className="font-black text-xl text-slate-800 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-500" /> Identity Details
                  </h4>
                  
                  {isCapturing ? (
                    <div className="space-y-4 animate-in zoom-in-95">
                      <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border-4 border-amber-500 shadow-2xl">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-4">
                        <button onClick={stopCamera} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold py-4 rounded-2xl">Cancel</button>
                        <button onClick={capturePhoto} className="flex-[2] bg-teal-600 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2">
                          <Camera className="w-5 h-5" /> Capture {isCapturing === 'front' ? 'Front' : 'Back'}
                        </button>
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <input type="text" value={nidName} onChange={(e) => setNidName(e.target.value)} placeholder="Full Name" className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl py-4 px-5 outline-none dark:text-white font-bold" />
                        <input type="number" value={nidNumber} onChange={(e) => setNidNumber(e.target.value)} placeholder="NID Number" className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl py-4 px-5 outline-none dark:text-white font-bold" />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div onClick={() => startCamera('front')} className={`relative aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center ${frontImage ? 'border-teal-500' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                            {frontImage ? <img src={frontImage} className="w-full h-full object-cover" /> : <Camera className="text-slate-400" />}
                          </div>
                          <div onClick={() => startCamera('back')} className={`relative aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center ${backImage ? 'border-teal-500' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                            {backImage ? <img src={backImage} className="w-full h-full object-cover" /> : <Camera className="text-slate-400" />}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => setModalStep('plan')} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold py-4 rounded-2xl">Back</button>
                        <button onClick={handleNidSubmit} className="flex-[2] bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-2xl shadow-xl transition-all">Next: Payment</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modalStep === 'payment' && (
                <div className="space-y-6">
                   <p className="text-5xl font-black text-center text-slate-900 dark:text-white">৳{PREMIUM_PRICE}</p>
                   <p className="text-center text-slate-500">Pay to: 01516-595597</p>
                   <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="Transaction ID" className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl py-4 px-5 outline-none dark:text-white text-center font-bold" />
                   <button onClick={handleFinalSubmit} className="w-full bg-teal-600 text-white font-black py-5 rounded-2xl shadow-xl">Submit Application</button>
                </div>
              )}

              {modalStep === 'success' && (
                <div className="text-center space-y-8 py-4">
                  <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mx-auto"><Clock className="w-12 h-12" /></div>
                  <h4 className="font-black text-3xl text-slate-900 dark:text-white">Reviewing Data...</h4>
                  <p className="text-slate-500">Approx. 2 Hours verification time.</p>
                  <button onClick={() => setShowUpgradeModal(false)} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl">Back to Dashboard</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Wallet: React.FC = () => {
  const { user } = useAppContext();
  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [method, setMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user) return;
      const { data } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setTransactions(data);
    };
    fetchWallet();
  }, [user]);

  const handleDepositRequest = async () => {
    if (!amount || !trxId || !user) return alert("Fill all fields");
    setLoading(true);
    
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      amount: Number(amount),
      type: 'Deposit',
      description: `Deposit via ${method}`,
      status: 'Pending'
    });

    if (!error) {
      setLoading(false);
      setStep(3);
    } else {
      alert("Error submitting request");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">My Wallet</h2>
        <button onClick={() => { setShowDeposit(true); setStep(1); }} className="bg-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg">Add Money</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-8 rounded-3xl text-white shadow-xl">
          <p className="text-teal-100 text-sm font-medium uppercase tracking-widest mb-2">Available Balance</p>
          <h3 className="text-4xl font-black">৳ {(user?.walletBalance || 0).toLocaleString()}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center">
            <TrendingUp className="w-8 h-8 text-yellow-500 mb-2" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Boost Visibility</h4>
            <p className="text-xs text-slate-500">Promote ads for faster sales.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center"><h3 className="font-bold">Recent Transactions</h3></div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map(tx => (
            <div key={tx.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-bold">{tx.type}</p>
                  <p className="text-xs text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>৳{tx.amount}</p>
                <span className="text-[10px] font-bold uppercase text-slate-400">{tx.status}</span>
              </div>
            </div>
          ))}
          {transactions.length === 0 && <div className="p-10 text-center text-slate-400 text-sm">No transaction history.</div>}
        </div>
      </div>

      {showDeposit && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-md rounded-3xl shadow-2xl p-8">
            {step === 1 && (
              <div className="space-y-6">
                 <h3 className="text-xl font-bold">Add Funds</h3>
                 <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (৳)" className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-4 px-4 font-bold" />
                 <button onClick={() => setStep(2)} className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl">Next</button>
                 <button onClick={() => setShowDeposit(false)} className="w-full text-slate-400 text-sm">Cancel</button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                 <p>Send ৳{amount} to 01516-595597</p>
                 <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="Transaction ID" className="w-full bg-slate-50 border rounded-xl py-4 px-4 uppercase font-bold" />
                 <button onClick={handleDepositRequest} disabled={loading} className="w-full bg-teal-600 text-white font-black py-4 rounded-xl">Submit</button>
              </div>
            )}
            {step === 3 && (
              <div className="text-center space-y-4">
                 <Clock className="w-12 h-12 text-yellow-500 mx-auto" />
                 <h4 className="text-xl font-bold">Verifying...</h4>
                 <button onClick={() => setShowDeposit(false)} className="w-full bg-slate-900 text-white font-black py-3 rounded-xl">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Overview: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ label: 'Views', val: '0' }, { label: 'Clicks', val: '0' }, { label: 'Active Ads', val: '0' }].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">{stat.val}</h3>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border text-center text-slate-400">
          <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-20" />
          <p className="text-xs uppercase font-black tracking-widest">No stats available yet</p>
      </div>
    </div>
  );
};

const SettingsPanel: React.FC = () => {
  const { user, setUser } = useAppContext();
  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
  const [twoFactor, setTwoFactor] = useState(user?.isTwoFactorEnabled || false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ 
        name, 
        bio, 
        phone_number: phoneNumber,
        photo_url: photoUrl,
        is_two_factor_enabled: twoFactor 
      })
      .eq('id', user.id);
      
    if (!error) {
      setUser({ ...user, name, bio, phoneNumber, photoUrl, isTwoFactorEnabled: twoFactor });
      alert("Settings saved successfully!");
    } else {
      console.error(error);
      alert("Failed to save settings.");
    }
    setSaving(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-3xl border-4 border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <UserIcon className="w-12 h-12 text-slate-300" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
            <div className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-2 rounded-xl shadow-lg">
              <Upload className="w-3 h-3" />
            </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Profile Photo</h3>
            <p className="text-xs text-slate-500 font-medium">Click on the image to update your avatar.</p>
            <div className="flex gap-2 justify-center md:justify-start">
               <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 uppercase">JPG/PNG</span>
               <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 uppercase">MAX 2MB</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white mb-2 flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-600" /> Account Settings
          </h3>
          <p className="text-xs text-slate-500 font-medium">Update your profile details and security options.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-teal-500 transition-all dark:text-white font-bold" 
              />
              <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Phone Number</label>
            <div className="relative">
              <input 
                type="tel" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                placeholder="+880 1XXX-XXXXXX"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-teal-500 transition-all dark:text-white font-bold" 
              />
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Bio</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value.slice(0, 160))} 
            placeholder="Tell us about yourself..." 
            rows={4} 
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-teal-500 transition-all dark:text-white resize-none"
          ></textarea>
          <p className="text-[10px] text-right text-slate-400 font-bold">{bio.length}/160</p>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-2xl flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-black text-slate-800 dark:text-white text-sm">2-Factor Authentication</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Add an extra layer of security to your Bazaari account.</p>
                 </div>
              </div>
              <button 
                onClick={() => setTwoFactor(!twoFactor)}
                className={`w-14 h-7 rounded-full transition-all relative flex items-center px-1 ${twoFactor ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${twoFactor ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
           </div>
        </div>

        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-slate-300"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          Save Changes
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, setUser } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const menuItems = [
    { label: 'Overview', icon: BarChart3, path: '/dashboard' },
    { label: 'My Ads', icon: Package, path: '/dashboard/ads' },
    { label: 'Wallet', icon: WalletIcon, path: '/dashboard/wallet' },
    { label: 'Verification', icon: ShieldCheck, path: '/dashboard/verification' },
    { label: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
    { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full border-4 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-teal-500/20">
             {user?.photoUrl ? <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" /> : <UserIcon className="w-10 h-10 text-slate-300" />}
          </div>
          <h2 className="font-bold text-slate-900 dark:text-white truncate">{user?.name}</h2>
          {user && <UserBadge role={user.role} size="sm" />}
        </div>
        
        <nav className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="flex flex-col">
            {menuItems.map(item => (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-6 py-4 text-sm font-bold ${location.pathname === item.path ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-4 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border-t border-slate-100 dark:border-slate-800"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </nav>
      </aside>
      
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/settings" element={<SettingsPanel />} />
          <Route path="*" element={<div className="p-20 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800"><PackageOpen className="w-12 h-12 mx-auto mb-2 opacity-20" /><p className="font-black uppercase tracking-widest text-xs">Section Empty</p></div>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
