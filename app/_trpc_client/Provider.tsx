"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { ReactNode, useState } from "react";
import { trpc } from "./client";
function Provider({ children }: { children: ReactNode }) {
  const url =
    process.env.NODE_ENV === "production"
      ? "https://blog-app-theta-sage.vercel.app/api/trpc"
      : "http://localhost:3000/api/trpc";
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url,
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

export default Provider;
