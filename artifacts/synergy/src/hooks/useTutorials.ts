import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";

export interface TutorialPost {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  channelName: string;
  instructor: string;
  category: string;
  level: string;
  status: string;
  duration: string;
  publishDate: string;
  tags: string[];
  resourcesUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const defaultTutorials: TutorialPost[] = [
  {
    _id: "tut-rex32",
    id: "tut-rex32",
    title: "Interfacing Sensors with REX32 Robotics Core",
    slug: "interfacing-sensors-rex32-robotics-core",
    youtubeUrl: "https://www.youtube.com/watch?v=s5Q8hM5H89A",
    thumbnailUrl: "https://placehold.co/800x400/0f172a/38bdf8?text=REX32+Robotics+Core+Sensors",
    channelName: "Synergy Robotics Lab",
    instructor: "Synergy Embedded Systems",
    category: "Sensors",
    level: "Intermediate",
    status: "Published",
    duration: "14:20",
    publishDate: "2024-06-01",
    shortDescription: "REX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB.",
    description: "In this tutorial, you will learn how to interface sensors and control high-power loads using the REX32 Robotics Core development board.\n\nREX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB.\n\nTopics covered:\n- Hardware architecture and power distribution\n- Interfacing I2C and analog sensors with the REX32 development board\n- Motor driver configuration and PWM speed control\n- AC load control and circuit protection\n- Wireless telemetry via WiFi & Bluetooth",
    tags: ["REX32", "Robotics Core", "Sensors", "Development Board", "Motor Drivers"],
    resourcesUrl: "https://github.com/synergy/rex32-robotics-core-guide",
    metaTitle: "Interfacing Sensors with REX32 Robotics Core",
    metaDescription: "REX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB.",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "tut-jetson",
    id: "tut-jetson",
    title: "Building Your First Image Classifier on Jetson Nano",
    slug: "first-image-classifier-jetson-nano",
    youtubeUrl: "https://www.youtube.com/watch?v=v-xQd_T6H1o",
    thumbnailUrl: "https://placehold.co/800x400/eeeeee/333333?text=Jetson+Nano+AI",
    channelName: "AI Engineer",
    instructor: "AI Engineer",
    category: "AI",
    level: "Intermediate",
    status: "Published",
    duration: "15:00",
    publishDate: "2024-05-15",
    shortDescription: "A step-by-step guide to setting up your NVIDIA Jetson Nano and training a simple image classifier model using PyTorch.",
    description: "Learn how to set up your NVIDIA Jetson Nano, install PyTorch, prepare a custom dataset, and train an image classification model to detect objects on the edge.",
    tags: ["Jetson Nano", "AI", "PyTorch", "Image Classification"],
    resourcesUrl: "https://github.com/example/jetson-nano-classifier",
    metaTitle: "Building Your First Image Classifier on Jetson Nano",
    metaDescription: "Set up Jetson Nano and train an image classifier model using PyTorch.",
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "tut-lvdt",
    id: "tut-lvdt",
    title: "Interfacing LVDT with Arduino Mega",
    slug: "interfacing-lvdt-arduino-mega",
    youtubeUrl: "https://www.youtube.com/watch?v=LMp-0HAuI68",
    thumbnailUrl: "https://placehold.co/800x400/eeeeee/333333?text=Arduino+LVDT",
    channelName: "Instrumentation Specialist",
    instructor: "Instrumentation Specialist",
    category: "Robotics",
    level: "Advanced",
    status: "Published",
    duration: "12:00",
    publishDate: "2024-05-02",
    shortDescription: "Learn how to read displacement values from a Linear Variable Differential Transformer (LVDT) using an Arduino Mega.",
    description: "This deep dive tutorial covers Linear Variable Differential Transformers (LVDT), their wiring configuration with signal conditioning modules, and programming Arduino Mega to read high-precision displacement inputs.",
    tags: ["LVDT", "Arduino Mega", "Sensors"],
    resourcesUrl: "https://github.com/example/arduino-mega-lvdt",
    metaTitle: "Interfacing LVDT with Arduino Mega",
    metaDescription: "Learn to read displacement values from an LVDT sensor using Arduino Mega.",
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

function sanitizeTutorial(t: TutorialPost): TutorialPost {
  if (t.youtubeUrl?.includes("dQw4w9Wg") || t.title?.includes("ESP32 and WiFi")) {
    return {
      ...t,
      title: t.title?.includes("ESP32") ? "Interfacing Sensors with REX32 Robotics Core" : t.title,
      slug: t.slug?.includes("esp32") ? "interfacing-sensors-rex32-robotics-core" : t.slug,
      youtubeUrl: "https://www.youtube.com/watch?v=s5Q8hM5H89A",
      thumbnailUrl: (!t.thumbnailUrl || t.thumbnailUrl.includes("placehold.co") || t.thumbnailUrl.includes("ESP32"))
        ? "https://placehold.co/800x400/0f172a/38bdf8?text=REX32+Robotics+Core+Sensors"
        : t.thumbnailUrl,
      shortDescription: t.title?.includes("ESP32")
        ? "REX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB."
        : t.shortDescription,
      category: t.title?.includes("ESP32") ? "Sensors" : t.category,
    };
  }
  return t;
}

export function useTutorials(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["tutorials", params],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams(params || {});
        const queryString = searchParams.toString();
        const res = await fetchApi<TutorialPost[]>(
          queryString ? `/tutorials?${queryString}` : "/tutorials"
        );
        if (Array.isArray(res) && res.length > 0) {
          return res.map(sanitizeTutorial);
        }
        return defaultTutorials;
      } catch (err) {
        console.warn("API tutorials failed to load, using default tutorials:", err);
        return defaultTutorials;
      }
    },
  });
}

export function useTutorial(slug: string) {
  return useQuery({
    queryKey: ["tutorial", slug],
    queryFn: async () => {
      try {
        const res = await fetchApi<TutorialPost>(`/tutorials/${slug}`);
        if (res) return sanitizeTutorial(res);
      } catch (err) {
        console.warn("API tutorial failed to load by slug, checking defaults:", err);
      }
      const match = defaultTutorials.find(t => t.slug === slug || t._id === slug || t.id === slug);
      if (match) return match;
      throw new Error("Tutorial not found");
    },
    enabled: !!slug,
  });
}
