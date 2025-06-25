// Global variables
let siteData = {};
let productsData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadSiteData();
    loadProducts();
    setupContactButtons();
});

// Load site configuration data
async function loadSiteData() {
    try {
        const response = await fetch('/content/site.md');
        const text = await response.text();
        siteData = parseFrontMatter(text);
        applySiteData();
    } catch (error) {
        console.error('Error loading site data:', error);
        // Use default values if site.md doesn't exist
        siteData = {
            title: 'Fashion Studio',
            description: 'Elegant Fashion Designs',
            hero_title: 'Elegant Fashion Designs',
            hero_description: 'Discover unique and sophisticated fashion pieces crafted with passion and attention to detail.',
            about_title: 'About Our Studio',
            about_description: 'We are passionate about creating timeless fashion pieces that combine style, comfort, and quality.',
            primary_color: '#0d6efd',
            secondary_color: '#6c757d',
            whatsapp_number: '8879403922',
            instagram_id: 'qwiktech.in'
        };
        applySiteData();
    }
}

// Apply site data to the page
function applySiteData() {
    // Update page title
    const titleElement = document.querySelector('title');
    if (titleElement && siteData.title) {
        titleElement.textContent = siteData.title;
    }

    // Update navigation brand
    const navBrand = document.getElementById('site-title');
    if (navBrand && siteData.title) {
        navBrand.textContent = siteData.title;
    }

    // Update hero section
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle && siteData.hero_title) {
        heroTitle.textContent = siteData.hero_title;
    }

    const heroDescription = document.getElementById('hero-description');
    if (heroDescription && siteData.hero_description) {
        heroDescription.textContent = siteData.hero_description;
    }

    // Update about section
    const aboutTitle = document.getElementById('about-title');
    if (aboutTitle && siteData.about_title) {
        aboutTitle.textContent = siteData.about_title;
    }

    const aboutDescription = document.getElementById('about-description');
    if (aboutDescription && siteData.about_description) {
        aboutDescription.textContent = siteData.about_description;
    }

    // Update CSS custom properties
    if (siteData.primary_color) {
        document.documentElement.style.setProperty('--primary-color', siteData.primary_color);
    }
    if (siteData.secondary_color) {
        document.documentElement.style.setProperty('--secondary-color', siteData.secondary_color);
    }
}

// Load products data
async function loadProducts() {
    try {
        // In a real implementation, this would fetch from the content/products directory
        // For now, we'll check if there are any product files
        productsData = await fetchProductsFromDirectory();
        displayProducts();
        displayFeaturedProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        showNoProductsMessage();
    }
}

// Fetch products from content directory
async function fetchProductsFromDirectory() {
    const products = [];
    
    // Demo product files
    const productFiles = [
        'elegant-silk-saree.md',
        'designer-cotton-kurti.md', 
        'embroidered-blouse.md',
        'festive-georgette-saree.md',
        'ethnic-printed-kurti.md',
        'silk-designer-blouse.md'
    ];
    
    for (const file of productFiles) {
        try {
            const response = await fetch(`/content/products/${file}`);
            if (response.ok) {
                const text = await response.text();
                const product = parseFrontMatter(text);
                if (product.title) {
                    // Add filename for URL generation
                    product.slug = file.replace('.md', '');
                    products.push(product);
                }
            }
        } catch (err) {
            console.log(`Product file ${file} not found, skipping`);
        }
    }
    
    return products;
}

// Parse front matter from markdown files
function parseFrontMatter(content) {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return {};
    
    const frontMatter = match[1];
    const body = match[2];
    
    const data = {};
    const lines = frontMatter.split('\n');
    
    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // Parse booleans and numbers
            if (value === 'true') value = true;
            else if (value === 'false') value = false;
            else if (!isNaN(value) && value !== '') value = Number(value);
            
            data[key] = value;
        }
    }
    
    if (body) data.body = body.trim();
    return data;
}

