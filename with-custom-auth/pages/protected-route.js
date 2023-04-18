import { useAuth } from "@/lib/hooks/auth";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";

export default function ProtectedRoute() {
  const router = useRouter();
  const { loading, loggedIn, error } = useAuth();

  if (!loading && !loggedIn) {
    router.push("/login");
  }

  return (
    <div className={styles.container}>
      {loading && <p>Loading...</p>}
      {error && <p>An error occurred.</p>}
      {loggedIn && (
        <>
          <h1>Protected Route</h1>
          <p>You can't see me if not logged-in!</p>
        </>
      )}
    </div>
  );
}
