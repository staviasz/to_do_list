import { HttpResponse } from "./httpResponse";
import { RequestOptions } from "./requestOptions";

export interface HttpClient {
  request: (url: string, optionss: RequestOptions) => Promise<HttpResponse>;
}
