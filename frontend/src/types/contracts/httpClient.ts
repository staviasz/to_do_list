import type { HttpResponse } from '@/types/contracts/services/httpResponse';
import type { RequestOptions } from '@/types/contracts/services/requestOptions';

export interface HttpClient {
  request: (url: string, optionss: RequestOptions) => Promise<HttpResponse>;
}
