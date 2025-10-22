import type { Metadata } from "next";
import "./globals.css";
import Provider from "./_trpc_client/Provider";
import UserWrapper from "@/Wrappers/UserWrapper";
import ThemeModeProvider from "@/Wrappers/ThemeMode";
import Header from "./_component/Header";
import ToastWrapper from "@/Wrappers/ToastWrapper";
export const metadata: Metadata = {
  title: "Blog APP",
  description: "blog app where you can share your ideas ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const dark = localStorage.getItem('dark') === 'true';
                  if (dark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="dark:bg-gray-950 dark:text-white w-full">
        <UserWrapper>
          <ThemeModeProvider>
            <Provider>
              <Header />
              {children}
            </Provider>
          </ThemeModeProvider>
        </UserWrapper>
        <ToastWrapper />
      </body>
    </html>
  );
}
