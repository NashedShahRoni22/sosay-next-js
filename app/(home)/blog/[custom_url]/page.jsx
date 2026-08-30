"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Share2, 
  Loader2 
} from "lucide-react";

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const { custom_url } = params;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (custom_url) {
      fetchBlogDetails(custom_url);
    }
  }, [custom_url]);

  const fetchBlogDetails = async (url) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.blog.bfinit.com/api/v1/single_blog_view/${url}`);
      const json = await res.json();
      if (json.status) {
        setBlog(json.data);
      } else {
        setError(json.message || "Failed to load blog details.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the blog.");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex flex-col items-center justify-center text-gray-800 p-5">
        <h2 className="text-3xl font-bold mb-4">Oops!</h2>
        <p className="text-lg text-gray-600 mb-8">{error || "Blog post not found."}</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-medium hover:scale-105 transition-all shadow-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <article className="bg-gradient-to-br from-pink-50 via-white to-blue-50 min-h-screen text-gray-900 pt-32 pb-20">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5">
        {/* Back Button */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-medium rounded-full shadow-md">
              {blog.category_name || 'Uncategorized'}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-gray-900">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between border-t border-b border-gray-200/60 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-md">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Author {blog.user_id}</div>
                <div className="text-sm text-gray-500">Creator</div>
              </div>
            </div>
            
            <button className="p-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-pink-500 hover:border-pink-200 hover:shadow-md transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Featured Image */}
        {blog.thumbnail && (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl border-4 border-white">
            <Image 
              src={blog.thumbnail} 
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-pink max-w-none mb-16 text-gray-700 leading-relaxed custom-blog-content">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Footer Tags */}
        <div className="border-t border-gray-200/60 pt-8 mt-12">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-pink-500" />
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-pink-300 hover:text-pink-600 cursor-pointer transition-colors">
              {blog.category_name}
            </span>
          </div>
        </div>
      </div>
      
      {/* Custom Styles for Blog Content HTML */}
      <style jsx global>{`
        .custom-blog-content p {
          margin-bottom: 1.5em;
        }
        .custom-blog-content h2, .custom-blog-content h3 {
          color: #111827;
          font-weight: 700;
          margin-top: 2em;
          margin-bottom: 1em;
        }
        .custom-blog-content a {
          color: #ec4899;
          text-decoration: none;
        }
        .custom-blog-content a:hover {
          text-decoration: underline;
        }
        .custom-blog-content img {
          border-radius: 1rem;
          margin: 2rem 0;
        }
      `}</style>
    </article>
  );
}
