import type { Todo } from "@/models";
import { api } from "@/lib/axios";

const endPoint = "todo-list";

const todoService = {
  async getTodos(): Promise<Todo[]> {
    const response = await api.get<Todo[]>(endPoint);
    return response.data;
  },

  async postTodo(title: string): Promise<Todo> {
    const response = await api.post<Todo>(endPoint, {
      title,
      completed: false,
    });
    return response.data;
  },
};

export default todoService;
