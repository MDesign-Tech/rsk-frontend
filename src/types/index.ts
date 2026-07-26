
export interface CloudinaryImage {
  url: string;
  publicId: string;
}

export type UserRole = "admin" | "member";

export interface Permission {
  _id: string;
  moduleName: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  member?: TeamMember | string | null;
  permissions?: Permission[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  member?: TeamMember | string | null;
  createdAt?: string;
  updatedAt?: string;
}


export interface Module {
  _id: string;
  name: string;
  description?: string;
  route?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  department?: string;
  position?: string;
  bio?: string;
  image?: string | null;
  imagePublicId?: string | null;
  title?: string;
  section?: string | TeamSection;
  socialMedia?: SocialMedia;
  visible?: boolean;
  order?: number;
  user?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroContent {
  _id: string;
  title: string;
  subtitle: string;
  trust: string;
  image?: string | null;
  imagePublicId?: string | null;
  subtitleVisible?: boolean;
  trustVisible?: boolean;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  image?: string | null;
  imagePublicId?: string | null;
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
  tiktok?: SocialLink;
  snapchat?: SocialLink;
}

export interface AboutUs {
  _id: string;
  title: string;
  description: string;
  visible?: boolean;
  stats: AboutStat[];
  contactMethods: ContactMethod[];
  socialMedia?: SocialMedia;
  ourStory?: {
    title: string;
    description: string;
  };
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
  image?: string | null;
  imagePublicId?: string | null;
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

export interface TeamSection {
  _id: string;
  name: string;
  description?: string;
  order?: number;
  visible?: boolean;
}

export interface TeamSectionGroup {
  section: TeamSection;
  members: TeamMember[];
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

export type ConversationStatus = "open" | "closed";

export interface Conversation {
  _id: string;
  clientName: string;
  clientEmail: string;
  status: ConversationStatus;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isOnline: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type MessageSender = "client" | "admin";

export interface ChatMessage {
  _id: string;
  conversation: string;
  sender: MessageSender;
  message: string;
  read: boolean;
  readAt?: string;
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
  whyJoinUs: WhyJoinUs;
  whyBecomeMember: WhyBecomeMember;
}

export interface WhyJoinUsPoint {
  _id: string;
  title: string;
  description: string;
  image: string | null;
  imagePublicId: string | null;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WhyJoinUs {
  _id: string;
  title: string;
  description: string;
  visible?: boolean;
  points: WhyJoinUsPoint[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WhyBecomeMemberPoint {
  _id: string;
  title: string;
  description: string;
  image: string | null;
  imagePublicId: string | null;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WhyBecomeMember {
  _id: string;
  title: string;
  description: string;
  visible?: boolean;
  points: WhyBecomeMemberPoint[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OpportunityType {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Opportunity {
  _id: string;
  type: OpportunityType | string;
  title: string;
  slug: string;
  org: string;
  description: string;
  category: string;
  location: string;
  date: string;
  image?: string | null;
  imagePublicId?: string | null;
  status: "Open" | "Closed";
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AvailableMember {
  _id: string;
  name: string;
  department?: string;
}
