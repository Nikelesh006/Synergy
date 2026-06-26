import { tutorialPosts } from "@/data/tutorials";
import { Calendar, User, Clock } from "lucide-react";

export default function Tutorials() {
  const featured = tutorialPosts[0];
  const rest = tutorialPosts.slice(1);

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tutorials & Guides</h1>
          <p className="text-gray-600">Step-by-step guides, projects, and how-tos on Embedded Systems, IoT, Robotics, and AI.</p>
        </div>

        {/* Featured Post */}
        {featured && (
          <div className="mb-16">
            <a href={featured.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group flex flex-col lg:flex-row bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden relative">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <span className="inline-block py-1 px-3 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-4 w-max">
                  {featured.category}
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
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
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map(post => (
            <a key={post.id} href={post.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="aspect-video overflow-hidden bg-gray-100 relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
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
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
