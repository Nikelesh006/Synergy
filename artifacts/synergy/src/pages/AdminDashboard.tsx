import { ChangeEvent, FormEvent, useMemo, useState } from "react";
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
  tags: string;
  isFeatured: boolean;
  inStock: boolean;
};

const defaultProduct: AdminProduct = {
  id: "iot-smart-board-001",
  name: "IoT Smart Board Controller 8 Relay",
  sku: "IOT-SB-8R-WIFI",
  brand: "Synergy Controls",
  category: "IOT",
  subcategory: "ESP32 (Rex32)",
  description:
    "Industrial IoT smart board with 8 relay outputs, app-ready control, sensor inputs, and DIN rail mounting for automation projects.",
  keyFeatures: "8 relay outputs, WiFi control, DIN rail mounting",
  specifications: "Input: 12V DC, Connectivity: WiFi, Relay Rating: 10A",
  images:
    "https://placehold.co/700x700/e8f1ff/1f2937?text=IoT+Smart+Board\nhttps://placehold.co/700x700/ecfdf5/1f2937?text=Relay+Module",
  price: "3499",
  offerPrice: "2999",
  stock: "24",
  mpn: "N/A",
  tags: "Power Supply,DC Power Supply,Voltage Regulator",
  isFeatured: true,
  inStock: true,
};

const initialProducts: AdminProduct[] = [
  defaultProduct,
  {
    ...defaultProduct,
    id: "iot-smart-board-002",
    name: "ESP32 Smart Energy Monitor Board",
    sku: "IOT-EM-ESP32-CT",
    subcategory: "ESP32 (Rex32)",
    description: "ESP32 based board for current sensing and energy telemetry.",
    price: "2199",
    offerPrice: "1899",
    stock: "36",
    mpn: "N/A",
    tags: "ESP32,Energy Monitor",
    isFeatured: false,
  },
];

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

const fieldClass =
  "h-12 rounded-md border-slate-200 bg-white/95 px-4 text-sm text-black shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100";
const textareaClass =
  "min-h-32 rounded-md border-slate-200 bg-white/95 px-4 py-3 text-sm text-black shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100";
const panelClass = "rounded-md border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70";
const sectionTitleClass = "text-base font-bold text-black";

export default function AdminDashboard() {
  const [form, setForm] = useState<AdminProduct>(defaultProduct);
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);

  const imageList = useMemo(
    () => form.images.split(/\n|,/).map((image) => image.trim()).filter(Boolean),
    [form.images]
  );

  const updateField = (field: keyof AdminProduct, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setForm((current) => ({
      ...current,
      category,
      subcategory: subcategoriesByCategory[category]?.[0] ?? "",
    }));
  };

  const handleSingleImageUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newUrls = Array.from(files).map((file) => URL.createObjectURL(file));
      const newList = [...imageList];
      for (let i = 0; i < newUrls.length && index + i < 5; i++) {
        newList[index + i] = newUrls[i];
      }
      updateField("images", newList.filter(Boolean).join("\n"));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const productToSave = {
      ...form,
      id: form.id || `product-${Date.now()}`,
      images: imageList.join("\n"),
    };

    setProducts((current) => [productToSave, ...current.filter((product) => product.id !== productToSave.id)]);
    setForm({
      ...defaultProduct,
      id: `iot-smart-board-${String(products.length + 1).padStart(3, "0")}`,
      name: "",
      sku: "",
      description: "",
      keyFeatures: "",
      specifications: "",
      images: "",
    });

    toast({
      title: "Product draft saved",
      description: "The dummy product is stored locally in this admin view.",
    });
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
                  <h1 className="text-3xl font-bold tracking-normal text-black">Add Product</h1>
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
                <Label className="text-sm font-semibold text-black">Subcategory</Label>
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
                <Label htmlFor="price" className="text-sm font-semibold text-black">Price</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-4 h-4 w-4 text-blue-700" />
                  <Input id="price" type="number" min="0" value={form.price} onChange={(event) => updateField("price", event.target.value)} className={`${fieldClass} pl-10`} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerPrice" className="text-sm font-semibold text-black">Offer Price</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-4 h-4 w-4 text-blue-700" />
                  <Input id="offerPrice" type="number" min="0" value={form.offerPrice} onChange={(event) => updateField("offerPrice", event.target.value)} className={`${fieldClass} pl-10`} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mpn" className="text-sm font-semibold text-black">MPN</Label>
                <Input id="mpn" value={form.mpn} onChange={(event) => updateField("mpn", event.target.value)} className={fieldClass} />
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
              <Button type="submit" className="h-11 border border-blue-700 bg-white px-5 font-semibold text-black shadow-sm hover:bg-blue-50">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
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
