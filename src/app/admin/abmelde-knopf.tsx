"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { meldeAb } from "./actions";

export function AbmeldeKnopf() {
  return (
    <form action={meldeAb}>
      <Button
        type="submit"
        variant="outline"
        className="h-10 rounded-full px-5 text-sm font-semibold"
      >
        <LogOut className="mr-1.5 size-4" aria-hidden="true" />
        Abmelden
      </Button>
    </form>
  );
}
