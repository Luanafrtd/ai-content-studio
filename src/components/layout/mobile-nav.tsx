"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/brand/logo";
import { NavLinks } from "@/components/layout/nav-links";
import { UserMenu } from "@/components/layout/user-menu";

export function MobileNav({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col p-0">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle asChild>
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              <Logo />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
        <div className="border-t p-2">
          <UserMenu {...user} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
