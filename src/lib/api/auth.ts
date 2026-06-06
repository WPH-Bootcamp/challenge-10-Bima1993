import { api } from "./axios";
import type {
  AuthData,
  AuthResponse,
  LoginPayload,
  ProfilePayload,
  ProfileResponse,
  RegisterPayload,
} from "@/types/auth";

export async function login(payload: LoginPayload): Promise<AuthData> {
  const response = await api.post<AuthResponse>("/api/auth/login", payload);
  return response.data.data;
}

export async function register(payload: RegisterPayload): Promise<AuthData> {
  const response = await api.post<AuthResponse>("/api/auth/register", payload);
  return response.data.data;
}

function normalizeProfile(response: ProfileResponse) {
  return "user" in response.data ? response.data.user : response.data;
}

export async function getProfile() {
  const response = await api.get<ProfileResponse>("/api/auth/profile");
  return normalizeProfile(response.data);
}

export async function updateProfile(payload: ProfilePayload) {
  const response = await api.put<ProfileResponse>("/api/auth/profile", payload);
  return normalizeProfile(response.data);
}
