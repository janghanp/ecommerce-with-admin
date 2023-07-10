import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import StoreModal from "@/src/components/store-modal";
import { ThemeProvider } from "@/src/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Admin Dashboard",
    description: "Admin Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <Toaster />
                        <StoreModal />
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
