import React from "react";

interface User {
  email: string;
}

export interface AuthContext {
  isAuthenticated: boolean;
  setUser: (username: string | null) => void;
  user: User | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const email = localStorage.getItem("email");
  const user = email ? { email } : null;

  const [authUser, setAuthUser] = React.useState<User | null>(user);

  const isAuthenticated = !!authUser;

  function setUser(email: User["email"] | null) {
    if (email) {
      setAuthUser({ email });
      localStorage.setItem("email", email);
    } else {
      setAuthUser(null);
      localStorage.removeItem("email");
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
