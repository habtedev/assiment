"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch for SSR
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 px-0 sm:w-auto sm:px-3" disabled>
        <Globe className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" className="gap-2 h-9 px-3 outline-none">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <span className="hidden sm:inline-block text-sm font-medium">
        English
      </span>
    </Button>
  );
}