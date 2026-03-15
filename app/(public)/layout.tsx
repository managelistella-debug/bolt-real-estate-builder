import type { Metadata } from "next";
import "./aspen-theme.css";

export const metadata: Metadata = {
  title: "Aspen Muraski | Extraordinary Land. Exceptional Representation.",
  description:
    "Based in Mountain View County, Aspen pairs deep local knowledge with a strategic approach to real estate.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="min-h-screen bg-[#09312a] text-white overflow-x-hidden"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {children}
    </div>
  );
}
