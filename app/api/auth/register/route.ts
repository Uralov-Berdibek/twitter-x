import User from '@/database/user.model';
import { connectToDatabase } from '@/lib/mognoose';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: any) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const step = searchParams.get('step');

    if (step === '1') {
      const { email } = await req.json();
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    } else if (step === '2') {
      const { email, username, name, password } = await req.json();

      const existingUsername = await User.findOne({ username });

      if (existingUsername) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
      }

      const hashedPassword = await hash(password, 10);

      const newUser = await User.create({
        email,
        username,
        name,
        password: hashedPassword,
      });

      return NextResponse.json({ success: true, user: newUser });
    } else {
      return NextResponse.json({ error: 'Invalid step parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
