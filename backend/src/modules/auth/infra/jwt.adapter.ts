import { ENV_SERVER } from '@/config/env';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

type Unit = 'Y' | 'W' | 'D' | 'H' | 'M' | 's' | 'Ms';
type StringValue = `${number}` | `${number}${Unit}` | `${number} ${Unit}`;

type SignProps = {
  payload: Record<string, any>;
  expiresIn?: StringValue;
};

@Injectable()
export class JWTAdapter {
  private readonly secretKey = ENV_SERVER.secretKeyJWT;

  constructor() {}

  sign(props: SignProps) {
    return jwt.sign(props.payload, this.secretKey, {
      expiresIn: props.expiresIn,
    });
  }

  decode(token: string) {
    try {
      return jwt.verify(token, this.secretKey);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return null;
    }
  }
}
