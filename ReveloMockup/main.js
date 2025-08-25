// --- MODAL & GLOBAL FUNCTIONS ---

// Reusable function to close any modal.
function closeModal(modalId) {
    const modalOverlay = document.getElementById(modalId);
    if (modalOverlay) {
        modalOverlay.classList.remove('visible');
        // Wait for the transition to finish before removing the element
        setTimeout(() => {
            if (modalOverlay.parentNode) {
                modalOverlay.remove();
            }
        }, 300);
    }
}

// Functions for the media modal.
// This function is now generic and accepts the clicked element as an argument.
function openMediaModal(element) {
    const mediaModal = document.getElementById('media-modal');
    if (!mediaModal) {
        console.error("Media modal HTML not found in the DOM.");
        return;
    }
    const modalImage = document.getElementById('modal-image');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalEventName = document.getElementById('modal-event-name');
    const modalCreatorName = document.getElementById('modal-creator-name');
    const modalHeaderIcons = mediaModal.querySelector('.flex.items-center.space-x-2');
    const modalNav = document.getElementById('modal-nav');
    
    // Find the parent gallery container of the clicked element.
    const galleryContainer = element.closest('.gallery-level') || element.closest('#favorites-grid');
    if (!galleryContainer) {
        console.error("Gallery container not found. Make sure the clicked element is inside a container with a class of '.gallery-level' or an id of '#favorites-grid'.");
        return;
    }

    // Get all gallery items from the current view.
    const galleryItems = Array.from(galleryContainer.querySelectorAll('.cursor-pointer'));
    let currentIndex = galleryItems.indexOf(element);

    if (currentIndex === -1) return;
    
    // Update content and show the modal
    modalImage.src = element.querySelector('img').src;
    modalEventName.textContent = element.getAttribute('data-event');
    modalCreatorName.textContent = `by ${element.getAttribute('data-creator')}`;
    mediaModal.classList.remove('hidden');

    // Attach event listeners for navigation and closing
    const closeBtn = document.getElementById('close-media-modal');
    const nextBtn = document.getElementById('next-media');
    const prevBtn = document.getElementById('prev-media');
    
    // Use an IIFE (Immediately Invoked Function Expression) to create a closure
    // for the current gallery items and index. This prevents issues with
    // multiple galleries trying to use the same global variables.
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

// Functions for the styles modal on the profile page.
function openStylesModal() {
    const stylesModal = document.getElementById('styles-modal');
    if (!stylesModal) {
        console.error("Styles modal HTML not found.");
        return;
    }
    renderStylesInModal();
    stylesModal.classList.remove('hidden');

    // Add event listeners directly to the modal's buttons
    const closeStylesModalBtn = document.getElementById('close-styles-modal');
    const confirmStylesBtn = document.getElementById('confirm-styles-btn');
    const stylesModalContent = document.getElementById('styles-modal-content');
    
    if (closeStylesModalBtn) {
        closeStylesModalBtn.onclick = closeStylesModal;
    }
    
    if (confirmStylesBtn) {
        confirmStylesBtn.onclick = () => {
            const newSelected = [];
            if (stylesModalContent) {
                stylesModalContent.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
                    newSelected.push(input.value);
                });
            }
            // [Unverified] This is a placeholder, actual data would come from a server.
            updateSelectedStylesDisplay(newSelected);
            closeStylesModal();
        };
    }
    
    if (stylesModal && stylesModalContent) {
        stylesModal.onclick = (event) => {
            if (!stylesModalContent.contains(event.target)) {
                closeStylesModal();
            }
        };
    }
}

function closeStylesModal() {
    const stylesModal = document.getElementById('styles-modal');
    if (stylesModal) {
        stylesModal.classList.add('hidden');
    }
}

