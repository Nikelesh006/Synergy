import { BlogPost } from '../types';

export const tutorialPosts: BlogPost[] = [
  {
    id: "tut1",
    title: "Getting Started with ESP32 and WiFi",
    slug: "getting-started-esp32-wifi",
    excerpt: "Learn the basics of connecting your ESP32 to a WiFi network and making basic HTTP requests.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9Wg",
    author: "Embedded Expert",
    date: "2024-06-01",
    category: "IoT Tutorials",
    readTime: "10 min read",
    image: "https://placehold.co/800x400/eeeeee/333333?text=ESP32+WiFi+Tutorial"
  },
  {
    id: "tut2",
    title: "Building Your First Image Classifier on Jetson Nano",
    slug: "first-image-classifier-jetson-nano",
    excerpt: "A step-by-step guide to setting up your NVIDIA Jetson Nano and training a simple image classifier model using PyTorch.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9Wg",
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
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9",
    author: "Instrumentation Specialist",
    date: "2024-05-02",
    category: "Robotics Tutorials",
    readTime: "12 min read",
    image: "https://placehold.co/800x400/eeeeee/333333?text=Arduino+LVDT"
  }
];
