(function () {
  'use strict';

  const TAB_CONFIG = [
    { key: 'store', label: '🛒 МАГАЗИН', url: 'steam://open/store' },
    { key: 'library', label: '🎮 БИБЛИОТЕКА', url: 'steam://open/library' },
    { key: 'community', label: '☁ СООБЩЕСТВО', url: 'steam://open/community' },
    { key: 'profile', label: '👤 ПРОФИЛЬ', url: 'steam://open/main' },
    { key: 'friends', label: '💬 ДРУЗЬЯ', url: 'steam://open/friends' }
  ];

  function setActiveTab(key) {
    const buttons = document.querySelectorAll('.toxic-neon-tab');
    buttons.forEach(btn => {
      const active = btn.dataset.tab === key;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
      btn.setAttribute('aria-selected', String(active));
    });
  }

  function clickNativeTab(tabKey) {
    const candidates = document.querySelectorAll(
      'a, button, [role="button"], [class*="NavItem"], [class*="tab"], [class*="supernav"], [class*="MenuItem"]'
    );

    for (const el of candidates) {
      const text = (el.textContent || el.getAttribute('aria-label') || el.title || '').toLowerCase();
      let match = false;

      switch (tabKey) {
        case 'store':
          match = /магазин|store|shop/.test(text);
          break;
        case 'library':
          match = /библиотека|library/.test(text);
          break;
        case 'community':
          match = /сообщество|community|forums|соц/.test(text);
          break;
        case 'profile':
          match = /профиль|profile|account|аккаунт/.test(text);
          break;
        case 'friends':
          match = /друзья|friends|chat|чат/.test(text);
          break;
      }

      if (match) {
        el.click();
        return true;
      }
    }

    return false;
  }

  function triggerFallback(url) {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.location.href = url;
    }
  }

  function handleTabClick(tab) {
    setActiveTab(tab.key);
    if (!clickNativeTab(tab.key)) {
      triggerFallback(tab.url);
    }
  }

  function buildTabBar() {
    if (document.getElementById('toxic-neon-tabs')) return;

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
      button.textContent = tab.label;
      button.addEventListener('click', () => handleTabClick(tab));
      bar.appendChild(button);
    });

    document.body.appendChild(bar);
    setActiveTab('library');
  }

  function init() {
    buildTabBar();

    const observer = new MutationObserver(() => {
      if (!document.getElementById('toxic-neon-tabs')) {
        buildTabBar();
      }
    });

    const root = document.body || document.documentElement;
    if (root) {
      observer.observe(root, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
