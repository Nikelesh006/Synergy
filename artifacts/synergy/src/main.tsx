import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Enforce draggable = false for all images throughout the site
if (typeof window !== "undefined") {
  const disableImageDrag = () => {
    document.querySelectorAll("img").forEach((img) => {
      if (img.getAttribute("draggable") !== "false") {
        img.setAttribute("draggable", "false");
        img.draggable = false;
      }
    });
  };

  // Run on initial load and DOM ready
  disableImageDrag();
  if (document.readyState !== "loading") {
    disableImageDrag();
  } else {
    document.addEventListener("DOMContentLoaded", disableImageDrag);
  }

  // Observe dynamically added images (e.g. route transitions, product lists, carousels)
  const observer = new MutationObserver(() => {
    disableImageDrag();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Capture phase dragstart blocker: prevents ghost drag outline anywhere on images
  window.addEventListener(
    "dragstart",
    (e) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "IMG" || target.closest("img"))) {
        e.preventDefault();
        return;
      }
    },
    { capture: true }
  );
}

createRoot(document.getElementById("root")!).render(<App />);
