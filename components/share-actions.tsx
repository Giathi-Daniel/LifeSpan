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
    <section className="card-enter rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/30 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Share Results</h3>
          <p className="mt-2 break-all text-sm text-gray-500 dark:text-slate-300">
            {disabled
              ? "Select a valid date to create a share URL."
              : shareUrl}
          </p>
        </div>
        <button
          className="h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 text-sm font-semibold text-white transition-all hover:from-indigo-500 hover:to-indigo-400 hover:scale-105 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-500"
          disabled={disabled || shareState === "copying"}
          onClick={handleShare}
          type="button"
        >
          {shareState === "copying" ? "Sharing..." : "Share"}
        </button>
      </div>
      {shareState === "copied" ? (
        <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
          Share link ready to copy.
        </p>
      ) : null}
      {shareState === "error" ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Unable to share. Copy the URL manually.
        </p>
      ) : null}
    </section>
  );
}