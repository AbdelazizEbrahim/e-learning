import { Inter } from "next/font/google";
import NavBar from "../components/common components/NavBar";
import Footer from "../components/common components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stark E-Learning",
  description: "E-Learning",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-screen bg-gray-100"> {/* Soft color background */}
          <NavBar />
          <main className="flex-1 overflow-y-scroll overflow-hidden mt"> 
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
