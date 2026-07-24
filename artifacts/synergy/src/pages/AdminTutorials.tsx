import { FormEvent, useMemo, useState } from "react";
import { CalendarDays, Play, Save, Video } from "lucide-react";
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

type AdminTutorial = {
  id: string;
  title: string;
  slug: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  channelName: string;
  instructor: string;
  category: string;
  level: string;
  status: string;
  duration: string;
  publishDate: string;
  shortDescription: string;
  description: string;
  tags: string;
  resourcesUrl: string;
  metaTitle: string;
  metaDescription: string;
  isFeatured: boolean;
};

const defaultTutorial: AdminTutorial = {
  id: "tutorial-draft-001",
  title: "Getting Started with ESP32 IoT Projects",
  slug: "getting-started-with-esp32-iot-projects",
  youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  thumbnailUrl: "",
  channelName: "Synergy Tutorials",
  instructor: "Synergy Team",
  category: "IoT",
  level: "Beginner",
  status: "Draft",
  duration: "12:30",
  publishDate: "2026-06-29",
  shortDescription: "Learn the basic setup, wiring, and first upload flow for ESP32 based IoT projects.",
  description:
    "This tutorial walks through ESP32 board selection, USB driver checks, IDE setup, Wi-Fi configuration, and a simple first test for IoT project development.",
  tags: "ESP32,IoT,Development Boards,Tutorial",
  resourcesUrl: "https://synergy.in/resources/esp32-starter",
  metaTitle: "Getting Started with ESP32 IoT Projects",
  metaDescription: "A beginner-friendly ESP32 tutorial covering setup, wiring, Wi-Fi, and first project checks.",
  isFeatured: true,
};

const initialTutorials: AdminTutorial[] = [
  defaultTutorial,
  {
    ...defaultTutorial,
    id: "tutorial-draft-002",
    title: "How to Wire a Relay Module Safely",
    slug: "how-to-wire-a-relay-module-safely",
    youtubeUrl: "https://youtu.be/aqz-KE-bpKQ",
    category: "Automation",
    level: "Intermediate",
    status: "Published",
    duration: "09:45",
    isFeatured: false,
  },
];

const tutorialCategories = ["IoT", "Automation", "Power Electronics", "Sensors", "Development Boards"];
const tutorialLevels = ["Beginner", "Intermediate", "Advanced"];
const tutorialStatuses = ["Draft", "Review", "Published", "Archived"];

const fieldClass =
  "h-12 rounded-md border-slate-200 bg-white/95 px-4 text-sm text-black shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100";
const textareaClass =
  "min-h-32 rounded-md border-slate-200 bg-white/95 px-4 py-3 text-sm text-black shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100";
const panelClass = "rounded-md border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70";
const sectionTitleClass = "text-base font-bold text-black";

function getYoutubeVideoId(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const match = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);

  return match?.[1] || trimmed;
}

