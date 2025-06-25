# Fashion Designer Studio - Static Website

## Overview

This is a static fashion designer website built with HTML, CSS, and JavaScript. The site showcases fashion products and includes a content management system powered by Netlify CMS. It's designed to be a simple, elegant platform for displaying fashion collections with dynamic content management capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: Pure HTML5, CSS3, and Vanilla JavaScript
- **UI Framework**: Bootstrap 5.3.0 for responsive design
- **Icons**: Font Awesome 6.0.0 for iconography
- **Carousel**: Swiper.js for product image galleries
- **Responsive Design**: Mobile-first approach using Bootstrap's grid system

### Content Management
- **CMS**: Netlify CMS for content management
- **Authentication**: Netlify Identity for admin access
- **Content Storage**: Markdown files with frontmatter in `/content/` directory
- **Media Storage**: Static uploads in `/static/uploads/` directory

### Deployment Strategy
- **Hosting**: Designed for static hosting (Netlify/Vercel compatible)
- **Build Process**: No build step required - pure static files
- **Development Server**: Python HTTP server for local development
- **Redirects**: SPA-style routing via `_redirects` file

## Key Components

### Pages Structure
1. **Homepage** (`index.html`) - Hero section, featured products, about section
2. **Products Page** (`products.html`) - Product catalog with filtering
3. **Product Detail Page** (`product-detail.html`) - Individual product showcase
4. **Admin Panel** (`/admin/`) - Netlify CMS interface

### JavaScript Modules
- **`main.js`** - Core functionality, site data loading, contact integration
- **`product-detail.js`** - Product detail page logic and display

### Content Structure
- **Site Configuration** (`content/site.md`) - Global site settings, colors, contact info
- **Products** (`content/products/`) - Individual product markdown files
- **Media Assets** (`static/uploads/`) - Product images and media files

### Styling System
- **CSS Variables** - Dynamic theming support with customizable colors
- **Component-based Styles** - Modular CSS organization
- **Bootstrap Integration** - Custom styles layered over Bootstrap foundation

## Data Flow

### Content Loading Process
1. **Site Initialization** - Load global site configuration from `content/site.md`
2. **Product Loading** - Fetch and parse product markdown files
3. **Dynamic Rendering** - JavaScript renders content into HTML templates
4. **Theme Application** - Apply custom colors and branding from site config

### Admin Workflow
1. **Authentication** - Netlify Identity login for admin access
2. **Content Editing** - Netlify CMS provides WYSIWYG interface
3. **File Generation** - CMS creates/updates markdown files in content directory
4. **Automatic Deployment** - Changes trigger site rebuild and deployment

## External Dependencies

### CDN Resources
- **Bootstrap 5.3.0** - UI framework and components
- **Font Awesome 6.0.0** - Icon library
- **Swiper.js 8** - Touch slider/carousel functionality
- **Netlify Identity Widget** - Authentication management
- **Netlify CMS 2.0** - Content management interface

### Third-party Integrations
- **WhatsApp Integration** - Direct messaging via WhatsApp Web API
- **Instagram Integration** - Social media linking
- **Git Gateway** - Version control for content management

### Development Dependencies
- **Node.js** - Package management
- **http-server** - Local development server alternative
- **Python HTTP Server** - Primary development server

## Deployment Strategy

### Static Hosting Requirements
- **Server**: Any static file server (Nginx, Apache, CDN)
- **Build Process**: None required - deploy files directly
- **Environment**: No server-side processing needed

### Netlify-Specific Features
- **Git Gateway** - Enables CMS without backend server
- **Identity Service** - User authentication for admin panel
- **Form Handling** - Contact form processing (if implemented)
- **Redirects** - SPA routing via `_redirects` file

### Local Development
- **Primary**: Python HTTP server on port 5000
- **Alternative**: Node.js http-server package
- **Hot Reload**: Manual refresh required (no build process)

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 25, 2025. Initial setup