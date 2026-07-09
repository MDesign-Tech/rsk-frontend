import { z } from "zod";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export const heroSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  trust: z.string().min(1, "Trust text is required"),
});
export type HeroInput = z.infer<typeof heroSchema>;

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

// ---------------------------------------------------------------------------
// About Us
// ---------------------------------------------------------------------------

export const aboutStatSchema = z.object({
  number: z.string().min(1, "Number is required"),
  label: z.string().min(1, "Label is required"),
});

export type AboutStatInput = z.infer<typeof aboutStatSchema>;


export const contactMethodSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  href: z.string().optional().nullable(),
});

export type ContactMethodInput = z.infer<typeof contactMethodSchema>;


export const aboutSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().min(1, "Description is required"),

  stats: z.array(aboutStatSchema).default([]),

  contactMethods: z.array(contactMethodSchema).default([]),
});


export type AboutInput = z.infer<typeof aboutSchema>;
// ---------------------------------------------------------------------------
// Mission & Vision
// ---------------------------------------------------------------------------
export const missionVisionSchema = z.object({
  missionTitle: z.string().min(1, "Mission title is required"),
  missionDescription: z.string().min(1, "Mission description is required"),
  visionTitle: z.string().min(1, "Vision title is required"),
  visionDescription: z.string().min(1, "Vision description is required"),
});
export type MissionVisionInput = z.infer<typeof missionVisionSchema>;

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------
export const partnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  text: z.string().min(1, "Text is required"),
});
export type PartnerInput = z.infer<typeof partnerSchema>;

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------
export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});
export type FaqInput = z.infer<typeof faqSchema>;

// ---------------------------------------------------------------------------
// Team Members
// ---------------------------------------------------------------------------
export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().optional().default(""),
});
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
// Password is optional: required on create, optional on update.
export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z.string().optional().default(""),
  role: z.enum(["admin"]).default("admin"),
  password: z.string().optional().default(""),
});
export type UserInput = z.infer<typeof userSchema>;

// Schema used when creating a user (password required, min 6 chars).
export const createUserSchema = userSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;
