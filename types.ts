
export enum Category {
  MOBILE = 'Mobile Phones',
  ELECTRONICS = 'Electronics',
  VEHICLES = 'Vehicles',
  PROPERTY = 'Property',
  TO_LET = 'To Let',
  HOME_LIVING = 'Home & Living',
  SERVICES = 'Services',
  JOBS = 'Jobs',
  OTHERS = 'Others'
}

export enum Condition {
  NEW = 'New',
  USED = 'Used',
  REFURBISHED = 'Refurbished'
}

export enum RentalTarget {
  BACHELOR = 'Bachelor',
  FAMILY = 'Family',
  BOTH = 'Both'
}

export enum TransactionType {
  DEPOSIT = 'Deposit',
  SPENT = 'Spent',
  REFUND = 'Refund'
}

export enum FriendshipStatus {
  NONE = 'none',
  PENDING = 'pending',
  ACCEPTED = 'accepted'
}

export enum UserRole {
  OWNER = 'Owner',
  PREMIUM = 'Premium',
  NORMAL = 'Normal'
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  isTwoFactorEnabled?: boolean;
  photoUrl: string;
  bio?: string;
  joinedDate: string;
  isVerified: boolean;
  totalAds: number;
  walletBalance: number;
  followersCount: number;
  followingCount: number;
  friendsCount: number;
  role: UserRole;
  isFollowing?: boolean;
  friendshipStatus?: FriendshipStatus;
}

export interface Ad {
  id: string;
  title: string;
  category: Category;
  description: string;
  price: number;
  location: string;
  district: string;
  condition?: Condition;
  rentalTarget?: RentalTarget;
  images: string[];
  sellerId: string;
  createdAt: string;
  isBoosted: boolean;
  boostExpiry?: string;
  views: number;
  clicks: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  adId?: string;
}

export type CallType = 'audio' | 'video' | 'screen';
export type CallStatus = 'ringing' | 'connected' | 'ended';

export type Language = 'en' | 'bn';
export type Theme = 'light' | 'dark';
