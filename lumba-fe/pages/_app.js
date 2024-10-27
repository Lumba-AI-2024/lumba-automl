// pages/_app.js
import Layout from "../src/components/Layout";
import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import DetailsModalProvider from "../src/context/DetailsModalContext";
import FormModalContextProvider from "../src/context/FormModalContext";
import { AutoMLProvider } from "../src/context/AutoMLContext";
import dynamic from "next/dynamic";

const UserProvider = dynamic(() => import("../src/context/UserContext"), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Layout>
        <NextNProgress
          color="#19d7e4"
          options={{ showSpinner: false }}
          startPosition={0.3}
          stopDelayMs={200}
          height={4}
          showOnShallow={true}
        />
        <DetailsModalProvider>
          <FormModalContextProvider>
            <AutoMLProvider>
              <Component {...pageProps} />
            </AutoMLProvider>
          </FormModalContextProvider>
        </DetailsModalProvider>
      </Layout>
    </UserProvider>
  );
}

export default MyApp;
