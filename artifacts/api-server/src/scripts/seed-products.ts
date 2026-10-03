import mongoose from 'mongoose';
import { Product } from '../models/Product.js';

const mockProducts = [
  {
    name: "ESP32 (Rex32)",
    slug: "esp32-rex32",
    sku: "DEV-ESP32-REX",
    brand: "Espressif",
    category: "IoT",
    subcategory: "ESP32 (Rex32)",
    shortDescription: "Versatile ESP32 development board (Rex32) with WiFi and Bluetooth.",
    description: "The ESP32 Rex32 is a low-cost, low-power system on a chip microcontroller with integrated Wi-Fi and dual-mode Bluetooth. Ideal for modern IoT applications.",
    specifications: {
      "Processor": "Dual-core Xtensa 32-bit LX6",
      "Connectivity": "Wi-Fi, Bluetooth BLE",
      "Operating Voltage": "3.3V"
    },
    features: ["Low Power", "High Performance", "Versatile"],
    applications: ["Smart Home", "IoT", "Robotics"],
    images: ["https://placehold.co/600x600/eeeeee/333333?text=ESP32+(Rex32)"],
    price: 450,
    compareAtPrice: 550,
    currency: "INR",
    stock: 145,
    inStock: true,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 124,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    warrantyInfo: "1 Year Manufacturer Warranty",
    shippingInfo: "Ships within 24 hours. Eligible for prime delivery."
  },
  {
    name: "ESP32 AI Development Board (REX32 AI)",
    slug: "esp32-ai-rex32-ai",
    sku: "DEV-ESP32-AI",
    brand: "Espressif",
    category: "AI",
    subcategory: "ESP32 (Rex32 AI)",
    shortDescription: "Advanced ESP32 board tailored for Edge AI and computer vision.",
    description: "The REX32 AI is designed specifically for Edge AI computing, allowing you to run lightweight machine learning models and neural networks directly on the edge.",
    specifications: {
      "Processor": "Dual-core Xtensa LX7",
      "AI Accelerator": "Included",
      "Memory": "8MB PSRAM"
    },
    features: ["Edge AI Support", "Camera Interface", "Microphone Array"],
    applications: ["Voice Recognition", "Face Detection", "Smart Cameras"],
    images: ["https://placehold.co/600x600/eeeeee/333333?text=REX32+AI"],
    price: 1250,
    compareAtPrice: 1500,
    currency: "INR",
    stock: 52,
    inStock: true,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 89,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    warrantyInfo: "1 Year Manufacturer Warranty",
    shippingInfo: "Ships within 24-48 hours."
  },
  {
    name: "Arduino Development Board",
    slug: "arduino-development-board",
    sku: "DEV-ARD-UNO",
    brand: "Arduino",
    category: "Embedded Systems Boards",
    subcategory: "Arduino development",
    shortDescription: "Classic Arduino development board for beginners and pros.",
    description: "The Arduino development board is the perfect starting point for your electronics projects, offering easy-to-use hardware and software.",
    specifications: {
      "Microcontroller": "ATmega328P",
      "Operating Voltage": "5V",
      "Digital I/O Pins": "14"
    },
    features: ["Easy to Program", "Huge Community Support", "Plug and Play"],
    applications: ["Prototyping", "Education", "DIY Electronics"],
    images: ["https://placehold.co/600x600/eeeeee/333333?text=Arduino+Board"],
    price: 850,
    currency: "INR",
    stock: 300,
    inStock: true,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 412,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    warrantyInfo: "1 Year Manufacturer Warranty",
    shippingInfo: "Standard shipping applies."
  },
  {
    name: "ESP32 Servo Driver",
    slug: "esp32-servo-driver",
    sku: "DRV-ESP32-SRV",
    brand: "Synergy Tech Labs",
    category: "Robotics",
    subcategory: "ESP32 servo drivers",
    shortDescription: "Multi-channel servo driver shield for ESP32.",
    description: "Control multiple servo motors effortlessly with the ESP32 Servo Driver. Perfect for robotic arms, hexapods, and other complex animatronics.",
    specifications: {
      "Channels": "16",
      "Interface": "I2C",
      "Voltage Range": "5V - 6V"
    },
    features: ["Daisy-chainable", "High Precision", "Built-in Oscillator"],
    applications: ["Robotics", "RC Vehicles", "Animatronics"],
    images: ["https://placehold.co/600x600/eeeeee/333333?text=ESP32+Servo+Driver"],
    price: 650,
    currency: "INR",
    stock: 80,
    inStock: true,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 45,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    warrantyInfo: "6 Months Warranty",
    shippingInfo: "Available for immediate dispatch."
  },
  {
    name: "ESP32 DC Driver",
    slug: "esp32-dc-driver",
    sku: "DRV-ESP32-DC",
    brand: "Synergy Tech Labs",
    category: "Robotics",
    subcategory: "ESP32 DC drivers",
    shortDescription: "High-power dual DC motor driver for ESP32.",
    description: "The ESP32 DC Driver provides robust and reliable control for up to two high-current DC motors. Ideal for smart rovers and mobile robotics.",
    specifications: {
      "Motor Channels": "2",
      "Max Current": "3A per channel",
      "Voltage Range": "6V - 24V"
    },
    features: ["Thermal Protection", "PWM Speed Control", "Direction Indication"],
    applications: ["Mobile Robots", "Conveyor Belts", "Automated Guided Vehicles"],
    images: ["https://placehold.co/600x600/eeeeee/333333?text=ESP32+DC+Driver"],
    price: 780,
    currency: "INR",
    stock: 65,
    inStock: true,
    minOrderQty: 1,
    rating: 4.6,
    reviewCount: 32,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    warrantyInfo: "6 Months Warranty",
    shippingInfo: "Ships within 2-3 business days."
  },
  {
    name: "ESP32 Stepper Driver",
    slug: "esp32-stepper-driver",
    sku: "DRV-ESP32-STP",
    brand: "Synergy Tech Labs",
    category: "Robotics",
    subcategory: "ESP32 stepper drivers",
    shortDescription: "Precision stepper motor driver module for ESP32.",
    description: "Achieve precise positioning and smooth motion control with the ESP32 Stepper Driver. Designed for 3D printers and CNC machines.",
    specifications: {
      "Microstepping": "Up to 1/32",
      "Max Current": "2A per phase",
      "Voltage Range": "8V - 35V"
    },
    features: ["Adjustable Current Limit", "Over-temperature Thermal Shutdown", "Short-to-ground Protection"],
    applications: ["3D Printers", "CNC Routers", "Camera Sliders"],
    images: ["https://placehold.co/600x600/eeeeee/333333?text=ESP32+Stepper+Driver"],
    price: 540,
    currency: "INR",
    stock: 120,
    inStock: true,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 67,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    warrantyInfo: "6 Months Warranty",
    shippingInfo: "Ships immediately."
  }
];

export async function seedProducts() {
  try {
    console.log('Starting to seed products...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const insertedProducts = await Product.insertMany(mockProducts);
    console.log(`Successfully seeded ${insertedProducts.length} products`);
    
    return insertedProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}
