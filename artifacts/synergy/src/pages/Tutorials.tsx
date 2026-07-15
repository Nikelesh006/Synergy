import { useMemo, useState, type CSSProperties } from "react";
import { tutorialPosts } from "@/data/tutorials";
import {
  ArrowUpRight,
  ArrowRight,
  Bookmark,
  Calendar,
  Play,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Tutorials() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const categories = useMemo(() => {
    const set = new Set<string>(tutorialPosts.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tutorialPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const featured = tutorialPosts[0];
  const rest = filtered.filter((p) => p.id !== featured.id);
  const visibleRest = rest.slice(0, visibleCount);
  const hasMore = rest.length > visibleCount;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero — split landing layout, fills the viewport */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-muted/50 via-background to-muted/30">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(50% 50% at 0% 0%, hsl(var(--primary) / 0.10), transparent 60%), radial-gradient(50% 50% at 100% 100%, hsl(var(--primary) / 0.08), transparent 60%)",
          }}
        />

        <div className="container relative mx-auto grid min-h-[calc(100vh-6rem)] grid-cols-1 items-center gap-8 px-4 pt-4 pb-8 lg:grid-cols-12 lg:gap-10 lg:pt-6 lg:pb-10">
          {/* Left: copy + search (centered within hero viewport) */}
          <div className="flex flex-col items-center text-center lg:col-span-6">
            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Hands-on{" "}
              <span className="text-blue-600">Tutorials & Guides</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Step-by-step projects, how-tos, and deep dives on embedded
              systems, IoT, robotics, and AI.
            </p>

            {/* Search */}
            <div className="mt-6 w-full max-w-lg">
              <div className="relative">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  placeholder="Search tutorials, projects…"
                  className="h-14 rounded-full border-border/80 bg-background pl-14 pr-5 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
                  style={
                    {
                      "--ring": "hsl(var(--foreground) / 0.3)",
                    } as CSSProperties
                  }
                />
              </div>
            </div>
          </div>

          {/* Right: featured preview card */}
          {featured && (
            <div className="lg:col-span-6">
              <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                <a
                  href={featured.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[16/9] overflow-hidden"
                  aria-label={featured.title}
                >
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 fill-white" />
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="absolute left-4 top-4 rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur"
                  >
                    {featured.category}
                  </Badge>
                </a>

                <div className="p-4 sm:p-5">
                  <h2 className="text-balance text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
                    <a
                      href={featured.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-blue-600"
                    >
                      {featured.title}
                    </a>
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {featured.excerpt}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(featured.date)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      asChild
                      className="h-9 rounded-full px-4 bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
                    >
                      <a
                        href={featured.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch tutorial
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full"
                      aria-label="Save for later"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-12">
        {/* Category filter pills */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <Button
                key={cat}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={cn(
                  "h-9 rounded-full px-4 text-sm font-medium transition-all",
                  !isActive &&
                    "border-border/70 text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </Button>
            );
          })}
        </div>

        {/* Tutorial grid */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                {activeCategory === "All" ? "Latest tutorials" : activeCategory}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {filtered.length === 0
                  ? "No matching tutorials yet — try a different search or category."
                  : `${filtered.length} ${filtered.length === 1 ? "tutorial" : "tutorials"} curated for you`}
              </p>
            </div>
            {(query || activeCategory !== "All") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          {visibleRest.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/80 bg-muted/30 px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-foreground">
                Nothing here yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Try a different category or clear your search to see all
                tutorials.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5 rounded-full"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {visibleRest.map((post) => (
                <div
                  key={post.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg"
                >
                  <a
                    href={post.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-[4/3] sm:aspect-[16/10] overflow-hidden"
                    aria-label={post.title}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
                    {/* Play button — smaller on mobile, full size on larger screens */}
                    <div className="flex absolute inset-0 items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-white" />
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="hidden sm:inline-flex absolute left-4 top-4 rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur"
                    >
                      {post.category}
                    </Badge>
                  </a>

                  <div className="flex flex-1 flex-col p-3 sm:p-5">
                    <h3 className="text-balance text-xs font-semibold leading-snug text-foreground sm:text-base sm:text-lg line-clamp-2">
                      <a
                        href={post.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-blue-600"
                      >
                        {post.title}
                      </a>
                    </h3>
                    {/* Hide excerpt, date, footer actions on small mobile */}
                    <p className="hidden sm:block mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>

                    <div className="hidden sm:flex mt-4 items-center gap-4 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.date)}
                      </span>
                    </div>

                    <div className="hidden sm:flex mt-4 items-center justify-between border-t border-border/60 pt-3">
                      <a
                        href={post.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-blue-600"
                      >
                        Watch tutorial
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        aria-label="Save tutorial"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-6"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Load more tutorials
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
