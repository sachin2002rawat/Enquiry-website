import React from 'react'
import { Link } from 'react-router-dom'
import { Edit3, Home } from 'lucide-react'
import './BlogHero.css'

const BlogHero = () => {
  return (
    <section className="blog-hero-section">
      {/* Radial Faded Dot Matrix Pattern */}
      <div className="blog-hero-grid-pattern"></div>
      
      {/* Dual Glowing Aurora Light Orbs */}
      <div className="blog-hero-glow-cyan"></div>
      <div className="blog-hero-glow-indigo"></div>

      <div className="blog-hero-container">
        {/* Top Tag */}
        <div className="blog-hero-tag">
          <Edit3 size={14} />
          <span>Our Blog</span>
        </div>

        {/* Main Heading */}
        <h1 className="blog-hero-title">
          The Latest <span className="title-highlight">Articles & Insights</span>
        </h1>

        {/* Subtitle Description */}
        <p className="blog-hero-subtitle">
          Explore expert tips, inspiring stories, and the latest insights from our blog to help you grow, learn, and stay motivated.
        </p>

        {/* Breadcrumb Tag */}
        <div className="blog-hero-breadcrumb">
          <Link to="/">
            <Home size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Home
          </Link>
          <span className="sep">•</span>
          <span className="current">Blog</span>
        </div>
      </div>
    </section>
  )
}

export default BlogHero
