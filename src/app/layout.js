import { Inter } from "next/font/google";
import "./globals.css"; // Uncomment if you have global styles

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "To Do App",
  description: "To Do List Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
