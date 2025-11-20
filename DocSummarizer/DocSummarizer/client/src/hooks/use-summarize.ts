import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SummarizeResponse } from "@shared/schema";

interface UseSummarizeOptions {
  onMutate?: () => void;
  onSettled?: () => void;
  onSuccess?: (data: SummarizeResponse) => void;
  onError?: (error: Error) => void;
}

export function useSummarizeFile(options: UseSummarizeOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<SummarizeResponse> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/summarize/file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process file");
      }

      return response.json();
    },
    onMutate: options.onMutate,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/summaries"] });
      options.onSettled?.();
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
}

export function useSummarizeText(options: UseSummarizeOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string): Promise<SummarizeResponse> => {
      const response = await fetch("/api/summarize/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process text");
      }

      return response.json();
    },
    onMutate: options.onMutate,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/summaries"] });
      options.onSettled?.();
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
}
