// This script is specifically for the Organizer user journey.
// It loads the organizer navbar and handles its interactions,
// as well as the media modal functionality for organizer pages.

// --- MEDIA MODAL FUNCTIONS (COPIED FROM main.js AND ADAPTED) ---
// This function is now generic and accepts the clicked element as an argument.
function openMediaModal(element) {
    const mediaModal = document.getElementById('media-modal');
    if (!mediaModal) {
        console.error("Media modal HTML not found in the DOM.");
        return;
    }
    const modalImage = document.getElementById('modal-image');
    const modalEventName = document.getElementById('modal-event-name');
    const modalCreatorName = document.getElementById('modal-creator-name');
    const modalHeaderIcons = mediaModal.querySelector('.flex.items-center.space-x-2');
    const modalNav = document.getElementById('modal-nav');
    
    // Find the parent gallery container of the clicked element.
    const galleryContainer = element.closest('#gallery-grid');
    if (!galleryContainer) {
        console.error("Gallery container not found. Make sure the clicked element is inside a container with the ID '#gallery-grid'.");
        return;
    }

    // Get all gallery items from the current view.
    const galleryItems = Array.from(galleryContainer.querySelectorAll('[data-open-media-modal]'));
    let currentIndex = galleryItems.indexOf(element);

    if (currentIndex === -1) return;
    
    // Update content and show the modal
    modalImage.src = element.querySelector('img').src;
    modalEventName.textContent = element.getAttribute('data-event');
    modalCreatorName.textContent = `by ${element.getAttribute('data-creator')}`;
    mediaModal.classList.remove('hidden');

    // Dynamically show/hide buttons based on page context
    const pageType = document.body.getAttribute('data-page-type');
    
    if (pageType === 'media-management') {
        // Show management-specific buttons
        modalHeaderIcons.innerHTML = `
        <button id="privacy-toggle" class="p-2 rounded-full hover:bg-white/20" title="Toggle Privacy" data-state="public">
            <svg id="privacy-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path id="privacy-path" stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.50 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        </button>
        <button class="p-2 rounded-full hover:bg-white/20" title="Delete Photo">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
        <button id="close-media-modal" class="p-2 rounded-full hover:bg-white/20 text-4xl leading-none">×</button>
        `;
        
        // Wait for the DOM to update before attaching the event listener
        setTimeout(() => {
            const privacyToggleBtn = document.getElementById('privacy-toggle');
            if (privacyToggleBtn) {
                privacyToggleBtn.addEventListener('click', () => {
                    // Find the icon path relative to the clicked button
                    const iconPath = privacyToggleBtn.querySelector('#privacy-path');
                    if (iconPath) {
                        const currentState = privacyToggleBtn.getAttribute('data-state');

                    const publicPath = "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.50 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z";
                    const privatePath = "M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88";

                        if (currentState === 'public') {
                            iconPath.setAttribute('d', privatePath);
                            privacyToggleBtn.setAttribute('data-state', 'private');
                            privacyToggleBtn.title = "Toggle Privacy (Private)";
                        } else {
                            iconPath.setAttribute('d', publicPath);
                            privacyToggleBtn.setAttribute('data-state', 'public');
                            privacyToggleBtn.title = "Toggle Privacy (Public)";
                        }
                    }
                });
            }
        }, 0);
        } else {
        // Show attendee-specific icons
        modalHeaderIcons.innerHTML = `
            <button class="p-2 rounded-full hover:bg-white/20"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
            <button class="p-2 rounded-full hover:bg-white/20"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg></button>
            <button class="p-2 rounded-full hover:bg-white/20"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></button>
            <button id="close-media-modal" class="p-2 rounded-full hover:bg-white/20 text-4xl leading-none">×</button>
        `;
        // Show navigation buttons for other pages
        if (modalNav) modalNav.classList.remove('hidden');
    }

    // Attach event listeners for navigation and closing
    const closeBtn = document.getElementById('close-media-modal');
    const nextBtn = document.getElementById('next-media');
    const prevBtn = document.getElementById('prev-media');
    
    // Use an IIFE (Immediately Invoked Function Expression) to create a closure
    // for the current gallery items and index.
    (function(currentItems, startingIndex) {
        let currentImageIndex = startingIndex;
        // Function to update the modal content
        function updateModalContent() {
            const currentItem = currentItems[currentImageIndex];
            if (currentItem) {
                modalImage.src = currentItem.querySelector('img').src;
                modalEventName.textContent = currentItem.getAttribute('data-event');
                modalCreatorName.textContent = `by ${currentItem.getAttribute('data-creator')}`;
            }
        }
        function showNextMedia() {
            currentImageIndex = (currentImageIndex + 1) % currentItems.length;
            updateModalContent();
        }
        function showPrevMedia() {
            currentImageIndex = (currentImageIndex - 1 + currentItems.length) % currentItems.length;
            updateModalContent();
        }
        // Remove previous listeners to prevent duplicates
        if (nextBtn) nextBtn.onclick = null;
        if (prevBtn) prevBtn.onclick = null;
        // Add new listeners
        if (nextBtn) nextBtn.onclick = showNextMedia;
        if (prevBtn) prevBtn.onclick = showPrevMedia;
        // Handle swipe functionality
        function handleSwipe(touchStartX, touchEndX) {
            if (touchEndX < touchStartX - 50) { // Swiped left
                showNextMedia();
            }
            if (touchEndX > touchStartX + 50) { // Swiped right
                showPrevMedia();
            }
        }
        // Add touch listeners
        mediaModal.ontouchstart = e => {
            mediaModal.touchStartX = e.changedTouches[0].screenX;
        };
        mediaModal.ontouchend = e => {
            mediaModal.touchEndX = e.changedTouches[0].screenX;
            handleSwipe(mediaModal.touchStartX, mediaModal.touchEndX);
        };
        // Add keyboard listeners
        document.onkeydown = e => {
            if (!mediaModal.classList.contains('hidden')) {
                if (e.key === 'ArrowRight') showNextMedia();
                else if (e.key === 'ArrowLeft') showPrevMedia();
                else if (e.key === 'Escape') closeMediaModal();
            }
        };
        // Add click listeners to modal parts
        mediaModal.onclick = (event) => {
            // Check if the click is on the modal's main container, the image, or the overlay
            if (event.target === mediaModal || event.target === modalImage || event.target.id === 'modal-overlay') {
                closeMediaModal();
            }
        };
        if (closeBtn) closeBtn.onclick = closeMediaModal;

    })(galleryItems, currentIndex);
}

