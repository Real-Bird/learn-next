import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Hello, JWT!</h1>
      <Link href={"/login"}>Go to Login</Link>
      <Link href={"/protected-route"}>Go to Protected route</Link>
    </div>
  );
}
