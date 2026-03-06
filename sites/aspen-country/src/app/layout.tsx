import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aspen Muraski | Extraordinary Land. Exceptional Representation.",
  description:
    "Based in Mountain View County, Aspen pairs deep local knowledge with a strategic approach to real estate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
