
export interface CloudinaryImage {
  url: string;
  publicId: string;
}

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

export interface TeamMember {
  _id: string;
  name: string;
  image?: string | null;
  imagePublicId?: string | null;
  title: string;
  bio?: string;
  visible?: boolean;
  section?: TeamSection | string;
  socialMedia?: SocialMedia;
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

export interface ContactMethod {
  label: string;
  value: string;
  href?: string | null;
  visible: boolean;
}

// ---------------------------------------------------------------------------
// Content Block types (used in block-editor and news articles)
// ---------------------------------------------------------------------------
export type BlockType =
  | "heading"
  | "paragraph"
  | "image"
  | "gallery"
  | "quote"
  | "bulletList"
  | "numberedList"
  | "checklist"
  | "divider"
  | "callout"
  | "button"
  | "spacer"
  | "table"
  | "codeBlock"
  | "video"
  | "fileAttachment"
  | "faq"
  | "timeline"
  | "statistics"
  | "card"
  | "banner"
  | "twoColumns"
  | "threeColumns";

export interface ContentBlock {
  id: string;
  type: BlockType;
  _draggedId?: string;
  _file?: File;
  _publicId?: string;
}

export interface ImageBlock extends ContentBlock {
  type: "image";
  src: string;
  alt: string;
  caption: string;
  alignment: "left" | "center" | "right";
  borderRadius: number;
  width: number;
}

export interface GalleryBlock extends ContentBlock {
  type: "gallery";
  images: { src: string; caption: string; _publicId?: string }[];
  layout: "grid" | "masonry";
}

export interface HeadingBlock extends ContentBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4;
  text: string;
}

export interface ParagraphBlock extends ContentBlock {
  type: "paragraph";
  content: string;
}

export interface QuoteBlock extends ContentBlock {
  type: "quote";
  text: string;
  author: string;
  position: string;
}

export interface ListBlock extends ContentBlock {
  type: "bulletList" | "numberedList";
  items: string[];
}

export interface ChecklistBlock extends ContentBlock {
  type: "checklist";
  items: { text: string; checked: boolean }[];
}

export interface CalloutBlock extends ContentBlock {
  type: "callout";
  variant: "info" | "success" | "warning" | "danger";
  message: string;
  icon: string;
}

export interface ButtonBlock extends ContentBlock {
  type: "button";
  label: string;
  url: string;
  variant: "primary" | "secondary" | "outline";
}

export interface SpacerBlock extends ContentBlock {
  type: "spacer";
  height: number;
}

export interface DividerBlock extends ContentBlock {
  type: "divider";
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