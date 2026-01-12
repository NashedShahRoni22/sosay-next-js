"use client";
import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  ArrowRight, 
  Search,
  Filter,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Tag,
  ChevronRight
} from "lucide-react";
import Image from "next/image";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Business Tips', 'Creator Stories', 'Marketing', 'Technology', 'Tutorials'];

  const featuredPost = {
    id: 1,
    title: "The Complete Guide to Building Your Creator Empire on Sosay",
    excerpt: "Discover the proven strategies that top creators use to turn their passion into profitable businesses. From content creation to monetization, we cover everything you need to know.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Creator Stories",
    author: "Sarah Johnson",
    date: "Dec 15, 2024",
    readTime: "12 min read",
    views: "2.4K",
    likes: 89,
    comments: 23
  };

  const blogPosts = [
    {
      id: 2,
      title: "10 Proven Strategies to Monetize Your Social Media Content",
      excerpt: "Learn how successful creators are earning six-figure incomes through strategic content monetization and fan engagement.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Business Tips",
      author: "Mike Chen",
      date: "Dec 12, 2024",
      readTime: "8 min read",
      views: "1.8K",
      likes: 67,
      comments: 15
    },
    {
      id: 3,
      title: "From Zero to 100K Followers: A Creator's Journey",
      excerpt: "Follow Emma's incredible journey as she built a massive following and turned it into a thriving business empire.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Creator Stories",
      author: "Emma Rodriguez",
      date: "Dec 10, 2024",
      readTime: "15 min read",
      views: "3.2K",
      likes: 134,
      comments: 41
    },
    {
      id: 4,
      title: "Mastering the Art of Viral Content Creation",
      excerpt: "Understand the psychology behind viral content and learn the techniques that consistently drive massive engagement.",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      author: "David Park",
      date: "Dec 8, 2024",
      readTime: "10 min read",
      views: "2.1K",
      likes: 92,
      comments: 28
    },
    {
      id: 5,
      title: "Building Your First E-commerce Store on Sosay",
      excerpt: "Step-by-step tutorial on setting up your online store, managing inventory, and processing your first orders.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Tutorials",
      author: "Lisa Wang",
      date: "Dec 5, 2024",
      readTime: "18 min read",
      views: "1.5K",
      likes: 58,
      comments: 19
    },
    {
      id: 6,
      title: "The Future of Creator Economy: Trends to Watch",
      excerpt: "Explore emerging trends and technologies that will shape the creator economy in 2025 and beyond.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Technology",
      author: "Alex Turner",
      date: "Dec 3, 2024",
      readTime: "12 min read",
      views: "2.7K",
      likes: 103,
      comments: 35
    },
    {
      id: 7,
      title: "Cryptocurrency Integration: Getting Paid in Digital Currency",
      excerpt: "Learn how to accept cryptocurrency payments and understand the benefits of blockchain technology for creators.",
      image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Technology",
      author: "Jordan Kim",
      date: "Nov 30, 2024",
      readTime: "14 min read",
      views: "1.9K",
      likes: 76,
      comments: 22
    },
    {
      id: 8,
      title: "Community Building: How to Create Loyal Fan Bases",
      excerpt: "Discover the secrets to building engaged communities that support your content and drive business growth.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      author: "Rachel Green",
      date: "Nov 28, 2024",
      readTime: "11 min read",
      views: "2.3K",
      likes: 88,
      comments: 31
    },
    {
      id: 9,
      title: "Analytics That Matter: Tracking Your Success",
      excerpt: "Learn which metrics actually matter for your creator business and how to use data to make better decisions.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Business Tips",
      author: "Mark Johnson",
      date: "Nov 25, 2024",
      readTime: "9 min read",
      views: "1.6K",
      likes: 54,
      comments: 17
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const trendingTags = [
    'Creator Economy', 'Monetization', 'Social Commerce', 'Content Strategy', 
    'Digital Marketing', 'E-commerce', 'Crypto Payments', 'Community Building'
  ];

  return (
    <section className="bg-gradient-to-br from-pink-50 via-white to-blue-50 min-h-screen text-gray-900">
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
            <span className="text-sm font-medium text-pink-600">Sosay Blog</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Stories, insights, and tips from the 
            <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              creator community
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the latest trends, success stories, and actionable advice to grow your creator business and build meaningful connections with your audience.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto flex flex-col gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-100 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 border-2 border-gray-100 hover:border-pink-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <div className="relative mx-5 md:container md:mx-auto mb-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-100 overflow-hidden hover:bg-white hover:border-pink-200 hover:shadow-xl transition-all duration-500 group">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative overflow-hidden">
              <Image 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                width={500}
                height={500}  
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-medium rounded-full">
                  Featured
                </span>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs font-medium rounded-full border border-pink-200">
                  {featuredPost.category}
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {featuredPost.views}
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                {featuredPost.title}
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{featuredPost.author}</div>
                    <div className="text-sm text-gray-600">{featuredPost.date}</div>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="relative mx-5 md:container md:mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredPosts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 overflow-hidden hover:bg-white hover:border-pink-200 hover:scale-105 hover:shadow-xl transition-all duration-500">
                <div className="relative overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    height={500}
                    width={500}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-pink-600 text-xs font-medium rounded-full border border-pink-200">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{post.author}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.comments}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mb-20">
          <button className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-100 rounded-full text-gray-800 font-medium hover:bg-white hover:border-pink-200 hover:scale-105 transition-all duration-300 shadow-lg">
            Load More Articles
          </button>
        </div>
      </div>

      {/* Trending Tags */}
      <div className="relative mx-5 md:container md:mx-auto pb-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-100 p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <TrendingUp className="w-6 h-6 text-pink-600" />
            Trending Topics
          </h3>
          <div className="flex flex-wrap gap-3">
            {trendingTags.map((tag, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 hover:border-pink-300 rounded-full text-sm font-medium text-pink-600 transition-all duration-300 hover:scale-105"
              >
                <Tag className="w-3 h-3 inline mr-2" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}