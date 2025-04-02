import { HttpResponse } from "@/types/contracts/httpResponse";
import { User } from "@/types/user";
import { fetchAdapter } from "./fetchAdapter";

export const loginUserService = async (
  body: Omit<User, "name">
): Promise<HttpResponse> => {
  const response = await fetchAdapter.request(`/user/login`, {
    method: "POST",
    body,
  });

  return response;
};
