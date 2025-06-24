import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncriptionService {
  key: Buffer<ArrayBuffer>;
  IV_LENGTH = 16;
  constructor() {
    const ENCRIPTION_SECRET = process.env.ENCRIPTION_SECRET;
    if (!ENCRIPTION_SECRET) {
      throw new InternalServerErrorException(
        'ENCRIPTION_SECRET is not defined in the environment variables',
      );
    }
    this.key = Buffer.from(ENCRIPTION_SECRET, 'base64');
  }

  encrypt(plaintext: string) {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const ivCiphertext = Buffer.concat([iv, encrypted]).toString('base64url');

    return ivCiphertext;
  }

  decrypt(ivCiphertextB64: string) {
    const ivCiphertext = Buffer.from(ivCiphertextB64, 'base64url');
    const iv = ivCiphertext.subarray(0, this.IV_LENGTH);
    const ciphertext = ivCiphertext.subarray(this.IV_LENGTH);
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    return decrypted.toString('utf8');
  }
}
