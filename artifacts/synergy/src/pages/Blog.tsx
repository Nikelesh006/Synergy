import { blogPosts } from "@/data/blog";
import { Link } from "wouter";
import { Calendar, User, Clock } from "lucide-react";

export default function Blog() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Knowledge Center</h1>
          <p className="text-gray-600">Insights, tutorials, and news on Embedded Systems, IoT, Robotics, and AI.</p>
        </div>

        {/* Featured Post */}
        {featured && (
          <div className="mb-16">
            <Link href={`/blog/${featured.slug}`} className="group flex flex-col lg:flex-row bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <span className="inline-block py-1 px-3 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4 w-max">
                  {featured.category}
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto">
                  <div className="flex items-center gap-1"><User className="h-4 w-4" /> {featured.author}</div>
                  <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {featured.date}</div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                  <span>{post.date}</span>
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
