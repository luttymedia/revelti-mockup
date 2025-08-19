// This script is specifically for the Organizer user journey.
// It loads the organizer navbar and handles its interactions.

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
                // Step 1: Inject the navbar's HTML into the placeholder.
                placeholder.innerHTML = html;

                // Step 2: Now that the HTML is on the page, find the interactive elements
                // and add the necessary event listeners.
                const hamburgerIcon = document.getElementById('organizer-hamburger-icon');
                const mobileMenu = document.getElementById('organizer-mobile-menu');
                
                if (hamburgerIcon && mobileMenu) {
                    hamburgerIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        mobileMenu.classList.toggle('hidden');
                    });
                }

                // Close menu if clicking outside of it.
                document.addEventListener('click', (event) => {
                    if (mobileMenu && hamburgerIcon) {
                        const isClickInsideMenu = mobileMenu.contains(event.target);
                        const isClickOnHamburgerIcon = hamburgerIcon.contains(event.target);
                        if (!isClickInsideMenu && !isClickOnHamburgerIcon && !mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                        }
                    }
                });

                // Language Picker Logic
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