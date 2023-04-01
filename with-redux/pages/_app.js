import { Provider } from "react-redux";
import { useStore } from "../redux/store";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <>
      <Provider store={store}>
        <Navbar />
        <div className="w-9/12 m-auto pt-10">
          <Component {...pageProps} />
        </div>
      </Provider>
    </>
  );
}

export default MyApp;
