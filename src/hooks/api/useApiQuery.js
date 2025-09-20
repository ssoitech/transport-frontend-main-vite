import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../../config/AxiosConfig";

// Generic GET query
export function useApiQuery({ key, url, params, enabled = true, select }) {
  return useQuery({
    queryKey: [key, params],
    queryFn: async () => {
      const { data } = await axiosInstance.get(url, { params });
      return select ? select(data) : data;
    },
    enabled,
  });
}

// Generic mutation (POST/PUT/DELETE)
export function useApiMutation({ key, url, method = "post", onSuccess }) {
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await axiosInstance[method](url, body);
      return data;
    },
    onSuccess,
  });
}
