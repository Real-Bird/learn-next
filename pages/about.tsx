import Widget from "@components/Widget";
import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>About this website</title>
      </Head>
      <div>
        <Link href={"/"} passHref>
          Back to home
        </Link>
      </div>
      <div>
        <Widget pageName="about" />
      </div>
    </>
  );
}
