import NavBar from "@components/NavBar";
import ThemeContext from "@components/themeContext";
import type { AppProps } from "next/app";
import { useState } from "react";
import "@styles/globals.css";
import Head from "next/head";

interface ThemesProps {
  [key: string]: { background: string; color: string };
}

const themes: ThemesProps = {
  dark: {
    background: "black",
    color: "white",
  },
  light: {
    background: "white",
    color: "black",
  },
};

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          ...themes[theme],
        }}
      >
        <NavBar />
        <Component {...pageProps} />
      </div>
    </ThemeContext.Provider>
  );
}
