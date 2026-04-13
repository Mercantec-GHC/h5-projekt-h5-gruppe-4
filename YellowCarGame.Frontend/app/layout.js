import "./globals.css";
import ClientLayout from "./layout.client";
import ThemeRegistry from "./ThemeRegistry";

export const metadata = {
  title: "Gul bil app",
  description: "Dette er gul bil legen som spil! Du kan logge ind og spille spillet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Gul bil app" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <ThemeRegistry>
          <ClientLayout navn={metadata.title}>
            {children}
          </ClientLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
