"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  TrendingUp,
  BookOpen,
  Tag,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  useEffect(() => {
    fetchBlogs("https://api.blog.bfinit.com/api/v1/show_blog/41");
  }, []);

  const fetchBlogs = async (url) => {
    setLoading(true);
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.status) {
        if (url.includes("page=") && !url.endsWith("page=1")) {
          setBlogs((prev) => [...prev, ...json.data.data]);
        } else {
          setBlogs(json.data.data);
        }
        setNextPageUrl(json.data.next_page_url);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
    setLoading(false);
  };

  return (
    <section>
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative mx-5 md:container md:mx-auto pt-40 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full border border-pink-200 w-fit mb-6">
            <BookOpen className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-medium text-pink-600">
              Sosay Blog
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Stories, insights, and tips from the
            <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              creator community
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the latest trends, success stories, and actionable advice
            to grow your creator business and build meaningful connections with
            your audience.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="relative mx-5 md:container md:mx-auto">
        {loading && blogs.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {blogs.map((post) => (
              <Link
                href={`/blog/${post.custom_url}`}
                key={post.id}
                className="group cursor-pointer block"
              >
                <article>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 overflow-hidden hover:bg-white hover:border-pink-200 transition-all duration-500">
                    <div className="relative overflow-hidden h-48">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        height={500}
                        width={500}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-pink-600 text-xs font-medium rounded-full border border-pink-200">
                          {post.category_name}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-3 text-gray-800 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      <div
                        className="text-gray-600 text-sm mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {nextPageUrl && (
          <div className="text-center mb-20">
            <button
              onClick={() => fetchBlogs(nextPageUrl)}
              disabled={loading}
              className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-100 rounded-full text-gray-800 font-medium hover:bg-white hover:border-pink-200 hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
