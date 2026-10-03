import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  FileText, 
  Calendar,
  AlertCircle
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/api";
import { useBlogPosts, BlogPost } from "@/hooks/useBlog";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

export default function AdminBlogsList() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch all blogs (admin view)
  const { data: blogs = [], isLoading, error } = useBlogPosts({ all: "true" });

  const getBlogId = (blog: BlogPost) => blog._id || blog.id || "";

  // Filter based on search term
  const filteredBlogs = blogs.filter((blog: BlogPost) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = (blog.title || "").toLowerCase().includes(term);
    const authorMatch = (blog.author || "").toLowerCase().includes(term);
    const categoryMatch = (blog.category || "").toLowerCase().includes(term);
    const tagMatch = Array.isArray(blog.tags) && blog.tags.some(t => t.toLowerCase().includes(term));
    return titleMatch || authorMatch || categoryMatch || tagMatch;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredBlogs.map(getBlogId).filter(Boolean));
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
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(id);
      await fetchApi(`/blogs/${id}`, {
        method: "DELETE",
      });
      
      await queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast({
        title: "Blog Deleted",
        description: "The blog post has been removed from the website.",
      });
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } catch (err) {
      toast({
        title: "Error deleting blog",
        description: err instanceof Error ? err.message : "Failed to delete blog.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete all ${selectedIds.length} selected blogs?`)) {
      return;
    }

    try {
      let successCount = 0;
      for (const id of selectedIds) {
        await fetchApi(`/blogs/${id}`, { method: "DELETE" });
        successCount++;
      }
      await queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast({
        title: "Bulk Deletion Successful",
        description: `Successfully deleted ${successCount} blogs.`,
      });
      setSelectedIds([]);
    } catch (err) {
      toast({
        title: "Bulk Deletion Error",
        description: "An error occurred while deleting one or more blogs.",
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

  const allSelected = filteredBlogs.length > 0 && selectedIds.length === filteredBlogs.length;

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminNav />

        {/* Header Dashboard section */}
        <div className="mb-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-black">Admin Dashboard</div>
                <h1 className="text-3xl font-bold tracking-normal text-black">Blogs List</h1>
              </div>
            </div>
            <Link href="/admin/blogs">
              <Button className="h-11 bg-blue-700 font-semibold text-white shadow-sm hover:bg-blue-800">
                <Plus className="mr-2 h-4 w-4" /> Add Blog
              </Button>
            </Link>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Review blog articles, publication status, categories, and content updates.
          </p>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search blogs by title, author, category, or tags..."
              className="h-11 pl-9 border-slate-200 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">
                {selectedIds.length} blog(s) selected
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
              <div className="text-sm text-slate-500 animate-pulse">Loading blogs...</div>
            </div>
          ) : error ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="text-sm font-semibold text-slate-700">Failed to load blogs</div>
              <div className="text-xs text-slate-400">Please try refreshing the page</div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-slate-300" />
              <div className="text-sm font-semibold text-slate-700">No blogs found</div>
              <div className="text-xs text-slate-400">Try adjusting your search criteria or add a blog.</div>
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
                    <th className="px-6 py-4">Blog</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredBlogs.map((blog) => {
                    const blogId = getBlogId(blog);
                    const isSelected = selectedIds.includes(blogId);
                    const coverImage = blog.coverImage || "https://placehold.co/100x100?text=No+Cover";

                    return (
                      <tr
                        key={blogId || blog.slug}
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
                            onChange={(e) => handleSelectRow(blogId, e.target.checked)}
                          />
                        </td>

                        {/* Blog (image, title, author, readTime) */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                              <img
                                src={getOptimizedImageUrl(coverImage, { width: 100, crop: "fill" })}
                                alt={blog.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs md:max-w-md">
                                {blog.title}
                              </div>
                              <div className="text-xs text-slate-400">
                                By {blog.author || "Synergy"} {blog.readTime ? `• ${blog.readTime}` : ""}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="text-slate-700 font-medium">{blog.category || "General"}</span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {renderStatusBadge(blog.status)}
                            {blog.isFeatured && (
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
                            {formatDate(blog.publishDate || blog.createdAt || blog.updatedAt)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View button (eye icon) */}
                            <Link href={`/blog/${blog.slug}`}>
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
                            <Link href={`/admin/edit-blog/${blogId || blog.slug}`}>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                title="Edit Blog"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>

                            {/* Delete button */}
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={isDeleting === blogId}
                              onClick={() => handleDelete(blogId)}
                              className="h-8 w-8 border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                              title="Delete Blog"
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
