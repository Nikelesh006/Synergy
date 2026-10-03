import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, FileText, ImagePlus, Loader2, Save, UploadCloud } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/api";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

type AdminBlog = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  status: string;
  publishDate: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  isFeatured: boolean;
};

const defaultBlog: AdminBlog = {
  id: "",
  title: "",
  slug: "",
  author: "",
  category: "",
  status: "Draft",
  publishDate: "",
  readTime: "",
  coverImage: "",
  excerpt: "",
  content: "",
  tags: "",
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
};

const initialBlogs: AdminBlog[] = [];

const blogCategories = ["Buying Guide", "Technical", "Industry News", "Project Ideas", "Product Updates"];
const blogStatuses = ["Draft", "Review", "Published", "Archived"];

const fieldClass =
  "h-12 rounded-md border-slate-200 bg-white/95 px-4 text-sm text-black shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100";
const textareaClass =
  "min-h-32 rounded-md border-slate-200 bg-white/95 px-4 py-3 text-sm text-black shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100";
const panelClass = "rounded-md border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70";
const sectionTitleClass = "text-base font-bold text-black";

export default function AdminBlogs({ params }: { params?: { id?: string } }) {
  const routeParams = useParams<{ id?: string }>();
  const blogId = params?.id || routeParams?.id;
  const isEditMode = !!blogId;

  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AdminBlog>(defaultBlog);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blogs, setBlogs] = useState<AdminBlog[]>(initialBlogs);

  useEffect(() => {
    if (blogId) {
      const loadBlog = async () => {
        try {
          const blog = await fetchApi<any>(`/blogs/${blogId}`);
          if (blog) {
            setForm({
              id: blog._id || blog.id || "",
              title: blog.title || "",
              slug: blog.slug || "",
              author: blog.author || "",
              category: blog.category || "",
              status: blog.status || "Draft",
              publishDate: blog.publishDate || "",
              readTime: blog.readTime || "",
              coverImage: blog.coverImage || "",
              excerpt: blog.excerpt || "",
              content: blog.content || "",
              tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : (blog.tags || ""),
              metaTitle: blog.metaTitle || "",
              metaDescription: blog.metaDescription || "",
              isFeatured: Boolean(blog.isFeatured),
            });
          }
        } catch (err) {
          toast({
            title: "Error loading blog",
            description: "Could not fetch blog post details for editing.",
            variant: "destructive",
          });
        }
      };
      loadBlog();
    } else {
      setForm(defaultBlog);
    }
  }, [blogId]);

  const tagList = useMemo(
    () => form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    [form.tags]
  );

  const updateField = (field: keyof AdminBlog, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (value: string) => {
    updateField("title", value);
    // Auto-generate slug from title if slug is empty or matches the old title
    if (!form.slug || form.slug === generateSlug(form.title)) {
      updateField("slug", generateSlug(value));
    }
  };

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      toast({ title: "Image not added", description: "Use image files up to 10 MB.", variant: "destructive" });
      event.target.value = "";
      return;
    }

    setIsUploadingCover(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Unable to read image"));
        reader.readAsDataURL(file);
      });

      try {
        const cloudinaryUrl = await uploadImageToCloudinary(dataUrl, "synergy/blogs");
        updateField("coverImage", cloudinaryUrl);
        toast({ title: "Cover uploaded", description: "Image successfully uploaded to Cloudinary." });
      } catch (uploadErr) {
        console.warn("Cloudinary upload fallback to data URL:", uploadErr);
        updateField("coverImage", dataUrl);
        toast({
          title: "Cloudinary upload note",
          description: uploadErr instanceof Error && uploadErr.message.includes("Cloudinary is not configured")
            ? "Cloudinary credentials not configured in server .env. Image stored locally."
            : "Cloudinary upload failed; image stored locally.",
        });
      }
    } catch {
      toast({ title: "Image not added", description: "Could not read image file.", variant: "destructive" });
    } finally {
      setIsUploadingCover(false);
      event.target.value = "";
    }
  };

  const saveBlog = async (overrideStatus?: string) => {
    // Validation
    if (!form.title || !form.slug || !form.author || !form.category || !form.coverImage || !form.excerpt || !form.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields: Title, Slug, Author, Category, Cover Image, Excerpt, and Content.",
        variant: "destructive",
      });
      return;
    }

    const blogToSave = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      status: overrideStatus || form.status || "Published",
      publishDate: form.publishDate || new Date().toISOString().split('T')[0],
      readTime: form.readTime || '5 min read',
      coverImage: form.coverImage,
      excerpt: form.excerpt.trim(),
      content: form.content,
      tags: tagList,
      metaTitle: form.metaTitle || form.title,
      metaDescription: form.metaDescription || form.excerpt,
      isFeatured: form.isFeatured,
    };

    try {
      setIsSubmitting(true);
      if (isEditMode) {
        await fetchApi(`/blogs/${blogId}`, {
          method: 'PUT',
          body: JSON.stringify(blogToSave),
        });
        await queryClient.invalidateQueries({ queryKey: ["blog"] });
        toast({
          title: "Blog updated successfully",
          description: "The blog post changes have been saved.",
        });
      } else {
        await fetchApi('/blogs', {
          method: 'POST',
          body: JSON.stringify(blogToSave),
        });
        await queryClient.invalidateQueries({ queryKey: ["blog"] });
        toast({
          title: "Blog added successfully",
          description: "The blog has been created and published.",
        });
      }
      setLocation("/admin/blogs-list");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: isEditMode ? "Error updating blog" : "Error adding blog",
        description: error instanceof Error ? error.message : "Failed to save blog to database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBlog = async () => {
    await saveBlog("Published");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveBlog(isEditMode ? undefined : form.status);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminNav />

        <div className="mb-6 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="grid gap-0 lg:grid-cols-[1fr_420px]">
            <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-700 shadow-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-black">Content Admin</div>
                    <h1 className="text-3xl font-bold tracking-normal text-black">
                      {isEditMode ? "Edit Blog" : "Add Blog"}
                    </h1>
                  </div>
                </div>
                <Link href="/admin/blogs-list">
                  <Button variant="outline" className="h-10 border-slate-200 text-slate-700 hover:bg-slate-50">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Blogs List
                  </Button>
                </Link>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-black">
                {isEditMode
                  ? "Update blog article content, cover image, category, and publishing status."
                  : "Create blog articles with cover image, title, SEO fields, publishing status, tags, and full content."}
              </p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50/70 text-center">
              <div className="p-5">
                <div className="text-2xl font-bold text-black">{blogs.length}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-normal text-black">Drafts</div>
              </div>
              <div className="p-5">
                <div className="text-2xl font-bold text-black">{form.status}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-normal text-black">Status</div>
              </div>
              <div className="p-5">
                <div className="text-2xl font-bold text-black">{tagList.length}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-normal text-black">Tags</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={panelClass}>
              <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 h-1 w-16 rounded-full bg-blue-700" />
                  <h2 className={sectionTitleClass}>Blog Details</h2>
                  <p className="mt-1 text-sm text-black">Required article identity, category, and publishing controls.</p>
                </div>
                <Badge variant="outline" className="w-fit border-blue-200 bg-white text-black">
                  Blog ready
                </Badge>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-black">Blog Title</Label>
                  <Input id="title" value={form.title} onChange={(event) => handleTitleChange(event.target.value)} className={fieldClass} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-semibold text-black">Slug</Label>
                  <Input id="slug" value={form.slug} onChange={(event) => updateField("slug", event.target.value)} className={fieldClass} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author" className="text-sm font-semibold text-black">Author</Label>
                  <Input id="author" value={form.author} onChange={(event) => updateField("author", event.target.value)} className={fieldClass} required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-sm font-semibold text-black">Category</Label>
                    <span className="rounded-md border border-blue-200 bg-white px-2 py-0.5 text-xs font-semibold text-black">Required</span>
                  </div>
                  <Select value={form.category} onValueChange={(value) => updateField("category", value)}>
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {blogCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-black">Status</Label>
                  <Select value={form.status} onValueChange={(value) => updateField("status", value)}>
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {blogStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishDate" className="text-sm font-semibold text-black">Publish Date</Label>
                  <Input id="publishDate" type="date" value={form.publishDate} onChange={(event) => updateField("publishDate", event.target.value)} className={fieldClass} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="readTime" className="text-sm font-semibold text-black">Read Time</Label>
                  <Input id="readTime" value={form.readTime} onChange={(event) => updateField("readTime", event.target.value)} className={fieldClass} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="excerpt" className="text-sm font-semibold text-black">Excerpt</Label>
                  <Textarea id="excerpt" value={form.excerpt} onChange={(event) => updateField("excerpt", event.target.value)} className="min-h-24 rounded-md border-slate-200 bg-white/95 px-4 py-3 text-sm text-black shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100" required />
                </div>
              </div>
            </div>

            <div className={panelClass}>
              <div className="mb-5 border-b border-slate-200 pb-5">
                <div className="mb-2 h-1 w-16 rounded-full bg-blue-700" />
                <h2 className={sectionTitleClass}>Cover Image</h2>
                <p className="mt-1 text-sm text-black">Upload or paste the main image URL used for the blog card and article header.</p>
              </div>
              <div className="space-y-5">
                <div className="group relative flex aspect-[16/9] w-full flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-blue-300 hover:bg-blue-50">
                  {isUploadingCover ? (
                    <div className="flex flex-col items-center justify-center gap-2 p-4 text-center text-blue-600">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="text-sm font-medium">Uploading cover to Cloudinary...</span>
                    </div>
                  ) : form.coverImage ? (
                    <>
                      <img src={form.coverImage} alt="Blog cover preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => updateField("coverImage", "")}
                        className="absolute inset-0 flex items-center justify-center bg-white/90 text-sm font-semibold text-black opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-black">
                      <UploadCloud className="h-6 w-6" />
                      <span className="text-sm font-medium">Upload Cover</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                    </label>
                  )}
                </div>

                {form.coverImage && (
                  <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-blue-700 bg-white px-4 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-blue-50">
                    <UploadCloud className="h-4 w-4 text-blue-700" />
                    Replace Cover Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                  </label>
                )}
              </div>
            </div>

            <div className={panelClass}>
              <div className="mb-5 border-b border-slate-200 pb-5">
                <div className="mb-2 h-1 w-16 rounded-full bg-blue-700" />
                <h2 className={sectionTitleClass}>Blog Content</h2>
                <p className="mt-1 text-sm text-black">Main article body, tags, and SEO metadata.</p>
              </div>
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-semibold text-black">Content</Label>
                  <Textarea id="content" value={form.content} onChange={(event) => updateField("content", event.target.value)} className="min-h-56 rounded-md border-slate-200 bg-white/95 px-4 py-3 text-sm text-black shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-semibold text-black">Tags</Label>
                  <Input id="tags" value={form.tags} onChange={(event) => updateField("tags", event.target.value)} className={fieldClass} />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle" className="text-sm font-semibold text-black">Meta Title</Label>
                    <Input id="metaTitle" value={form.metaTitle} onChange={(event) => updateField("metaTitle", event.target.value)} className={fieldClass} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription" className="text-sm font-semibold text-black">Meta Description</Label>
                    <Input id="metaDescription" value={form.metaDescription} onChange={(event) => updateField("metaDescription", event.target.value)} className={fieldClass} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-black">
                <Switch checked={form.isFeatured} onCheckedChange={(checked) => updateField("isFeatured", checked)} />
                Featured Blog
              </label>
              <div className="flex gap-3">
                {isEditMode ? (
                  <>
                    <Button type="submit" disabled={isSubmitting} className="h-11 bg-blue-700 px-5 font-semibold text-white shadow-sm hover:bg-blue-800">
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Update Blog
                    </Button>
                    <Link href="/admin/blogs-list">
                      <Button type="button" variant="outline" className="h-11 border-slate-200 px-5 font-semibold text-slate-700 hover:bg-slate-50">
                        Cancel
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button type="button" disabled={isSubmitting} onClick={handleAddBlog} className="h-11 bg-blue-700 px-5 font-semibold text-white shadow-sm hover:bg-blue-800">
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Add Blog
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="h-11 border border-blue-700 bg-white px-5 font-semibold text-black shadow-sm hover:bg-blue-50">
                      <Save className="mr-2 h-4 w-4" />
                      Save Blog Draft
                    </Button>
                  </>
                )}
              </div>
            </div>
          </form>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className={panelClass}>
              <div className="mb-4 flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-blue-700" />
                <h2 className={sectionTitleClass}>Preview</h2>
              </div>
              <div className="aspect-video overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                {form.coverImage ? (
                  <img src={form.coverImage} alt={form.title || "Blog preview"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-black">No cover image</div>
                )}
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="font-bold text-black">{form.title || "Untitled blog"}</h3>
                  <p className="mt-1 text-sm text-black">{form.excerpt || "Blog excerpt preview"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-blue-200 bg-white text-black">{form.category}</Badge>
                  <Badge variant="outline" className="border-slate-200 bg-white text-black">{form.status}</Badge>
                  {form.isFeatured && <Badge variant="outline" className="border-slate-200 bg-white text-black">Featured</Badge>}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-black">
                  <CalendarDays className="h-4 w-4 text-blue-700" />
                  {form.publishDate || "No publish date"} · {form.readTime || "Read time"}
                </div>
              </div>
            </section>

            <section className={panelClass}>
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-700" />
                <h2 className={sectionTitleClass}>Recent Blog Drafts</h2>
              </div>
              <div className="space-y-3">
                {blogs.slice(0, 4).map((blog) => (
                  <button
                    key={blog.id}
                    type="button"
                    onClick={() => setForm(blog)}
                    className="w-full rounded-md border border-slate-200 bg-white p-3 text-left transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-black">{blog.title}</div>
                        <div className="mt-1 text-xs text-black">{blog.category}</div>
                      </div>
                      <div className="text-sm font-semibold text-black">{blog.status}</div>
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
