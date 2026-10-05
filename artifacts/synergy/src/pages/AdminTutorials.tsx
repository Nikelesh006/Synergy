import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Loader2, Play, Save, UploadCloud, Video, Sparkles } from "lucide-react";
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

export const rex32Preset: AdminTutorial = {
  id: "",
  title: "Interfacing Sensors with REX32 Robotics Core",
  slug: "interfacing-sensors-rex32-robotics-core",
  youtubeUrl: "https://www.youtube.com/watch?v=s5Q8hM5H89A",
  thumbnailUrl: "https://placehold.co/800x400/0f172a/38bdf8?text=REX32+Robotics+Core+Sensors",
  channelName: "Synergy Robotics Lab",
  instructor: "Synergy Embedded Systems",
  category: "Sensors",
  level: "Intermediate",
  status: "Published",
  duration: "14:20",
  publishDate: new Date().toISOString().split("T")[0],
  shortDescription: "REX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB.",
  description: "Learn how to get started with the REX32 Robotics Core development board.\n\nREX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB.\n\nIn this step-by-step tutorial, you will learn:\n1. REX32 industrial hardware architecture, power rails, and pin configuration.\n2. Reading on-board sensors and interfacing external I2C/analog sensor modules.\n3. Safe high-power motor driver configuration and PWM speed control.\n4. Isolated AC load control switching with opto-isolated channels.\n5. Real-time telemetry monitoring over WiFi and Bluetooth.",
  tags: "REX32, Sensors, Robotics Core, Development Board, Motor Drivers",
  resourcesUrl: "https://github.com/synergy/rex32-robotics-core-guide",
  metaTitle: "Interfacing Sensors with REX32 Robotics Core",
  metaDescription: "REX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB.",
  isFeatured: true,
};

const defaultTutorial: AdminTutorial = {
  id: "",
  title: "",
  slug: "",
  youtubeUrl: "",
  thumbnailUrl: "",
  channelName: "",
  instructor: "",
  category: "",
  level: "Beginner",
  status: "Draft",
  duration: "",
  publishDate: "",
  shortDescription: "",
  description: "",
  tags: "",
  resourcesUrl: "",
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
};

const initialTutorials: AdminTutorial[] = [rex32Preset];

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

