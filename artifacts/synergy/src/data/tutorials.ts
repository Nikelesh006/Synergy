import { BlogPost } from '../types';

export const tutorialPosts: BlogPost[] = [
  {
    id: "tut1",
    title: "Interfacing Sensors with REX32 Robotics Core",
    slug: "interfacing-sensors-rex32-robotics-core",
    excerpt: "REX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB.",
    youtubeUrl: "https://www.youtube.com/watch?v=s5Q8hM5H89A",
    author: "Synergy Embedded Systems",
    date: "2024-06-01",
    category: "Sensors",
    readTime: "14 min read",
    image: "https://placehold.co/800x400/0f172a/38bdf8?text=REX32+Robotics+Core+Sensors"
  },
  {
    id: "tut2",
    title: "Building Your First Image Classifier on Jetson Nano",
    slug: "first-image-classifier-jetson-nano",
    excerpt: "A step-by-step guide to setting up your NVIDIA Jetson Nano and training a simple image classifier model using PyTorch.",
    youtubeUrl: "https://www.youtube.com/watch?v=v-xQd_T6H1o",
    author: "AI Engineer",
    date: "2024-05-15",
    category: "AI Tutorials",
    readTime: "15 min read",
    image: "https://placehold.co/800x400/eeeeee/333333?text=Jetson+Nano+AI"
  },
  {
    id: "tut3",
    title: "Interfacing LVDT with Arduino Mega",
    slug: "interfacing-lvdt-arduino-mega",
    excerpt: "Learn how to read displacement values from a Linear Variable Differential Transformer (LVDT) using an Arduino Mega.",
    youtubeUrl: "https://www.youtube.com/watch?v=LMp-0HAuI68",
    author: "Instrumentation Specialist",
    date: "2024-05-02",
    category: "Robotics Tutorials",
    readTime: "12 min read",
    image: "https://placehold.co/800x400/eeeeee/333333?text=Arduino+LVDT"
  }
];
