import ConvexClientProvider from "@/components/ConvexClientProvider";
import { cn } from "@/lib/utils";
import { Activity, BarChart3, Dumbbell, History, HomeIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function GymLayout({ children }: { children: ReactNode }) {
  return (
    <ConvexClientProvider>
      <div className="flex min-h-screen w-full">
        <GymMenu />
        {children}
      </div>
    </ConvexClientProvider>
  );
}

function GymMenu() {
  return (
    <aside className="w-48 border-r bg-muted/40 p-2">
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
