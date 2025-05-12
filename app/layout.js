import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import CreateEventDrawer from "@/components/create-event";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Creative Bugs Admin",
  description: "The Admin Dashboard empowers the Creative Bugs Media team to seamlessly manage and oversee all scheduled client meetings.With a clear and intuitive interface, administrators can view upcoming bookings, track attendee details, monitor time slots, and prevent scheduling conflicts.This centralized system streamlines communication, enhances organization, and ensures a smooth experience for both clients and the team.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {children}
          </main>
          <footer className="bg-blue-100 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Made with 💗 by creativeBugsMedia</p>
            </div>
          </footer>
          <CreateEventDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}
