import { useQuery } from "@tanstack/react-query";

export function useReviewEligibility(resortId: string) {
  return useQuery({
    queryKey: ["review-eligibility", resortId],
    queryFn: async () => {
      const response = await fetch(`/api/review-eligibility/${resortId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch review eligibility");
      }
      return response.json();
    },
    enabled: Boolean(resortId),
  });
}
