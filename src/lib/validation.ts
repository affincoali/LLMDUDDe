import { z } from 'zod';

/**
 * Validation schemas using Zod for type-safe validation
 */

// User Registration Schema
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character'),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Password Reset Request Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Password Reset Schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character'),
});

// Agent Submission Schema
export const agentSubmissionSchema = z.object({
  // Step 1: Basic Information
  name: z.string()
    .min(3, 'Agent name must be at least 3 characters')
    .max(100, 'Agent name must be less than 100 characters'),
  websiteUrl: z.string()
    .url('Invalid URL')
    .startsWith('https://', 'Website URL must use HTTPS'),
  tagline: z.string()
    .min(10, 'Tagline must be at least 10 characters')
    .max(100, 'Tagline must be less than 100 characters'),
  description: z.string()
    .min(200, 'Description must be at least 200 characters')
    .max(5000, 'Description is too long'),
  pricingModel: z.enum(['FREE', 'PAID', 'FREEMIUM', 'CONTACT'], {
    errorMap: () => ({ message: 'Please select a pricing model' })
  }),
  isOpenSource: z.boolean().default(false),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  
  // Step 2: Visual Assets
  // Accept regular URLs, data URLs (base64), and relative URLs
  logoUrl: z.string()
    .refine(val => !val || val.startsWith('http') || val.startsWith('data:image/') || val.startsWith('/api/'), 'Invalid logo URL')
    .optional().or(z.literal('')),
  coverUrl: z.string()
    .refine(val => !val || val.startsWith('http') || val.startsWith('data:image/') || val.startsWith('/api/'), 'Invalid cover URL')
    .optional().or(z.literal('')),
  screenshots: z.array(
    z.string().refine(val => val.startsWith('http') || val.startsWith('data:image/') || val.startsWith('/api/'), 'Invalid screenshot URL')
  ).max(5, 'Maximum 5 screenshots allowed').default([]),
  
  // Step 3: Categorization
  categories: z.array(z.number())
    .min(1, 'Please select at least 1 category')
    .max(3, 'Maximum 3 categories allowed'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').default([]),
  
  // Step 4: Features & Use Cases
  features: z.array(z.string()).max(10, 'Maximum 10 features allowed').default([]),
  useCases: z.array(z.string()).max(5, 'Maximum 5 use cases allowed').default([]),
  
  // Step 5: Additional Info
  socialLinks: z.object({
    twitter: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    discord: z.string().url().optional().or(z.literal('')),
  }).optional(),
  hasAffiliate: z.boolean().default(false),
  affiliateUrl: z.string().url().optional().or(z.literal('')),
  allowBacklink: z.boolean().default(true),
  
  // Terms acceptance
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
});

// Profile Update Schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(500).optional(),
});

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character'),
});

// Helper function to validate data against schema
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _error: ['Validation failed'] } };
  }
}
