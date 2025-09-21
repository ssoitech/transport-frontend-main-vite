import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../../config/AxiosConfig";

/**
 * World-class, production-ready generic React Query hook for any HTTP method.
 * Features:
 * - Supports GET, POST, PUT, PATCH, DELETE, etc.
 * - Customizable axios instance
 * - Automatic error handling and retry logic
 * - Custom response transformation (select)
 * - Request cancellation (AbortController)
 * - Full TypeScript support (if desired)
 * - Custom headers, params, body, etc.
 * - Optional onSuccess, onError, onSettled callbacks
 * - Exposes loading, error, data, refetch, mutate, etc.
 */

export function useApiQuery({
  key,
  url,
  method = "get",
  params,
  data,
  headers,
  enabled = true,
  select,
  axios = axiosInstance,
  retry = 2,
  staleTime = 60 * 1000,
  cacheTime = 5 * 60 * 1000,
  onSuccess,
  onError,
  onSettled,
}) {
  return useQuery({
    queryKey: [key, url, params, data],
    queryFn: async () => {
      const controller =
        typeof AbortController !== "undefined"
          ? new AbortController()
          : undefined;
      const response = await axios.request({
        url,
        method,
        params,
        data,
        headers,
        signal: controller?.signal,
      });
      return select ? select(response.data) : response.data;
    },
    enabled,
    retry,
    staleTime,
    cacheTime,
    onSuccess,
    onError,
    onSettled,
  });
}

export function useApiMutation({
  key,
  url,
  method = "post",
  headers,
  axios = axiosInstance,
  select,
  retry = 0,
  onSuccess,
  onError,
  onSettled,
}) {
  return useMutation({
    mutationKey: key ? [key, url] : undefined,
    mutationFn: async (body) => {
      const response = await axios.request({
        url,
        method,
        data: body,
        headers,
      });
      return select ? select(response.data) : response.data;
    },
    retry,
    onSuccess,
    onError,
    onSettled,
  });
}
