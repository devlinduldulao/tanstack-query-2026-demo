import { api } from "@/lib/axios";
import type { Post } from "@/models";

const postService = {
  async getPosts(): Promise<Post[]> {
    const response = await api.get<Post[]>("posts");
    return response.data;
  },
};

export default postService;
