// This script is specifically for the Creative user journey.
// It loads the creative navbar and handles its interactions,
// as well as the media modal and other generic functionalities for creative pages.

// --- MODAL & GLOBAL FUNCTIONS ---

// Reusable function to close any modal.
function closeModal(modalId) {
    const modalOverlay = document.getElementById(modalId);
    if (modalOverlay) {
        modalOverlay.classList.remove('visible');
        setTimeout(() => {
            if (modalOverlay.parentNode) {
                modalOverlay.remove();
            }
        }, 300);
    }
}

// Reusable function to open the media modal.
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
    const galleryContainer = element.closest('.gallery-grid') || element.closest('#gallery-grid');
    if (!galleryContainer) {
        console.error("Gallery container not found.");
        return;
    }

    const galleryItems = Array.from(galleryContainer.querySelectorAll('[data-open-media-modal]'));
    let currentIndex = galleryItems.indexOf(element);

    if (currentIndex === -1) return;

    // Update content and show the modal
    modalImage.src = element.querySelector('img').src;
    modalEventName.textContent = element.getAttribute('data-event') || 'Event Name';
    modalCreatorName.textContent = `by ${element.getAttribute('data-creator') || 'Creator'}`;
    mediaModal.classList.remove('hidden');

    // Attach event listeners for navigation and closing
    const closeBtn = document.getElementById('close-media-modal');
    const nextBtn = document.getElementById('next-media');
    const prevBtn = document.getElementById('prev-media');

    (function (currentItems, startingIndex) {
        let currentImageIndex = startingIndex;
        function updateModalContent() {
            const currentItem = currentItems[currentImageIndex];
            if (currentItem) {
                modalImage.src = currentItem.querySelector('img').src;
                modalEventName.textContent = currentItem.getAttribute('data-event') || 'Event Name';
                modalCreatorName.textContent = `by ${currentItem.getAttribute('data-creator') || 'Creator'}`;
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
        if (nextBtn) nextBtn.onclick = showNextMedia;
        if (prevBtn) prevBtn.onclick = showPrevMedia;

        // Disable simple navigation keys
        document.onkeydown = e => {
            if (!mediaModal.classList.contains('hidden')) {
                if (e.key === 'ArrowRight') showNextMedia();
                else if (e.key === 'ArrowLeft') showPrevMedia();
                else if (e.key === 'Escape') closeMediaModal();
            }
        };

        if (closeBtn) closeBtn.onclick = closeMediaModal;

    })(galleryItems, currentIndex);
}

function closeMediaModal() {
    const mediaModal = document.getElementById('media-modal');
    if (mediaModal) {
        mediaModal.classList.add('hidden');
        document.onkeydown = null;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Fetch the creative-specific navbar.
    fetch('creativeNavBar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            const placeholder = document.getElementById('creative-navbar-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;

                const hamburgerIcon = document.getElementById('creative-hamburger-icon');
                const mobileMenu = document.getElementById('creative-mobile-menu');

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

                const langEn = document.getElementById('creative-lang-en');
                const langEs = document.getElementById('creative-lang-es');

                if (langEn && langEs) {
                    langEn.addEventListener('click', () => {
                        langEn.classList.add('text-revelti-orange');
                        langEn.classList.remove('text-gray-700');
                        langEs.classList.add('text-gray-700');
                        langEs.classList.remove('text-revelti-orange');
                    });
                    langEs.addEventListener('click', () => {
                        langEs.classList.add('text-revelti-orange');
                        langEs.classList.remove('text-gray-700');
                        langEn.classList.add('text-gray-700');
                        langEn.classList.remove('text-revelti-orange');
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching creative navbar:', error));

    // Listen for clicks on any element that should open the media modal.
    document.addEventListener('click', (event) => {
        const galleryItem = event.target.closest('[data-open-media-modal]');
        if (galleryItem) {
            openMediaModal(galleryItem);
        }
    });
});

// Helper function to switch dashboard tabs from the menu and then close it.
function switchTabAndCloseMenu(tabId) {
    if (typeof switchTab === 'function') {
        switchTab(tabId);
    }
    const mobileMenu = document.getElementById('creative-mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}
// --- DASHBOARD FILTERING LOGIC ---
function filterEvents(status) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    // Update button styles
    filterButtons.forEach(button => {
        if (button.getAttribute('onclick') === `filterEvents('${status}')`) {
            button.classList.add('bg-revelti-blue', 'text-white');
            button.classList.remove('bg-gray-200', 'text-gray-700');
        } else {
            button.classList.add('bg-gray-200', 'text-gray-700');
            button.classList.remove('bg-revelti-blue', 'text-white');
        }
    });

    // Show/hide event cards
    eventCards.forEach(card => {
        if (status === 'all' || card.dataset.status === status) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// --- LIGHTBOX VISIBILITY TOGGLE ---
function toggleLightboxVisibility(button) {
    const iconPath = button.querySelector('#privacy-path');
    if (!iconPath) return;

    const currentState = button.getAttribute('data-state');

    // Paths from organizer.js (using strokeWidth=2 compatible paths if needed, 
    // but these are the d attributes used in the organizer mockup)
    const publicPath = "M15 12a3 3 0 11-6 0 3 3 0 016 0z";
    const privatePath = "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .547 0 1.08.037 1.59.108M15 12a3 3 0 11-6 0 3 3 0 016 0zM17.94 17.94L21 21m-6-6l-3-3m0 0L9 9m3 3l3 3m0 0l3 3";

    if (currentState === 'public') {
        iconPath.setAttribute('d', privatePath);
        button.setAttribute('data-state', 'private');
        button.title = "Toggle Visibility (Private)";
    } else {
        iconPath.setAttribute('d', publicPath);
        button.setAttribute('data-state', 'public');
        button.title = "Toggle Visibility (Public)";
    }
}
