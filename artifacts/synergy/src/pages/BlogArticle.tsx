import { Link, useParams } from "wouter";
import { blogPosts } from "@/data/blog";
import NotFound from "./not-found";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";

export default function BlogArticle() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) return <NotFound />;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
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
          {/* Placeholder content since we only have short snippets in mock data */}
          <p className="lead text-xl text-gray-600 mb-8">{post.excerpt}</p>
          <p>{post.content}</p>
          
          <h2>The Importance of Correct Selection</h2>
          <p>When developing embedded systems and IoT solutions, selecting the right components isn't just about functionality—it's about scalability, reliability, and security.</p>
          
          <h3>Key Considerations</h3>
          <ul>
            <li>Load requirements and future capacity</li>
            <li>Environmental factors (temperature, moisture, dust)</li>
            <li>Compatibility with existing infrastructure</li>
            <li>Regulatory compliance (IS/IEC standards)</li>
          </ul>
          
          <p>Always consult with technology experts when architecting complex IoT and Edge AI systems. Synergy Tech Labs provides the expertise and technical support to help you build smart, scalable solutions.</p>
        </div>
      </div>
    </div>
  );
}
