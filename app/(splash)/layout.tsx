import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function SplashPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 border-b bg-background/80 px-4 backdrop-blur md:px-6">
        <nav className="container flex w-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6" />
            <span className="text-lg font-bold">Gym Tracker</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/gym/exercises"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Exercises
            </Link>
            <Link
              href="/gym/history"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              History
            </Link>
            <Link
              href="/gym/analytics"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Analytics
            </Link>
            <ThemeToggle />
            <Link href="/gym">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex grow flex-col">{children}</main>
    </div>
  );
}
