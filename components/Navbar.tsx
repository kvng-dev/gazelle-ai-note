import React from "react";
import Link from "next/link";
import { Home, Sprout } from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <div className="flex items-center">
            <Button variant="outline" asChild>
              <Link
                href="/"
                className="text-xl font-bold text-primary font-sans tracking-wider"
              >
                🌱 Plantventory
              </Link>
            </Button>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="flex items-center gap-2" variant="ghost" asChild>
              <Link href="/plants">
                <Sprout className="w-4 h-4" />
                <span className="hidden lg:inline">Plants</span>
              </Link>
            </Button>

            <Button className="flex items-center gap-2" variant="ghost" asChild>
              <Link href="/">
                <Home className="w-4 h-4" />
                <span className="hidden lg:inline">Home</span>
              </Link>
            </Button>
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
