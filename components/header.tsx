import { shadow } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import LogoutButton from "./LogoutButton";
import { getUser } from "@/utils/supabase/server";
import { SidebarTrigger } from "./ui/sidebar";

const Header = async () => {
  const user = await getUser();
  return (
    <header
      className="relative flex h-24 w-full items-center justify-between bg-popover px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
      <SidebarTrigger size="icon" className="absolute left-1 top-24" />
      <Link href="/" className="flex items-end gap-2">
        <Image
          src="/gazelle.png"
          alt="logo"
          width={60}
          height={60}
          className="rounded-full size-12"
          priority
        />

        <h1 className="flex flex-col pb-1 text-xl font-semibold leading-6 font-sans">
          GAZELLE <span>Notes</span>
        </h1>
      </Link>

      <div className="flex gap-4">
        {user ? (
          <>
            <Button variant="outline" className="rounded-full font-bold">
              {user.email?.slice(0, 1).toUpperCase()}
            </Button>
            <LogoutButton />
          </>
        ) : (
          <>
            <Button asChild>
              <Link href="/sign-up" className="hidden sm:block">
                Sign Up
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <ModeToggle />
      </div>
    </header>
  );
};
export default Header;