function renderStylesInModal() {
    const stylesModalContent = document.getElementById('styles-modal-content');
    if (!stylesModalContent) return;
    
    const container = stylesModalContent.querySelector('.space-y-2');
    if (!container) return;

    const allStyles = ['Bachata Sensual', 'Salsa On1', 'Kizomba', 'Zouk', 'Bachata Fusion', 'Salsa On2'];
    // [Unverified] Fetch selected styles from a global variable or storage
    const selectedStyles = window.reveloSelectedStyles || ['Bachata Sensual', 'Kizomba']; 

    container.innerHTML = '';
    allStyles.forEach(style => {
        const isChecked = selectedStyles.includes(style);
        const label = document.createElement('label');
        label.className = 'flex justify-between items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer';
        label.innerHTML = `<span class="text-gray-700">${style}</span><input type="checkbox" value="${style}" class="h-5 w-5 rounded border-gray-300 text-revelo-orange focus:ring-revelo-orange" ${isChecked ? 'checked' : ''}>`;
        container.appendChild(label);
    });
}

function updateSelectedStylesDisplay(newStyles) {
    const stylesDisplay = document.getElementById('styles-display');
    if (!stylesDisplay) return;

    // [Unverified] This would typically come from a server or user data
    window.reveloSelectedStyles = newStyles || window.reveloSelectedStyles || ['Bachata Sensual', 'Kizomba'];
    const selectedStyles = window.reveloSelectedStyles;

    stylesDisplay.innerHTML = '';
    selectedStyles.forEach(style => {
        const span = document.createElement('span');
        span.className = 'bg-revelo-orange text-white text-sm font-semibold px-3 py-1 rounded-full';
        span.textContent = style;
        stylesDisplay.appendChild(span);
    });
}
    
    // Function to attach listeners for the Media tab.
    function initializeMediaTabListeners() {
        const stylesModal = document.getElementById('styles-modal');
        const editStylesBtn = document.getElementById('edit-styles-btn');
        const closeStylesModalBtn = document.getElementById('close-styles-modal');
        const confirmStylesBtn = document.getElementById('confirm-styles-btn');
        const stylesModalContent = document.getElementById('styles-modal-content');
        const settingsLink = document.getElementById('notification-settings-link');
        
        if (editStylesBtn) {
            editStylesBtn.addEventListener('click', openStylesModal);
        }
        
        if (closeStylesModalBtn) {
            closeStylesModalBtn.addEventListener('click', closeStylesModal);
        }
        
        if (confirmStylesBtn) {
            confirmStylesBtn.onclick = () => {
                // Get selected styles and update display
                const newSelected = [];
                if (stylesModalContent) {
                    stylesModalContent.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
                        newSelected.push(input.value);
                    });
                }
                // In a real app, you would save this to a server
                // For now, we'll just update the display
                updateSelectedStylesDisplay(newSelected);
                closeStylesModal();
            };
        }
        
        if (stylesModal && stylesModalContent) {
            stylesModal.addEventListener('click', (event) => {
                if (!stylesModalContent.contains(event.target)) {
                    closeStylesModal();
                }
            });
        }
        
        if (settingsLink) {
            // Fallback for standalone pages
            window.location.href = 'notificationSettings.html';
        }

        // Initialize styles display
        updateSelectedStylesDisplay();
        
        // Render styles in modal if needed
        if (stylesModalContent) {
            renderStylesInModal();
        }
    }

function initializeFooter() {
    const footerLinks = document.querySelectorAll('footer a');
    const currentPath = window.location.pathname;

    // Remove active class from all links first to ensure only one is active
    footerLinks.forEach(link => {
        link.classList.remove('footer-link-active');
        link.classList.remove('revelo-blue'); // Ensure revelo-blue is removed
        link.classList.add('text-gray-400'); // Add the gray color class
    });

    // Find the link that matches the current page and add the active class
    // We check if the current path ends with the link's href for a robust match.
    footerLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (currentPath.endsWith(linkHref)) {
            link.classList.add('footer-link-active');
            link.classList.remove('text-gray-400');
            link.classList.add('revelo-blue');
        }
    });
}

