"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SWRProvider } from "@workspace/ui/providers/swr-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </SWRProvider>
  );
}
