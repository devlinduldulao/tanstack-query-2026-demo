import { useQuery } from "@tanstack/react-query";
import postService from "@/services/post";

export function useDedupeQuery() {
  return useQuery({
    queryKey: ["posts"], // Expo code used posts
    queryFn: () => postService.getPosts(),
  });
}
