import "./globals.css";
import Navbar from "@/components/Navbar";
import Provider from "@/components/SessionProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Provider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-gray-900 text-white py-8 text-center">
            <p>© 2025 EventPlanner. All rights reserved.</p>
          </footer>
        </Provider>
      </body>
    </html>
  );
}