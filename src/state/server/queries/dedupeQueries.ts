import { useQuery } from "@tanstack/react-query";
import postService from "@/services/post";

export function useDedupeQuery() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => postService.getPosts(),
  });
}
