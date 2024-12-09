// src/pages/_app.tsx
import {httpBatchLink} from "@trpc/client/links/httpBatchLink";
import {loggerLink} from "@trpc/client/links/loggerLink";
import {withTRPC} from "@trpc/next";
import superjson from "superjson";
import type {AppRouter} from "../server/router";
import "../styles/globals.css";
import {ThemeProvider} from "@/components/themes-provider";
import {Inter} from "next/font/google";
import {SessionProvider} from "next-auth/react";
import {AppProps} from "next/app";

const inter = Inter({subsets: ["latin"]});


const MyApp = ({Component, pageProps}: AppProps<{ session: any }>) => {
    return (
        <main>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                {/*<SessionProvider session={pageProps.session}>*/}
                    <div style={{fontFamily: inter.style.fontFamily}}>
                        <Component {...pageProps} />
                    </div>
                {/*</SessionProvider>*/}
            </ThemeProvider>
        </main>
    );
};

const getBaseUrl = () => {
    if (typeof window !== "undefined") return ""; // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
    config({}) {

        const url = `${getBaseUrl()}/api/trpc`;

        return {
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === "development" ||
                        (opts.direction === "down" && opts.result instanceof Error),
                }),
                httpBatchLink({url}),
            ],
            url,
            transformer: superjson,
        };
    },

    ssr: false,
})(MyApp);
