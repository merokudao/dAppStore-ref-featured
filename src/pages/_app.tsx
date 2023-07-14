import { Provider } from 'react-redux';
import { store } from '../store';
import type { AppProps } from 'next/app';
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import type { Session } from 'next-auth';

import Layout from "../components/layout";
import { wagmiConfig } from '../features/wallet_connect';
import { WagmiConfig } from 'wagmi';
import { chains } from '../features/wallet_connect/config';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import { darkTheme, RainbowKitProvider, } from '@rainbow-me/rainbowkit';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@biconomy/web3-auth/dist/src/style.css"
import dynamic from "next/dynamic";
import { Suspense } from "react";

export default function App({ Component, pageProps }: AppProps<{
    session: Session;
}>) {
    const DynamicSocialProvider = dynamic(
        () => import("../contexts/SocialLoginContext").then((res) => res.Web3AuthProvider),
        {
          ssr: false,
        }
      );
    
    const DynamicSmartAccountProvider = dynamic(
        () => import("../contexts/SmartAccountContext").then((res) => res.SmartAccountProvider),
        {
          ssr: false,
        }
      );

      const DynamicReviewProvider = dynamic(
        () => import("../contexts/ReviewContext").then((res) => res.ReviewProvider),
        {
          ssr: false,
        }
      );
    return (
        // redux state store
        <Suspense fallback={<div>Loading...</div>}>
            <DynamicSocialProvider>
                <DynamicSmartAccountProvider>
                    <DynamicReviewProvider>
        <Provider store={store}>
            {/* This provides all the necssary config for wallet connections */}
            <WagmiConfig config={wagmiConfig}>
                {/* Session store and rainbow kit store is used for authenticting wallet */}
                <SessionProvider refetchInterval={0} session={pageProps.session}>
                    <RainbowKitSiweNextAuthProvider >
                        {/* Rainbow kit is being used for wallet conection */}
                        <RainbowKitProvider chains={chains} theme={darkTheme()}>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </RainbowKitProvider>
                    </RainbowKitSiweNextAuthProvider>
                </SessionProvider>
            </WagmiConfig>
        </Provider>
        </DynamicReviewProvider>
        </DynamicSmartAccountProvider>
        </DynamicSocialProvider>
        </Suspense>

    )
}