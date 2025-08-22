// --- MODAL & GLOBAL FUNCTIONS ---

// Reusable function to close any modal.
function closeModal(modalId) {
    const modalOverlay = document.getElementById(modalId);
    if (modalOverlay) {
        modalOverlay.classList.remove('visible');
        // Wait for the transition to finish before removing the element
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    }
}

// Functions for the media modal.
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
    
    // Get all gallery items from the current view.
    const favoritesGrid = document.getElementById('favorites-grid');
    if (!favoritesGrid) {
        console.error("Favorites grid not found.");
        return;
    }

    const galleryItems = Array.from(favoritesGrid.querySelectorAll('.cursor-pointer'));
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
    
    if (closeBtn) closeBtn.onclick = () => closeMediaModal();
    if (nextBtn) nextBtn.onclick = () => showNextMedia(galleryItems);
    if (prevBtn) prevBtn.onclick = () => showPrevMedia(galleryItems);

    function showNextMedia(items) {
        currentIndex = (currentIndex + 1) % items.length;
        const nextItem = items[currentIndex];
        modalImage.src = nextItem.querySelector('img').src;
        modalEventName.textContent = nextItem.getAttribute('data-event');
        modalCreatorName.textContent = `by ${nextItem.getAttribute('data-creator')}`;
    }

    function showPrevMedia(items) {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        const prevItem = items[currentIndex];
        modalImage.src = prevItem.querySelector('img').src;
        modalEventName.textContent = prevItem.getAttribute('data-event');
        modalCreatorName.textContent = `by ${prevItem.getAttribute('data-creator')}`;
    }
}

function closeMediaModal() {
    const mediaModal = document.getElementById('media-modal');
    if (mediaModal) {
        mediaModal.classList.add('hidden');
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
    const selectedStyles = ['Bachata Sensual', 'Kizomba']; // [Unverified] This is a placeholder, actual data would come from a server.

    container.innerHTML = '';
    allStyles.forEach(style => {
        const isChecked = selectedStyles.includes(style);
        const label = document.createElement('label');
        label.className = 'flex justify-between items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer';
        label.innerHTML = `<span class="text-gray-700">${style}</span><input type="checkbox" value="${style}" class="h-5 w-5 rounded border-gray-300 text-revelo-orange focus:ring-revelo-orange" ${isChecked ? 'checked' : ''}>`;
        container.appendChild(label);
    });
}

function updateSelectedStylesDisplay() {
    const stylesDisplay = document.getElementById('styles-display');
    if (!stylesDisplay) return;

    // This would typically come from a server or user data
    const selectedStyles = ['Bachata Sensual', 'Kizomba'];

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
    const mediaModal = document.getElementById('media-modal');
    const modalImage = document.getElementById('modal-image');
    const closeMediaModalBtn = document.getElementById('close-media-modal');
    const nextBtn = document.getElementById('next-media');
    const prevBtn = document.getElementById('prev-media');
    
    if (mediaModal) {
        mediaModal.addEventListener('click', (event) => {
            if (event.target === mediaModal) closeMediaModal();
        });
        mediaModal.addEventListener('touchstart', (e) => {
            window.touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        mediaModal.addEventListener('touchend', (e) => {
            window.touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        document.addEventListener('keydown', (e) => {
            if (!mediaModal.classList.contains('hidden')) {
                if (e.key === 'ArrowRight') nextMedia();
                else if (e.key === 'ArrowLeft') prevMedia();
                else if (e.key === 'Escape') closeMediaModal();
            }
        });
    }

    if (modalImage) modalImage.addEventListener('click', (e) => e.stopPropagation());
    if (closeMediaModalBtn) closeMediaModalBtn.addEventListener('click', closeMediaModal);
    if (nextBtn) nextBtn.addEventListener('click', () => openMediaModal(nextBtn.nextElementSibling));
    if (prevBtn) prevBtn.addEventListener('click', () => openMediaModal(prevBtn.previousElementSibling));

    // Handle swipe functionality
    function handleSwipe() {
        if (window.touchEndX < window.touchStartX - 50) nextMedia();
        if (window.touchEndX > window.touchStartX + 50) prevMedia();
    }
}

// Function to attach listeners for the Profile tab.
function initializeProfileTabListeners() {
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
        confirmStylesBtn.addEventListener('click', () => {
            // Get selected styles and update display
            const newSelected = [];
            if (stylesModalContent) {
                stylesModalContent.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
                    newSelected.push(input.value);
                });
            }
            // In a real app, you would save this to a server
            // For now, we'll just update the display
            updateSelectedStylesDisplay();
            closeStylesModal();
        });
    }
    
    if (stylesModal && stylesModalContent) {
        stylesModal.addEventListener('click', (event) => {
            if (!stylesModalContent.contains(event.target)) {
                closeStylesModal();
            }
        });
    }
    
    if (settingsLink) {
        settingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.innerWidth < 768) {
                window.location.href = 'notificationSettings.html';
            } else {
                // Check if openSettingsModal exists (for standalone pages)
                if (typeof openSettingsModal === 'function') {
                    openSettingsModal();
                } else {
                    // Fallback for standalone pages
                    window.location.href = 'notificationSettings.html';
                }
            }
        });
    }

    // Open Notification Settings as a modal
function openSettingsModal() {
    if (document.getElementById('settings-modal-overlay')) return;

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'settings-modal-overlay';
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden flex flex-col';
    modalContent.innerHTML = `
        <div class="p-6 border-b">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold revelo-blue">Notification Settings</h2>
                <button id="close-settings-modal" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">×</button>
            </div>
        </div>
        <div class="overflow-y-auto flex-1 p-6">
            <p class="text-center p-6">Loading notification settings...</p>
        </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Add close event listener
    const closeButton = document.getElementById('close-settings-modal');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modalOverlay.remove();
        });
    }

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            modalOverlay.remove();
        }
    });

    fetch('notificationSettings.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const settingsContainer = doc.querySelector('.max-w-2xl.mx-auto.bg-white');
            
            if (settingsContainer) {
                const contentArea = modalContent.querySelector('.overflow-y-auto');
                contentArea.innerHTML = '';
                
                // Remove the header from the fetched content since we already have one
                const header = settingsContainer.querySelector('header');
                if (header) header.remove();
                
                contentArea.appendChild(settingsContainer);
            } else {
                const contentArea = modalContent.querySelector('.overflow-y-auto');
                contentArea.innerHTML = '<p class="text-center text-red-500 p-6">Error: Could not load settings content.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching settings for modal:', error);
            const contentArea = modalContent.querySelector('.overflow-y-auto');
            contentArea.innerHTML = '<p class="text-center text-red-500 p-6">Error: Could not load settings.</p>';
        });
}
    
    // Initialize styles display
    updateSelectedStylesDisplay();
    
    // Render styles in modal if needed
    if (stylesModalContent) {
        renderStylesInModal();
    }
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
                    notificationIconButton.addEventListener('click', () => {
                        if (window.innerWidth < 768) {
                            window.location.href = 'attendeeNotifications.html';
                        } else {
                            openNotificationsModal();
                        }
                    });
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
            }
        })
        .catch(error => console.error('Error fetching footer:', error));
});

// Initialize listeners for the Profile page if the element exists
if (document.getElementById('profile')) {
    initializeProfileTabListeners();
}
