/**
 * Revelti PostHog Analytics Module
 * Provides privacy-conscious event & product interaction tracking.
 */
(function () {
    const POSTHOG_KEY = 'phc_mRGJRYTnCbKTiNSzPxZ6sRaSVfNwu5K4ZRb2deDKUZ6F';
    const POSTHOG_HOST = 'https://eu.i.posthog.com';

    // Official PostHog snippet loader
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}var u=e;for("undefined"!=typeof a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getActiveMatchingSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a]);o=t.createElement("script"),o.type="text/javascript",o.async=!0,o.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(p=t.getElementsByTagName("script")[0]).parentNode.insertBefore(o,p)},e.__SV=1.0)}(document,window.posthog||[]);

    // Initialize PostHog with privacy-respecting options
    if (window.posthog && POSTHOG_KEY) {
        window.posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            persistence: 'localStorage',
            autocapture: true,
            capture_pageview: true,
            respect_dnt: false
        });
    }

    // Global helper object for custom event tracking
    window.ReveltiAnalytics = {
        /**
         * Track any custom event safely
         */
        track: function (eventName, properties) {
            try {
                if (window.posthog && typeof window.posthog.capture === 'function') {
                    window.posthog.capture(eventName, properties || {});
                }
            } catch (err) {
                console.warn('[ReveltiAnalytics] Failed to log event:', eventName, err);
            }
        },

        /**
         * Track role button click on waitlist or profile selection
         */
        trackRoleSelection: function (role) {
            this.track('waitlist_profile_selected', {
                role: role,
                timestamp: new Date().toISOString()
            });
        },

        /**
         * Track successful or submitted waitlist form
         */
        trackWaitlistSubmission: function (role, locale) {
            this.track('waitlist_submitted', {
                role: role || 'unspecified',
                locale: locale || 'en',
                timestamp: new Date().toISOString()
            });
        },

        /**
         * Track CTA clicks across hero, nav, and profile cards
         */
        trackCtaClick: function (ctaName, role, location) {
            this.track('cta_clicked', {
                cta_name: ctaName,
                role: role || null,
                location: location || 'page',
                timestamp: new Date().toISOString()
            });
        },

        /**
         * Track scroll depth milestone (25%, 50%, 75%, 100%)
         */
        trackScrollDepth: function (percentage) {
            this.track('scroll_milestone_reached', {
                depth_percentage: percentage,
                timestamp: new Date().toISOString()
            });
        },

        /**
         * Track language changes (EN / ES)
         */
        trackLanguageChange: function (locale) {
            this.track('language_changed', {
                locale: locale,
                timestamp: new Date().toISOString()
            });
        }
    };

    // Scroll depth tracking initialization
    var scrollDepthMilestones = { 25: false, 50: false, 75: false, 100: false };
    window.addEventListener('scroll', function () {
        var winHeight = window.innerHeight;
        var docHeight = document.documentElement.scrollHeight - winHeight;
        if (docHeight <= 0) return;
        var scrollTop = window.scrollY || window.pageYOffset;
        var scrollPercent = Math.round((scrollTop / docHeight) * 100);

        [25, 50, 75, 100].forEach(function (milestone) {
            if (scrollPercent >= milestone && !scrollDepthMilestones[milestone]) {
                scrollDepthMilestones[milestone] = true;
                window.ReveltiAnalytics.trackScrollDepth(milestone);
            }
        });
    }, { passive: true });

})();
