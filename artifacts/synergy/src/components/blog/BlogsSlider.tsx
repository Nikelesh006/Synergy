import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useBlogPosts } from "@/hooks/useBlog";

const AUTOPLAY_MS = 3500;
const TRANSITION_MS = 700;

export default function BlogsSlider() {
  const { data: blogPosts, isLoading } = useBlogPosts();
  const blogs = blogPosts && blogPosts.length > 0 ? blogPosts : [];

  const [perView, setPerView] = useState(4);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Responsive: how many cards are visible at once
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) setPerView(2);
      else if (w < 1024) setPerView(2);
      else if (w < 1280) setPerView(3);
      else setPerView(4);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const shouldSlide = blogs.length > perView;

  // Reset index if visible count or blogs count changes
  useEffect(() => {
    setIndex(0);
  }, [blogs.length, perView]);

  // Seamless loop slides: duplicate leading `perView` items when sliding
  const slides = shouldSlide ? [...blogs, ...blogs.slice(0, perView)] : blogs;

  // Autoplay — advances one card at a time, pauses on hover.
  useEffect(() => {
    if (paused || !shouldSlide || blogs.length === 0) return;
    const t = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= blogs.length) {
          setTimeout(() => {
            const el = trackRef.current;
            if (el) {
              el.style.transition = "none";
              setIndex(0);
              // Force a reflow so the snap commits without animating.
              void el.offsetWidth;
              el.style.transition = "";
            }
          }, TRANSITION_MS);
          return blogs.length;
        }
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, shouldSlide, blogs.length]);

  if (isLoading) {
    return (
      <div className="relative overflow-hidden">
        <div className="flex">
          {Array.from({ length: perView }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 px-1.5 sm:px-3 animate-pulse"
              style={{ width: `${100 / perView}%` }}
            >
              <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="mt-2 sm:mt-5 px-1 space-y-2">
                <div className="hidden sm:block h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  const translatePct = shouldSlide ? (index * 100) / perView : 0;

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${translatePct}%)` }}
      >
        {slides.map((blog, i) => (
          <div
            key={`${blog._id || blog.slug || i}-${i}`}
            className="shrink-0 px-1.5 sm:px-3"
            style={{ width: `${100 / perView}%` }}
          >
            <Link
              href={blog.slug ? `/blog/${blog.slug}` : "/blogs"}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl"
              aria-label={`Read: ${blog.title}`}
            >
              {/* Cover — compact square on mobile, normal on larger screens */}
              <div className="relative w-full aspect-square sm:aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
                <img
                  src={blog.coverImage || "https://placehold.co/600x450/0f172a/ffffff?text=Synergy+Blog"}
                  alt={blog.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://placehold.co/600x450/0f172a/ffffff?text=Synergy+Blog";
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Topic — only title on mobile, separated editorial typography on larger screens */}
              <div className="mt-2 sm:mt-5 px-1">
                {/* Hide read-time on mobile, show on larger screens */}
                <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  <span className="h-px w-5 bg-slate-300" />
                  <span>{blog.readTime || "2 min read"}</span>
                </div>
                <h3 className="mt-0 sm:mt-3 text-[11px] sm:text-base md:text-lg font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600 line-clamp-2">
                  {blog.title}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
