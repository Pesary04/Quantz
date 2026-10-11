import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      theme?: "light" | "dark" | "auto";
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("Failed to load Turnstile"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export const TURNSTILE_SITE_KEY = import.meta.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string | undefined;

export type TurnstileHandle = { reset: () => void };

export const TurnstileWidget = forwardRef<TurnstileHandle, { onToken: (token: string) => void }>(
  function TurnstileWidget({ onToken }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const onTokenRef = useRef(onToken);
    onTokenRef.current = onToken;
    const [failed, setFailed] = useState(!TURNSTILE_SITE_KEY);

    useImperativeHandle(ref, () => ({
      reset: () => {
        onTokenRef.current("");
        setFailed(false);
        if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
      },
    }));

    useEffect(() => {
      if (!TURNSTILE_SITE_KEY) {
        console.error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set; the security check cannot load.");
        return;
      }
      let cancelled = false;
      loadTurnstile()
        .then(() => {
          if (cancelled || !containerRef.current || !window.turnstile) return;
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            theme: "light",
            callback: (token) => onTokenRef.current(token),
            "expired-callback": () => onTokenRef.current(""),
            "error-callback": () => {
              onTokenRef.current("");
              setFailed(true);
            },
          });
        })
        .catch((err) => {
          console.error(err);
          setFailed(true);
        });
      return () => {
        cancelled = true;
        if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      };
    }, []);

    return (
      <div className="flex flex-col items-center gap-2">
        <div ref={containerRef} className="flex justify-center min-h-[65px]" data-testid="turnstile-widget" />
        {failed && (
          <p role="alert" className="text-sm text-destructive text-center">
            The security check could not load. Please refresh the page or contact us directly.
          </p>
        )}
      </div>
    );
  },
);
