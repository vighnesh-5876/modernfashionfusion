// Product detail page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetail();
});

let currentProduct = null;

// Load product detail
async function loadProductDetail() {
    const productTitle = getUrlParameter('product');
    
    if (!productTitle) {
        showProductNotFound();
        return;
    }
    
    try {
        // Wait for products to load
        await loadProducts();
        
        // Find the product by slug or title
        currentProduct = productsData.find(product => 
            product.slug === productTitle || product.title === productTitle
        );
        
        if (currentProduct) {
            displayProductDetail(currentProduct);
        } else {
            showProductNotFound();
        }
    } catch (error) {
        console.error('Error loading product detail:', error);
        showProductNotFound();
    }
}

// Display product detail
function displayProductDetail(product) {
    const contentContainer = document.getElementById('product-detail-content');
    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    
    // Update breadcrumb
    if (breadcrumbTitle) {
        breadcrumbTitle.textContent = product.title;
    }
    
    // Update page title
    document.title = `${product.title} - Fashion Designer Studio`;
    
    // Create product detail HTML
    const productDetailHTML = `
        <div class="col-lg-6">
            <div class="product-gallery">
                ${createProductGallery(product)}
            </div>
        </div>
        <div class="col-lg-6">
            <div class="product-info">
                <div class="mb-3">
                    <span class="product-category">${product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Uncategorized'}</span>
                </div>
                
                <h1 class="product-detail-title">${product.title}</h1>
                
                ${product.price ? `<div class="product-detail-price">₹${product.price}</div>` : ''}
                
                <div class="availability-status-detail">
                    ${product.available ? 
                        '<span class="availability-dot available-dot"></span> In Stock' : 
                        '<span class="availability-dot unavailable-dot"></span> Out of Stock'
                    }
                </div>
                
                <div class="product-description mt-4">
                    <p>${product.description || 'No description available.'}</p>
                </div>
                
                ${product.tags && product.tags.length > 0 ? createTagsHTML(product.tags) : ''}
                
                <div class="purchase-section">
                    <h4 class="mb-3">Interested in this product?</h4>
                    <p class="text-muted mb-4">Contact us through your preferred platform to place an order or ask questions.</p>
                    <button class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#purchaseModal">
                        <i class="fas fa-shopping-cart"></i> Purchase Now
                    </button>
                </div>
            </div>
        </div>
    `;
    
    contentContainer.innerHTML = productDetailHTML;
    
    // Initialize image carousel if multiple images
    if (product.gallery && product.gallery.length > 0) {
        initializeCarousel();
    }
    
    // Setup purchase buttons
    setupPurchaseButtons(product);
}

// Create product gallery
function createProductGallery(product) {
    const images = [];
    
    // Add main image first
    if (product.image) {
        images.push(product.image);
    }
    
    // Add gallery images (filter out duplicates with main image)
    if (product.gallery && Array.isArray(product.gallery)) {
        product.gallery.forEach(img => {
            if (img && img !== product.image && !images.includes(img)) {
                images.push(img);
            }
        });
    }
    
    // Remove any empty or undefined images
    const validImages = images.filter(img => img && img.trim() !== '');
    
    if (validImages.length === 0) {
        return `
            <div class="product-detail-image">
                <div class="d-flex align-items-center justify-content-center bg-light" style="height: 400px;">
                    <i class="fas fa-image fa-5x text-muted"></i>
                    <div class="ms-3">
                        <h5 class="text-muted">No Images Available</h5>
                        <p class="text-muted mb-0">Product images will be displayed here</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (validImages.length === 1) {
        return `
            <div class="product-detail-image">
                <img src="${validImages[0]}" alt="${product.title}" class="img-fluid w-100" style="height: 400px; object-fit: cover; border-radius: 15px;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            </div>
        `;
    }
    
    // Multiple images - create carousel with thumbnails
    const slidesHTML = validImages.map((image, index) => `
        <div class="swiper-slide">
            <img src="${image}" alt="${product.title} - Image ${index + 1}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlICR7index + 1fTwvdGV4dD48L3N2Zz4K'">
        </div>
    `).join('');
    
    const thumbnailsHTML = validImages.map((image, index) => `
        <div class="swiper-slide thumbnail-slide">
            <img src="${image}" alt="Thumbnail ${index + 1}" class="thumbnail-img" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7index + 1}</dGV4dD48L3N2Zz4K'">
        </div>
    `).join('');
    
    return `
        <div class="product-gallery-container">
            <div class="swiper product-carousel main-carousel">
                <div class="swiper-wrapper">
                    ${slidesHTML}
                </div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
            <div class="swiper product-thumbnails mt-3">
                <div class="swiper-wrapper">
                    ${thumbnailsHTML}
                </div>
            </div>
            <div class="image-counter mt-2 text-center">
                <small class="text-muted">
                    <span class="current-slide">1</span> / ${validImages.length} images
                </small>
            </div>
        </div>
    `;
}

// Create tags HTML
function createTagsHTML(tags) {
    if (!tags || tags.length === 0) return '';
    
    const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    return `
        <div class="product-tags">
            <h6>Tags:</h6>
            ${tagsHTML}
        </div>
    `;
}

// Initialize image carousel
function initializeCarousel() {
    // Initialize thumbnail carousel first
    const thumbnailSwiper = new Swiper('.product-thumbnails', {
        spaceBetween: 10,
        slidesPerView: 'auto',
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
            320: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 6 }
        }
    });

    // Initialize main carousel
    const mainSwiper = new Swiper('.main-carousel', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: thumbnailSwiper,
        },
        on: {
            slideChange: function() {
                // Update counter
                const counter = document.querySelector('.current-slide');
                if (counter) {
                    counter.textContent = this.activeIndex + 1;
                }
            }
        }
    });

    // Add click handlers for thumbnails
    document.querySelectorAll('.thumbnail-slide').forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            mainSwiper.slideTo(index);
        });
    });
}

// Setup purchase buttons
function setupPurchaseButtons(product) {
    const whatsappBtn = document.getElementById('whatsapp-purchase');
    const instagramBtn = document.getElementById('instagram-purchase');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            const message = createPurchaseMessage(product);
            const whatsappUrl = `https://wa.me/${siteData.whatsapp_number || '+918879403922'}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('purchaseModal'));
            if (modal) modal.hide();
        });
    }
    
    if (instagramBtn) {
        instagramBtn.addEventListener('click', function() {
            const instagramUrl = `https://instagram.com/${siteData.instagram_id || 'qwiktech.in'}`;
            window.open(instagramUrl, '_blank');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('purchaseModal'));
            if (modal) modal.hide();
        });
    }
}

// Create purchase message for WhatsApp
function createPurchaseMessage(product) {
    let message = `Hello! I'm interested in this product:\n\n`;
    message += `*${product.title}*\n`;
    
    if (product.price) {
        message += `Price: ₹${product.price}\n`;
    }
    
    if (product.category) {
        message += `Category: ${product.category}\n`;
    }
    
    if (product.description) {
        message += `\nDescription: ${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}\n`;
    }
    
    message += `\nPlease let me know about availability and how to proceed with the order.`;
    
    return message;
}

// Show product not found
function showProductNotFound() {
    const contentContainer = document.getElementById('product-detail-content');
    const notFoundContainer = document.getElementById('product-not-found');
    
    if (contentContainer) {
        contentContainer.style.display = 'none';
    }
    
    if (notFoundContainer) {
        notFoundContainer.style.display = 'block';
    }
}
