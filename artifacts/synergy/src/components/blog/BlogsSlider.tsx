import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

interface Blog {
  id: number;
  topic: string;
  readTime: string;
  image: string;
}

const BLOGS: Blog[] = [
  {
    id: 1,
    topic: "The Future of Edge AI in Industrial Automation",
    readTime: "2 min read",
    image: "https://placehold.co/600x450/0f172a/ffffff?text=Edge+AI",
  },
  {
    id: 2,
    topic: "Getting Started with ROS 2 for Mobile Robots",
    readTime: "2 min read",
    image: "https://placehold.co/600x450/1e293b/ffffff?text=ROS+2",
  },
  {
    id: 3,
    topic: "Designing Low-Power IoT Devices That Last Years",
    readTime: "2 min read",
    image: "https://placehold.co/600x450/0f172a/ffffff?text=Low+Power+IoT",
  },
  {
    id: 4,
    topic: "Choosing the Right MCU for Your Embedded Project",
    readTime: "2 min read",
    image: "https://placehold.co/600x450/1e293b/ffffff?text=MCU+Guide",
  },
];

const AUTOPLAY_MS = 3500;
const TRANSITION_MS = 700;

export default function BlogsSlider() {
  // To make a seamless loop with `perView` visible cards, we only need to
  // duplicate the first `perView` items onto the end. When the track reaches
  // index = BLOGS.length, the viewport is showing the duplicated leading
  // cards (which are pixel-identical to position 0), so we can snap back to
  // 0 with no visible jump.
  const [perView, setPerView] = useState(4);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<Blog[]>([]);
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

  // Rebuild the rendered slides list whenever the visible-card count
  // changes. Duplicating only the first `perView` items is what makes the
  // loop seamless: at index = BLOGS.length the visible window is showing
  // exactly those duplicates, which look identical to position 0.
  useEffect(() => {
    slidesRef.current = [...BLOGS, ...BLOGS.slice(0, perView)];
  }, [perView]);

  // Autoplay — advances one card at a time, pauses on hover.
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= BLOGS.length) {
          // We've reached the original-count position. The viewport is
          // currently showing the duplicate leading cards (which match
          // position 0 pixel-for-pixel). Wait for the smooth transition
          // to finish, then imperatively snap back to 0 with the CSS
          // transition disabled — the snap is invisible because the
          // pre- and post-snap frames render the same content.
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
          return BLOGS.length;
        }
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused]);

  const translatePct = (index * 100) / perView;

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
        {slidesRef.current.map((blog, i) => (
          <div
            key={`${blog.id}-${i}`}
            className="shrink-0 px-1.5 sm:px-3"
            style={{ width: `${100 / perView}%` }}
          >
            <Link
              href="/blog"
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl"
              aria-label={`Read: ${blog.topic}`}
            >
              {/* Cover — compact square on mobile, normal on larger screens */}
              <div className="relative w-full aspect-square sm:aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
                <img
                  src={blog.image}
                  alt={blog.topic}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Topic — only title on mobile, separated editorial typography on larger screens */}
              <div className="mt-2 sm:mt-5 px-1">
                {/* Hide read-time on mobile, show on larger screens */}
                <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  <span className="h-px w-5 bg-slate-300" />
                  <span>{blog.readTime}</span>
                </div>
                <h3 className="mt-0 sm:mt-3 text-[11px] sm:text-base md:text-lg font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600 line-clamp-2">
                  {blog.topic}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