// --- NAVBAR & FOOTER INITIALIZATION ---
document.addEventListener("DOMContentLoaded", function() {
    // Load Navbar
    fetch('navBar.html')
        .then(response => response.text())
        .then(html => {
            const placeholder = document.getElementById('navbar-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;

                const langEn = document.getElementById('lang-en');
                const langEs = document.getElementById('lang-es');
                const hamburgerIcon = document.getElementById('hamburger-icon');
                const mobileMenu = document.getElementById('mobile-menu');
                const searchIcon = document.getElementById('search-icon');
                const searchBar = document.getElementById('search-bar');
                const searchContainer = document.getElementById('search-container');
                const logo = document.querySelector('a[href="homePage.html"]');
                const notificationIconButton = document.getElementById('notification-icon-button');

                if (langEn && langEs) {
                    langEn.addEventListener('click', () => {
                        langEn.classList.add('text-orange-500');
                        langEn.classList.remove('text-gray-700');
                        langEs.classList.add('text-gray-700');
                        langEs.classList.remove('text-orange-500');
                    });
                    langEs.addEventListener('click', () => {
                        langEs.classList.add('text-orange-500');
                        langEs.classList.remove('text-gray-700');
                        langEn.classList.add('text-gray-700');
                        langEn.classList.remove('text-orange-500');
                    });
                }
                
                if (hamburgerIcon && mobileMenu) {
                     hamburgerIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        mobileMenu.classList.toggle('hidden');
                    });
                }
               
                if (searchIcon && searchBar && logo && searchContainer) {
                    searchIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        if (window.innerWidth < 768) {
                            logo.classList.toggle('hidden');
                            searchContainer.classList.toggle('left-4');
                            searchContainer.classList.toggle('right-20');
                            searchContainer.classList.toggle('right-0');
                        }
                        searchBar.classList.toggle('w-0');
                        searchBar.classList.toggle('opacity-0');
                        searchBar.classList.toggle('w-full');
                        searchBar.classList.toggle('opacity-100');
                        if (searchBar.classList.contains('opacity-100')) {
                            searchBar.focus();
                        }
                    });
                }

                if (notificationIconButton) {
                    // Placeholder for future notification functionality
                    // notificationIconButton.addEventListener('click', openNotificationsModal);
                }

                document.addEventListener('click', (event) => {
                    if (searchBar && searchIcon) {
                        const isClickInsideSearchBar = searchBar.contains(event.target);
                        const isClickOnSearchIcon = searchIcon.contains(event.target);
                        if (!isClickInsideSearchBar && !isClickOnSearchIcon && searchBar.classList.contains('opacity-100')) {
                            if (window.innerWidth < 768) {
                                logo.classList.remove('hidden');
                                searchContainer.classList.remove('left-4');
                                searchContainer.classList.remove('right-20');
                                searchContainer.classList.add('right-0');
                            }
                            searchBar.classList.add('w-0');
                            searchBar.classList.add('opacity-0');
                            searchBar.classList.remove('w-full');
                            searchBar.classList.remove('opacity-100');
                        }
                    }

                    if (mobileMenu && hamburgerIcon) {
                         const isClickInsideMenu = mobileMenu.contains(event.target);
                        const isClickOnHamburgerIcon = hamburgerIcon.contains(event.target);
                        if (!isClickInsideMenu && !isClickOnHamburgerIcon && !mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching navbar:', error));

    // Load Footer
    fetch('footer.html')
        .then(response => response.text())
        .then(html => {
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;
                initializeFooter();
            }
        })
        .catch(error => console.error('Error fetching footer:', error));
        
    // --- CENTRALIZED GALLERY LISTENERS ---
    // Listen for clicks on any element that should open the media modal.
    document.addEventListener('click', (event) => {
        const galleryItem = event.target.closest('[data-open-media-modal]');
        if (galleryItem) {
            openMediaModal(galleryItem);
        }
    });

    // Initialize listeners for the Profile page if the element exists
    if (document.getElementById('profile')) {
        initializeMediaTabListeners();
    }
});
