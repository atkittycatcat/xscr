// ==UserScript==
// @name         Reddit
// @description  XSCR reddit script
// @namespace    https://tampermonkey.net/
// @version      1.0
// @auther       angel
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(() => {
  const updateRedditLinks = (root) => {
    const links = root.querySelectorAll ? root.querySelectorAll('a[href]') : [];

    for (const link of links) {
      try {
        const url = new URL(link.href);
        if (url.hostname === 'www.reddit.com') {
          url.hostname = 'old.reddit.com';
          link.href = url.href;
        }
      } catch {}
    }
  };

  updateRedditLinks(document);

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        updateRedditLinks(mutation.target.parentElement ?? document);
      } else {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches('a[href]')) {
              updateRedditLinks(node.parentElement ?? document);
            } else {
              updateRedditLinks(node);
            }
          }
        }
      }
    }
  }).observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });
})();
