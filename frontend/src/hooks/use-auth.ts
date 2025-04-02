import { sessionContext } from "@/components/context/session-context";
import { useContext } from "react";

export const useAuth = () => {
  return useContext(sessionContext);
};
