import { HttpResponse } from "@/types/contracts/httpResponse";
import { fetchAdapter } from "./fetchAdapter";
import { tryRefreshLogin } from "./try-refresh-login";

type Request = {
  token: string;
  refreshToken: string;
};

const request = async ({ token }: Request) => {
  const response = await fetchAdapter.request(`/tasks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const getTasksService = async ({
  token,
  refreshToken,
}: Request): Promise<HttpResponse> => {
  const response = await tryRefreshLogin(request, { token, refreshToken });

  return response;
};
