import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/admin-api";

/** Gates admin routes: redirects to the login page unless a session is active. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useSession();
  const [, navigate] = useLocation();

  const authenticated = data?.authenticated === true;

  useEffect(() => {
    if (!isLoading && (isError || !authenticated)) {
      navigate("/admin/login");
    }
  }, [isLoading, isError, authenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
