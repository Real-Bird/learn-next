import Navbar from "../components/Navbar";
import ShoppingCartContext from "../components/context/cartContext";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [items, setItems] = useState({});
  return (
    <>
      <ShoppingCartContext.Provider value={{ items, setItems }}>
        <Navbar />
        <div className="w-9/12 m-auto pt-10">
          <Component {...pageProps} />
        </div>
      </ShoppingCartContext.Provider>
    </>
  );
}

export default MyApp;
