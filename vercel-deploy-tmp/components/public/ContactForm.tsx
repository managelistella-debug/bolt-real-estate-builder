'use client';

import { useState } from 'react';
import { ContactFormWidget, FormField } from '@/lib/types';
import { useLeadsStore } from '@/lib/stores/leads';
import { useWebsiteStore } from '@/lib/stores/website';

interface ContactFormProps {
  widget: ContactFormWidget;
  websiteId: string;
  pageId: string;
}

export function ContactForm({ widget, websiteId, pageId }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addLead } = useLeadsStore();
  const { website } = useWebsiteStore();
  
  const fields = widget.fields || [];
  
  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.placeholder || field.label} is required`;
    }
    
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    if (field.type === 'phone' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
      }
    }
    
    return null;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, any> = {};
    const newErrors: Record<string, string> = {};
    
    // Collect and validate form data
    fields.forEach(field => {
      const value = String(formData.get(field.id) || '');
      data[field.label] = value;
      
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
      }
    });
    
    // If there are validation errors, show them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    // Parse full name into first and last name if needed
    let firstName = data.firstName || '';
    let lastName = data.lastName || '';
    
    if (data.name && !firstName && !lastName) {
      const nameParts = (data.name as string).trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    // Prepare lead data
    const leadData = {
      firstName: firstName || 'Unknown',
      lastName: lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      message: data.message || '',
      customFields: {} as Record<string, string>,
    };
    
    // Add any custom fields
    Object.keys(data).forEach(key => {
      if (!['name', 'firstName', 'lastName', 'email', 'phone', 'message'].includes(key)) {
        leadData.customFields[key] = String(data[key] || '');
      }
    });
    
    try {
      // Submit to API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          websiteId,
          sourcePage: pageId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      const result = await response.json();
      
      // Add to local store
      if (result.lead) {
        addLead(result.lead);
      }
      
      setSubmitted(true);
      (e.target as HTMLFormElement).reset();
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ _form: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { submitted, errors, isSubmitting, handleSubmit };
}
