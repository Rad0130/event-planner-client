import "./globals.css";
import Navbar from "@/components/Navbar";
import Provider from "@/components/SessionProvider";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <Provider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}