import { type Session } from "next-auth";
// import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
