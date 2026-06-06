import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, login, register, updateProfile } from "@/lib/api/auth";

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: register,
  });
}

export function useProfile(enabled = true) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
