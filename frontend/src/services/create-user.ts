import { HttpResponse } from "@/types/contracts/httpResponse";
import { User } from "@/types/user";
import { fetchAdapter } from "./fetchAdapter";

export const createUserService = async (body: User): Promise<HttpResponse> => {
  const response = await fetchAdapter.request(`/user`, {
    method: "POST",
    body,
  });

  return response;
};
