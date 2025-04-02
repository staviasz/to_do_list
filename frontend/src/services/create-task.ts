import { HttpResponse } from "@/types/contracts/httpResponse";
import { Task } from "@/types/task";
import { fetchAdapter } from "./fetchAdapter";
import { tryRefreshLogin } from "./try-refresh-login";

type Body = Pick<Task, "description" | "dateOfCompletion">;

type Request = {
  body: Body;
  token: string;
  refreshToken: string;
};

const request = async ({ body, token }: Request) => {
  const response = await fetchAdapter.request(`/tasks`, {
    method: "POST",
    body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const createTaskService = async ({
  body,
  token,
  refreshToken,
}: Request): Promise<HttpResponse> => {
  const response = await tryRefreshLogin(request, {
    body,
    token,
    refreshToken,
  });

  return response;
};
