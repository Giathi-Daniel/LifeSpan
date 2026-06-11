"use client";

import { useMemo, useState } from "react";

type ShareActionsProps = {
  path: string;
  disabled?: boolean;
};

type ShareState = "idle" | "copying" | "copied" | "error";

export function ShareActions({ path, disabled = false }: ShareActionsProps) {
  const [shareState, setShareState] = useState<ShareState>("idle");
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return path;
    }

    return new URL(path, window.location.origin).toString();
  }, [path]);

  async function handleShare() {
    if (disabled) {
      return;
    }

    setShareState("copying");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "LifeSpan",
          text: "Know Your Time with this LifeSpan age snapshot.",
          url: shareUrl,
        });
        setShareState("copied");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareState("copied");
    } catch {
      setShareState("error");
    }
  }

  return (
    <section
      aria-labelledby="share-actions-heading"
      className="share-actions-panel rounded-md border border-white/12 bg-[#05080c] p-4 shadow-[0_0_28px_rgba(47,125,246,0.08)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs text-white/42">
            lifespan share --public-url
          </p>
          <h3
            className="mt-3 text-lg font-semibold text-white"
            id="share-actions-heading"
          >
            Share this age page
          </h3>
          <p className="mt-2 break-all font-mono text-sm text-white/58">
            {disabled ? "Select a valid date to create a share URL." : shareUrl}
          </p>
        </div>
        <button
          className="h-12 rounded-sm bg-[#2f7df6] px-5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#5a98ff] disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/42"
          disabled={disabled || shareState === "copying"}
          onClick={handleShare}
          type="button"
        >
          {shareState === "copying" ? "Sharing..." : "Share"}
        </button>
      </div>
      {shareState === "copied" ? (
        <p className="mt-3 font-mono text-sm text-emerald-glow">
          Share link ready.
        </p>
      ) : null}
      {shareState === "error" ? (
        <p className="mt-3 font-mono text-sm text-[#d86a9f]">
          Unable to share. Copy the URL manually.
        </p>
      ) : null}
    </section>
  );
}
