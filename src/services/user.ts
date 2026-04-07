import { api } from "@/lib/axios";
import type { User } from "@/models";

const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("users");
    return response.data;
  },
};

export default userService;
