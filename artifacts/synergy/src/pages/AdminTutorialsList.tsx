import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Video, 
  Calendar,
  AlertCircle,
  Play
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/api";
import { useTutorials, TutorialPost } from "@/hooks/useTutorials";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

function getYoutubeVideoId(value: string) {
  const trimmed = value ? value.trim() : "";
  if (!trimmed) return "";
  const match = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || "";
}

export default function AdminTutorialsList() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch all tutorials (admin view)
  const { data: tutorials = [], isLoading, error } = useTutorials({ all: "true" });

  const getTutorialId = (tutorial: TutorialPost) => tutorial._id || tutorial.id || "";

  // Filter based on search term
  const filteredTutorials = tutorials.filter((tutorial: TutorialPost) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = (tutorial.title || "").toLowerCase().includes(term);
    const instructorMatch = (tutorial.instructor || "").toLowerCase().includes(term);
    const channelMatch = (tutorial.channelName || "").toLowerCase().includes(term);
    const categoryMatch = (tutorial.category || "").toLowerCase().includes(term);
    const tagMatch = Array.isArray(tutorial.tags) && tutorial.tags.some(t => t.toLowerCase().includes(term));
    return titleMatch || instructorMatch || channelMatch || categoryMatch || tagMatch;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredTutorials.map(getTutorialId).filter(Boolean));
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
    if (!confirm("Are you sure you want to delete this tutorial? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(id);
      await fetchApi(`/tutorials/${id}`, {
        method: "DELETE",
      });
      
      await queryClient.invalidateQueries({ queryKey: ["tutorials"] });
      toast({
        title: "Tutorial Deleted",
        description: "The tutorial has been removed from the website.",
      });
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } catch (err) {
      toast({
        title: "Error deleting tutorial",
        description: err instanceof Error ? err.message : "Failed to delete tutorial.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete all ${selectedIds.length} selected tutorials?`)) {
      return;
    }

    try {
      let successCount = 0;
      for (const id of selectedIds) {
        await fetchApi(`/tutorials/${id}`, { method: "DELETE" });
        successCount++;
      }
      await queryClient.invalidateQueries({ queryKey: ["tutorials"] });
      toast({
        title: "Bulk Deletion Successful",
        description: `Successfully deleted ${successCount} tutorials.`,
      });
      setSelectedIds([]);
    } catch (err) {
      toast({
        title: "Bulk Deletion Error",
        description: "An error occurred while deleting one or more tutorials.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderStatusBadge = (status: string) => {
    const norm = (status || "").toLowerCase();
    if (norm === "published") {
      return (
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">
          Published
        </Badge>
      );
    }
    if (norm === "draft") {
      return (
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 font-semibold">
          Draft
        </Badge>
      );
    }
    if (norm === "review") {
      return (
        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 font-semibold">
          Review
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 font-semibold">
        {status || "Unknown"}
      </Badge>
    );
  };

  const renderLevelBadge = (level: string) => {
    const norm = (level || "").toLowerCase();
    if (norm === "beginner") {
      return (
        <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-700 font-semibold">
          Beginner
        </Badge>
      );
    }
    if (norm === "intermediate") {
      return (
        <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold">
          Intermediate
        </Badge>
      );
    }
    if (norm === "advanced") {
      return (
        <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700 font-semibold">
          Advanced
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 font-semibold">
        {level || "General"}
      </Badge>
    );
  };

  const allSelected = filteredTutorials.length > 0 && selectedIds.length === filteredTutorials.length;

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminNav />

        {/* Header Dashboard section */}
        <div className="mb-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-black">Admin Dashboard</div>
                <h1 className="text-3xl font-bold tracking-normal text-black">Tutorials List</h1>
              </div>
            </div>
            <Link href="/admin/tutorials">
              <Button className="h-11 bg-blue-700 font-semibold text-white shadow-sm hover:bg-blue-800">
                <Plus className="mr-2 h-4 w-4" /> Add Tutorial
              </Button>
            </Link>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Review video tutorials, difficulty levels, duration, and publication status.
          </p>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tutorials by title, instructor, channel, category..."
              className="h-11 pl-9 border-slate-200 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">
                {selectedIds.length} tutorial(s) selected
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
              <div className="text-sm text-slate-500 animate-pulse">Loading tutorials...</div>
            </div>
          ) : error ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="text-sm font-semibold text-slate-700">Failed to load tutorials</div>
              <div className="text-xs text-slate-400">Please try refreshing the page</div>
            </div>
          ) : filteredTutorials.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <Video className="h-8 w-8 text-slate-300" />
              <div className="text-sm font-semibold text-slate-700">No tutorials found</div>
              <div className="text-xs text-slate-400">Try adjusting your search criteria or add a tutorial.</div>
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
                    <th className="px-6 py-4">Tutorial</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Level</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredTutorials.map((tutorial) => {
                    const tutorialId = getTutorialId(tutorial);
                    const isSelected = selectedIds.includes(tutorialId);
                    const videoId = getYoutubeVideoId(tutorial.youtubeUrl);
                    const thumb = tutorial.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "https://placehold.co/100x100?text=No+Video");

                    return (
                      <tr
                        key={tutorialId || tutorial.slug}
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
                            onChange={(e) => handleSelectRow(tutorialId, e.target.checked)}
                          />
                        </td>

                        {/* Tutorial (image, title, channel, duration) */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-900 group">
                              <img
                                src={getOptimizedImageUrl(thumb, { width: 120, crop: "fill" })}
                                alt={tutorial.title}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Play className="h-4 w-4 fill-white text-white opacity-80" />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs md:max-w-md">
                                {tutorial.title}
                              </div>
                              <div className="text-xs text-slate-400">
                                {tutorial.channelName || tutorial.instructor || "Synergy"} {tutorial.duration ? `• ${tutorial.duration}` : ""}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="text-slate-700 font-medium">{tutorial.category || "General"}</span>
                        </td>

                        {/* Level */}
                        <td className="px-6 py-4">
                          {renderLevelBadge(tutorial.level)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {renderStatusBadge(tutorial.status)}
                            {tutorial.isFeatured && (
                              <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 font-semibold">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {formatDate(tutorial.publishDate || tutorial.createdAt || tutorial.updatedAt)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View button (eye icon) */}
                            <Link href={`/tutorial/${tutorial.slug}`}>
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
                            <Link href={`/admin/edit-tutorial/${tutorialId || tutorial.slug}`}>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                title="Edit Tutorial"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>

                            {/* Delete button */}
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={isDeleting === tutorialId}
                              onClick={() => handleDelete(tutorialId)}
                              className="h-8 w-8 border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                              title="Delete Tutorial"
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
