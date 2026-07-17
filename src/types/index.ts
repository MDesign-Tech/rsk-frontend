// Shared TypeScript interfaces matching the RSK Associates backend API exactly.

export type UserRole = "admin";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroContent {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  bgImage?: string | null;
  subtitleVisible?: boolean;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutStat {
  _id?: string;
  number: string;
  label: string;
  visible: boolean;
}

export interface SocialLink {
  href?: string | null;
  visible?: boolean;
}

export interface SocialMedia {
  facebook?: SocialLink;
  instagram?: SocialLink;
  whatsapp?: SocialLink;
  x?: SocialLink;
  linkedin?: SocialLink;
  youtube?: SocialLink;
}

export interface AboutUs {
  _id: string;
  title: string;
  description: string;
  visible?: boolean;
  stats: AboutStat[];
  contactMethods: ContactMethod[];
  socialMedia?: SocialMedia;
}

export interface MissionVision {
  _id?: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  visible?: boolean;
}

export interface Partner {
  _id: string;
  name: string;
  website: string;
  description: string;
  image?: string | null;
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  image?: string | null;
  title: string;
  bio?: string;
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ContactStatus = "pending" | "replied";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status?: ContactStatus;
  reply?: string;
  replyAt?: string;
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMethod {
  label: string;
  value: string;
  href?: string | null;
  visible: boolean;
}

// Generic API envelope returned by the backend.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface WebsiteContent {
  hero: HeroContent;
  about: AboutUs;
  missionVision: MissionVision;
  services: Service[];
  partners: Partner[];
  faqs: FAQ[];
  teamMembers: TeamMember[];
}