import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { logout, useSession } from "@/lib/admin-api";

export function AdminHeader() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { data } = useSession();

  async function handleLogout() {
    await logout();
    await queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
    navigate("/admin/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border" style={{ background: "#1E3F72" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="flex items-center gap-3"
          data-testid="admin-logo"
        >
          <img src="/quantz-logo-white-text.png" alt="Quantz Financial Services" className="h-10 w-auto" />
          <span className="hidden text-sm font-medium text-white/80 sm:inline">Content Studio</span>
        </button>
        <div className="flex items-center gap-4">
          {data?.user && (
            <span className="hidden text-sm text-white/80 md:inline" data-testid="admin-user-email">
              {data.user.email}
            </span>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            data-testid="button-logout"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
