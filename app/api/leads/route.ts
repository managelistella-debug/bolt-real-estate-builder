import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message, customFields, websiteId, sourcePage } = body;
    
    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Parse full name if provided
    let parsedFirstName = firstName;
    let parsedLastName = lastName;
    
    if (!parsedFirstName && body.name) {
      const nameParts = body.name.trim().split(' ');
      parsedFirstName = nameParts[0] || '';
      parsedLastName = nameParts.slice(1).join(' ') || '';
    }
    
    // Create lead object
    const lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      websiteId: websiteId || 'default',
      firstName: parsedFirstName || 'Unknown',
      lastName: parsedLastName || '',
      email,
      phone: phone || undefined,
      message: message || undefined,
      status: 'new' as const,
      tags: [],
      sourcePage: sourcePage || 'contact-form',
      customFields: customFields || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // In a real application, this would:
    // 1. Save to database
    // 2. Send notification emails
    // 3. Trigger webhooks
    // 4. Update CRM
    
    // For now, we'll return the lead data
    // The client will handle adding it to the local store
    
    return NextResponse.json({
      success: true,
      lead,
      message: 'Lead submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead' },
      { status: 500 }
    );
  }
}
