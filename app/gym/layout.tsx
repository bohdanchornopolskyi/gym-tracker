import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  Dumbbell,
  History,
  HomeIcon,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function GymLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <GymMenu />
      <div className="flex-1">
        <MobileMenu />
        <div className="md:mt-0 mt-16">{children}</div>
      </div>
    </div>
  );
}

function GymMenu() {
  return (
    <aside className="hidden md:flex w-48 border-r bg-muted/40 p-2">
      <nav className="flex h-full max-h-screen flex-col gap-2">
        <MenuLink href="/gym" active>
          <Activity className="h-4 w-4" />
          Dashboard
        </MenuLink>
        <MenuLink href="/gym/exercises">
          <Dumbbell className="h-4 w-4" />
          Exercises
        </MenuLink>
        <MenuLink href="/gym/history">
          <History className="h-4 w-4" />
          History
        </MenuLink>
        <MenuLink href="/gym/analytics">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </MenuLink>
        <MenuLink href="/">
          <HomeIcon className="h-4 w-4" />
          Home
        </MenuLink>
      </nav>
    </aside>
  );
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 bg-background border shadow-sm hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Gym Tracker</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-8">
          <MenuLink href="/gym" active>
            <Activity className="h-4 w-4" />
            Dashboard
          </MenuLink>
          <MenuLink href="/gym/exercises">
            <Dumbbell className="h-4 w-4" />
            Exercises
          </MenuLink>
          <MenuLink href="/gym/history">
            <History className="h-4 w-4" />
            History
          </MenuLink>
          <MenuLink href="/gym/analytics">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </MenuLink>
          <MenuLink href="/">
            <HomeIcon className="h-4 w-4" />
            Home
          </MenuLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function MenuLink({
  active,
  href,
  children,
}: {
  active?: boolean;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium  text-muted-foreground transition-all hover:text-primary",
        active && "bg-muted text-primary",
      )}
    >
      {children}
    </Link>
  );
}
