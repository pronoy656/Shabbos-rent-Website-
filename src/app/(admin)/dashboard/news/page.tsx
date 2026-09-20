"use client";

import { useState, useRef } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  X,
  AlertTriangle,
  RefreshCw,
  Newspaper,
  CheckCircle2,
  Globe,
  FileEdit,
  ExternalLink,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  useNewsList,
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
} from "@/hooks/useNews";
import type {
  NewsArticle,
  CreateNewsPayload,
  UpdateNewsPayload,
} from "@/types/news.types";

export default function AdminNewsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [deleteConfirmationArticle, setDeleteConfirmationArticle] =
    useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">(
    "all"
  );

  // Form State
  const [formData, setFormData] = useState<CreateNewsPayload>({
    title: "",
    summary: "",
    content: "",
    image: "",
    author: "ShabbosRent Team",
    isPublished: true,
  });
  const [dragActive, setDragActive] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // API Queries & Mutations
  const { data, isLoading, isError, refetch, isFetching } = useNewsList();
  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const deleteMutation = useDeleteNews();

  const articles: NewsArticle[] = Array.isArray(data?.data) ? data.data : [];

  // Filtered Articles
  const filteredArticles = articles.filter((item) => {
    // Status Filter
    if (statusFilter === "published" && !item.isPublished) return false;
    if (statusFilter === "draft" && item.isPublished) return false;

    // Search Filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.summary?.toLowerCase().includes(q) ||
      item.content?.toLowerCase().includes(q) ||
      item.author?.toLowerCase().includes(q)
    );
  });

  // Stats
  const totalCount = articles.length;
  const publishedCount = articles.filter((a) => a.isPublished).length;
  const draftCount = totalCount - publishedCount;

  // Open Modal for New Article
  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      summary: "",
      content: "",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80",
      author: "ShabbosRent Team",
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit Article
  const handleOpenEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || "",
      summary: article.summary || "",
      content: article.content || "",
      image: article.image || "",
      author: article.author || "ShabbosRent Team",
      isPublished: Boolean(article.isPublished),
    });
    setIsModalOpen(true);
  };

  // Rich text formatting helper
  const applyFormatting = (prefix: string, suffix: string = "") => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const selectedText = text.substring(start, end);

    const replacement = `${prefix}${selectedText || "text"}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      );
    }, 0);
  };

  // Handle Image Drag & Drop / Upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleImageFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  // Submit Add / Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter an announcement title");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Please enter announcement content");
      return;
    }

    try {
      if (editingArticle) {
        // Update Existing
        const updatePayload: UpdateNewsPayload = {
          title: formData.title,
          summary: formData.summary,
          content: formData.content,
          image: formData.image,
          author: formData.author,
          isPublished: formData.isPublished,
        };
        await updateMutation.mutateAsync({
          newsId: editingArticle.id,
          payload: updatePayload,
        });
        toast.success("Announcement updated successfully!");
      } else {
        // Create New
        await createMutation.mutateAsync(formData);
        toast.success("Announcement created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save announcement"
      );
    }
  };

  // Toggle Published Status Directly
  const handleTogglePublish = async (article: NewsArticle) => {
    try {
      const newStatus = !article.isPublished;
      await updateMutation.mutateAsync({
        newsId: article.id,
        payload: { isPublished: newStatus },
      });
      toast.success(
        newStatus ? "Article published!" : "Article moved to draft."
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to update article status"
      );
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmationArticle) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmationArticle.id);
      toast.success("Announcement deleted successfully.");
      setDeleteConfirmationArticle(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to delete announcement"
      );
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
              <Newspaper className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              News & Announcements
            </h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Publish official updates, guides, and announcements to the public newsroom.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/news"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Newsroom</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>

          <button
            onClick={() => {
              refetch();
              toast.success("Articles refreshed");
            }}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`}
            />
            Refresh
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Announcement
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Articles
            </span>
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {totalCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <Newspaper className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Published Live
            </span>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {publishedCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Drafts / Unpublished
            </span>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {draftCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FileEdit className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search announcements by title, author, content..."
                className="block w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9.5 pr-8 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white placeholder-zinc-400 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  ×
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "all"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setStatusFilter("published")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "published"
                    ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Published ({publishedCount})
              </button>
              <button
                onClick={() => setStatusFilter("draft")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "draft"
                    ? "bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Drafts ({draftCount})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-950/50 text-[12px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                        <div className="space-y-2">
                          <div className="h-4 w-44 bg-zinc-200 dark:bg-zinc-800 rounded" />
                          <div className="h-3 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center">
                        <X className="w-6 h-6" />
                      </div>
                      <p className="text-zinc-800 dark:text-zinc-200 font-bold">
                        Failed to load announcements
                      </p>
                      <button
                        onClick={() => refetch()}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
                        <Newspaper className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                        {searchQuery || statusFilter !== "all"
                          ? "No matching announcements found"
                          : "No announcements yet"}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {searchQuery || statusFilter !== "all"
                          ? "Try adjusting your filters or search keywords."
                          : "Create your first news announcement to display on the public homepage."}
                      </p>
                      <button
                        onClick={handleOpenAdd}
                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Create Announcement
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors group"
                  >
                    {/* Article Thumbnail + Title & Summary */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5 max-w-md">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-zinc-900 dark:text-white text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                            {item.summary || item.content}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {item.author || "ShabbosRent Team"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        title="Click to toggle publish status"
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                          item.isPublished
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/20"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isPublished ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {item.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 font-medium text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          <Edit className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmationArticle(item)}
                          className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5 text-red-500" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 my-8 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-950/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                    {editingArticle
                      ? "Edit Announcement"
                      : "Create New Announcement"}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {editingArticle
                      ? "Update the details of this news story."
                      : "Fill in the details to publish a new announcement."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitForm}>
              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* 1. Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-900 dark:text-white">
                    Announcement Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Ambassador Program Launched"
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white shadow-xs font-medium"
                  />
                </div>

                {/* 2. Author / Dept & Summary Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-900 dark:text-white">
                      Author / Department
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="e.g. ShabbosRent Team"
                      className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white shadow-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-900 dark:text-white">
                      Summary / Teaser
                    </label>
                    <input
                      type="text"
                      value={formData.summary}
                      onChange={(e) =>
                        setFormData({ ...formData, summary: e.target.value })
                      }
                      placeholder="Short 1-2 sentence preview for cards..."
                      className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white shadow-xs font-medium"
                    />
                  </div>
                </div>

                {/* 3. Full Content - Rich Text Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-900 dark:text-white">
                      Full Content (Rich Text) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-zinc-400">
                      {formData.content.length} characters
                    </span>
                  </div>

                  {/* Rich Text Editor Container */}
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all shadow-xs">
                    {/* Formatting Toolbar */}
                    <div className="flex items-center flex-wrap gap-1 p-2 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => applyFormatting("**", "**")}
                        title="Bold"
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormatting("*", "*")}
                        title="Italic"
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormatting("<u>", "</u>")}
                        title="Underline"
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        <UnderlineIcon className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-700 mx-1" />
                      <button
                        type="button"
                        onClick={() => applyFormatting("### ", "")}
                        title="Heading"
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormatting("\n- ", "")}
                        title="Bullet List"
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormatting("\n1. ", "")}
                        title="Numbered List"
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormatting("\n> ", "")}
                        title="Blockquote"
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Expansive Textarea */}
                    <textarea
                      ref={contentTextareaRef}
                      required
                      rows={8}
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Write the complete story content here. You can use markdown or the formatting buttons above..."
                      className="block w-full bg-transparent px-4 py-3 text-xs leading-relaxed text-zinc-900 outline-none dark:text-white resize-y min-h-[180px] font-sans"
                    />
                  </div>
                </div>

                {/* 4. Upload Image (Drop Zone & Preview Only) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-900 dark:text-white">
                      Featured Image Upload
                    </label>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-[11px] font-semibold text-red-500 hover:underline cursor-pointer"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>

                  <label
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 min-h-[170px] transition-all cursor-pointer overflow-hidden ${
                      dragActive
                        ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-500/10"
                        : "border-zinc-300 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900/60"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {formData.image ? (
                      <div className="relative w-full h-44 rounded-xl overflow-hidden group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                          <span className="text-white font-bold text-xs flex items-center gap-1.5 bg-black/60 px-3.5 py-1.5 rounded-lg backdrop-blur-xs">
                            <Upload className="h-3.5 w-3.5" /> Click or Drag to Change Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center mx-auto mb-2.5">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">
                          Drag & drop an image here
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3">
                          PNG, JPG, WebP up to 10MB
                        </p>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 text-[11px] font-bold shadow-xs">
                          <Upload className="w-3 h-3" /> Browse Device
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                {/* 5. Publish Status (At the Very End / Bottom) */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                        Publishing Status
                      </span>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {formData.isPublished
                          ? "Article will be visible immediately to all visitors on the public newsroom."
                          : "Article will be saved as draft and hidden from public view."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, isPublished: false }))
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          !formData.isPublished
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-600"
                            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
                        }`}
                      >
                        Draft (Hidden)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, isPublished: true }))
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          formData.isPublished
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
                        }`}
                      >
                        Published (Public)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 p-5 bg-zinc-50/50 dark:bg-zinc-950/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {editingArticle ? "Save Changes" : "Create Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationArticle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 text-center">
            <div className="pt-8 pb-6 px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1.5">
                Delete Announcement?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                Are you sure you want to delete &quot;
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {deleteConfirmationArticle.title}
                </span>
                &quot;? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setDeleteConfirmationArticle(null)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                {deleteMutation.isPending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
