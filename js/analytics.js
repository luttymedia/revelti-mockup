/**
 * Revelti PostHog Analytics Module
 * Provides privacy-conscious event & product interaction tracking.
 */
(function () {
    const POSTHOG_KEY = 'phc_mRGJRYTnCbKTiNSzPxZ6sRaSVfNwu5K4ZRb2deDKUZ6F';
    const POSTHOG_API_HOST = 'https://t.revelti.com';
    const POSTHOG_UI_HOST = 'https://eu.posthog.com';

    // Official PostHog snippet loader
    !function (t, e) { var o, n, p, r; e.__SV || (window.posthog && window.posthog.__loaded) || (window.posthog = e, e._i = [], e.init = function (i, s, a) { function g(t, e) { var o = e.split("."); 2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } } (p = t.createElement("script")).type = "text/javascript", p.crossOrigin = "anonymous", p.async = !0, p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js", (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r); var u = e; for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function (t) { var e = "posthog"; return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e }, u.people.toString = function () { return u.toString(1) + ".people (stub)" }, o = "an ln init xn Cn Br kn In capture Fn nn calculateEventProperties On register register_once register_for_session unregister unregister_for_session Ln getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync Dn identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty An Rn createPersonProfile setInternalOrTestUser $n yn jn opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Tn debug Ur Rt getPageViewId captureTraceFeedback captureTraceMetric pn".split(" "), n = 0; n < o.length; n++)g(u, o[n]); e._i.push([i, s, a]) }, e.__SV = 1) }(document, window.posthog || []);

    // Initialize PostHog with reverse proxy & privacy-respecting options
    if (window.posthog && POSTHOG_KEY) {
        window.posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_API_HOST,
            ui_host: POSTHOG_UI_HOST,
            defaults: '2026-05-30',
            person_profiles: 'always',
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
