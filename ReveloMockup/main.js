// --- MODAL FUNCTIONS (GLOBAL SCOPE) ---

/**
 * Closes a modal by its ID with a fade-out animation.
 * @param {string} modalId The ID of the modal overlay to close.
 */
function closeModal(modalId) {
    const modalOverlay = document.getElementById(modalId);
    if (modalOverlay) {
        modalOverlay.classList.remove('visible');
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    }
}

/**
 * Fetches notification settings content and displays it in a modal.
 */
function openSettingsModal() {
    if (document.getElementById('settings-modal-overlay')) return;

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'settings-modal-overlay';
    modalOverlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = '<p class="text-center p-6">Loading settings...</p>';

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    setTimeout(() => modalOverlay.classList.add('visible'), 10);

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) closeModal('settings-modal-overlay');
    });

    fetch('notificationSettings.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const settingsContainer = doc.querySelector('.max-w-2xl.mx-auto.bg-white');
            const settingsScript = doc.querySelector('script:not([src])');

            if (settingsContainer && settingsScript) {
                const closeButton = document.createElement('button');
                closeButton.innerHTML = '&times;';
                closeButton.className = 'absolute top-2 right-2 text-3xl leading-none text-gray-500 hover:text-gray-800 z-50';
                closeButton.setAttribute('aria-label', 'Close settings');
                closeButton.onclick = () => closeModal('settings-modal-overlay');
                
                const header = settingsContainer.querySelector('header');
                if(header) header.appendChild(closeButton);

                modalContent.innerHTML = '';
                modalContent.appendChild(settingsContainer);

                const scriptElement = document.createElement('script');
                scriptElement.textContent = settingsScript.textContent;
                document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);

                if (typeof initializeSettingsComponent === 'function') {
                    initializeSettingsComponent(modalContent.querySelector('.max-w-2xl'));
                }
            } else {
                modalContent.innerHTML = '<p class="text-center text-red-500 p-6">Error: Could not load settings content.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching settings for modal:', error);
            modalContent.innerHTML = '<p class="text-center text-red-500 p-6">Error: Could not load settings.</p>';
        });
}

/**
 * Fetches notification content and displays it in a modal.
 */
function openNotificationsModal() {
    if (document.getElementById('notifications-modal-overlay')) return;

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'notifications-modal-overlay';
    modalOverlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = '<p class="text-center p-6">Loading notifications...</p>';

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    setTimeout(() => modalOverlay.classList.add('visible'), 10);

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) closeModal('notifications-modal-overlay');
    });

    fetch('attendeeNotifications.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const notificationContainer = doc.querySelector('.max-w-2xl.mx-auto.bg-white');
            const notificationScript = doc.querySelector('script:not([src])');

            if (notificationContainer && notificationScript) {
                const closeButton = document.createElement('button');
                closeButton.innerHTML = '&times;';
                closeButton.className = 'absolute top-2 right-2 text-3xl leading-none text-gray-500 hover:text-gray-800 z-50';
                closeButton.setAttribute('aria-label', 'Close notifications');
                closeButton.onclick = () => closeModal('notifications-modal-overlay');
                
                const header = notificationContainer.querySelector('header');
                if(header) header.appendChild(closeButton);

                modalContent.innerHTML = '';
                modalContent.appendChild(notificationContainer);

                const scriptElement = document.createElement('script');
                scriptElement.textContent = notificationScript.textContent;
                document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);

                if (typeof initializeNotificationComponent === 'function') {
                    const host = modalContent.querySelector('.max-w-2xl');
                    initializeNotificationComponent(host);

                    const settingsButton = host.querySelector('#settings-icon-button');
                    if (settingsButton) {
                        settingsButton.addEventListener('click', () => {
                            if (window.innerWidth < 768) {
                                window.location.href = 'notificationSettings.html';
                            } else {
                                openSettingsModal();
                            }
                        });
                    }
                }
            } else {
                modalContent.innerHTML = '<p class="text-center text-red-500 p-6">Error: Could not load notification content.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching notifications for modal:', error);
            modalContent.innerHTML = '<p class="text-center text-red-500 p-6">Error: Could not load notifications.</p>';
        });
}


// --- NAVBAR INITIALIZATION ---
document.addEventListener("DOMContentLoaded", function() {
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
});
