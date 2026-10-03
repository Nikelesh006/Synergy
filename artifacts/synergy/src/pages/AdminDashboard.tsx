import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ImagePlus,
  IndianRupee,
  PackagePlus,
  Save,
  UploadCloud,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminNav from "@/components/admin/AdminNav";
import { toast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/api";
type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  keyFeatures: string;
  specifications: string;
  images: string;
  price: string;
  offerPrice: string;
  stock: string;
  mpn: string;
  hsnCode: string;
  tags: string;
  isFeatured: boolean;
  inStock: boolean;
};

const defaultProduct: AdminProduct = {
  id: "",
  name: "",
  sku: "",
  brand: "",
  category: "",
  subcategory: "",
  description: "",
  keyFeatures: "",
  specifications: "",
  images: "",
  price: "",
  offerPrice: "",
  stock: "",
  mpn: "",
  hsnCode: "",
  tags: "",
  isFeatured: false,
  inStock: true,
};

const initialProducts: AdminProduct[] = [];

const categories = [
  "IOT",
  "AI",
  "Embedded Systems",
  "Robotics",
  "Lab Equipments",
];

const subcategoriesByCategory: Record<string, string[]> = {
  IOT: ["ESP32 (Rex32)"],
  AI: ["ESP32 AI (Rex32 AI)"],
  "Embedded Systems": ["Arduino"],
  Robotics: ["ESP32 servo drivers", "ESP32 DC drivers", "ESP32 stepper drivers"],
  "Lab Equipments": ["Sensors and Instruments (MR34461)"],
};

// The admin labels above are kept unchanged. These are the matching catalog
// values used by the customer-facing category pages.
const catalogCategoryByAdminCategory: Record<string, string> = {
  IOT: "IoT",
  AI: "AI",
  "Embedded Systems": "Embedded Systems Boards",
  Robotics: "Robotics",
  "Lab Equipments": "Sensors and Instrumentation (MR3461)",
};

const reverseCategoryMapping: Record<string, string> = {
  "IoT": "IOT",
  "AI": "AI",
  "Embedded Systems Boards": "Embedded Systems",
  "Robotics": "Robotics",
  "Sensors and Instrumentation (MR3461)": "Lab Equipments",
};

const mapProductToForm = (product: any): AdminProduct => {
  const formCategory = reverseCategoryMapping[product.category] || "IOT";

  let specStr = "";
  if (product.specifications && typeof product.specifications === "object") {
    specStr = Object.entries(product.specifications)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
  }

  let priceVal = "";
  let offerPriceVal = "";
  if (product.compareAtPrice) {
    priceVal = String(product.compareAtPrice);
    offerPriceVal = String(product.price);
  } else {
    priceVal = String(product.price || "");
  }

  return {
    id: product.id || product._id || "",
    name: product.name || "",
    sku: product.sku || "",
    brand: product.brand || "",
    category: formCategory,
    subcategory: product.subcategory || "",
    description: product.description || "",
    keyFeatures: Array.isArray(product.features) ? product.features.join(", ") : "",
    specifications: specStr,
    images: Array.isArray(product.images) ? product.images.join("\n") : "",
    price: priceVal,
    offerPrice: offerPriceVal,
    stock: String(product.stock ?? 0),
    mpn: product.mpn || "N/A",
    hsnCode: product.hsnCode || "",
    tags: Array.isArray(product.applications) ? product.applications.join(", ") : "",
    isFeatured: !!product.isFeatured,
    inStock: !!product.inStock,
  };
};

const fieldClass =
  "h-12 rounded-md border-slate-200 bg-white/95 px-4 text-sm text-black shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100";
const textareaClass =
  "min-h-32 rounded-md border-slate-200 bg-white/95 px-4 py-3 text-sm text-black shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100";
const panelClass = "rounded-md border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70";
const sectionTitleClass = "text-base font-bold text-black";

