document.addEventListener("DOMContentLoaded", async () => {
    const role = document.body.getAttribute('data-role');

    // --- AUTH STATE TRACKING ---
    const pathname = window.location.pathname;
    const isLoginPage = pathname.endsWith('attendeeDashboard.html') ||
        pathname.endsWith('organizerDashboard.html') ||
        pathname.endsWith('creativeDashboard.html') ||
        pathname.endsWith('superAdminDashboard.html');

    if (isLoginPage) {
        localStorage.setItem('revelti_logged_in', 'true');
        if (pathname.endsWith('attendeeDashboard.html')) localStorage.setItem('revelti_active_role', 'attendee');
        else if (pathname.endsWith('organizerDashboard.html')) localStorage.setItem('revelti_active_role', 'organizer');
        else if (pathname.endsWith('creativeDashboard.html')) localStorage.setItem('revelti_active_role', 'creative');
        else if (pathname.endsWith('superAdminDashboard.html')) localStorage.setItem('revelti_active_role', 'superadmin');
    }

    if (role) {
        localStorage.setItem('revelti_active_role', role);
    }

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
        if (role === 'creative' || role === 'organizer' || role === 'promoter' || role === 'superadmin') {
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

        // Initialize tooltips engine
        initTooltip();

    } catch (e) {
        console.error("Layout Injector Error:", e);
    }
});

function initTooltip() {
    let tooltipEl = document.getElementById('revelti-tooltip');
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'revelti-tooltip';
        tooltipEl.className = 'fixed hidden z-[9999] px-3 py-2 text-xs font-semibold text-slate-100 bg-slate-950/95 backdrop-blur-sm border border-slate-800 rounded-lg shadow-xl max-w-xs pointer-events-none transition-opacity duration-150 ease-out opacity-0';
        document.body.appendChild(tooltipEl);
    }

    let activeTooltipTarget = null;
    let tooltipTimeout = null;

    document.body.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (!target || target === activeTooltipTarget) return;

        activeTooltipTarget = target;
        clearTimeout(tooltipTimeout);

        tooltipEl.textContent = target.getAttribute('data-tooltip');
        tooltipEl.classList.remove('hidden');
        
        // Calculate position
        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();
        
        let top = rect.top - tooltipRect.height - 8;
        let left = rect.left + (rect.width - tooltipRect.width) / 2;

        // Boundaries
        if (left < 8) left = 8;
        if (left + tooltipRect.width > window.innerWidth - 8) {
            left = window.innerWidth - tooltipRect.width - 8;
        }
        if (top < 8) {
            top = rect.bottom + 8;
        }

        tooltipEl.style.top = `${top}px`;
        tooltipEl.style.left = `${left}px`;
        
        // Trigger reflow for transition
        tooltipEl.offsetHeight;
        tooltipEl.style.opacity = '1';
    });

    document.body.addEventListener('mouseout', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (!target || !activeTooltipTarget || target !== activeTooltipTarget) return;

        // Check if we are moving to a child of the active target
        if (e.relatedTarget && activeTooltipTarget.contains(e.relatedTarget)) return;

        activeTooltipTarget = null;
        tooltipEl.style.opacity = '0';
        
        tooltipTimeout = setTimeout(() => {
            if (!activeTooltipTarget) {
                tooltipEl.classList.add('hidden');
            }
        }, 150);
    });
}
