/* eslint-disable react-hooks/rules-of-hooks */
import { useJWT } from "@/hooks/use-jwt";
import { createContext, useEffect, useState } from "react";

type session = {
  user: { id: number } | null;
  token: string;
  refreshToken: string;
};

export const sessionContext = createContext<{
  session: session | null;
  setSession: (session: Omit<session, "user">) => void;
}>({} as any);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSessionState] = useState<session | null>(null);

  const setSession = ({ token, refreshToken }: Omit<session, "user">) => {
    const { payload } = useJWT(token);
    setSessionState({
      user: { id: (payload as { userId: number }).userId },
      token,
      refreshToken,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    if (token && refreshToken) {
      setSession({ token, refreshToken });
    }
  }, []);

  return (
    <sessionContext.Provider value={{ session, setSession }}>
      {children}
    </sessionContext.Provider>
  );
};
