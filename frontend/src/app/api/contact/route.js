import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

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
      email: data.email,
      subject: data.subject || 'No Subject',
      message: data.message,
      date: new Date().toISOString(),
    };
    
    // Save to Firebase Firestore
    await addDoc(collection(db, 'messages'), newMessage);
    
    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error("Firebase POST error:", error);
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
  
  try {
    // Retrieve from Firebase Firestore
    const messagesQuery = query(collection(db, 'messages'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(messagesQuery);
    
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Firebase GET error:", error);
    return NextResponse.json(
      { error: 'Failed to retrieve messages' },
      { status: 500 }
    );
  }
}
