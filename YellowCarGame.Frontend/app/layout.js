import "./globals.css";

export const metadata = {
  title: "Gul bil app",
  description: "Dette er gul bil legen som spil! Du kan logge ind og spille spillet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
