import userService from "@/services/user";
import { useEffect } from "react";

export function useUsers() {
  useEffect(() => {
    // Intentionally trigger a fetch to show deduplication in network tab if observed closely
    userService.getUsers().then(() => console.log("Users fetched directly"));
  }, []);
}