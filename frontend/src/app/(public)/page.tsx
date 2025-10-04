'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingBag, Star, ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]); // Added type annotation for number array
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = (id: number) => { // Added type annotation for id parameter
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const categories = ['all', 'running', 'lifestyle', 'basketball', 'limited'];

  const products = [
    { id: 1, name: 'Velocity Pro Max', price: 189, category: 'running', rating: 4.9, reviews: 234, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', tag: 'New', color1: '#FF6B6B', color2: '#4ECDC4' },
    { id: 2, name: 'Urban Legend', price: 149, category: 'lifestyle', rating: 4.7, reviews: 189, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop', tag: 'Popular', color1: '#A8E6CF', color2: '#FFD3B6' },
    { id: 3, name: 'Court Dominator', price: 199, category: 'basketball', rating: 4.8, reviews: 312, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop', tag: 'Pro', color1: '#FFAAA5', color2: '#FF8B94' },
    { id: 4, name: 'Classic Heritage', price: 129, category: 'lifestyle', rating: 4.6, reviews: 156, image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=600&fit=crop', tag: null, color1: '#B4E7CE', color2: '#D4A5A5' },
    { id: 5, name: 'Quantum Leap', price: 249, category: 'limited', rating: 5.0, reviews: 89, image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop', tag: 'Limited', color1: '#FFC6FF', color2: '#BDB2FF' },
    { id: 6, name: 'Sprint Master', price: 169, category: 'running', rating: 4.8, reviews: 267, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop', tag: 'Hot', color1: '#FDFFB6', color2: '#FFD6A5' },
    { id: 7, name: 'Retro Wave', price: 139, category: 'lifestyle', rating: 4.5, reviews: 198, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', tag: null, color1: '#CAFFBF', color2: '#9BF6FF' },
    { id: 8, name: 'Elite Performance', price: 219, category: 'basketball', rating: 4.9, reviews: 421, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop', tag: 'Pro', color1: '#A0C4FF', color2: '#BDB2FF' },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-black dark:to-black overflow-hidden">
      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:bg-purple-700 dark:opacity-10" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:bg-yellow-700 dark:opacity-10" />
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 dark:bg-pink-700 dark:opacity-10" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 backdrop-blur-sm rounded-full border border-violet-200 dark:border-violet-700 dark:bg-gradient-to-r dark:from-violet-500/20 dark:to-fuchsia-500/20">
                <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span className="text-sm font-semibold text-violet-900 dark:text-violet-100">2025 Collection</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 animate-gradient dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400">
                  Step Into
                </span>
                <span className="block mt-2 text-gray-900 dark:text-white">Tomorrow</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                Experience the perfect fusion of style, comfort, and innovation in every step.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-full font-semibold text-lg hover:border-violet-600 hover:text-violet-600 transition-all duration-300 dark:bg-black/80 dark:border-gray-600 dark:text-gray-200 dark:hover:border-violet-400 dark:hover:text-violet-400">
                  Limited Drops
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
                <div>
                  <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Premium Styles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">50K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">4.9★</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-[3rem] blur-3xl animate-pulse dark:from-violet-500/10 dark:to-fuchsia-500/10" />
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop"
                  alt="Featured Sneaker"
                  className="w-full max-w-lg drop-shadow-2xl transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-700 ease-out"
                />
                
                {/* Floating Price Tag */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-gray-100 transform hover:scale-110 transition-all duration-300 dark:bg-black dark:border-gray-600">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Limited Edition</div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">$189</div>
                  <button className="mt-3 w-full px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                    Add to Bag
                  </button>
                </div>

                {/* Floating Features */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl p-4 backdrop-blur-sm border border-gray-100 dark:bg-black dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900 dark:text-white">4.9</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">2.3K reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-1 z-40 px-4 sm:px-6 lg:px-8 py-4 bg-white/80 backdrop-blur-xl border-b border-gray-200 dark:bg-black/80 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 dark:bg-black dark:shadow-gray-900/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden" style={{ background: `linear-gradient(135deg, ${product.color1}, ${product.color2})` }}>
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Tag */}
                  {product.tag && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 dark:bg-black/90 dark:text-white">
                      {product.tag}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                        favorites.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white dark:bg-black/90 dark:text-gray-200 dark:hover:bg-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-black hover:text-white transition-all duration-300 dark:bg-black/90 dark:text-gray-200 dark:hover:bg-gray-600">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quick View on Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full py-2 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors dark:bg-black dark:text-white dark:hover:bg-gray-600">
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviews})</span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-1 text-gray-900 group-hover:text-violet-600 transition-colors dark:text-white dark:group-hover:text-violet-400">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                      ${product.price}
                    </span>
                    <div className="flex gap-1">
                      <div className="w-6 h-6 rounded-full bg-black border-2 border-gray-300 cursor-pointer hover:border-black transition-colors dark:border-gray-600 dark:hover:border-gray-400" />
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 cursor-pointer hover:border-black transition-colors dark:bg-gray-600 dark:border-gray-500 dark:hover:border-gray-400" />
                      <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-gray-300 cursor-pointer hover:border-black transition-colors dark:border-gray-600 dark:hover:border-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;