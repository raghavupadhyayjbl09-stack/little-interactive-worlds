import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { getScheme, SCHEMES } from "@/data/schemes";
import { useApp } from "@/lib/app-context";
import { PageHeader, EmptyState, DemoTag } from "@/components/shared";
import { SchemeCard } from "@/components/SchemeCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Schemes – JanSathi AI" },
      { name: "description", content: "The government schemes you bookmarked, saved right here in your browser." },
      { property: "og:title", content: "Saved Schemes – JanSathi AI" },
      { property: "og:description", content: "Your bookmarked government schemes, stored privately in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Saved,
});

function Saved() {
  const { t, saved } = useApp();
  const items = saved.map(getScheme).filter((s): s is (typeof SCHEMES)[number] => !!s);

  return (
    <>
      <PageHeader
        title={t("nav.saved")}
        subtitle="Schemes you bookmarked — stored only in this browser, nothing is sent anywhere."
        icon={<Bookmark className="h-6 w-6" />}
      />
      <div className="container-page py-8">
        <DemoTag className="mb-4" />
        {items.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="h-10 w-10" />}
            title={t("saved.emptyTitle")}
            text={t("saved.emptyText")}
            action={
              <Button asChild>
                <Link to="/schemes">{t("nav.schemes")}</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s) => (
              <SchemeCard key={s.id} s={s} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