export default function AdminTutorials({ params }: { params?: { id?: string } }) {
  const routeParams = useParams<{ id?: string }>();
  const tutorialId = params?.id || routeParams?.id;
  const isEditMode = !!tutorialId;

  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AdminTutorial>(defaultTutorial);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tutorials, setTutorials] = useState<AdminTutorial[]>(initialTutorials);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const list = await fetchApi<any[]>("/tutorials?all=true");
        if (Array.isArray(list) && list.length > 0) {
          setTutorials(list.map((tut: any) => ({
            id: tut._id || tut.id || "",
            title: tut.title || "",
            slug: tut.slug || "",
            youtubeUrl: tut.youtubeUrl || "",
            thumbnailUrl: tut.thumbnailUrl || "",
            channelName: tut.channelName || "",
            instructor: tut.instructor || tut.channelName || "",
            category: tut.category || "",
            level: tut.level || "Beginner",
            status: tut.status || "Draft",
            duration: tut.duration || "",
            publishDate: tut.publishDate || "",
            shortDescription: tut.shortDescription || "",
            description: tut.description || "",
            tags: Array.isArray(tut.tags) ? tut.tags.join(", ") : (tut.tags || ""),
            resourcesUrl: tut.resourcesUrl || "",
            metaTitle: tut.metaTitle || "",
            metaDescription: tut.metaDescription || "",
            isFeatured: Boolean(tut.isFeatured),
          })));
        }
      } catch (e) {
        // keep default preset
      }
    };
    fetchRecent();
  }, []);

  useEffect(() => {
    if (tutorialId) {
      const loadTutorial = async () => {
        try {
          const tut = await fetchApi<any>(`/tutorials/${tutorialId}`);
          if (tut) {
            setForm({
              id: tut._id || tut.id || "",
              title: tut.title || "",
              slug: tut.slug || "",
              youtubeUrl: tut.youtubeUrl || "",
              thumbnailUrl: tut.thumbnailUrl || "",
              channelName: tut.channelName || "",
              instructor: tut.instructor || tut.channelName || "",
              category: tut.category || "",
              level: tut.level || "Beginner",
              status: tut.status || "Draft",
              duration: tut.duration || "",
              publishDate: tut.publishDate || "",
              shortDescription: tut.shortDescription || "",
              description: tut.description || "",
              tags: Array.isArray(tut.tags) ? tut.tags.join(", ") : (tut.tags || ""),
              resourcesUrl: tut.resourcesUrl || "",
              metaTitle: tut.metaTitle || "",
              metaDescription: tut.metaDescription || "",
              isFeatured: Boolean(tut.isFeatured),
            });
          }
        } catch (err) {
          toast({
            title: "Error loading tutorial",
            description: "Could not fetch tutorial details for editing.",
            variant: "destructive",
          });
        }
      };
      loadTutorial();
    } else {
      setForm(defaultTutorial);
    }
  }, [tutorialId]);

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

  const handleThumbnailUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      toast({ title: "Image not added", description: "Use image files up to 10 MB.", variant: "destructive" });
      event.target.value = "";
      return;
    }

    setIsUploadingThumbnail(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Unable to read image"));
        reader.readAsDataURL(file);
      });

      try {
        const cloudinaryUrl = await uploadImageToCloudinary(dataUrl, "synergy/tutorials");
        updateField("thumbnailUrl", cloudinaryUrl);
        toast({ title: "Thumbnail uploaded", description: "Image successfully uploaded to Cloudinary." });
      } catch (uploadErr) {
        console.warn("Cloudinary upload fallback to data URL:", uploadErr);
        updateField("thumbnailUrl", dataUrl);
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
      setIsUploadingThumbnail(false);
      event.target.value = "";
    }
  };

  const saveTutorial = async (overrideStatus?: string) => {
    // Validation
    if (!form.title || !form.slug || !form.youtubeUrl || !form.channelName || !form.category || !form.duration || !form.shortDescription || !form.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields: Title, Slug, YouTube URL, Channel, Category, Duration, Short Description, and Description.",
        variant: "destructive",
      });
      return;
    }

    const tutorialToSave = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      youtubeUrl: form.youtubeUrl.trim(),
      thumbnailUrl: form.thumbnailUrl || (youtubeVideoId ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg` : ""),
      channelName: form.channelName.trim(),
      instructor: form.instructor.trim() || form.channelName.trim(),
      category: form.category.trim(),
      level: form.level || "Beginner",
      status: overrideStatus || form.status || "Published",
      duration: form.duration.trim(),
      publishDate: form.publishDate || new Date().toISOString().split('T')[0],
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      tags: tagList,
      resourcesUrl: form.resourcesUrl || "",
      metaTitle: form.metaTitle || form.title,
      metaDescription: form.metaDescription || form.shortDescription,
      isFeatured: form.isFeatured,
    };

    try {
      setIsSubmitting(true);
      if (isEditMode) {
        await fetchApi(`/tutorials/${tutorialId}`, {
          method: 'PUT',
          body: JSON.stringify(tutorialToSave),
        });
        await queryClient.invalidateQueries({ queryKey: ["tutorials"] });
        toast({
          title: "Tutorial updated successfully",
          description: "The tutorial changes have been saved.",
        });
      } else {
        await fetchApi('/tutorials', {
          method: 'POST',
          body: JSON.stringify(tutorialToSave),
        });
        await queryClient.invalidateQueries({ queryKey: ["tutorials"] });
        toast({
          title: "Tutorial added successfully",
          description: "The tutorial has been added and published.",
        });
      }
      setLocation("/admin/tutorials-list");
    } catch (error) {
      console.error("Error saving tutorial:", error);
      toast({
        title: isEditMode ? "Error updating tutorial" : "Error adding tutorial",
        description: error instanceof Error ? error.message : "Failed to save tutorial to database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTutorial = async () => {
    await saveTutorial("Published");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveTutorial(isEditMode ? undefined : form.status);
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
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-black">Tutorial Admin</div>
                    <h1 className="text-3xl font-bold tracking-normal text-black">
                      {isEditMode ? "Edit Tutorial" : "Add Tutorial Video"}
                    </h1>
                  </div>
                </div>
                <Link href="/admin/tutorials-list">
                  <Button variant="outline" className="h-10 border-slate-200 text-slate-700 hover:bg-slate-50">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Tutorials List
                  </Button>
                </Link>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-black">
                {isEditMode
                  ? "Update video tutorial metadata, difficulty levels, duration, and content."
                  : "Add YouTube tutorial metadata while showing only the video thumbnail with a play button in previews."}
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
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setForm(rex32Preset);
                      toast({
                        title: "REX32 Template Loaded",
                        description: "Populated form with REX32 Robotics Core & Sensor tutorial preset.",
                      });
                    }}
                    className="h-8 border-blue-300 bg-blue-50 text-xs font-semibold text-blue-800 hover:bg-blue-100"
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                    Load REX32 Sensor Preset
                  </Button>
                  <Badge variant="outline" className="w-fit border-blue-200 bg-white text-black">
                    YouTube ready
                  </Badge>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="youtubeUrl" className="text-sm font-semibold text-black">YouTube Video URL or ID</Label>
                  <Input
                    id="youtubeUrl"
                    value={form.youtubeUrl}
                    onChange={(event) => updateField("youtubeUrl", event.target.value)}
                    className={fieldClass}
                    placeholder="https://www.youtube.com/watch?v=s5Q8hM5H89A"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-black">Tutorial Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    className={fieldClass}
                    placeholder="e.g. Interfacing Sensors with REX32 Robotics Core"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-semibold text-black">Slug</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(event) => updateField("slug", event.target.value)}
                    className={fieldClass}
                    placeholder="e.g. interfacing-sensors-rex32-robotics-core"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channelName" className="text-sm font-semibold text-black">YouTube Channel</Label>
                  <Input
                    id="channelName"
                    value={form.channelName}
                    onChange={(event) => updateField("channelName", event.target.value)}
                    className={fieldClass}
                    placeholder="e.g. Synergy Robotics Lab"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor" className="text-sm font-semibold text-black">Instructor</Label>
                  <Input
                    id="instructor"
                    value={form.instructor}
                    onChange={(event) => updateField("instructor", event.target.value)}
                    className={fieldClass}
                    placeholder="e.g. Synergy Embedded Systems"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-semibold text-black">Video Duration</Label>
                  <Input
                    id="duration"
                    value={form.duration}
                    onChange={(event) => updateField("duration", event.target.value)}
                    className={fieldClass}
                    placeholder="e.g. 14:20"
                    required
                  />
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

              <div className="relative aspect-video overflow-hidden rounded-md border border-slate-200 bg-slate-900">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt={form.title || "Tutorial thumbnail"} className="h-full w-full object-cover" />
                ) : (
                  <img
                    src="https://placehold.co/800x400/0f172a/38bdf8?text=REX32+Robotics+Core+Sensors"
                    alt="REX32 placeholder thumbnail"
                    className="h-full w-full object-cover opacity-90"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-blue-700 shadow-md">
                    <Play className="ml-1 h-7 w-7 fill-current" />
                  </div>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <Label htmlFor="thumbnailUrl" className="text-sm font-semibold text-black">Custom Thumbnail</Label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    id="thumbnailUrl"
                    value={form.thumbnailUrl}
                    onChange={(event) => updateField("thumbnailUrl", event.target.value)}
                    className={fieldClass}
                    placeholder="https://placehold.co/800x400/0f172a/38bdf8?text=REX32+Robotics+Core+Sensors"
                  />
                  <label className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-blue-700 bg-white px-4 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-blue-50">
                    {isUploadingThumbnail ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-blue-700" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4 text-blue-700" />
                        Upload Thumbnail
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" disabled={isUploadingThumbnail} onChange={handleThumbnailUpload} />
                  </label>
                </div>
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
                  <Input
                    id="shortDescription"
                    value={form.shortDescription}
                    onChange={(event) => updateField("shortDescription", event.target.value)}
                    className={fieldClass}
                    placeholder="REX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-black">Full Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    className={textareaClass}
                    placeholder="Learn how to get started with the REX32 Robotics Core development board. REX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB."
                  />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-semibold text-black">Tags</Label>
                    <Input
                      id="tags"
                      value={form.tags}
                      onChange={(event) => updateField("tags", event.target.value)}
                      className={fieldClass}
                      placeholder="REX32, Sensors, Robotics Core, Development Board, Motor Drivers"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resourcesUrl" className="text-sm font-semibold text-black">Resources URL</Label>
                    <Input
                      id="resourcesUrl"
                      value={form.resourcesUrl}
                      onChange={(event) => updateField("resourcesUrl", event.target.value)}
                      className={fieldClass}
                      placeholder="https://github.com/synergy/rex32-robotics-core-guide"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle" className="text-sm font-semibold text-black">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={form.metaTitle}
                      onChange={(event) => updateField("metaTitle", event.target.value)}
                      className={fieldClass}
                      placeholder="Interfacing Sensors with REX32 Robotics Core"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription" className="text-sm font-semibold text-black">Meta Description</Label>
                    <Input
                      id="metaDescription"
                      value={form.metaDescription}
                      onChange={(event) => updateField("metaDescription", event.target.value)}
                      className={fieldClass}
                      placeholder="REX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB."
                    />
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
                {isEditMode ? (
                  <>
                    <Button type="submit" disabled={isSubmitting} className="h-11 bg-blue-700 px-5 font-semibold text-white shadow-sm hover:bg-blue-800">
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Update Tutorial
                    </Button>
                    <Link href="/admin/tutorials-list">
                      <Button type="button" variant="outline" className="h-11 border-slate-200 px-5 font-semibold text-slate-700 hover:bg-slate-50">
                        Cancel
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button type="button" disabled={isSubmitting} onClick={handleAddTutorial} className="h-11 bg-blue-700 px-5 font-semibold text-white shadow-sm hover:bg-blue-800">
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Add Tutorial
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="h-11 border border-blue-700 bg-white px-5 font-semibold text-black shadow-sm hover:bg-blue-50">
                      <Save className="mr-2 h-4 w-4" />
                      Save Tutorial Draft
                    </Button>
                  </>
                )}
              </div>
            </div>
          </form>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className={panelClass}>
              <div className="mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-700" />
                <h2 className={sectionTitleClass}>Video Card Preview</h2>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-md border border-slate-200 bg-slate-900">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt={form.title || "Tutorial preview"} className="h-full w-full object-cover" />
                ) : (
                  <img
                    src="https://placehold.co/800x400/0f172a/38bdf8?text=REX32+Robotics+Core+Sensors"
                    alt="REX32 placeholder preview"
                    className="h-full w-full object-cover opacity-90"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-blue-700 shadow-md">
                    <Play className="ml-1 h-6 w-6 fill-current" />
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="font-bold text-black">{form.title || "Interfacing Sensors with REX32 Robotics Core"}</h3>
                  <p className="mt-1 text-sm text-black">{form.shortDescription || "REX32 Robotics Core integrates full-featured high-power motor drivers, AC load control, on-board sensors, and wireless connectivity directly onto a single industrial-grade PCB."}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-blue-200 bg-white text-black">{form.category || "Sensors"}</Badge>
                  <Badge variant="outline" className="border-slate-200 bg-white text-black">{form.level || "Intermediate"}</Badge>
                  <Badge variant="outline" className="border-slate-200 bg-white text-black">{form.status || "Draft"}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-black">
                  <CalendarDays className="h-4 w-4 text-blue-700" />
                  {form.publishDate || "2024-06-01"} · {form.duration || "14:20"}
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
