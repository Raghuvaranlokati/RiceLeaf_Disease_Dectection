import { NextResponse } from 'next/server';

// Temporary in-memory storage (will reset when Vercel serverless function spins down)
global.messagesStore = global.messagesStore || [];

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.email || !data.message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }
    
    const newMessage = {
      id: Date.now().toString(),
      email: data.email,
      subject: data.subject || 'No Subject',
      message: data.message,
      date: new Date().toISOString(),
    };
    
    global.messagesStore.push(newMessage);
    
    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  // Check password in headers for security
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return NextResponse.json({ messages: global.messagesStore || [] }, { status: 200 });
}
