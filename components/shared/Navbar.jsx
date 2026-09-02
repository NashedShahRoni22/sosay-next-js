"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import logo from "../../app/assets/logo/logo.png";

export default function Navbar() {
  const [view, setView] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = usePathname();

  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Business", path: "/business" },
    { name: "Marketplace", path: "/spump-market" },
    { name: "Creators", path: "/creators" },
    { name: "Blog", path: "/blog" },
    { name: "Contact Us", path: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section>
      {/* Fixed Navbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-border shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
            : "bg-white/0 border-b border-transparent"
        }`}
      >
        <div className="flex justify-between items-center mx-5 md:container md:mx-auto py-4">
          {/* Mobile Menu Button */}
          <Menu
            className="text-3xl lg:text-4xl text-foreground hover:text-destructive transition-colors duration-300 cursor-pointer hover:scale-110 transform lg:hidden"
            onClick={() => setView(true)}
          />

          {/* Logo */}
          <div className="flex gap-2 items-center">
            <Image
              src={logo}
              alt="Sosay Logo"
              className="rounded-full"
              width={100}
              height={100}
            />
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/[0.03] rounded-full px-1.5 py-1.5">
            {menuItems.map((item) => {
              const active = location === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                    active
                      ? "text-white"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-destructive rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/"
              className="px-5 py-2 text-sm font-semibold text-foreground/80 hover:text-destructive transition-colors duration-300"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-destructive hover:bg-destructive/90 text-white text-sm font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-destructive/25"
            >
              Join Free
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu Overlay */}
      <AnimatePresence>
        {view && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl overflow-hidden lg:hidden"
          >
            {/* Mobile Header */}
            <div className="flex justify-between items-center mx-5 md:container md:mx-auto py-4">
              <X
                className="text-3xl text-foreground hover:text-destructive transition-all duration-300 cursor-pointer hover:scale-110 transform hover:rotate-90"
                onClick={() => setView(false)}
              />
              <div className="text-xl font-bold">
                <span className="text-destructive">Sosay</span>
              </div>
            </div>

            {/* Mobile Nav Menu */}
            <div className="flex flex-col gap-6 mt-10 mx-5">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.05 * i,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={item.path}
                    className={`group relative text-3xl font-bold w-fit block transition-colors duration-300 ${
                      location === item.path
                        ? "text-destructive"
                        : "text-foreground"
                    }`}
                    onClick={() => setView(false)}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div
                      className={`absolute bottom-0 left-0 h-1 bg-destructive transition-all duration-300 ease-out ${
                        location === item.path
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.05 * menuItems.length + 0.05,
                duration: 0.3,
              }}
              className="flex flex-col sm:flex-row gap-4 mt-12 mx-5"
            >
              <Link
                href="/register"
                className="px-8 py-3 bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-destructive/25 text-lg text-center"
              >
                Join Free
              </Link>
              <Link
                href="/"
                className="px-8 py-3 bg-transparent border-2 border-destructive text-destructive hover:bg-destructive hover:text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 text-lg text-center"
              >
                Log In
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
