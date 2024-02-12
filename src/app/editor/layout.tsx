import type { Metadata } from "next";
import TopBar from "./components/TopBar/TobBar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Editor",
  description: "Bspulveda Edior",
};

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopBar />
        {children}
      </body>
    </html>
  );
}
