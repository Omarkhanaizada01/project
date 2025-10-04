import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { comparePassword } from '../../../lib/hash';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Описываю тип пользователя
interface User {
  id: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bitrix_id?: string;
}

//  Основной handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, message: 'Email and password required' });

  //  Подсказка TypeScript, что возвращается тип User
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;

  if (!user) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

  
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, 
  }));

  return res.status(200).json({ ok: true, message: 'Logged in' });
}
