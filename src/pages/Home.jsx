import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Hero = () => {
  return (
   <> <Navbar/>
    <section id="hero" className="relative min-h-screen bg-neutral-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-pattern"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="particles-container">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500 rounded-full opacity-15 blur-xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left Content */}
          <div className="text-left animate__animated animate__fadeInLeft">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse"></span>
              AI-Powered Chatbot Platform
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Build Smart
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
                Chatbots
              </span>
              with ChatMatrix
            </h1>
            
            <p className="text-xl text-neutral-300 mb-8 leading-relaxed max-w-lg">
              A SaaS platform to create and manage AI-powered chatbots, easily embeddable on any website using modern AI tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/dashboard/my-chatbots"
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25 hover:scale-105"
              >
                <span className="relative z-10">Create Chatbot</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
             
            </div>
          </div>
          
          <div className="relative animate__animated animate__fadeInRight animate__delay-1s">
            <div className="relative bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg"></div>
                  <h3 className="text-white font-semibold">ChatMatrix Dashboard</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-700/30 rounded-lg p-4">
                  <div className="text-neutral-400 text-sm mb-1">Total Chatbots</div>
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-teal-400 text-sm">+2 this week</div>
                </div>
                <div className="bg-neutral-700/30 rounded-lg p-4">
                  <div className="text-neutral-400 text-sm mb-1">Messages</div>
                  <div className="text-2xl font-bold text-white">24.5K</div>
                  <div className="text-purple-400 text-sm">+12% growth</div>
                </div>
              </div>
              
              {/* Chart Area */}
              <div className="bg-neutral-700/20 rounded-lg p-4 mb-4">
                <div className="text-neutral-300 text-sm mb-3">Engagement Analytics</div>
                <div className="flex items-end space-x-2 h-20">
                  {[60, 80, 45, 90, 70, 95, 85].map((height, index) => (
                    <div
                      key={index}
                      className={`w-4 rounded-t ${index < 5 ? 'bg-teal-500' : 'bg-purple-400'}`}
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Link
                  to="/create"
                  className="flex-1 bg-teal-500/20 text-teal-400 py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-500/30 transition-colors"
                >
                  Create Chatbot
                </Link>
                <Link
                  to="/analytics"
                  className="flex-1 bg-purple-500/20 text-purple-400 py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors"
                >
                  View Analytics
                </Link>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-80 animate-bounce"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-pulse"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">ChatMatrix Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Custom AI Chatbots</h3>
              <p className="text-neutral-400">Create multiple personalized chatbots tailored to your needs.</p>
            </div>
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">LangChain & RAG</h3>
              <p className="text-neutral-400">Uses LangChain and Retrieval-Augmented Generation for intelligent conversations.</p>
            </div>
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Google Gemini Embeddings</h3>
              <p className="text-neutral-400">Leverages Google Gemini for efficient document embeddings.</p>
            </div>
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Chroma Vector Store</h3>
              <p className="text-neutral-400">Scalable vector storage for fast data retrieval.</p>
            </div>
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Embeddable Widgets</h3>
              <p className="text-neutral-400">Generate HTML snippets to embed chatbots on any website.</p>
            </div>
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Session-Based Memory</h3>
              <p className="text-neutral-400">Stores chat history per session using PostgreSQL.</p>
            </div>
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">API-Driven</h3>
              <p className="text-neutral-400">RESTful API for chatbot configuration and integration.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-neutral-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-teal-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
   </>
  );
};

export default Hero;