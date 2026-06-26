import { Link, useParams } from "wouter";
import { tutorialPosts } from "@/data/tutorials";
import NotFound from "./not-found";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";

export default function TutorialArticle() {
  const { slug } = useParams();
  const post = tutorialPosts.find(p => p.slug === slug);

  if (!post) return <NotFound />;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/tutorials" className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 mb-8">
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
            <div className="flex items-center gap-2"><User className="h-4 w-4" /> {post.author}</div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {post.date}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {post.readTime}</div>
          </div>
        </div>

        <div className="aspect-video w-full rounded-xl overflow-hidden mb-12 bg-gray-100">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="lead text-xl text-gray-600 mb-8">{post.excerpt}</p>
          <p>{post.content}</p>
          
          <h2>Prerequisites</h2>
          <ul>
            <li>Development board</li>
            <li>Basic understanding of programming</li>
            <li>USB cable and internet connection</li>
          </ul>
          
          <h3>Step 1: Setup the environment</h3>
          <p>Before you begin, ensure you have the necessary development environment installed on your computer. Download the latest IDE and install the required board packages.</p>
          
          <p>If you encounter any issues during this tutorial, please refer to our forums or contact Synergy Tech Labs support for assistance.</p>
        </div>
      </div>
    </div>
  );
}
