import { sessionContext } from "@/context/session-context";
import { useContext } from "react";

export const useAuth = () => {
  return useContext(sessionContext);
};
