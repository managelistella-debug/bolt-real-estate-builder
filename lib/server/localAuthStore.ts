import { createHash, randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export interface LocalAuthUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'super_admin' | 'internal_admin' | 'business_user';
  businessId?: string;
  createdAt: string;
}

const STORE_PATH = path.join(process.cwd(), 'data', 'local-auth-users.json');

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

async function ensureStoreDir(): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
}

async function readUsers(): Promise<LocalAuthUser[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as LocalAuthUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: LocalAuthUser[]): Promise<void> {
  await ensureStoreDir();
  await fs.writeFile(STORE_PATH, JSON.stringify(users, null, 2), 'utf8');
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function createLocalUser(input: {
  email: string;
  password: string;
  name: string;
  role: 'super_admin' | 'internal_admin' | 'business_user';
}): Promise<{ user?: LocalAuthUser; error?: string }> {
  const users = await readUsers();
  const normalizedEmail = input.email.trim().toLowerCase();
  if (users.some((entry) => entry.email === normalizedEmail)) {
    return { error: 'User already exists' };
  }

  const now = new Date().toISOString();
  const user: LocalAuthUser = {
    id: `local_${Date.now()}_${randomBytes(4).toString('hex')}`,
    email: normalizedEmail,
    passwordHash: hashPassword(input.password),
    name: input.name || normalizedEmail.split('@')[0],
    role: input.role,
    businessId: input.role === 'business_user' ? `business-${Date.now()}` : undefined,
    createdAt: now,
  };

  await writeUsers([...users, user]);
  return { user };
}

export async function authenticateLocalUser(input: {
  email: string;
  password: string;
}): Promise<LocalAuthUser | null> {
  const users = await readUsers();
  const normalizedEmail = input.email.trim().toLowerCase();
  const user = users.find((entry) => entry.email === normalizedEmail);
  if (!user) return null;
  return user.passwordHash === hashPassword(input.password) ? user : null;
}

export async function getLocalProfile(userId: string): Promise<{
  id: string;
  email: string;
  name: string;
  role: string;
  business_id?: string;
  created_at: string;
}> {
  const users = await readUsers();
  const user = users.find((entry) => entry.id === userId);
  if (!user) {
    throw new Error('Profile not found');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    business_id: user.businessId,
    created_at: user.createdAt,
  };
}

export async function updateLocalPassword(userId: string, newPassword: string): Promise<boolean> {
  const users = await readUsers();
  const next = users.map((user) =>
    user.id === userId ? { ...user, passwordHash: hashPassword(newPassword) } : user,
  );
  const changed = next.some((user, index) => user.passwordHash !== users[index]?.passwordHash);
  if (!changed) return false;
  await writeUsers(next);
  return true;
}
