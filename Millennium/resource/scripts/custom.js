(function () {
  const SELECTORS = [
    'a', 'button', '[role="button"]', '.menuitem', '.MenuItem', '.tab', '.Tab', '.navigation', '.NavItem'
  ];

  const TAB_CONFIG = [
    {
      key: 'store',
      label: 'Магазин',
      aliases: ['store', 'shop', 'магазин', 'market'],
      fallback: 'steam://open/store'
    },
    {
      key: 'library',
      label: 'Библиотека',
      aliases: ['library', 'библиотека'],
      fallback: 'steam://open/library'
    },
    {
      key: 'community',
      label: 'Сообщество',
      aliases: ['community', 'сообщество', 'forums'],
      fallback: 'steam://open/community'
    },
    {
      key: 'profile',
      label: 'Профиль',
      aliases: ['profile', 'профиль', 'account'],
      fallback: 'steam://open/main'
    },
    {
      key: 'friends',
      label: 'Друзья',
      aliases: ['friends', 'friends & chat', 'друзья', 'chat'],
      fallback: 'steam://open/friends'
    }
  ];

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function textMatches(node, aliases) {
    if (!node) return false;

    const raw = node.textContent || node.getAttribute('aria-label') || node.title || '';
    const value = normalizeText(raw);

    return aliases.some(alias => value.includes(alias.toLowerCase()));
  }

  function findSteamTabNode(tab) {
    const els = document.querySelectorAll(SELECTORS.join(','));

    for (const el of els) {
      if (textMatches(el, tab.aliases)) {
        return el;
      }
    }

    return null;
  }

  function setActiveTab(key) {
    const buttons = document.querySelectorAll('.toxic-neon-tab');
    buttons.forEach(btn => {
      const active = btn.dataset.tab === key;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function triggerFallback(url) {
    try {
      const link = document.createElement('a');
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.location.href = url;
    }
  }

  function bindTab(tab, button) {
    button.addEventListener('click', () => {
      const target = findSteamTabNode(tab);
      setActiveTab(tab.key);

      if (target) {
        target.click();
        return;
      }

      triggerFallback(tab.fallback);
    });
  }

  function buildTabBar() {
    const existing = document.getElementById('toxic-neon-tabs');
    if (existing) return;

    const bar = document.createElement('div');
    bar.id = 'toxic-neon-tabs';
    bar.setAttribute('role', 'tablist');
    bar.setAttribute('aria-label', 'Steam toxic neon tabs');

    TAB_CONFIG.forEach(tab => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'toxic-neon-tab';
      button.dataset.tab = tab.key;
      button.setAttribute('role', 'tab');
      button.innerHTML = `<span>${tab.label}</span>`;
      bindTab(tab, button);
      bar.appendChild(button);
    });

    document.body.appendChild(bar);
    setActiveTab('library');
  }

  function watchDom() {
    buildTabBar();

    const observer = new MutationObserver(() => {
      const hasSteamUI = document.body && document.body.innerText.length > 0;
      if (hasSteamUI) {
        buildTabBar();
      }
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchDom);
  } else {
    watchDom();
  }
})();

