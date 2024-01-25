import { generate } from 'generate-password';

export function generatePassword(): string {
  const password = generate({ length: 10, numbers: true });

  return password;
}