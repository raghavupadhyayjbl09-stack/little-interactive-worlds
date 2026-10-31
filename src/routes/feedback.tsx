import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquareHeart } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-context";
import { pick } from "@/lib/i18n";
import { PageHeader, DemoTag } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback – JanSathi AI" },
      { name: "description", content: "Report a problem, suggest an improvement or tell us what worked well." },
      { property: "og:title", content: "Feedback – JanSathi AI" },
      { property: "og:description", content: "Help make JanSathi AI simpler and more useful for everyone." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Feedback,
});

const topics = ["Something is wrong", "Translation quality", "Suggestion", "Compliment"];

function Feedback() {
  const { lang } = useApp();
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHeader title="Feedback" subtitle="Found a mistake? A translation that reads oddly? Tell us — every report is reviewed." icon={<MessageSquareHeart className="h-6 w-6" />} />
      <div className="container-page max-w-2xl py-8">
        <DemoTag className="mb-4" />
        <div className="card-surface space-y-5 p-6">
          <div>
            <p className="mb-2 text-sm font-semibold">What is this about?</p>
            <div className="flex flex-wrap gap-2">
              {topics.map((tp) => (
                <button
                  key={tp}
                  onClick={() => setTopic(tp)}
                  className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition-colors", topic === tp ? "border-primary bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary")}
                >
                  {tp}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">How useful is JanSathi AI overall?</p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  aria-label={`${n} of 5`}
                  className={cn("h-9 w-9 rounded-lg border text-sm font-bold", n <= rating ? "border-primary bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary")}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Your message</p>
            <Textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what happened and where — e.g. a scheme detail, a page, or a translation." />
          </div>
          <Button
            onClick={() => {
              setSent(true);
              toast.success("Thank you! Your feedback was recorded (demo only — nothing is sent).");
            }}
            disabled={sent || message.trim().length < 5}
          >
            {sent ? "Sent ✓" : "Send feedback"}
          </Button>
          <p className="text-xs text-muted-foreground">
            In this demo build feedback stays in your browser. Related: <Link to="/schemes" className="text-primary hover:underline">{pick({ en: "explore schemes", hi: "योजनाएँ देखें", bn: "প্রকল্প দেখুন" }, lang)}</Link>
          </p>
        </div>
      </div>
    </>
  );
}
