/**
 * Professional Photo Treatment Component for BMPOA
 * Enhancing verified images from source materials
 */

class ProfessionalPhotoTreatments {
    constructor() {
        // Verified images from directory
        this.images = {
            facilities: [
                {
                    file: "TheLodge.jpg",
                    title: "The Lodge",
                    caption: "Community gathering space at 540 Cliff Road",
                    category: "facility"
                },
                {
                    file: "TheLodgeEntrance.jpg",
                    title: "Lodge Entrance",
                    caption: "Welcome to the heart of BMPOA community",
                    category: "facility"
                },
                {
                    file: "TheLodgeOverlook.jpg",
                    title: "Lodge Overlook",
                    caption: "Scenic mountain views from The Lodge",
                    category: "facility"
                },
                {
                    file: "deer-lake-dock.jpeg",
                    title: "Deer Lake Dock",
                    caption: "Private recreation area for BMPOA members",
                    category: "recreation"
                }
            ],
            nature: [
                {
                    file: "trillium-bloom-at-thompson-wma-in-virginia.jpeg",
                    title: "Great White Trilliums",
                    caption: "18 million trilliums bloom at Thompson WMA",
                    category: "nature"
                },
                {
                    file: "virginia-bluebells.jpeg",
                    title: "Virginia Bluebells",
                    caption: "Native wildflowers in Blue Mountain area",
                    category: "nature"
                }
            ],
            wineries: [
                {
                    file: "winery-1.jpeg",
                    title: "Local Vineyard",
                    caption: "Fox Meadow Winery on Freezeland Road",
                    category: "attraction"
                },
                {
                    file: "winery-3.jpeg",
                    title: "Wine Tasting Room",
                    caption: "Experience local Virginia wines",
                    category: "attraction"
                },
                {
                    file: "OverlookatVineyard.png",
                    title: "Vineyard Overlook",
                    caption: "Scenic views from local wineries",
                    category: "attraction"
                }
            ],
            emblems: [
                {
                    file: "bmpoa-emblem.png",
                    title: "BMPOA Emblem",
                    caption: "Official community crest - ANGULUS RIDET",
                    category: "emblem"
                },
                {
                    file: "VA-Flag.jpeg",
                    title: "Virginia State Flag",
                    caption: "Sic Semper Tyrannis",
                    category: "emblem"
                }
            ]
        };
    }
    
    applyPhotoTreatments() {
        console.log('Applying professional photo treatments...');
        
        // Load photo treatment CSS
        const photoCSS = document.createElement('link');
        photoCSS.rel = 'stylesheet';
        photoCSS.href = 'professional-photo-treatments.css';
        document.head.appendChild(photoCSS);
        
        // Enhance existing images
        this.enhanceExistingImages();
        
        // Create photo galleries for specific sections
        this.createFacilityGallery();
        this.createNatureGallery();
        this.createHeroImages();
    }
    
