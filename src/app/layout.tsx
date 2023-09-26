import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import StoreModal from "@/src/components/store-modal";
import { Providers } from "@/src/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Toaster />
          <StoreModal />
          {children}
        </Providers>
      </body>
    </html>
  );
}
