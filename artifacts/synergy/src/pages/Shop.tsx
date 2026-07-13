import { useMemo, useState } from "react";
import { Link } from "wouter";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar, { type FilterGroup } from "@/components/layout/FilterSidebar";
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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]);

  const selectedFilters = developmentBoardFilters.filter((filter) =>
    selectedCategories.includes(filter.category)
  );

  const selectedSubcategoryFilters = developmentBoardFilters.flatMap((filter) =>
    filter.subcategories.filter((subcategory) => selectedSubcategories.includes(subcategory.value))
  );

  // Derive available brands from products so counts are always accurate
  const brandOptions = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      if (!p.brand) return;
      counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([brand, count]) => ({ value: brand, label: brand, count }));
  }, []);

  const toggle = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filterGroups: FilterGroup[] = [
    {
      id: "category",
      title: "Development Boards",
      defaultOpen: true,
      options: developmentBoardFilters.map((f) => ({
        value: f.category,
        label: f.name,
        count: f.productCount,
      })),
    },
    {
      id: "brand",
      title: "Brand",
      defaultOpen: true,
      options: brandOptions,
    },
    {
      id: "price",
      title: "Price",
      defaultOpen: false,
      options: [
        { value: "u500", label: "Under ₹500" },
        { value: "500-1000", label: "₹500 – ₹1,000" },
        { value: "1000-2500", label: "₹1,000 – ₹2,500" },
        { value: "2500-5000", label: "₹2,500 – ₹5,000" },
        { value: "a5000", label: "Over ₹5,000" },
      ],
    },
    {
      id: "availability",
      title: "Availability",
      defaultOpen: false,
      options: [
        { value: "in-stock", label: "In stock" },
        { value: "on-sale", label: "On sale" },
        { value: "new", label: "New arrivals" },
        { value: "bestseller", label: "Bestsellers" },
      ],
    },
  ];

  const allSelected = [
    ...selectedCategories,
    ...selectedSubcategories,
    ...selectedBrands,
    ...selectedAvailability,
    ...selectedPrice,
  ];

  const onToggleSelected = (groupId: string, value: string) => {
    if (groupId === "category") toggleCategory(value);
    else if (groupId === "brand") toggle(value, selectedBrands, setSelectedBrands);
    else if (groupId === "price") toggle(value, selectedPrice, setSelectedPrice);
    else if (groupId === "availability")
      toggle(value, selectedAvailability, setSelectedAvailability);
  };

  const resetAll = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setSelectedAvailability([]);
    setSelectedPrice([]);
  };

  const visibleProducts = useMemo(() => {
    let filteredProducts = products;

    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => selectedCategories.includes(product.category));
    }

    if (selectedSubcategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => selectedSubcategories.includes(product.subcategory));
    }

    if (selectedBrands.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.brand ? selectedBrands.includes(product.brand) : false
      );
    }

    if (selectedPrice.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        return selectedPrice.some((range) => {
          const p = product.price;
          switch (range) {
            case "u500":
              return p < 500;
            case "500-1000":
              return p >= 500 && p < 1000;
            case "1000-2500":
              return p >= 1000 && p < 2500;
            case "2500-5000":
              return p >= 2500 && p < 5000;
            case "a5000":
              return p >= 5000;
            default:
              return false;
          }
        });
      });
    }

    if (selectedAvailability.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedAvailability.every((flag) => {
          if (flag === "in-stock") return product.inStock;
          if (flag === "on-sale") return Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
          if (flag === "new") return product.isNewArrival;
          if (flag === "bestseller") return product.isBestSeller;
          return true;
        })
      );
    }

    return filteredProducts;
  }, [selectedCategories, selectedSubcategories, selectedBrands, selectedPrice, selectedAvailability]);

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
          <FilterSidebar
            groups={filterGroups}
            selected={allSelected}
            onToggle={(value) => {
              const group = filterGroups.find((g) => g.options.some((o) => o.value === value));
              if (group) onToggleSelected(group.id, value);
            }}
            onReset={resetAll}
          />

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