export default function AdminDashboard({ params }: { params?: { id?: string } }) {
  const [form, setForm] = useState<AdminProduct>(defaultProduct);
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const isEditMode = !!params?.id;

  useEffect(() => {
    if (params?.id) {
      const loadProduct = async () => {
        try {
          const product = await fetchApi<any>(`/products/${params.id}`);
          if (product) {
            setForm(mapProductToForm(product));
          }
        } catch (err) {
          toast({
            title: "Error loading product",
            description: "Could not fetch product details for editing.",
            variant: "destructive",
          });
        }
      };
      loadProduct();
    } else {
      setForm(defaultProduct);
    }
  }, [params?.id]);

  const imageList = useMemo(
    () => form.images.split(/\r?\n/).map((image) => image.trim()).filter(Boolean),
    [form.images]
  );

  const updateField = (field: keyof AdminProduct, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCategoryChange = (category: string) => {
    const newSubcategories = subcategoriesByCategory[category] ?? [];
    const currentSubcategory = form.subcategory;
    
    // If current subcategory exists in new category's subcategories, keep it
    // Otherwise, default to first subcategory
    const newSubcategory = newSubcategories.includes(currentSubcategory) 
      ? currentSubcategory 
      : (newSubcategories[0] ?? "");
    
    setForm((current) => ({
      ...current,
      category,
      subcategory: newSubcategory,
    }));
  };

  const handleSingleImageUpload = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files).slice(0, 5 - index);
      if (selectedFiles.some((file) => !file.type.startsWith("image/") || file.size > 1024 * 1024)) {
        toast({ title: "Image not added", description: "Use image files up to 1 MB each.", variant: "destructive" });
        event.target.value = "";
        return;
      }

      try {
        const newUrls = await Promise.all(selectedFiles.map((file) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("Unable to read image"));
          reader.readAsDataURL(file);
        })));
        const newList = [...imageList];
        newUrls.forEach((url, offset) => { newList[index + offset] = url; });
        updateField("images", newList.filter(Boolean).join("\n"));
      } catch {
        toast({ title: "Image not added", description: "The selected image could not be read.", variant: "destructive" });
      }
      event.target.value = "";
    }
  };

  const handleSaveDraft = () => {
    setProducts((current) => [{ ...form, id: form.id || `draft-${Date.now()}` }, ...current.filter((product) => product.id !== form.id)]);
    toast({ title: "Draft saved", description: "The draft is saved locally. Use Add Product to publish it to the database." });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const sku = form.sku.trim();
    const brand = form.brand.trim();
    const category = form.category.trim();
    const subcategory = form.subcategory.trim();
    const listPrice = Number(form.price);
    const offerPrice = form.offerPrice === "" ? undefined : Number(form.offerPrice);
    const stock = Number(form.stock);

    if (!name || !sku || !brand || !category || !subcategory) {
      toast({ title: "Complete required fields", description: "Name, SKU, brand, category, and subcategory are required.", variant: "destructive" });
      return;
    }
    if (!Number.isFinite(listPrice) || listPrice <= 0 || !Number.isInteger(stock) || stock < 0) {
      toast({ title: "Check price and stock", description: "Enter a price greater than zero and a whole-number stock quantity.", variant: "destructive" });
      return;
    }
    if (offerPrice !== undefined && (!Number.isFinite(offerPrice) || offerPrice <= 0 || offerPrice >= listPrice)) {
      toast({ title: "Check offer price", description: "Offer price must be greater than zero and lower than the price.", variant: "destructive" });
      return;
    }
    if (imageList.length === 0) {
      toast({ title: "Add a product image", description: "Upload at least one image before adding the product.", variant: "destructive" });
      return;
    }

    const productToSave = {
      name,
      sku,
      brand,
      category: catalogCategoryByAdminCategory[category],
      subcategory,
      shortDescription: form.description.trim().slice(0, 150),
      description: form.description.trim(),
      specifications: form.specifications.trim(),
      features: form.keyFeatures.split(",").map((feature) => feature.trim()).filter(Boolean),
      applications: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      images: imageList,
      price: offerPrice ?? listPrice,
      compareAtPrice: offerPrice ? listPrice : undefined,
      currency: "INR",
      stock,
      inStock: form.inStock && stock > 0,
      minOrderQty: 1,
      rating: 4.5,
      reviewCount: 0,
      isFeatured: form.isFeatured,
      isNewArrival: true,
      isBestSeller: false,
      warrantyInfo: "1 Year",
      shippingInfo: "Ships within 24 hours",
      mpn: form.mpn.trim(),
      hsnCode: form.hsnCode.trim(),
    };

    try {
      setIsAddingProduct(true);
      if (isEditMode) {
        await fetchApi(`/products/${params.id}`, {
          method: 'PUT',
          body: JSON.stringify(productToSave),
        });
        await queryClient.invalidateQueries({ queryKey: ["products"] });
        toast({ title: "Product updated", description: "The product was successfully updated." });
      } else {
        await fetchApi('/products', {
          method: 'POST',
          body: JSON.stringify(productToSave),
        });
        await queryClient.invalidateQueries({ queryKey: ["products"] });
        toast({ title: "Product added", description: "The product is stored in the database and will appear in its selected category." });
      }
      setLocation("/admin/products");
    } catch (error) {
      toast({
        title: "Error saving product",
        description: error instanceof Error ? error.message.replace(/^API Error \(\d+\):\s*/, "") : "Failed to save product to database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingProduct(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminNav />

        <div className="mb-6 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="grid gap-0 lg:grid-cols-[1fr_420px]">
            <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-700 shadow-sm">
                  <PackagePlus className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-black">Product Admin</div>
                  <h1 className="text-3xl font-bold tracking-normal text-black">
                    {isEditMode ? "Edit Product" : "Add Product"}
                  </h1>
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-black">
                Smart board components, IoT modules, pricing, catalog metadata, images, and inventory controls.
              </p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50/70 text-center">
              <div className="p-5">
                <div className="text-2xl font-bold text-black">{products.length}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-normal text-black">Drafts</div>
              </div>
              <div className="p-5">
                <div className="text-2xl font-bold text-black">IoT</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-normal text-black">Category</div>
              </div>
              <div className="p-5">
                <div className="text-2xl font-bold text-black">INR</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-normal text-black">Currency</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={panelClass}>
              <div className="mb-5 border-b border-slate-200 pb-5">
                <div>
                  <div className="mb-2 h-1 w-16 rounded-full bg-blue-700" />
                  <h2 className={sectionTitleClass}>Basic Details</h2>
                  <p className="mt-1 text-sm text-black">Required catalog identity and dropdown classification.</p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-black">Product Name <span className="text-red-600">*</span></Label>
                <Input id="name" value={form.name} onChange={(event) => updateField("name", event.target.value)} className={fieldClass} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku" className="text-sm font-semibold text-black">SKU <span className="text-red-600">*</span></Label>
                <Input id="sku" value={form.sku} onChange={(event) => updateField("sku", event.target.value)} className={fieldClass} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-semibold text-black">Brand <span className="text-red-600">*</span></Label>
                <Input id="brand" value={form.brand} onChange={(event) => updateField("brand", event.target.value)} className={fieldClass} required />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-black">Category <span className="text-red-600">*</span></Label>
                <Select value={form.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-black">Subcategory <span className="text-red-600">*</span></Label>
                <Select value={form.subcategory} onValueChange={(value) => updateField("subcategory", value)}>
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {(subcategoriesByCategory[form.category] ?? []).map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-semibold text-black">Stock Quantity</Label>
                <Input id="stock" type="number" min="0" value={form.stock} onChange={(event) => updateField("stock", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold text-black">Price <span className="text-red-600">*</span></Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-4 h-4 w-4 text-blue-700" />
                  <Input id="price" type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => updateField("price", event.target.value)} className={`${fieldClass} pl-10`} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerPrice" className="text-sm font-semibold text-black">Offer Price</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-4 h-4 w-4 text-blue-700" />
                  <Input id="offerPrice" type="number" min="0.01" step="0.01" value={form.offerPrice} onChange={(event) => updateField("offerPrice", event.target.value)} className={`${fieldClass} pl-10`} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mpn" className="text-sm font-semibold text-black">MPN</Label>
                <Input id="mpn" value={form.mpn} onChange={(event) => updateField("mpn", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hsnCode" className="text-sm font-semibold text-black">HSN Code</Label>
                <Input id="hsnCode" value={form.hsnCode} onChange={(event) => updateField("hsnCode", event.target.value)} className={fieldClass} placeholder="e.g., 8471" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-semibold text-black">Tags</Label>
                <Input id="tags" value={form.tags} onChange={(event) => updateField("tags", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-semibold text-black">Description</Label>
                <Textarea id="description" value={form.description} onChange={(event) => updateField("description", event.target.value)} className={textareaClass} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="keyFeatures" className="text-sm font-semibold text-black">Key Features</Label>
                <Input id="keyFeatures" value={form.keyFeatures} onChange={(event) => updateField("keyFeatures", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specifications" className="text-sm font-semibold text-black">Specifications</Label>
                <Input id="specifications" value={form.specifications} onChange={(event) => updateField("specifications", event.target.value)} className={fieldClass} />
              </div>
              </div>
            </div>


            <div className={panelClass}>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className={sectionTitleClass}>Product Images</h2>
                    <p className="text-sm text-black">{imageList.length}/5 images uploaded. The first image is used as the main product image.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {[0, 1, 2, 3, 4].map((index) => {
                  const image = imageList[index];
                  return (
                    <div key={index} className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-blue-300 hover:bg-blue-50">
                      {image ? (
                        <>
                          <img src={image} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const newList = [...imageList];
                              newList.splice(index, 1);
                              updateField("images", newList.join("\n"));
                            }}
                            className="absolute inset-0 flex items-center justify-center bg-white/90 text-sm font-semibold text-black opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-black transition-colors hover:text-black">
                          <UploadCloud className="h-6 w-6" />
                          <span className="text-sm font-medium">Upload</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleSingleImageUpload(index, e)}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm font-semibold text-black">
                  <Switch checked={form.inStock} onCheckedChange={(checked) => updateField("inStock", checked)} />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-black">
                  <Switch checked={form.isFeatured} onCheckedChange={(checked) => updateField("isFeatured", checked)} />
                  Featured
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={handleSaveDraft} className="h-11 border border-slate-300 bg-white px-5 font-semibold text-black shadow-sm hover:bg-slate-50">
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button type="submit" disabled={isAddingProduct} className="h-11 bg-blue-700 px-5 font-semibold text-white shadow-sm hover:bg-blue-800">
                  <PackagePlus className="h-4 w-4" />
                  {isAddingProduct ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Product" : "Add Product")}
                </Button>
              </div>
            </div>
          </form>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className={panelClass}>
              <div className="mb-4 flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-blue-700" />
                <h2 className={sectionTitleClass}>Preview</h2>
              </div>
              <div className="aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                {imageList[0] ? (
                  <img src={imageList[0]} alt={form.name || "Product preview"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-black">No image</div>
                )}
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="font-bold text-black">{form.name || "Untitled product"}</h3>
                  <p className="mt-1 text-sm text-black">{form.description || "Product description"}</p>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-black">Rs. {form.offerPrice || form.price || "0"}</span>
                  {form.offerPrice && form.price && (
                    <span className="pb-1 text-sm text-black line-through">Rs. {form.price}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-blue-200 bg-white text-black">{form.category}</Badge>
                  <Badge variant="outline" className="border-slate-200 bg-white text-black">{form.mpn || "No MPN"}</Badge>
                  {form.isFeatured && <Badge variant="outline" className="border-slate-200 bg-white text-black">Featured</Badge>}
                </div>
              </div>
            </section>

            <section className={panelClass}>
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-700" />
                <h2 className={sectionTitleClass}>Recent Drafts</h2>
              </div>
              <div className="space-y-3">
                {products.slice(0, 4).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setForm(product)}
                    className="w-full rounded-md border border-slate-200 bg-white p-3 text-left transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-black">{product.name}</div>
                        <div className="mt-1 text-xs text-black">{product.sku}</div>
                      </div>
                      <div className="text-sm font-semibold text-black">Rs. {product.offerPrice || product.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
