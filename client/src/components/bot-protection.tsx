import { useCallback, useId, useRef, useState } from "react";
import { TurnstileWidget, type TurnstileHandle } from "@/components/turnstile-widget";

export const MISSING_SECURITY_CHECK = "Please complete the security check before submitting.";

/**
 * Honeypot + Cloudflare Turnstile state for a public form. Spread `fields` into
 * the request body; call `reset()` after every response because Turnstile
 * tokens are single-use.
 */
export function useBotProtection() {
  const [honeypot, setHoneypot] = useState("");
  const [token, setToken] = useState("");
  const widgetRef = useRef<TurnstileHandle>(null);
  const reset = useCallback(() => widgetRef.current?.reset(), []);

  return {
    token,
    reset,
    fields: { company: honeypot, turnstileToken: token },
    honeypotProps: { value: honeypot, onChange: setHoneypot },
    widgetProps: { ref: widgetRef, onToken: setToken },
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

export { TurnstileWidget };
