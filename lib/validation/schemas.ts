import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['super_admin', 'internal_admin', 'business_user']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Page Schemas
export const createPageSchema = z.object({
  name: z.string().min(1, 'Page name is required').max(100),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

// SEO Schemas
export const seoSchema = z.object({
  metaTitle: z.string().max(60, 'Meta title should be 60 characters or less'),
  metaDescription: z.string().max(160, 'Meta description should be 160 characters or less'),
  targetKeyword: z.string().optional(),
});

// Widget Schemas
export const heroWidgetSchema = z.object({
  headline: z.string().min(1, 'Headline is required').max(100),
  subheadline: z.string().max(200),
  cta: z.object({
    text: z.string().min(1, 'CTA text is required'),
    url: z.string().url('Must be a valid URL').or(z.string().regex(/^\//, 'Must start with /')),
  }),
  alignment: z.enum(['left', 'center', 'right']),
});

export const serviceCardSchema = z.object({
  title: z.string().min(1, 'Service title is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
});

export const contactFormFieldSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  type: z.enum(['text', 'email', 'phone', 'textarea', 'custom']),
  required: z.boolean(),
  placeholder: z.string().optional(),
});

// Lead Schemas
export const leadFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional(),
});

export const noteSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
});

// Global Styles Schema
export const colorSchema = z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color');

export const globalStylesSchema = z.object({
  colors: z.object({
    primary: colorSchema,
    secondary: colorSchema,
    accent: colorSchema,
  }),
});

const numericField = (fieldName: string) =>
  z.coerce.number({
    invalid_type_error: `${fieldName} must be a number`,
  });

export const listingSchema = z.object({
  address: z.string().min(1, 'Address is required').max(200),
  description: z.string().min(1, 'Description is required').max(5000),
  listPrice: numericField('List price').nonnegative('List price must be 0 or greater'),
  neighborhood: z.string().min(1, 'Neighborhood is required').max(120),
  city: z.string().min(1, 'City is required').max(120),
  listingStatus: z.enum(['for_sale', 'pending', 'sold']),
  bedrooms: numericField('Bedrooms').min(0, 'Bedrooms must be 0 or greater'),
  bathrooms: numericField('Bathrooms').min(0, 'Bathrooms must be 0 or greater'),
  propertyType: z.string().min(1, 'Property type is required').max(120),
  yearBuilt: numericField('Year built')
    .int('Year built must be a whole number')
    .min(1800, 'Year built looks too early')
    .max(3000, 'Year built looks invalid'),
  livingAreaSqft: numericField('Living area').nonnegative('Living area must be 0 or greater'),
  lotAreaValue: numericField('Lot area').nonnegative('Lot area must be 0 or greater'),
  lotAreaUnit: z.enum(['sqft', 'acres']),
  taxesAnnual: numericField('Taxes').nonnegative('Taxes must be 0 or greater'),
  listingBrokerage: z.string().min(1, 'Listing brokerage is required').max(160),
  mlsNumber: z.string().min(1, 'MLS listing number is required').max(80),
  representation: z.enum(['buyer_representation', 'seller_representation']).optional(),
  gallery: z.array(
    z.object({
      id: z.string(),
      url: z.string().min(1),
      caption: z.string().optional(),
      order: z.number(),
    })
  ),
});
