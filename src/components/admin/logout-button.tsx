"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    if (!isSupabaseConfigured) return;
    const supabase = createClientSupabaseClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className={cn(className)}
    >
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  );
}
