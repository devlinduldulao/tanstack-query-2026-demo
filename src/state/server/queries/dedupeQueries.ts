import { useQuery } from "@tanstack/react-query";
import postService from "@/services/post";

// for dedupe demo
export function usePostsQuery() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => postService.getPosts(),
  });
}
