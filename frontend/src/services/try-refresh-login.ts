import { HttpResponse } from "@/types/contracts/httpResponse";
import { refreshLoginUserService } from "./refresh-login-user";

type TryRefreshLogin = {
  token: string;
  refreshToken: string;
};

export async function tryRefreshLogin<T extends TryRefreshLogin>(
  service: (props: T) => Promise<HttpResponse>,
  props: T
): Promise<HttpResponse> {
  let response = await service({ ...props });

  if (response.status === 401) {
    const resRefresh = await refreshLoginUserService({ ...props });
    if (resRefresh.ok) {
      response = await service({ ...props, token: resRefresh.body.token });
    }
  }
  return response;
}
