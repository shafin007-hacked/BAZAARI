
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Ad, FriendshipStatus, UserRole } from '../types';
import { INITIAL_ADS } from '../constants';
import { 
  UserPlus, 
  UserCheck, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Calendar, 
  Grid,
  MapPin,
  CheckCircle2,
  Clock,
  Crown,
  User as UserIcon,
  Info,
  PackageOpen
} from 'lucide-react';
import { UserBadge } from '../App';
import { supabase } from '../supabase';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setLoading(true);
      
      // Fetch Profile
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profile) {
        setTargetUser(profile as User);
        
        // Fetch User's Ads
        const { data: ads } = await supabase
          .from('ads')
          .select('*')
          .eq('seller_id', userId);
        
        if (ads) setUserAds(ads as Ad[]);
      }
      setLoading(false);
    };
    
    fetchUserData();
  }, [userId]);

  const handleFollow = () => {
    if (!targetUser) return;
    setTargetUser({
      ...targetUser,
      isFollowing: !targetUser.isFollowing,
      followersCount: targetUser.isFollowing ? targetUser.followersCount - 1 : targetUser.followersCount + 1
    });
  };

  if (loading) return <div className="text-center py-20 animate-pulse font-bold text-slate-400">Loading Bazaari Profile...</div>;
  if (!targetUser) return <div className="text-center py-20">User not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-teal-600 to-teal-800"></div>
        <div className="px-8 pb-8 -mt-16">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl border-8 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 shadow-xl flex items-center justify-center overflow-hidden">
                  {targetUser.photoUrl ? (
                    <img src={targetUser.photoUrl} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2"><UserBadge role={targetUser.role} /></div>
              </div>
              <div className="mb-2 space-y-1 text-center md:text-left">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">{targetUser.name}</h1>
                  {targetUser.role === UserRole.OWNER && <Crown className="w-5 h-5 text-amber-500 fill-current" />}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium"><Calendar className="w-4 h-4" /> Joined {targetUser.joinedDate || 'Recently'}</span>
                  <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-4 h-4" /> Bangladesh</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleFollow} className={`px-8 py-3 rounded-2xl font-black shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs ${targetUser.isFollowing ? 'bg-slate-900 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>
                {targetUser.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>

          {targetUser.bio && (
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 relative">
               <div className="flex items-center gap-2 mb-2">
                  <Info className="w-3 h-3 text-teal-600" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About the Seller</span>
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                 "{targetUser.bio}"
               </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-tight"><ShieldCheck className="w-5 h-5 text-teal-600" /> Verification</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm"><span className="text-slate-500 font-bold">Email Verified</span><CheckCircle2 className={`w-4 h-4 ${targetUser.isVerified ? 'text-green-500' : 'text-slate-300'}`} /></div>
              <div className="flex items-center justify-between text-sm"><span className="text-slate-500 font-bold">Phone Verified</span><CheckCircle2 className="w-4 h-4 text-slate-300" /></div>
              <div className="flex items-center justify-between text-sm"><span className="text-slate-500 font-bold">NID Identity</span><CheckCircle2 className={`w-4 h-4 ${targetUser.role !== UserRole.NORMAL ? 'text-green-500' : 'text-slate-300'}`} /></div>
            </div>
          </div>
          
          <div className="bg-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-teal-600/20">
             <h4 className="font-black uppercase tracking-widest text-xs opacity-60 mb-4">Quick Stats</h4>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-2xl font-black">{(targetUser.followersCount || 0).toLocaleString()}</p>
                   <p className="text-[10px] font-bold uppercase opacity-80">Followers</p>
                </div>
                <div>
                   <p className="text-2xl font-black">{userAds.length}</p>
                   <p className="text-[10px] font-bold uppercase opacity-80">Active Ads</p>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-tight"><Grid className="w-5 h-5 text-teal-600" /> Current Listings</h2>
          {userAds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userAds.map(ad => (
                <Link key={ad.id} to={`/ad/${ad.id}`} className="group bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 hover:shadow-md transition-all">
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <img src={ad.images[0]} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate mb-1">{ad.title}</h4>
                    <p className="font-black text-teal-700 dark:text-teal-500">৳{ad.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active listings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
