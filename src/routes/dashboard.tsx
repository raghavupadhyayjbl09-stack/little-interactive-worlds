import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Bell, ListChecks, MessageCircle, Languages, Upload, LayoutDashboard, ChevronRight } from "lucide-react";
import { NOTIFICATIONS } from "@/data/content";
import { getScheme, SCHEMES } from "@/data/schemes";
import { useApp } from "@/lib/app-context";
import { pick } from "@/lib/i18n";
import { PageHeader, DemoTag } from "@/components/shared";
import { SchemeCard } from "@/components/SchemeCard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard – JanSathi AI" },
      { name: "description", content: "Your saved schemes, upcoming deadlines and quick links to every JanSathi tool." },
      { property: "og:title", content: "My Dashboard – JanSathi AI" },
      { property: "og:description", content: "Track the government schemes you saved and never miss a deadline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { to: "/eligibility" as const, k: "nav.eligibility", icon: ListChecks },
  { to: "/assistant" as const, k: "nav.assistant", icon: MessageCircle },
  { to: "/translate" as const, k: "nav.translate", icon: Languages },
  { to: "/upload" as const, k: "nav.upload", icon: Upload },
];

function Dashboard() {
  const { t, lang, user, saved } = useApp();
  const items = saved.map(getScheme).filter((s): s is (typeof SCHEMES)[number] => !!s);
  const deadlines = items
    .flatMap((s) => s.dates.map((d) => ({ scheme: s, ...d })))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  const latest = NOTIFICATIONS.slice(0, 3);

  return (
    <>
      <PageHeader
        title={user ? `${t("nav.dashboard")} — ${user.name}` : t("nav.dashboard")}
        subtitle="Your saved schemes, upcoming deadlines and quick links, all in one place."
        icon={<LayoutDashboard className="h-6 w-6" />}
      />
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="card-surface p-4">
              <p className="text-3xl font-bold text-navy">{items.length}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Bookmark className="h-4 w-4" />{t("nav.saved")}</p>
            </div>
            <div className="card-surface p-4">
              <p className="text-3xl font-bold text-navy">{deadlines.length}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Bell className="h-4 w-4" />Upcoming deadlines</p>
            </div>
            <div className="card-surface p-4">
              <p className="text-3xl font-bold text-navy">{SCHEMES.length}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><ListChecks className="h-4 w-4" />{t("nav.schemes")}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold">{t("nav.saved")}</h2>
            {items.length === 0 ? (
              <p className="card-surface p-6 text-sm text-muted-foreground">
                Nothing saved yet — <Link to="/schemes" className="text-primary hover:underline">{t("nav.schemes")}</Link> to bookmark a scheme.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((s) => (
                  <SchemeCard key={s.id} s={s} compact />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card-surface p-5">
            <h3 className="font-bold">Quick tools</h3>
            <ul className="mt-2 divide-y">
              {tools.map(({ to, k, icon: Icon }) => (
                <li key={to}>
                  <Link to={to} className="flex items-center justify-between gap-2 py-2.5 text-sm font-medium hover:text-primary">
                    <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary" />{t(k)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-5">
            <h3 className="font-bold">Deadlines from your saved schemes</h3>
            <ul className="mt-2 space-y-2.5">
              {deadlines.map((d) => (
                <li key={`${d.scheme.id}-${d.label}`} className="rounded-lg bg-muted px-3 py-2 text-sm">
                  <p className="font-semibold">{pick(d.scheme.name, lang)}</p>
                  <p className="text-xs text-muted-foreground">{d.label} · {d.date}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-5">
            <h3 className="font-bold">Latest updates</h3>
            <ul className="mt-2 space-y-2.5 text-sm">
              {latest.map((n) => (
                <li key={n.id} className="rounded-lg bg-muted px-3 py-2">
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.date}</p>
                </li>
              ))}
            </ul>
            <Link to="/notifications" className="mt-3 inline-block text-sm text-primary hover:underline">{t("nav.notifications")}</Link>
          </div>
        </aside>
      </div>
      <DemoTag />
    </>
  );
}
