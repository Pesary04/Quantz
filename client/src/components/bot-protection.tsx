import { useCallback, useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";

async function fetchFormToken(): Promise<string> {
  const res = await fetch("/api/form-token", { cache: "no-store" });
  if (!res.ok) throw new Error("form-token");
  return ((await res.json()) as { token: string }).token;
}

/**
 * Invisible spam protection for a public form: a hidden honeypot plus a
 * server-signed form token. Spread `fields` into the request body and call
 * `reset()` after every response because tokens are single-use.
 */
export function useBotProtection() {
  const [honeypot, setHoneypot] = useState("");
  const { data: formToken = "", refetch } = useQuery({
    queryKey: ["/api/form-token", useId()],
    queryFn: fetchFormToken,
    staleTime: 60 * 60 * 1000,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
  const reset = useCallback(() => void refetch(), [refetch]);

  return {
    reset,
    fields: { company: honeypot, formToken },
    honeypotProps: { value: honeypot, onChange: setHoneypot },
  };
}

export function HoneypotField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const id = useId();
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
      <label htmlFor={id}>Company</label>
      <input
        id={id}
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
