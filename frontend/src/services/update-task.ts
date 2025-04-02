import { HttpResponse } from "@/types/contracts/httpResponse";
import { Task } from "@/types/task";
import { fetchAdapter } from "./fetchAdapter";
import { tryRefreshLogin } from "./try-refresh-login";

type Body = Omit<Task, "id">;

type Request = {
  body: Body;
  token: string;
  refreshToken: string;
  id: number;
};

const request = async ({ body, token, id }: Request) => {
  const response = await fetchAdapter.request(`/tasks/${id}`, {
    method: "PUT",
    body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const updateTaskService = async ({
  body,
  token,
  refreshToken,
  id,
}: Request): Promise<HttpResponse> => {
  const response = await tryRefreshLogin(request, {
    body,
    token,
    refreshToken,
    id,
  });

  return response;
};
