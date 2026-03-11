import { hash } from 'bcrypt';

export async function hashPassword(password: string) {
  const hashPassword = await hash(password, 10);
  return hashPassword;
}
