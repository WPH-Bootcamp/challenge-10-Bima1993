export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type AuthData = {
  user: AuthUser;
  token: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: AuthData;
};

export type ProfilePayload = {
  name: string;
  email: string;
  phone: string;
};

export type ProfileResponse = {
  success: boolean;
  message: string;
  data: AuthUser | { user: AuthUser };
};
