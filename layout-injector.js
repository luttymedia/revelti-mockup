document.addEventListener("DOMContentLoaded", async () => {
    const role = document.body.getAttribute('data-role');
    if (!role) return;

    // Mobile vs Desktop Initial State
    const sidebar = document.getElementById('sidebar-placeholder');
    const isMobile = window.innerWidth < 768;

    if (sidebar) {
        const savedState = localStorage.getItem('sidebarState');
        if (savedState) {
            sidebar.classList.remove('sidebar-expanded', 'sidebar-collapsed');
            sidebar.classList.add(savedState);
        } else {
            if (isMobile) {
                sidebar.classList.add('sidebar-collapsed');
                sidebar.classList.remove('sidebar-expanded');
            } else {
                sidebar.classList.add('sidebar-expanded');
                sidebar.classList.remove('sidebar-collapsed');
            }
        }
    }

    try {
        if (role === 'creative' || role === 'organizer') {
            const _v = Date.now();
            const [sidebarHtml, navbarHtml] = await Promise.all([
                fetch(`${role}Sidebar.snippet?v=${_v}`).then(r => r.text()),
                fetch(`${role}NavBar.snippet?v=${_v}`).then(r => r.text())
            ]);

            // Surgical sanitization to remove live-server injection without clipping content
            // This function is no longer needed as .snippet files are assumed to be clean
            // const sanitizeSnippet = (html) => {
            //     return html
            //         .replace(/<!-- Code injected by live-server -->/gi, '')
            //         .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            // };

            console.log(`[layout-injector] Fetched ${role}Sidebar.snippet, length: ${sidebarHtml.length}`);
            if (sidebar) sidebar.innerHTML = sidebarHtml;

            const navbar = document.getElementById(`${role}-navbar-placeholder`);
            console.log(`[layout-injector] Fetched ${role}NavBar.snippet, length: ${navbarHtml.length}`);
            if (navbar) navbar.innerHTML = navbarHtml;

            // Bind hamburger icon in the navbar to toggle the mobile menu
            const hamburgerIcon = document.getElementById(`${role}-hamburger-icon`);
            const mobileMenu = document.getElementById(`${role}-mobile-menu`);
            if (hamburgerIcon && mobileMenu) {
                hamburgerIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    mobileMenu.classList.toggle('hidden');
                });
                document.addEventListener('click', (e) => {
                    if (!mobileMenu.contains(e.target) && !hamburgerIcon.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                });
            }

            // Bind sidebar toggle button (inside the sidebar) to expand/collapse the sidebar
            setTimeout(() => {
                const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');

                const toggleSidebar = () => {
                    if (sidebar.classList.contains('sidebar-expanded')) {
                        sidebar.classList.remove('sidebar-expanded');
                        sidebar.classList.add('sidebar-collapsed');
                        localStorage.setItem('sidebarState', 'sidebar-collapsed');
                    } else {
                        sidebar.classList.remove('sidebar-collapsed');
                        sidebar.classList.add('sidebar-expanded');
                        localStorage.setItem('sidebarState', 'sidebar-expanded');
                    }
                };

                if (sidebarToggleBtn && sidebar) {
                    sidebarToggleBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        toggleSidebar();
                    });
                }

                // Expand sidebar when clicking a group icon while collapsed
                const groupSummaries = sidebar.querySelectorAll('.sidebar-group > summary');
                groupSummaries.forEach(summary => {
                    summary.addEventListener('click', (e) => {
                        if (sidebar.classList.contains('sidebar-collapsed')) {
                            toggleSidebar();
                        }
                    });
                });
            }, 0);
        }

        // Active Link Logic Update
        const getBaseName = (path) => {
            const parts = path.split('/');
            const lastPart = parts.pop() || 'index.html';
            return lastPart.split('?')[0].split('#')[0].replace(/\.html$/, '') || 'index';
        };

        const currentBase = getBaseName(window.location.pathname);
        const activeClass = `active-link-${role}`;

        // Find links in both sidebar and navbar to set active state
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            if (link.hasAttribute('data-no-active-link')) return;
            const linkHref = link.getAttribute('href') || '';
            if (linkHref === '' || linkHref === '#') return;

            const linkBase = getBaseName(linkHref);

            if (linkBase === currentBase) {
                link.classList.add(activeClass);
            }
        });

        // Handle resize events cleanly
        window.addEventListener('resize', () => {
            const mobileView = window.innerWidth < 768;
            if (sidebar && mobileView) {
                if (!sidebar.classList.contains('sidebar-collapsed')) {
                    sidebar.classList.add('sidebar-collapsed');
                    sidebar.classList.remove('sidebar-expanded');
                }
            }
        });

    } catch (e) {
        console.error("Layout Injector Error:", e);
    }
});
