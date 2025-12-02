import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Zyder - Next-Gen Delivery Management",
    description: "Unified Logistics Platform designed to connect clients, vendors, and technology.",
};



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="noise-overlay" />
                {children}
            </body>
        </html>
    );
}
