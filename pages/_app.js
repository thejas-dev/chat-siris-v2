import Head from 'next/head'
import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from "recoil";

function App({Component, pageProps: { session, ...pageProps} }) {
  return (
    <>
      <Head>
        <title>Chat-Siris-v2</title>
      </Head>
      <SessionProvider session={session}>
        <RecoilRoot>
        	<Component {...pageProps} />
        </RecoilRoot>
      </SessionProvider>
    </>
  )
}

export default App;

