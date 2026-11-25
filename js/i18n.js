/**
 * Revelti Client-Side i18n Engine
 * Supports automatic browser language detection (es fallback) & localStorage persistence
 */
(function () {
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'revelti_lang';

  class I18nEngine {
    constructor() {
      this.translations = {};
      this.currentLang = this.detectPreferredLanguage();
      this.listeners = [];
    }

    detectPreferredLanguage() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;

      const spanishRegionalPrefixes = ['es', 'ca', 'eu', 'gl'];
      const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage || ''];
      for (const lang of browserLangs) {
        if (!lang) continue;
        const code = lang.toLowerCase();
        if (spanishRegionalPrefixes.some(prefix => code.startsWith(prefix))) {
          return 'es';
        }
      }
      return DEFAULT_LANG;
    }

    async init() {
      await this.loadLanguage(this.currentLang);
      document.documentElement.lang = this.currentLang;
      this.updateDOM();
      this.updateSwitcherUI();
    }

    async loadLanguage(lang) {
      if (this.translations[lang]) return;
      try {
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) throw new Error(`Failed to load /locales/${lang}.json (Status: ${response.status})`);
        this.translations[lang] = await response.json();
      } catch (err) {
        console.error(`[i18n] Error loading /locales/${lang}.json:`, err);
      }
    }

    registerFallback(lang, data) {
      this.translations[lang] = data;
    }

    t(key, params = {}) {
      const keys = key.split('.');
      let dict = this.translations[this.currentLang] || this.translations[DEFAULT_LANG] || {};

      let val = dict;
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          return key; // Return key if translation missing
        }
      }

      if (typeof val === 'string') {
        Object.keys(params).forEach(param => {
          val = val.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
        });
      }

      return val;
    }

    async setLanguage(lang) {
      if (!this.translations[lang]) {
        await this.loadLanguage(lang);
      }
      this.currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = this.currentLang;
      this.updateDOM();
      this.updateSwitcherUI();
      this.listeners.forEach(cb => cb(this.currentLang));
      if (window.ReveltiAnalytics && typeof window.ReveltiAnalytics.trackLanguageChange === 'function') {
        window.ReveltiAnalytics.trackLanguageChange(this.currentLang);
      }
    }

    onLanguageChange(callback) {
      this.listeners.push(callback);
    }

    updateDOM() {
      // Elements with data-i18n (innerText)
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.textContent = translated;
        }
      });

      // Elements with data-i18n-html (innerHTML)
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.innerHTML = translated;
        }
      });

      // Elements with data-i18n-placeholder
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.setAttribute('placeholder', translated);
        }
      });

      // Elements with data-i18n-title
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.setAttribute('title', translated);
        }
      });

      // Elements with data-i18n-aria-label
      document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.setAttribute('aria-label', translated);
        }
      });

      // Meta elements
      document.querySelectorAll('[data-i18n-meta]').forEach(el => {
        const key = el.getAttribute('data-i18n-meta');
        const translated = this.t(key);
        if (translated && translated !== key) {
          if (el.tagName.toLowerCase() === 'title') {
            document.title = translated;
          } else {
            el.setAttribute('content', translated);
          }
        }
      });

      // Update legal & blog links href dynamically based on active language
      const termsLinks = document.querySelectorAll('a[href^="terms"], a[href^="/terms"]');
      termsLinks.forEach(link => {
        link.setAttribute('href', this.currentLang === 'es' ? '/terms-es.html' : '/terms.html');
      });
      const privacyLinks = document.querySelectorAll('a[href^="privacy"], a[href^="/privacy"]');
      privacyLinks.forEach(link => {
        link.setAttribute('href', this.currentLang === 'es' ? '/privacy-es.html' : '/privacy.html');
      });
      const blogLinks = document.querySelectorAll('a[data-blog-link]');
      blogLinks.forEach(link => {
        link.setAttribute('href', this.currentLang === 'es' ? '/es/blog/' : '/blog/');
      });
    }

    updateSwitcherUI() {
      document.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        btn.classList.toggle('active', lang === this.currentLang);
      });
    }
  }

  window.i18n = new I18nEngine();
})();
