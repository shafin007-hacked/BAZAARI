
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Language, User, UserRole, Theme } from './types';
import { TRANSLATIONS } from './constants';
import Home from './pages/Home';
import AdDetails from './pages/AdDetails';
import PostAd from './pages/PostAd';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import UserProfile from './pages/UserProfile';
import Messenger from './pages/Messenger';
import { supabase } from './supabase';
import { Search, PlusCircle, LogOut, MoreVertical, X, Globe, Mail, MessageCircle, Crown, ShieldCheck, User as UserIcon, Sun, Moon, Zap, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

export const UserBadge: React.FC<{ role: UserRole, size?: 'sm' | 'md' | 'lg' }> = ({ role, size = 'md' }) => {
  const config = {
    [UserRole.OWNER]: {
      label: 'Owner',
      icon: Crown,
      classes: 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white border-amber-400 shadow-amber-500/40 animate-pulse bg-[length:200%_auto] hover:animate-none transition-all'
    },
    [UserRole.PREMIUM]: {
      label: 'Premium',
      icon: ShieldCheck,
      classes: 'bg-teal-600 text-white border-teal-400 shadow-teal-500/20'
    },
    [UserRole.NORMAL]: {
      label: 'Member',
      icon: UserIcon,
      classes: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 shadow-sm'
    }
  };

  const { label, icon: Icon, classes } = config[role];
  const sizeMap = {
    sm: { wrapper: 'px-1.5 py-0.5 text-[8px]', icon: 'w-2.5 h-2.5' },
    md: { wrapper: 'px-2.5 py-1 text-[10px]', icon: 'w-3 h-3' },
    lg: { wrapper: 'px-4 py-1.5 text-xs', icon: 'w-4 h-4' }
  };
  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border font-black uppercase tracking-widest ${classes} ${currentSize.wrapper}`}>
      <Icon className={`${currentSize.icon} ${role === UserRole.OWNER ? 'fill-current' : ''}`} />
      {label}
    </div>
  );
};

const Header: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, user, setUser, t } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">B</div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-teal-700 dark:text-teal-500 leading-none">Bazaari</span>
            <div className="flex items-center gap-1">
              <Zap className="w-2 h-2 text-teal-600 animate-pulse" />
              <span className="text-[6px] font-black uppercase tracking-[0.2em] text-slate-400">Powered by ENIGMATIC</span>
            </div>
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-teal-500 transition-all outline-none text-sm dark:text-slate-100"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all active:scale-95">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          <button onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'বাংলা' : 'English'}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/messenger" className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all relative">
                <MessageCircle className="w-5 h-5" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></div>
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors group">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {user.photoUrl ? <img src={user.photoUrl} alt={user.name} /> : <UserIcon className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 scale-75">
                    <UserBadge role={user.role} size="sm" />
                  </div>
                </div>
                <span className="text-sm font-semibold group-hover:text-teal-600 dark:text-slate-100 transition-colors">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600">{t('login')}</Link>
              <Link to="/login" className="text-sm font-semibold bg-teal-600 text-white px-5 py-2.5 rounded-full hover:bg-teal-700 transition-all">{t('register')}</Link>
            </div>
          )}

          <Link to="/post-ad" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-6 py-2.5 rounded-full shadow-md transition-all">
            <PlusCircle className="w-5 h-5" />
            <span>{t('postAd')}</span>
          </Link>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <MoreVertical className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in slide-in-from-top duration-300">
          <div className="p-4 space-y-4">
            <div className="relative">
              <input type="text" placeholder={t('searchPlaceholder')} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm dark:text-slate-100 focus:ring-2 focus:ring-teal-500 outline-none" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button onClick={toggleTheme} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-400 transition-colors active:scale-95">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />} {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
              <button onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-400 transition-colors active:scale-95">
                <Globe className="w-4 h-4" /> {language === 'en' ? 'বাংলা' : 'English'}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={closeMenu} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                        {user.photoUrl ? <img src={user.photoUrl} alt={user.name} /> : <UserIcon className="w-5 h-5 text-slate-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-white leading-none">{user.name}</p>
                        <UserBadge role={user.role} size="sm" />
                      </div>
                    </div>
                    <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </Link>
                  <Link to="/messenger" onClick={closeMenu} className="flex items-center gap-3 p-3 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800">
                    <MessageCircle className="w-5 h-5" /> Messages
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <LogOut className="w-5 h-5" /> Logout Account
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={closeMenu} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <LogIn className="w-4 h-4" /> {t('login')}
                  </Link>
                  <Link to="/login" onClick={closeMenu} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-teal-600 text-white text-sm font-bold shadow-lg shadow-teal-600/20">
                    <UserPlus className="w-4 h-4" /> {t('register')}
                  </Link>
                </div>
              )}
            </div>

            <Link to="/post-ad" onClick={closeMenu} className="flex items-center justify-center gap-2 p-4 rounded-xl bg-yellow-400 text-slate-900 font-black uppercase tracking-widest shadow-xl shadow-yellow-400/20 active:scale-95 transition-all">
              <PlusCircle className="w-5 h-5" />
              <span>{t('postAd')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center text-white font-bold">B</div>
            <span className="text-xl font-bold text-white">Bazaari</span>
          </div>
          <p className="text-sm">The safest and easiest place to buy, sell and promote anything in Bangladesh.</p>
          <div className="pt-2">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-bold">Support Contact</p>
            <div className="space-y-2">
              <a href="mailto:heytoxic105@gmail.com" className="flex items-center gap-2 text-sm hover:text-teal-400 transition-colors">
                <Mail className="w-4 h-4" /> heytoxic105@gmail.com
              </a>
              <a href="https://wa.me/8801516595597" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-teal-400 transition-colors">
                <MessageCircle className="w-4 h-4" /> +880 1516-595597
              </a>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-teal-400 transition-colors">Help & FAQ</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Safety Tips</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Social</h4>
          <div className="flex gap-4">
            <a href="https://wa.me/8801516595597" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white cursor-pointer transition-all">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="mailto:heytoxic105@gmail.com" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-white cursor-pointer transition-all">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
        <p>© 2026 Bazaari Marketplace. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

const FloatingWhatsApp: React.FC = () => {
  return (
    <a href="https://wa.me/8801516595597" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 animate-bounce">
      <MessageCircle className="w-8 h-8" />
    </a>
  );
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // AUTH LISTENER (ENIGMATIC CLOUD)
  useEffect(() => {
    const fetchUserData = async (sessionUser: any) => {
      const adminEmail = "heytoxic105@gmail.com";
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      setUser({
        id: sessionUser.id,
        name: profile?.name || sessionUser.user_metadata.full_name || sessionUser.email?.split('@')[0] || 'User',
        email: sessionUser.email || '',
        phoneNumber: profile?.phone_number || '',
        isTwoFactorEnabled: profile?.is_two_factor_enabled || false,
        photoUrl: profile?.photo_url || sessionUser.user_metadata.avatar_url || '',
        joinedDate: new Date(sessionUser.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        isVerified: sessionUser.email === adminEmail,
        totalAds: 0,
        walletBalance: profile?.wallet_balance || 0,
        followersCount: 0,
        followingCount: 0,
        friendsCount: 0,
        role: sessionUser.email === adminEmail ? UserRole.OWNER : (profile?.role || UserRole.NORMAL)
      });
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserData(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserData(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const t = (key: keyof typeof TRANSLATIONS.en): string => TRANSLATIONS[language][key] || key;

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, toggleTheme, user, setUser, t }}>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ad/:id" element={<AdDetails />} />
              <Route path="/post-ad" element={<PostAd />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/messenger" element={<Messenger />} />
            </Routes>
          </main>
          <Footer />
          <FloatingWhatsApp />
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
