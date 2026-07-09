import { createContext, useCallback, useEffect, useState } from "react";

import { getCurrentUser } from "../api/auth";

export const AuthContext = createContext({
  user: null,
  refreshUser: () => {},
});

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refreshUser = fetchUser;

  const authContext = {
    user,
    refreshUser,
  };

  return <AuthContext value={authContext}>{children}</AuthContext>;
}
