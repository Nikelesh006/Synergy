import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Filter, ChevronDown } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

const developmentBoardFilters = [
  {
    name: "IOT Development Boards",
    category: "IoT",
    productCount: 20,
    subcategories: [{ name: "ESP32 (Rex32)", value: "ESP32 (Rex32)" }],
  },
  {
    name: "AI Development Boards",
    category: "AI",
    productCount: 10,
    subcategories: [{ name: "ESP32 AI (Rex32 AI)", value: "ESP32 (Rex32 AI)" }],
  },
  {
    name: "Embedded Systems Development Boards",
    category: "Embedded Systems Boards",
    productCount: 30,
    subcategories: [{ name: "Arduino", value: "Arduino development" }],
  },
  {
    name: "Robotics Development Boards",
    category: "Robotics",
    productCount: 25,
    subcategories: [
      { name: "ESP32 servo drivers", value: "ESP32 servo drivers" },
      { name: "ESP32 DC drivers", value: "ESP32 DC drivers" },
      { name: "ESP32 stepper drivers", value: "ESP32 stepper drivers" },
    ],
  },
];

export default function Shop() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const selectedFilters = developmentBoardFilters.filter((filter) =>
    selectedCategories.includes(filter.category)
  );

  const selectedSubcategoryFilters = developmentBoardFilters.flatMap((filter) =>
    filter.subcategories.filter((subcategory) => selectedSubcategories.includes(subcategory.value))
  );

  const visibleProducts = useMemo(() => {
    let filteredProducts = products;

    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => selectedCategories.includes(product.category));
    }

    if (selectedSubcategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => selectedSubcategories.includes(product.subcategory));
    }

    return filteredProducts;
  }, [selectedCategories, selectedSubcategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) => {
      if (!current.includes(category)) return [...current, category];

      const subcategoryValues = developmentBoardFilters
        .find((filter) => filter.category === category)
        ?.subcategories.map((subcategory) => subcategory.value) ?? [];

      setSelectedSubcategories((currentSubcategories) =>
        currentSubcategories.filter((subcategory) => !subcategoryValues.includes(subcategory))
      );

      return current.filter((selectedCategory) => selectedCategory !== category);
    });
  };

  const removeCategory = (category: string) => {
    const subcategoryValues = developmentBoardFilters
      .find((filter) => filter.category === category)
      ?.subcategories.map((subcategory) => subcategory.value) ?? [];

    setSelectedCategories((current) => current.filter((selectedCategory) => selectedCategory !== category));
    setSelectedSubcategories((current) =>
      current.filter((subcategory) => !subcategoryValues.includes(subcategory))
    );
  };

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories((current) =>
      current.includes(subcategory)
        ? current.filter((selectedSubcategory) => selectedSubcategory !== subcategory)
        : [...current, subcategory]
    );
  };

  const removeSubcategory = (subcategory: string) => {
    setSelectedSubcategories((current) =>
      current.filter((selectedSubcategory) => selectedSubcategory !== subcategory)
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">All Products</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">Showing {visibleProducts.length} of {products.length} products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-md p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <Filter className="h-5 w-5 text-gray-700" />
                <h2 className="font-bold text-gray-900">Filters</h2>
              </div>

              {/* Development Boards Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-900 mb-3 flex justify-between items-center">
                  Development Boards <ChevronDown className="h-4 w-4 text-gray-400" />
                </h3>
                <ul className="space-y-2">
                  {developmentBoardFilters.map((filter) => (
                    <li key={filter.category}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-sm py-1 text-sm text-gray-600 transition-colors hover:text-blue-600">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(filter.category)}
                          onChange={() => toggleCategory(filter.category)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{filter.name}</span>
                        <span className="ml-auto text-xs text-gray-400">({filter.productCount})</span>
                      </label>
                      {selectedCategories.includes(filter.category) && (
                        <div className="ml-6 mt-2 rounded-md border border-gray-100 bg-gray-50 p-2">
                          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase text-gray-500">
                            Sub Category
                            <ChevronDown className="h-3.5 w-3.5" />
                          </div>
                          <ul className="space-y-1.5">
                            {filter.subcategories.map((subcategory) => (
                              <li key={subcategory.value}>
                                <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600 transition-colors hover:text-blue-600">
                                  <input
                                    type="checkbox"
                                    checked={selectedSubcategories.includes(subcategory.value)}
                                    onChange={() => toggleSubcategory(subcategory.value)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span>{subcategory.name}</span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white border border-gray-200 rounded-md p-3 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {selectedFilters.length > 0 ? (
                  <>
                    {selectedFilters.map((filter) => (
                      <span key={filter.category} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {filter.name}
                        <button
                          type="button"
                          onClick={() => removeCategory(filter.category)}
                          className="ml-1.5 hover:text-blue-900"
                          aria-label={`Remove ${filter.name} filter`}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    {selectedSubcategoryFilters.map((filter) => (
                      <span key={filter.value} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        {filter.name}
                        <button
                          type="button"
                          onClick={() => removeSubcategory(filter.value)}
                          className="ml-1.5 hover:text-emerald-900"
                          aria-label={`Remove ${filter.name} filter`}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedSubcategories([]);
                      }}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Clear All
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-gray-600">Showing {visibleProducts.length} products</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sort by:</span>
                <select className="border-gray-300 rounded text-sm py-1.5 focus:ring-blue-500 focus:border-blue-500">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                  <option>Bestselling</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 mb-8">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center">
              <nav className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>&lt;</Button>
                <Button variant="outline" className="h-8 w-8 bg-blue-50 text-blue-600 border-blue-200">1</Button>
                <Button variant="outline" className="h-8 w-8">2</Button>
                <Button variant="outline" className="h-8 w-8">3</Button>
                <span className="px-2 text-gray-400">...</span>
                <Button variant="outline" className="h-8 w-8">12</Button>
                <Button variant="outline" size="icon" className="h-8 w-8">&gt;</Button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
