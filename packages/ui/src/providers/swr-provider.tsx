"use client";

import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        errorRetryCount: 3,
      }}
    >
      {children}
    </SWRConfig>
  );
}
