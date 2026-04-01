"use client"

import "./globals.css";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { SnackbarProvider } from 'notistack';
import { PersistGate } from "redux-persist/lib/integration/react";
import { StyledEngineProvider } from "@mui/material";
import HeaderComp from "@/component/header-comp/header-comp";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoaderComp from "@/component/loader-comp/loader-comp";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        <StyledEngineProvider injectFirst>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <HeaderComp />
                {loading && <LoaderComp />}
                {children}
              </SnackbarProvider>
            </PersistGate>
          </Provider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
