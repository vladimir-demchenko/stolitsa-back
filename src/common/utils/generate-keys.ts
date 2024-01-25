import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { generateKeyPairSync, randomBytes } from 'crypto';
import { Logger } from '@nestjs/common';

export function generateKeys(): void {
  const passphrase = randomBytes(32).toString('base64');
  const loger = new Logger('KeyGenerator');
  const log = (msg: string) => {
    loger.log(msg);
  };
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase,
    },
  });
  const keyDirPath = join(process.cwd(), 'keys');
  const privateKeyPath = join(keyDirPath, 'private.key');
  const publicKeyPath = join(keyDirPath, 'public.key');
  const passphrasePath = join(keyDirPath, 'passphrase.txt');
  if (!existsSync(keyDirPath)) {
    mkdirSync(keyDirPath);
  }
  if (!existsSync(privateKeyPath) || !existsSync(publicKeyPath)) {
    log('\x1B[33mpair of keys not found\x1B[39m');
    log('\x1B[32mgenerating new pair of keys\x1B[39m');
    try {
      writeFileSync(privateKeyPath, privateKey);
      writeFileSync(publicKeyPath, publicKey);
      writeFileSync(passphrasePath, passphrase);
    } catch (e) {
      log('\x1B[31mgenerating new pair of keys failed\x1B[39m');
    }
    log('\x1B[34mgenerating new pair of keys success\x1B[39m');
  } else {
    log('\x1B[34mpair of keys found\x1B[39m');
  }
}
