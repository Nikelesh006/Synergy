import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Package, 
  Calendar,
  AlertCircle
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/api";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { getProductDisplayImage, getCategoryFallbackImage } from "@/lib/productImage";

export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch all products
  const { data, isLoading, error } = useProducts();
  const productsList = data?.products || [];

  // Filter based on search term
  const filteredProducts = productsList.filter((product: Product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(id);
      await fetchApi(`/products/${id}`, {
        method: "DELETE",
      });
      
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Product Deleted",
        description: "The product has been removed from the website.",
      });
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } catch (err) {
      toast({
        title: "Error deleting product",
        description: err instanceof Error ? err.message : "Failed to delete product.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete all ${selectedIds.length} selected products?`)) {
      return;
    }

    try {
      let successCount = 0;
      for (const id of selectedIds) {
        await fetchApi(`/products/${id}`, { method: "DELETE" });
        successCount++;
      }
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Bulk Deletion Successful",
        description: `Successfully deleted ${successCount} products.`,
      });
      setSelectedIds([]);
    } catch (err) {
      toast({
        title: "Bulk Deletion Error",
        description: "An error occurred while deleting one or more products.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const allSelected = filteredProducts.length > 0 && selectedIds.length === filteredProducts.length;

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminNav />

        {/* Header Dashboard section */}
        <div className="mb-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-black">Admin Dashboard</div>
                <h1 className="text-3xl font-bold tracking-normal text-black">Products</h1>
              </div>
            </div>
            <Link href="/admin/add-product">
              <Button className="h-11 bg-blue-700 font-semibold text-white shadow-sm hover:bg-blue-800">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </Link>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Review product listings, stock status, pricing, and catalog updates.
          </p>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search products by name, SKU, category..."
              className="h-11 pl-9 border-slate-200 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">
                {selectedIds.length} product(s) selected
              </span>
              <Button
                variant="destructive"
                className="h-11 font-semibold"
                onClick={handleBulkDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Bulk Delete
              </Button>
            </div>
          )}
        </div>

        {/* Table Area */}
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-sm text-slate-500 animate-pulse">Loading products...</div>
            </div>
          ) : error ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="text-sm font-semibold text-slate-700">Failed to load products</div>
              <div className="text-xs text-slate-400">Please try refreshing the page</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <Package className="h-8 w-8 text-slate-300" />
              <div className="text-sm font-semibold text-slate-700">No products found</div>
              <div className="text-xs text-slate-400">Try adjusting your search criteria or add a product.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <th className="px-6 py-4 w-12 text-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Date Added</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredProducts.map((product) => {
                    const isSelected = selectedIds.includes(product.id);
                    const mainImage = product.images?.[0] || "https://placehold.co/100x100?text=No+Image";
                    const isOutOfStock = product.stock <= 0;

                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-slate-50/50 transition-colors ${
                          isSelected ? "bg-blue-50/20" : ""
                        }`}
                      >
                        {/* Select */}
                        <td className="px-6 py-4 w-12 text-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(product.id, e.target.checked)}
                          />
                        </td>

                        {/* Product (image, name) */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                              <img
                                src={getProductDisplayImage(mainImage, product.category, product.subcategory, 100)}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = getCategoryFallbackImage(product.category, product.subcategory);
                                }}
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs md:max-w-sm">
                                {product.name}
                              </div>
                              <div className="text-xs text-slate-400">
                                SKU: {product.sku}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="text-slate-700 font-medium">{product.category}</span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {isOutOfStock ? (
                            <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 font-semibold">
                              Out of Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">
                              In Stock
                            </Badge>
                          )}
                          {product.isFeatured && (
                            <Badge variant="outline" className="ml-2 border-amber-200 bg-amber-50 text-amber-700 font-semibold">
                              Featured
                            </Badge>
                          )}
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 font-semibold text-slate-950">
                          {formatPrice(product.price)}
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <span className={`font-medium ${isOutOfStock ? "text-red-600 font-bold" : "text-slate-700"}`}>
                            {product.stock} units
                          </span>
                        </td>

                        {/* Date Added */}
                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {formatDate((product as any).createdAt || (product as any).updatedAt)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Visit button (eye icon) */}
                            <Link href={`/product/${product.slug}`}>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                title="View on site"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>

                            {/* Edit button */}
                            <Link href={`/admin/edit-product/${product.id}`}>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>

                            {/* Delete button */}
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={isDeleting === product.id}
                              onClick={() => handleDelete(product.id)}
                              className="h-8 w-8 border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
