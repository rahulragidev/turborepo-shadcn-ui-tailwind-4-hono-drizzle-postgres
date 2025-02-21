import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-3xl font-bold">Welcome</h1>

        <div className="flex gap-4">
          <Link
            href="/users"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            View Users
          </Link>
          <Link
            href="/posts"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            View Posts
          </Link>
        </div>
      </main>
    </div>
  );
}