// Display products on products page
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    if (productsData.length === 0) {
        showNoProductsMessage();
        return;
    }

    productsGrid.innerHTML = '';
    
    productsData.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Display featured products on homepage
function displayFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;

    const featuredProducts = productsData.filter(product => product.featured);
    
    if (featuredProducts.length === 0) {
        // Show first 3 products if no featured products
        featuredProducts.push(...productsData.slice(0, 3));
    }

    featuredContainer.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 mb-4';
        col.appendChild(createProductCard(product));
        featuredContainer.appendChild(col);
    });
}

// Create product card element
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category || 'uncategorized';
    
    // Image
    const imageDiv = document.createElement('div');
    imageDiv.className = 'product-image position-relative';
    
    if (product.image) {
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.title;
        img.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
        };
        imageDiv.appendChild(img);
    } else {
        imageDiv.innerHTML = '<div class="d-flex align-items-center justify-content-center h-100 bg-light"><i class="fas fa-image fa-3x text-muted"></i></div>';
    }
    
    // Availability badge
    const availabilityBadge = document.createElement('div');
    availabilityBadge.className = `availability-badge ${product.available ? 'available' : 'unavailable'}`;
    availabilityBadge.textContent = product.available ? 'Available' : 'Sold Out';
    imageDiv.appendChild(availabilityBadge);
    
    // Featured badge
    if (product.featured) {
        const featuredBadge = document.createElement('div');
        featuredBadge.className = 'featured-badge';
        featuredBadge.textContent = 'Featured';
        imageDiv.appendChild(featuredBadge);
    }
    
    // Card body
    const cardBody = document.createElement('div');
    cardBody.className = 'product-card-body';
    
    // Category
    if (product.category) {
        const category = document.createElement('span');
        category.className = 'product-category';
        category.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
        cardBody.appendChild(category);
    }
    
    // Title
    const title = document.createElement('h5');
    title.className = 'product-title';
    title.textContent = product.title || 'Untitled Product';
    cardBody.appendChild(title);
    
    // Price
    if (product.price) {
        const price = document.createElement('div');
        price.className = 'product-price';
        price.textContent = `₹${product.price}`;
        cardBody.appendChild(price);
    }
    
    // Description
    if (product.description) {
        const description = document.createElement('p');
        description.className = 'product-description';
        description.textContent = product.description.substring(0, 100) + (product.description.length > 100 ? '...' : '');
        cardBody.appendChild(description);
    }
    
    // View Details Button
    const button = document.createElement('a');
    button.href = `product-detail.html?product=${encodeURIComponent(product.slug || product.title)}`;
    button.className = 'btn btn-primary mt-auto';
    button.textContent = 'View Details';
    cardBody.appendChild(button);
    
    card.appendChild(imageDiv);
    card.appendChild(cardBody);
    col.appendChild(card);
    
    return col;
}

// Show no products message
function showNoProductsMessage() {
    const productsGrid = document.getElementById('products-grid');
    const noProductsMsg = document.getElementById('no-products');
    
    if (productsGrid) {
        productsGrid.innerHTML = '';
    }
    
    if (noProductsMsg) {
        noProductsMsg.style.display = 'block';
    }
}

// Setup contact buttons
function setupContactButtons() {
    const whatsappContact = document.getElementById('whatsapp-contact');
    const instagramContact = document.getElementById('instagram-contact');
    
    if (whatsappContact) {
        whatsappContact.addEventListener('click', function(e) {
            e.preventDefault();
            const message = encodeURIComponent('Hello! I would like to know more about your fashion collection.');
            const whatsappUrl = `https://wa.me/${siteData.whatsapp_number || '8879403922'}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    }
    
    if (instagramContact) {
        instagramContact.addEventListener('click', function(e) {
            e.preventDefault();
            const instagramUrl = `https://instagram.com/${siteData.instagram_id || 'qwiktech.in'}`;
            window.open(instagramUrl, '_blank');
        });
    }
}

// Utility function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(price);
}
