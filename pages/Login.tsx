
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Mail, Loader2, AlertCircle, Eye, EyeOff, Zap, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '../supabase';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(8).fill(''));
  const [resendTimer, setResendTimer] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Timer for OTP resend
  useEffect(() => {
    let interval: any;
    if (showOtp && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, resendTimer]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
            }
          }
        });
        if (error) throw error;
        setShowOtp(true);
        setResendTimer(60);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        setShowOtp(true);
        setResendTimer(60);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value.substring(element.value.length - 1);
    setOtp(newOtp);

    if (element.value !== '' && index < 7) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const token = otp.join('');
    if (token.length !== 8) return;

    setLoading(true);
    setError(null);
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup'
        });
        if (error) throw error;
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Invalid security code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showOtp) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">Security Verification</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            We've sent an <span className="text-slate-900 dark:text-white font-bold">8-digit security code</span> to <br />
            <span className="text-teal-600 font-bold">{email}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-8 gap-1.5 md:gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={el => { otpRefs.current[index] = el; }}
                value={data}
                onChange={e => handleOtpChange(e.target, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                className="w-full aspect-square text-center text-lg font-black bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all dark:text-white"
              />
            ))}
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleVerifyOtp}
              disabled={loading || otp.some(v => v === '')}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-600/30 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'login' ? "Verify & Sign In" : "Complete Registration")}
            </button>

            <div className="flex flex-col items-center gap-4">
              <button 
                disabled={resendTimer > 0}
                onClick={() => setResendTimer(60)}
                className="text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 text-slate-500 hover:text-teal-600"
              >
                <RefreshCw className={`w-3 h-3 ${resendTimer > 0 ? '' : 'animate-spin'}`} />
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Security Code'}
              </button>
              
              <button 
                onClick={() => setShowOtp(false)}
                className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-slate-600"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Login
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default text-slate-500">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bazaari Identity Guard</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-xl shadow-teal-600/20">B</div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {mode === 'login' ? 'Login to Bazaari' : 'Create Bazaari Account'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Access your secure marketplace dashboard.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-[10px] font-black uppercase leading-tight">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-teal-500 transition-all outline-none dark:text-white font-medium" 
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-teal-500 transition-all outline-none dark:text-white font-medium" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-teal-600/30 uppercase tracking-widest text-sm">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (mode === 'login' ? 'Proceed to Secure Login' : 'Create Secure Account')}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest hover:underline"
          >
            {mode === 'login' ? "New to Bazaari? Join Us" : "Existing Member? Sign In"}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Cloud Connection</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
