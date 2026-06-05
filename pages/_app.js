import Head from 'next/head'
import { useEffect } from 'react'
import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from "recoil";
import { getAccessToken } from '../utils/authToken';
import { connectSocket } from '../service/socket';

function SocketBootstrap() {
  useEffect(() => {
    const tryConnect = () => {
      if (getAccessToken()) {
        connectSocket();
      }
    };
    tryConnect();
    window.addEventListener("chat-siris-token-set", tryConnect);
    return () => window.removeEventListener("chat-siris-token-set", tryConnect);
  }, []);
  return null;
}

function App({Component, pageProps: { session, ...pageProps} }) {
  return (
    <>
      <Head>
        <title>Chat-Siris-v2</title>
      </Head>
      <SessionProvider session={session}>
        <RecoilRoot>
          <SocketBootstrap />
        	<Component {...pageProps} />
        </RecoilRoot>
      </SessionProvider>
    </>
  )
}

export default App;

