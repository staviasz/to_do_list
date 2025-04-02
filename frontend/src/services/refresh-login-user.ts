import { fetchAdapter } from "./fetchAdapter";

type RefreshLoginUser = {
  token: string;
  refreshToken: string;
};

export const refreshLoginUserService = async ({
  token,
  refreshToken,
}: RefreshLoginUser) => {
  const response = await fetchAdapter.request(`/user/refresh`, {
    method: "POST",
    body: { token, refreshToken },
  });

  window.localStorage.setItem("token", response.body.token);
  window.localStorage.setItem("refreshToken", response.body.refreshToken);

  return response;
};
