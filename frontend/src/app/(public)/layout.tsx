"use client"
import React from "react";
import Footer from "@/components/base/footer/footer";
import { Navbar } from "@/components/base/navbar/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuState, setMenuState] = React.useState(false);
  return (
    <div>
      <Navbar menuState={menuState} setMenuState={setMenuState} />
      {children}
      <Footer/>
    </div>
  );
}
