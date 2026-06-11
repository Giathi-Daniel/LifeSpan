export const siteConfig = {
  name: "LifeSpan",
  tagline: "Know Your Time",
  description:
    "Calculate exact age, life progress, birthday countdowns, milestones, and shareable age pages.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lifespan.vercel.app",
};

export function getAbsoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
