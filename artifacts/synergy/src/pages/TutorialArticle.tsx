import { Link, useParams } from "wouter";
import { useTutorial } from "@/hooks/useTutorials";
import NotFound from "./not-found";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";

export default function TutorialArticle() {
  const { slug } = useParams();
  const { data: post, isLoading, isError } = useTutorial(slug || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !post) return <NotFound />;

  const getYoutubeVideoId = (url: string) => {
    const match = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return match?.[1] || "";
  };

  const videoId = getYoutubeVideoId(post.youtubeUrl);
  const image = post.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "");

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/tutorials" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Tutorials
        </Link>
        
        <div className="mb-8">
          <span className="inline-block py-1 px-3 bg-gray-100 text-gray-800 text-xs font-bold rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 py-4 border-y border-gray-100">
            <div className="flex items-center gap-2"><User className="h-4 w-4" /> {post.instructor || post.channelName}</div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {post.publishDate}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {post.duration}</div>
          </div>
        </div>

        {videoId ? (
          <div className="aspect-video w-full rounded-xl overflow-hidden mb-12 bg-black shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={post.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : image ? (
          <div className="aspect-video w-full rounded-xl overflow-hidden mb-12 bg-gray-100">
            <img src={image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        ) : null}

        <div className="prose prose-lg max-w-none text-gray-700">
          {post.shortDescription && (
            <p className="lead text-xl text-gray-600 mb-8">{post.shortDescription}</p>
          )}
          <div className="whitespace-pre-line text-gray-800 leading-relaxed">{post.description}</div>
        </div>
      </div>
    </div>
  );
}
