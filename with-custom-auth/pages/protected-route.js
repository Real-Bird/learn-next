import styles from "@/styles/Home.module.css";

export default function ProtectedRoute() {
  return (
    <div className={styles.container}>
      <h1>Protected Route</h1>
      <p>You can't see me if not logged-in!</p>
    </div>
  );
}
