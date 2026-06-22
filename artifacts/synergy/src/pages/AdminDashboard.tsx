import { FormEvent, useMemo, useState } from "react";
import {
  CheckCircle2,
  ImagePlus,
  IndianRupee,
  PackagePlus,
  Save,
  Sparkles,
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
import { toast } from "@/hooks/use-toast";

type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  description: string;
  images: string;
  price: string;
  offerPrice: string;
  stock: string;
  minOrderQty: string;
  warrantyInfo: string;
  connectivity: string;
  voltage: string;
  protocol: string;
  isFeatured: boolean;
  inStock: boolean;
};

const defaultProduct: AdminProduct = {
  id: "iot-smart-board-001",
  name: "IoT Smart Board Controller 8 Relay",
  sku: "IOT-SB-8R-WIFI",
  brand: "Synergy Controls",
  category: "Smart Boards & IoT",
  subcategory: "Relay Controller",
  shortDescription: "Wi-Fi enabled smart board controller for automation panels.",
  description:
    "Industrial IoT smart board with 8 relay outputs, app-ready control, sensor inputs, and DIN rail mounting for automation projects.",
  images:
    "https://placehold.co/700x700/e8f1ff/1f2937?text=IoT+Smart+Board\nhttps://placehold.co/700x700/ecfdf5/1f2937?text=Relay+Module",
  price: "3499",
  offerPrice: "2999",
  stock: "24",
  minOrderQty: "1",
  warrantyInfo: "1 Year Manufacturer Warranty",
  connectivity: "Wi-Fi + Bluetooth",
  voltage: "12V DC",
  protocol: "MQTT / REST API",
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
    subcategory: "Energy Monitor",
    shortDescription: "ESP32 based board for current sensing and energy telemetry.",
    price: "2199",
    offerPrice: "1899",
    stock: "36",
    connectivity: "Wi-Fi",
    voltage: "5V DC",
    protocol: "MQTT",
    isFeatured: false,
  },
];

const categories = [
  "Smart Boards & IoT",
  "Circuit Protection",
  "Distribution Boards",
  "Sensors & Modules",
  "Automation Panels",
];

const fieldClass = "h-11 border-gray-300 bg-white";

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
      shortDescription: "",
      description: "",
      images: "",
    });

    toast({
      title: "Product draft saved",
      description: "The dummy product is stored locally in this admin view.",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
              <PackagePlus className="h-4 w-4" />
              Product Admin
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">Add Product</h1>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center md:min-w-96">
            <div className="rounded-md border border-gray-200 bg-white p-3">
              <div className="text-xl font-bold text-gray-950">{products.length}</div>
              <div className="text-xs font-medium text-gray-500">Drafts</div>
            </div>
            <div className="rounded-md border border-gray-200 bg-white p-3">
              <div className="text-xl font-bold text-gray-950">IoT</div>
              <div className="text-xs font-medium text-gray-500">Category</div>
            </div>
            <div className="rounded-md border border-gray-200 bg-white p-3">
              <div className="text-xl font-bold text-gray-950">INR</div>
              <div className="text-xs font-medium text-gray-500">Currency</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <form onSubmit={handleSubmit} className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-950">Basic Details</h2>
                <p className="text-sm text-gray-500">Smart board components, IoT modules, pricing, and catalog metadata.</p>
              </div>
              <Badge variant="outline" className="hidden border-blue-200 bg-blue-50 text-blue-700 sm:inline-flex">
                MongoDB ready
              </Badge>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={form.name} onChange={(event) => updateField("name", event.target.value)} className={fieldClass} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={form.sku} onChange={(event) => updateField("sku", event.target.value)} className={fieldClass} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={form.brand} onChange={(event) => updateField("brand", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(value) => updateField("category", value)}>
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
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input id="subcategory" value={form.subcategory} onChange={(event) => updateField("subcategory", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" min="0" value={form.stock} onChange={(event) => updateField("stock", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input id="price" type="number" min="0" value={form.price} onChange={(event) => updateField("price", event.target.value)} className={`${fieldClass} pl-9`} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerPrice">Offer Price</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input id="offerPrice" type="number" min="0" value={form.offerPrice} onChange={(event) => updateField("offerPrice", event.target.value)} className={`${fieldClass} pl-9`} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="connectivity">Connectivity</Label>
                <Input id="connectivity" value={form.connectivity} onChange={(event) => updateField("connectivity", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protocol">Protocol</Label>
                <Input id="protocol" value={form.protocol} onChange={(event) => updateField("protocol", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voltage">Voltage</Label>
                <Input id="voltage" value={form.voltage} onChange={(event) => updateField("voltage", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrderQty">Minimum Order Qty</Label>
                <Input id="minOrderQty" type="number" min="1" value={form.minOrderQty} onChange={(event) => updateField("minOrderQty", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input id="shortDescription" value={form.shortDescription} onChange={(event) => updateField("shortDescription", event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(event) => updateField("description", event.target.value)} className="min-h-28 border-gray-300 bg-white" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="images">Images</Label>
                <Textarea id="images" value={form.images} onChange={(event) => updateField("images", event.target.value)} className="min-h-24 border-gray-300 bg-white" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="warrantyInfo">Warranty</Label>
                <Input id="warrantyInfo" value={form.warrantyInfo} onChange={(event) => updateField("warrantyInfo", event.target.value)} className={fieldClass} />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Switch checked={form.inStock} onCheckedChange={(checked) => updateField("inStock", checked)} />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Switch checked={form.isFeatured} onCheckedChange={(checked) => updateField("isFeatured", checked)} />
                  Featured
                </label>
              </div>
              <Button type="submit" className="bg-blue-700 text-white hover:bg-blue-800">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            </div>
          </form>

          <aside className="space-y-6">
            <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-blue-700" />
                <h2 className="text-lg font-bold text-gray-950">Preview</h2>
              </div>
              <div className="aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                {imageList[0] ? (
                  <img src={imageList[0]} alt={form.name || "Product preview"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">No image</div>
                )}
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="font-bold text-gray-950">{form.name || "Untitled product"}</h3>
                  <p className="mt-1 text-sm text-gray-500">{form.shortDescription || "Short catalog description"}</p>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-gray-950">Rs. {form.offerPrice || form.price || "0"}</span>
                  {form.offerPrice && form.price && (
                    <span className="pb-1 text-sm text-gray-400 line-through">Rs. {form.price}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{form.category}</Badge>
                  <Badge variant="outline">{form.connectivity}</Badge>
                  {form.isFeatured && <Badge className="bg-amber-100 text-amber-800"><Sparkles className="mr-1 h-3 w-3" /> Featured</Badge>}
                </div>
              </div>
            </section>

            <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-950">Recent Drafts</h2>
              </div>
              <div className="space-y-3">
                {products.slice(0, 4).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setForm(product)}
                    className="w-full rounded-md border border-gray-200 p-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-gray-950">{product.name}</div>
                        <div className="mt-1 text-xs text-gray-500">{product.sku}</div>
                      </div>
                      <div className="text-sm font-semibold text-gray-950">Rs. {product.offerPrice || product.price}</div>
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
