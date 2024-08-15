import { Inter } from "next/font/google";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "To Do App",
  description: "To Do List Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-screen bg-gray-100"> {/* Soft color background */}
          <NavBar />
          <main className="flex-1 overflow-y-auto overflow-hidden p-4"> 
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
