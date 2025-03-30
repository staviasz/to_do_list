import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashAdapter {
  async hash(text: string): Promise<string> {
    const hash = await argon2.hash(text);
    return hash;
  }

  compare(text: string, hash: string) {
    return argon2.verify(hash, text);
  }
}
