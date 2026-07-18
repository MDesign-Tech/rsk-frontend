import { z } from "zod";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Forgot password — only requires a valid email.
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Verify OTP — exactly 6 numeric digits.
export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

// Reset password — minimum length and confirmation match.
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export const heroSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  trust: z.string().min(1, "Trust text is required"),
  subtitleVisible: z.boolean().default(true),
  trustVisible: z.boolean().default(true),
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
// Social Media
// ---------------------------------------------------------------------------

export const socialLinkSchema = z.object({
  href: z.string().optional().nullable().default(null),
  visible: z.boolean().optional().default(true),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

export const socialMediaSchema = z.object({
  facebook: socialLinkSchema.default({}),
  instagram: socialLinkSchema.default({}),
  whatsapp: socialLinkSchema.default({}),
  x: socialLinkSchema.default({}),
  linkedin: socialLinkSchema.default({}),
  youtube: socialLinkSchema.default({}),
});

export type SocialMediaInput = z.infer<typeof socialMediaSchema>;

// ---------------------------------------------------------------------------
// About Us
// ---------------------------------------------------------------------------

export const aboutStatSchema = z.object({
  number: z.string().min(1, "Number is required"),
  label: z.string().min(1, "Label is required"),
  visible: z.boolean().optional().default(true),
});

export type AboutStatInput = z.infer<typeof aboutStatSchema>;


export const contactMethodSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  href: z.string().optional().nullable(),
  visible: z.boolean().optional().default(true),
});

export type ContactMethodInput = z.infer<typeof contactMethodSchema>;


export const aboutSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().min(1, "Description is required"),

  visible: z.boolean().default(true),

  stats: z.array(aboutStatSchema).default([]),

  contactMethods: z.array(contactMethodSchema).default([]),

  socialMedia: socialMediaSchema.default({}),
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
  visible: z.boolean().default(true),
});
export type MissionVisionInput = z.infer<typeof missionVisionSchema>;

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------
export const partnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  visible: z.boolean().default(true),
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

// Social media links for a team member (href + visibility per platform).
const teamSocialLinkSchema = z.object({
  href: z.string().optional().default(""),
  visible: z.boolean().optional().default(true),
});

export const teamMemberSocialSchema = z.object({
  facebook: teamSocialLinkSchema.optional(),
  instagram: teamSocialLinkSchema.optional(),
  whatsapp: teamSocialLinkSchema.optional(),
  x: teamSocialLinkSchema.optional(),
  linkedin: teamSocialLinkSchema.optional(),
  youtube: teamSocialLinkSchema.optional(),
});
export type TeamMemberSocialInput = z.infer<typeof teamMemberSocialSchema>;

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().optional().default(""),
  section: z.string().min(1, "Section is required"),
  socialMedia: teamMemberSocialSchema.default({}),
});
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

// ---------------------------------------------------------------------------
// Team Sections
// ---------------------------------------------------------------------------
export const teamSectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  description: z.string().optional().default(""),
});
export type TeamSectionInput = z.infer<typeof teamSectionSchema>;

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
