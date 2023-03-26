import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome to my Next.js website</title>
      </Head>
      <div>
        <Link href="/about" passHref>
          About us
        </Link>
      </div>
    </>
  );
}
