import { HttpResponse } from "@/types/contracts/httpResponse";
import { fetchAdapter } from "./fetchAdapter";
import { tryRefreshLogin } from "./try-refresh-login";

type Request = {
  id: number;
  token: string;
  refreshToken: string;
};

const request = async ({ id, token }: Request) => {
  const response = await fetchAdapter.request(`/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const deleteTaskService = async ({
  id,
  token,
  refreshToken,
}: Request): Promise<HttpResponse> => {
  const response = await tryRefreshLogin(request, {
    id,
    token,
    refreshToken,
  });
  return response;
};
