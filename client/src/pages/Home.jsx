import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <p>Loading...</p>;
  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <main style={{ padding: "2rem" }}>
      <h2>Welcome to NetWorth Tracker</h2>
      <p>Track your finances securely and easily.</p>
    </main>
  );
}
