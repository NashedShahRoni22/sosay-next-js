"use client";

import React from "react";
import {
  ArrowRight,
  Users,
  Video,
  Store,
  Bitcoin,
  Crown,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Simple Swiper Implementation
const Swiper = ({ children, navigation = false, pagination = false }) => {
  const [currentSlide, setCurrentSlide] = React.useState(1);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const totalSlides = React.Children.count(children);

  const slides = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    return [childrenArray[totalSlides - 1], ...childrenArray, childrenArray[0]];
  }, [children, totalSlides]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index + 1);
  };

  React.useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        if (currentSlide === 0) {
          setCurrentSlide(totalSlides);
        } else if (currentSlide === totalSlides + 1) {
          setCurrentSlide(1);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isTransitioning, totalSlides]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl">
        <div
          className={`flex ${
            isTransitioning
              ? "transition-transform duration-500 ease-in-out"
              : ""
          }`}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      {navigation && (
        <>
          <Button
            onClick={prevSlide}
            size="icon"
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={nextSlide}
            size="icon"
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-xl"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {pagination && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index + 1 ||
                (currentSlide === 0 && index === totalSlides - 1) ||
                (currentSlide === totalSlides + 1 && index === 0)
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 w-8"
                  : "bg-gray-300 w-2.5 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function AboutSosay() {
  const features = [
    {
      icon: <Users className="w-7 h-7" />,
      title: "Social Ecommerce Networking",
      description:
        "Connect, chat, and engage with friends and communities on Sosay.",
      longDescription:
        "Build meaningful connections with people who share your interests. Send friend requests and chat completely free on Sosay. Join vibrant communities, participate in discussions, and expand your social circle through our intuitive networking features.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Video className="w-7 h-7" />,
      title: "Content Creation, Publishing & Monetization",
      description:
        "Become a creator, build your fanbase, and earn from exclusive content.",
      longDescription:
        "Transform your passion into profit! Become a verified creator on Sosay and offer exclusive content to your subscribers. Build a loyal fanbase who can subscribe to access your premium videos, live streams, and behind-the-scenes content. Monetize your creativity and turn your audience into a sustainable income stream.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Store className="w-7 h-7" />,
      title: "Ecommerce Platform",
      description:
        "Build your audience and sell products directly through your profile. Create your marketplace to sell your products and services.",
      longDescription:
        "Leverage your content to drive sales! Create an audience through engaging content, then seamlessly transition them into customers. Our integrated marketplace allows creators to showcase and sell their products directly to their followers, turning social engagement into business success.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <Bitcoin className="w-7 h-7" />,
      title: "Crypto Integration",
      description:
        "Secure transactions with cryptocurrency. Pay, receive payment or hold USFRANC, the only crypto blockchain that hedges its own capital to USF coin.",
      longDescription:
        "Experience the future of creator economy with built-in cryptocurrency support. Earn USFRANC through content creation, fan subscriptions, and product sales. Use USFRANC for secure purchases with guaranteed protection when shopping with verified vendors on our platform.",
      gradient: "from-yellow-500 to-amber-500",
    },
  ];

  const creatorFeatures = [
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Become a Creator",
      description:
        "Start your journey as a content publisher and build your personal brand. Best for influencers, brand builders and content publishing.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Fan Subscriptions",
      description:
        "Fans can subscribe to access your exclusive premium content. Fans can ask for private guidelines by paying a standard charge.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Free Networking",
      description:
        "Send friend requests and chat with anyone completely free. Send offers, promotions and build your client base.",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const sliders = [
    {
      title: "Connect & Network for Free",
      desc: "Send friend requests, chat with friends, and build your social circle without any cost.",
      button: "Start Networking",
      link: "/register",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Create & Earn",
      desc: "Become a creator, build your fanbase, and monetize your content through subscriptions.",
      button: "Become Creator",
      link: "https://so-show.netlify.app/",
      img: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Shop & Sell in Marketplace",
      desc: "Discover products from creators or sell your own in our integrated marketplace.",
      button: "Explore Market",
      link: "/business",
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-pink-50 via-white to-blue-50 min-h-screen text-gray-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-rose-300/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="mx-5 md:container md:mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full mb-6 animate-bounce-subtle">
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-semibold text-pink-600">
                  Social Ecommerce Network
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                Connect, Create & Grow Together
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Join the social ecommerce network connecting you to shoppers,
                fans, friends and family to share your views and build your
                business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    Join Free <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Link href="/">Login Now</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 animate-fade-in-up animation-delay-300">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Sosay Community"
                  className="relative rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-16 md:py-20 bg-white/50 backdrop-blur-sm">
        <div className="mx-5 md:container md:mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                number: "10K+",
                label: "Active Users",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                number: "500+",
                label: "Creators Earning",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: <Store className="w-8 h-8" />,
                number: "1K+",
                label: "Products Listed",
                color: "from-orange-500 to-red-500",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="border-2 border-gray-100 hover:border-pink-200 transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Creator Features Highlight */}
      <div className="relative py-16 md:py-24">
        <div className="mx-5 md:container md:mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">
                Creator Economy
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Empower Your Creativity
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Turn your passion into profit with our comprehensive creator tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {creatorFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border-2 border-gray-100 hover:border-pink-200 transition-all duration-300 hover:shadow-2xl group bg-white/80 backdrop-blur hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative py-16 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="mx-5 md:container md:mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Why Choose Sosay?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make Sosay the ultimate creator-focused
              social platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-2xl group bg-white/90 backdrop-blur hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div
                      className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-4 flex-shrink-0 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4 font-medium">
                        {feature.description}
                      </p>
                      <p className="text-gray-500 leading-relaxed">
                        {feature.longDescription}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Creator Spotlight Section */}
      <div className="relative py-16 md:py-24">
        <div className="mx-5 md:container md:mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 animate-fade-in-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-pink-600">
                💰 Grow Yourself
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: "🎬",
                    title: "Exclusive Content",
                    desc: "Create premium content for your subscribers and earn recurring revenue from your most dedicated fans.",
                  },
                  {
                    icon: "🛍️",
                    title: "Direct Sales",
                    desc: "Build your audience through engaging content, then sell your products directly in our integrated marketplace.",
                  },
                  {
                    icon: "💬",
                    title: "Free Networking",
                    desc: "Connect with other creators, chat with fans, and send friend requests - all completely free on Sosay.",
                  },
                  {
                    icon: "🪙",
                    title: "Crypto Rewards",
                    desc: "Earn USFRANC through content creation, subscriptions, and sales with secure blockchain technology.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/80 transition-all duration-300 group"
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 animate-fade-in-right">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Creator Features"
                  className="relative rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="relative py-20 md:py-28 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative mx-5 md:container md:mx-auto text-center">
          <Zap className="w-16 h-16 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Join a Safe & Supportive Community
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
            We're committed to fostering an environment where your security,
            creativity, and success matter
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-pink-600 hover:bg-gray-100 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
          >
            <Link href="/register" className="flex items-center gap-3">
              Join for Free <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Showcase Slider */}
      <div className="relative py-16 md:py-24">
        <div className="mx-5 md:container md:mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              Experience Sosay
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how our features empower creators and connect communities
            </p>
          </div>

          <Swiper navigation={true} pagination={true}>
            {sliders.map((slide, index) => (
              <div
                key={index}
                className=" h-[500px] md:h-[600px] bg-gradient-to-br from-white to-gray-50 rounded-3xl border shadow-2xl overflow-hidden"
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="flex-1 p-12 flex flex-col justify-center">
                    <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {slide.title}
                    </h3>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      {slide.desc}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="w-fit bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Link
                        href={slide.link}
                        className="flex items-center gap-2"
                      >
                        {slide.button} <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex-1 h-full">
                    <img
                      src={slide.img}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Swiper>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 md:py-28 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="mx-5 md:container md:mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 shadow-md">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-bold text-pink-600">
              LET'S GET STARTED
            </span>
          </div>
          <h3 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Grow Your Business with Sosay
          </h3>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of creators and businesses already thriving on our
            platform
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <Link href="/register">Join Now</Link>
          </Button>
        </div>
      </div>

      {/* Marketplace Highlight */}
      <div className="relative py-16 md:py-24">
        <div className="mx-5 md:container md:mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="flex-1 animate-fade-in-right">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                🛒 Creator Marketplace
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Turn your content into commerce. Build your audience first, then
                seamlessly transition them into customers through our integrated
                marketplace.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "List your products directly on your profile",
                  "Leverage your content to drive sales",
                  "Secure transactions with USFRANC",
                  "Build brand loyalty through content",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/80 transition-all duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      ✓
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/business">Explore Marketplace</Link>
              </Button>
            </div>
            <div className="flex-1 animate-fade-in-left">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Sosay Marketplace"
                  className="relative rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}