    enhanceExistingImages() {
        // Find all images in the document
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
            // Skip logos and small icons
            if (img.width < 100 || img.classList.contains('no-enhance')) return;
            
            // Find matching image data
            const imageData = this.findImageData(img.src);
            
            // Create wrapper
            const container = document.createElement('div');
            container.className = 'photo-container';
            
            const wrapper = document.createElement('div');
            wrapper.className = 'photo-wrapper photo-frame-modern';
            
            // Clone and enhance image
            const enhancedImg = img.cloneNode();
            enhancedImg.className = 'photo-professional photo-enhance';
            
            // Add caption if available
            if (imageData) {
                const caption = document.createElement('div');
                caption.className = 'photo-caption';
                caption.innerHTML = `
                    <h4 class="caption-title">${imageData.title}</h4>
                    <p class="caption-description">${imageData.caption}</p>
                `;
                wrapper.appendChild(caption);
                
                // Add static caption for print
                const staticCaption = document.createElement('div');
                staticCaption.className = 'photo-caption-static';
                staticCaption.innerHTML = `
                    <span class="caption-number">Figure ${index + 1}:</span>
                    ${imageData.title} - ${imageData.caption}
                `;
                container.appendChild(staticCaption);
            }
            
            wrapper.appendChild(enhancedImg);
            container.appendChild(wrapper);
            
            // Replace original image
            img.parentNode.replaceChild(container, img);
        });
    }
    
    findImageData(src) {
        const filename = src.split('/').pop();
        
        for (const category of Object.values(this.images)) {
            const found = category.find(img => img.file === filename);
            if (found) return found;
        }
        
        return null;
    }
    
    createFacilityGallery() {
        // Find facility sections
        const facilityPages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Lodge') && 
            page.textContent.includes('Facilities')
        );
        
        if (facilityPages.length > 0) {
            const gallery = document.createElement('div');
            gallery.className = 'photo-grid photo-grid-2';
            
            this.images.facilities.forEach(facility => {
                const card = document.createElement('div');
                card.className = 'facility-photo photo-wrapper photo-frame-elegant';
                
                card.innerHTML = `
                    <div class="facility-label">${facility.category === 'recreation' ? 'Recreation' : 'Community Space'}</div>
                    <img src="images/${facility.file}" alt="${facility.title}" class="photo-professional photo-enhance">
                    <div class="photo-caption-static">
                        <strong>${facility.title}</strong> - ${facility.caption}
                    </div>
                `;
                
                gallery.appendChild(card);
            });
            
            const content = facilityPages[0].querySelector('.page-content');
            if (content) {
                content.appendChild(gallery);
            }
        }
    }
    
    createNatureGallery() {
        // Find nature/trails sections
        const naturePages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Trail') || 
            page.textContent.includes('Natural Resources') ||
            page.textContent.includes('Flora')
        );
        
        if (naturePages.length > 0) {
            const natureSection = document.createElement('div');
            natureSection.className = 'nature-photo-section';
            
            natureSection.innerHTML = `
                <h3 style="font-family: 'Montserrat', sans-serif; color: #1e3a5f; margin: 2rem 0 1rem 0;">Local Flora</h3>
                <div class="photo-grid photo-grid-2">
                    ${this.images.nature.map(nature => `
                        <div class="nature-photo-card">
                            <img src="images/${nature.file}" alt="${nature.title}" class="photo-professional photo-soft">
                            <div class="nature-photo-info">
                                <h4 class="nature-photo-name">${nature.title}</h4>
                                <p class="nature-photo-details">${nature.caption}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            const content = naturePages[0].querySelector('.page-content');
            if (content) {
                content.appendChild(natureSection);
            }
        }
    }
    
    createHeroImages() {
        // Find cover page or main sections
        const coverPage = document.querySelector('.page[data-template="cover"]');
        
        if (coverPage && !coverPage.querySelector('.photo-hero')) {
            // Skip if already has background image
            return;
        }
        
        // Add hero image to community life section
        const communityPages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.querySelector('h1')?.textContent.includes('Community Life')
        );
        
        if (communityPages.length > 0) {
            const hero = document.createElement('div');
            hero.className = 'photo-hero';
            
            hero.innerHTML = `
                <img src="images/TheLodgeOverlook.jpg" alt="Blue Mountain Community">
                <div class="photo-hero-overlay">
                    <h2 class="photo-hero-title">Community Life at Blue Mountain</h2>
                    <p class="photo-hero-subtitle">A Mountain Home Since the 1950s</p>
                </div>
            `;
            
            const content = communityPages[0].querySelector('.page-content');
            if (content && content.firstChild) {
                content.insertBefore(hero, content.firstChild.nextSibling);
            }
        }
    }
    
    createPhotoCollage() {
        // Create a collage for community overview
        const collage = document.createElement('div');
        collage.className = 'photo-collage';
        
        const selectedImages = [
            { file: "TheLodge.jpg", size: "large" },
            { file: "deer-lake-dock.jpeg", size: "normal" },
            { file: "virginia-bluebells.jpeg", size: "normal" },
            { file: "winery-1.jpeg", size: "normal" },
            { file: "trillium-bloom-at-thompson-wma-in-virginia.jpeg", size: "normal" },
            { file: "TheLodgeEntrance.jpg", size: "normal" }
        ];
        
        selectedImages.forEach(img => {
            const item = document.createElement('div');
            item.className = img.size === 'large' ? 'collage-item collage-item-large' : 'collage-item';
            item.innerHTML = `<img src="images/${img.file}" alt="BMPOA Community">`;
            collage.appendChild(item);
        });
        
        return collage;
    }
}

// Initialize
const photoTreatments = new ProfessionalPhotoTreatments();

// Add to professional components
if (typeof professionalComponents !== 'undefined') {
    professionalComponents.applyPhotoTreatments = function() {
        photoTreatments.applyPhotoTreatments();
    };
}