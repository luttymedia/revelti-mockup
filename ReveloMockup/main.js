document.addEventListener("DOMContentLoaded", function() {
    fetch('navBar.html')
        .then(response => response.text())
        .then(html => {
            const placeholder = document.getElementById('navbar-placeholder');
            if (placeholder) {
                // Step 1: Inject the navbar's HTML into the placeholder
                placeholder.innerHTML = html;

                // Step 2: Now that the HTML is on the page, run the JavaScript
                // that makes the navbar interactive. This code was moved from navBar.html.
                const langEn = document.getElementById('lang-en');
                const langEs = document.getElementById('lang-es');
                const hamburgerIcon = document.getElementById('hamburger-icon');
                const mobileMenu = document.getElementById('mobile-menu');
                const searchIcon = document.getElementById('search-icon');
                const searchBar = document.getElementById('search-bar');
                const searchContainer = document.getElementById('search-container');
                const logo = document.querySelector('a[href="homePage.html"]');

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
});