export default function AdminTutorials() {
  const [form, setForm] = useState<AdminTutorial>(defaultTutorial);
  const [tutorials, setTutorials] = useState<AdminTutorial[]>(initialTutorials);

  const youtubeVideoId = useMemo(() => getYoutubeVideoId(form.youtubeUrl), [form.youtubeUrl]);
  const thumbnailUrl = form.thumbnailUrl || (youtubeVideoId ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg` : "");
  const tagList = useMemo(
    () => form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    [form.tags]
  );

  const updateField = (field: keyof AdminTutorial, value: string | boolean) => {
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

  const handleAddTutorial = async () => {
    // Validation
    if (!form.title || !form.slug || !form.youtubeUrl || !form.channelName || !form.category || !form.duration || !form.shortDescription || !form.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields: Title, Slug, YouTube URL, Channel, Category, Duration, Short Description, and Description.",
        variant: "destructive",
      });
      return;
    }

    let finalSlug = form.slug;
    let slugCounter = 1;
    let slugExists = true;

    // Try to find a unique slug
    while (slugExists) {
      try {
        const testSlug = slugCounter === 1 ? finalSlug : `${finalSlug}-${slugCounter}`;
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/tutorials?slug=${testSlug}`, {
          method: 'GET',
        });
        if (response.ok) {
          const tutorials = await response.json();
          const existingTutorial = tutorials.find((t: any) => t.slug === testSlug);
          if (!existingTutorial) {
            finalSlug = testSlug;
            slugExists = false;
          } else {
            slugCounter++;
          }
        } else {
          // If API fails, proceed with current slug and let backend handle it
          slugExists = false;
        }
      } catch (error) {
        // If check fails, proceed with current slug
        slugExists = false;
      }
    }

    const tutorialToSave = {
      title: form.title,
      slug: finalSlug,
      youtubeUrl: form.youtubeUrl,
      thumbnailUrl: form.thumbnailUrl,
      channelName: form.channelName,
      instructor: form.instructor,
      category: form.category,
      level: form.level,
      status: "Published",
      duration: form.duration,
      publishDate: form.publishDate || new Date().toISOString().split('T')[0],
      shortDescription: form.shortDescription,
      description: form.description,
      tags: tagList,
      resourcesUrl: form.resourcesUrl,
      metaTitle: form.metaTitle || form.title,
      metaDescription: form.metaDescription || form.shortDescription,
      isFeatured: form.isFeatured,
    };

    try {
      console.log("Sending tutorial data:", tutorialToSave);
      const response = await fetchApi('/tutorials', {
        method: 'POST',
        body: JSON.stringify(tutorialToSave),
      });

      if (response) {
        toast({
          title: "Tutorial added successfully",
          description: "The tutorial has been published to the website.",
        });
        
        // Reset form
        setForm({
          ...defaultTutorial,
          id: `tutorial-draft-${String(tutorials.length + 1).padStart(3, "0")}`,
          title: "",
          slug: "",
          youtubeUrl: "",
          thumbnailUrl: "",
          shortDescription: "",
          description: "",
          tags: "",
          resourcesUrl: "",
          metaTitle: "",
          metaDescription: "",
        });
      }
    } catch (error) {
      console.error("Error adding tutorial:", error);
      toast({
        title: "Error adding tutorial",
        description: error instanceof Error ? error.message : "Failed to add tutorial to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tutorialToSave = {
      title: form.title,
      slug: form.slug,
      youtubeUrl: form.youtubeUrl,
      thumbnailUrl: form.thumbnailUrl,
      channelName: form.channelName,
      instructor: form.instructor,
      category: form.category,
      level: form.level,
      status: form.status,
      duration: form.duration,
      publishDate: form.publishDate,
      shortDescription: form.shortDescription,
      description: form.description,
      tags: tagList,
      resourcesUrl: form.resourcesUrl,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      isFeatured: form.isFeatured,
    };

    try {
      const response = await fetchApi('/tutorials', {
        method: 'POST',
        body: JSON.stringify(tutorialToSave),
      });

      if (response) {
        toast({
          title: "Tutorial saved successfully",
          description: "The tutorial has been added to the database.",
        });
        
        // Reset form
        setForm({
          ...defaultTutorial,
          id: `tutorial-draft-${String(tutorials.length + 1).padStart(3, "0")}`,
          title: "",
          slug: "",
          youtubeUrl: "",
          thumbnailUrl: "",
          shortDescription: "",
          description: "",
          tags: "",
          resourcesUrl: "",
          metaTitle: "",
          metaDescription: "",
        });
      }
    } catch (error) {
      toast({
        title: "Error saving tutorial",
        description: "Failed to save tutorial to database. Please try again.",
        variant: "destructive",
      });
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
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-black">Tutorial Admin</div>
                  <h1 className="text-3xl font-bold tracking-normal text-black">Add Tutorial Video</h1>
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-black">
                Add YouTube tutorial metadata while showing only the video thumbnail with a play button in previews.
              </p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50/70 text-center">
              <div className="p-5">
                <div className="text-2xl font-bold text-black">{tutorials.length}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-normal text-black">Drafts</div>
              </div>
              <div className="p-5">
                <div className="text-2xl font-bold text-black">{form.level}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-normal text-black">Level</div>
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
                  <h2 className={sectionTitleClass}>Video Details</h2>
                  <p className="mt-1 text-sm text-black">Required YouTube source, title, channel, and tutorial classification.</p>
                </div>
                <Badge variant="outline" className="w-fit border-blue-200 bg-white text-black">
                  YouTube ready
                </Badge>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="youtubeUrl" className="text-sm font-semibold text-black">YouTube Video URL or ID</Label>
                  <Input id="youtubeUrl" value={form.youtubeUrl} onChange={(event) => updateField("youtubeUrl", event.target.value)} className={fieldClass} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-black">Tutorial Title</Label>
                  <Input id="title" value={form.title} onChange={(event) => handleTitleChange(event.target.value)} className={fieldClass} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-semibold text-black">Slug</Label>
                  <Input id="slug" value={form.slug} onChange={(event) => updateField("slug", event.target.value)} className={fieldClass} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channelName" className="text-sm font-semibold text-black">YouTube Channel</Label>
                  <Input id="channelName" value={form.channelName} onChange={(event) => updateField("channelName", event.target.value)} className={fieldClass} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor" className="text-sm font-semibold text-black">Instructor</Label>
                  <Input id="instructor" value={form.instructor} onChange={(event) => updateField("instructor", event.target.value)} className={fieldClass} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-semibold text-black">Video Duration</Label>
                  <Input id="duration" value={form.duration} onChange={(event) => updateField("duration", event.target.value)} className={fieldClass} required />
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
                      {tutorialCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-black">Level</Label>
                  <Select value={form.level} onValueChange={(value) => updateField("level", value)}>
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {tutorialLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
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
                      {tutorialStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishDate" className="text-sm font-semibold text-black">Publish Date</Label>
                  <Input id="publishDate" type="date" value={form.publishDate} onChange={(event) => updateField("publishDate", event.target.value)} className={fieldClass} />
                </div>
              </div>
            </div>

            <div className={panelClass}>
              <div className="mb-5 border-b border-slate-200 pb-5">
                <div className="mb-2 h-1 w-16 rounded-full bg-blue-700" />
                <h2 className={sectionTitleClass}>Thumbnail Preview</h2>
                <p className="mt-1 text-sm text-black">The page displays the YouTube thumbnail only, with a play button overlay.</p>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt={form.title || "Tutorial thumbnail"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-black">Enter a YouTube URL to show thumbnail</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-blue-700 shadow-md">
                    <Play className="ml-1 h-7 w-7 fill-current" />
                  </div>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <Label htmlFor="thumbnailUrl" className="text-sm font-semibold text-black">Custom Thumbnail URL</Label>
                <Input id="thumbnailUrl" value={form.thumbnailUrl} onChange={(event) => updateField("thumbnailUrl", event.target.value)} className={fieldClass} placeholder="Optional: leave blank to use the YouTube thumbnail" />
              </div>
            </div>

            <div className={panelClass}>
              <div className="mb-5 border-b border-slate-200 pb-5">
                <div className="mb-2 h-1 w-16 rounded-full bg-blue-700" />
                <h2 className={sectionTitleClass}>Tutorial Content</h2>
                <p className="mt-1 text-sm text-black">Description, resources, tags, and SEO metadata.</p>
              </div>
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="shortDescription" className="text-sm font-semibold text-black">Short Description</Label>
                  <Input id="shortDescription" value={form.shortDescription} onChange={(event) => updateField("shortDescription", event.target.value)} className={fieldClass} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-black">Full Description</Label>
                  <Textarea id="description" value={form.description} onChange={(event) => updateField("description", event.target.value)} className={textareaClass} />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-semibold text-black">Tags</Label>
                    <Input id="tags" value={form.tags} onChange={(event) => updateField("tags", event.target.value)} className={fieldClass} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resourcesUrl" className="text-sm font-semibold text-black">Resources URL</Label>
                    <Input id="resourcesUrl" value={form.resourcesUrl} onChange={(event) => updateField("resourcesUrl", event.target.value)} className={fieldClass} />
                  </div>
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
                Featured Tutorial
              </label>
              <div className="flex gap-3">
                <Button type="button" onClick={handleAddTutorial} className="h-11 bg-blue-700 px-5 font-semibold text-white shadow-sm hover:bg-blue-800">
                  <Save className="h-4 w-4" />
                  Add Tutorial
                </Button>
                <Button type="submit" className="h-11 border border-blue-700 bg-white px-5 font-semibold text-black shadow-sm hover:bg-blue-50">
                  <Save className="h-4 w-4" />
                  Save Tutorial Draft
                </Button>
              </div>
            </div>
          </form>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className={panelClass}>
              <div className="mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-700" />
                <h2 className={sectionTitleClass}>Video Card Preview</h2>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt={form.title || "Tutorial preview"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-black">No thumbnail</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-blue-700 shadow-md">
                    <Play className="ml-1 h-6 w-6 fill-current" />
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="font-bold text-black">{form.title || "Untitled tutorial"}</h3>
                  <p className="mt-1 text-sm text-black">{form.shortDescription || "Tutorial short description"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-blue-200 bg-white text-black">{form.category}</Badge>
                  <Badge variant="outline" className="border-slate-200 bg-white text-black">{form.level}</Badge>
                  <Badge variant="outline" className="border-slate-200 bg-white text-black">{form.status}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-black">
                  <CalendarDays className="h-4 w-4 text-blue-700" />
                  {form.publishDate || "No publish date"} · {form.duration || "Duration"}
                </div>
              </div>
            </section>

            <section className={panelClass}>
              <div className="mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-700" />
                <h2 className={sectionTitleClass}>Recent Tutorial Drafts</h2>
              </div>
              <div className="space-y-3">
                {tutorials.slice(0, 4).map((tutorial) => (
                  <button
                    key={tutorial.id}
                    type="button"
                    onClick={() => setForm(tutorial)}
                    className="w-full rounded-md border border-slate-200 bg-white p-3 text-left transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-black">{tutorial.title}</div>
                        <div className="mt-1 text-xs text-black">{tutorial.category}</div>
                      </div>
                      <div className="text-sm font-semibold text-black">{tutorial.status}</div>
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