// Reusable function to close the media modal.
function closeMediaModal() {
    const mediaModal = document.getElementById('media-modal');
    if (mediaModal) {
        mediaModal.classList.add('hidden');
        // Clean up global listeners to avoid conflicts
        document.onkeydown = null;
        mediaModal.ontouchstart = null;
        mediaModal.ontouchend = null;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Fetch the organizer-specific navbar.
    fetch('organizerNavBar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            const placeholder = document.getElementById('organizer-navbar-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;

                const hamburgerIcon = document.getElementById('organizer-hamburger-icon');
                const mobileMenu = document.getElementById('organizer-mobile-menu');
                
                if (hamburgerIcon && mobileMenu) {
                    hamburgerIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        mobileMenu.classList.toggle('hidden');
                    });
                }

                document.addEventListener('click', (event) => {
                    if (mobileMenu && hamburgerIcon) {
                        const isClickInsideMenu = mobileMenu.contains(event.target);
                        const isClickOnHamburgerIcon = hamburgerIcon.contains(event.target);
                        if (!isClickInsideMenu && !isClickOnHamburgerIcon && !mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                        }
                    }
                });

                const langEn = document.getElementById('organizer-lang-en');
                const langEs = document.getElementById('organizer-lang-es');

                if (langEn && langEs) {
                    langEn.addEventListener('click', () => {
                        langEn.classList.add('revelo-orange');
                        langEn.classList.remove('text-gray-700');
                        langEs.classList.add('text-gray-700');
                        langEs.classList.remove('revelo-orange');
                    });
                    langEs.addEventListener('click', () => {
                        langEs.classList.add('revelo-orange');
                        langEs.classList.remove('text-gray-700');
                        langEn.classList.add('text-gray-700');
                        langEn.classList.remove('revelo-orange');
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching organizer navbar:', error));

    // Listen for clicks on any element that should open the media modal.
    document.addEventListener('click', (event) => {
        const galleryItem = event.target.closest('[data-open-media-modal]');
        if (galleryItem) {
            openMediaModal(galleryItem);
        }
    });
});

// Helper function to switch dashboard tabs from the menu and then close it.
// This function needs to be globally accessible for the onclick attributes.
function switchTabAndCloseMenu(tabId) {
    if (typeof switchTab === 'function') {
        switchTab(tabId);
    }
    const mobileMenu = document.getElementById('organizer-mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}
