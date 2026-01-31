
import { Category, Ad } from './types';

export const LOCATIONS = [
  'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'
];

export const PLACEHOLDER_AD_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f1f5f9'/%3E%3Cpath d='M360 260l40 40 40-40' stroke='%23cbd5e1' stroke-width='4' fill='none'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' font-weight='bold' fill='%2394a3b8'%3EBazaari No Image%3C/text%3E%3C/svg%3E";

export const INITIAL_ADS: Ad[] = [];

export const CATEGORY_ICONS: Record<Category, string> = {
  [Category.MOBILE]: '📱',
  [Category.ELECTRONICS]: '💻',
  [Category.VEHICLES]: '🚗',
  [Category.PROPERTY]: '🏠',
  [Category.TO_LET]: '🔑',
  [Category.HOME_LIVING]: '🛋️',
  [Category.SERVICES]: '🛠️',
  [Category.JOBS]: '💼',
  [Category.OTHERS]: '📦',
};

export const TRANSLATIONS = {
  en: {
    searchPlaceholder: "Search for anything...",
    login: "Login",
    register: "Register",
    postAd: "Post Your Ad",
    featuredAds: "Featured Ads",
    recentAds: "Recent Ads",
    categories: "Categories",
    price: "Price",
    location: "Location",
    boost: "Boost",
    dashboard: "Dashboard",
    myAds: "My Ads",
    messages: "Messages",
    favorites: "Favorites",
    settings: "Settings",
    rentalTarget: "Rent for",
    bachelor: "Bachelor",
    family: "Family",
    both: "Both",
    verificationPending: "Verification Pending (24h)",
    premiumUpgrade: "Upgrade to Premium"
  },
  bn: {
    searchPlaceholder: "পণ্য বা সেবা খুঁজুন...",
    login: "লগইন",
    register: "নিবন্ধন",
    postAd: "বিজ্ঞাপন দিন",
    featuredAds: "ফিচার্ড বিজ্ঞাপন",
    recentAds: "নতুন বিজ্ঞাপন",
    categories: "ক্যাটেগরি",
    price: "মূল্য",
    location: "অবস্থান",
    boost: "বুস্ট",
    dashboard: "ড্যাশবোর্ড",
    myAds: "আমার বিজ্ঞাপন",
    messages: "মেসেজ",
    favorites: "পছন্দের তালিকা",
    settings: "সেটিংস",
    rentalTarget: "ভাড়া",
    bachelor: "ব্যাচেলর",
    family: "ফ্যামিলি",
    both: "উভয়",
    verificationPending: "যাচাইকরণ পেন্ডিং (২৪ ঘণ্টা)",
    premiumUpgrade: "প্রিমিয়াম মেম্বারশিপ"
  }
};
