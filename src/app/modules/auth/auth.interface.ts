export type ILoginUser = {
  email: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
