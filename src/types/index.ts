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
  trust: string;
  bgImage?: string | null;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutStat {
  _id?: string;
  number: string;
  label: string;
}

export interface AboutUs {

 _id:string;

 title:string;

 description:string;

 stats:AboutStat[];

 contactMethods:ContactMethod[];

}

export interface MissionVision {
  _id?: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
}

export interface Partner {
  _id: string;
  name: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  image?: string | null;
  title: string;
  bio?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMethod {
  label:string;
  value:string;
  href?:string | null;
}

export interface AboutUs {
 _id:string;
 title:string;
 description:string;
 stats:AboutStat[];
 contactMethods:ContactMethod[];
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