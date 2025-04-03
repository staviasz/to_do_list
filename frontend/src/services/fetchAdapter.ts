/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClient } from "@/types/contracts/httpClient";
import { HttpResponse } from "@/types/contracts/httpResponse";
import { RequestOptions } from "@/types/contracts/requestOptions";

class FetchAdapter implements HttpClient {
  async request(url: string, options: RequestOptions): Promise<HttpResponse> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
        {
          method: options.method,
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          body: JSON.stringify(options.body),
        }
      );

      const body = await this._formatBodyResponse(response);

      if (!response.ok) {
        return {
          status: response.status,
          body: this._formatErrorMessage(body.message),
          ok: false,
        };
      }
      return {
        ok: true,
        status: response.status,
        body,
      };
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error?.message);
    }
  }

  private _formatErrorMessage(messages: string | string[]): {
    message: string;
  } {
    if (Array.isArray(messages)) {
      return { message: messages.join(", ") };
    }
    return { message: messages };
  }

  private async _formatBodyResponse(response: Response) {
    try {
      return await response.json();
    } catch (_) {
      return {};
    }
  }
}

export const fetchAdapter = new FetchAdapter();
