// ==UserScript==
// @name         GitHub 仓库导航栏 - Releases 便捷入口
// @namespace    https://github.com/tampermonkey/releases-tab
// @version      1.0.0
// @description  在 Code 与 Issues 之间添加 Downloads 入口，点击直达 releases 页面
// @author       Loge
// @match        https://github.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  var LINK_ID = 'tm-releases-tab';
  var LOG_PREFIX = '[TM-Releases]';

  // 使用更通用的选择器：不限定内部容器是 ul 还是 div
  var NAV_CONTAINER_SELECTOR = 'nav[aria-label="Repository"] .UnderlineNav-body, nav[aria-label="Repository"] ul';

  var RESERVED_OWNERS = [
    'about', 'account', 'apps', 'codespaces', 'collections', 'contact',
    'copilot', 'customer-stories', 'dashboard', 'enterprise', 'events',
    'explore', 'features', 'github-copilot', 'issues', 'join', 'login',
    'logout', 'marketplace', 'new', 'nonprofit', 'notifications',
    'organizations', 'orgs', 'pricing', 'pulls', 'readme', 'search',
    'security', 'sessions', 'settings', 'site', 'sponsors', 'stars',
    'topics', 'trending', 'users', 'watching'
  ];

  function isReserved(name) {
    name = String(name).toLowerCase();
    for (var i = 0; i < RESERVED_OWNERS.length; i++) {
      if (RESERVED_OWNERS[i] === name) return true;
    }
    return false;
  }

  function getRepoPath() {
    var path = location.pathname || '';
    var m = path.match(/^\/([^\/?#]+)\/([^\/?#]+)/);
    if (!m) return null;
    var owner = m[1];
    var repo = m[2];
    if (!owner || !repo || isReserved(owner)) return null;
    return '/' + owner + '/' + repo;
  }

  function log() {
    // 仅在需要调试时取消下面这行的注释
    // console.log.apply(console, [LOG_PREFIX].concat(Array.prototype.slice.call(arguments)));
  }

  /* 等待导航栏容器出现 */
  function waitForNav(callback) {
    var nav = document.querySelector(NAV_CONTAINER_SELECTOR);
    if (nav) {
      log('Nav container found immediately');
      callback(nav);
      return;
    }
    log('Nav container not found, waiting...');
    var observer = new MutationObserver(function (mutations, obs) {
      var nav = document.querySelector(NAV_CONTAINER_SELECTOR);
      if (nav) {
        log('Nav container found via observer');
        obs.disconnect();
        callback(nav);
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    // 10 秒后超时，避免无限等待
    setTimeout(function () { observer.disconnect(); log('Timeout waiting for nav'); }, 10000);
  }

  /* 查找 Code 或 Issues 的 li，通过链接的 href 或 data-tab-item 定位，不再依赖 ID */
  function findAnchor(nav) {
    var links = nav.querySelectorAll('a');
    var codeLi = null, issuesLi = null;

    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href') || '';
      var tabItem = a.getAttribute('data-tab-item') || '';

      // Code 通常指向 /owner/repo，Issues 指向 /owner/repo/issues
      if (!codeLi && (href.indexOf('/issues') === -1 && (href === location.pathname || href.indexOf('code') > -1 || tabItem.indexOf('code') > -1))) {
        codeLi = a.closest('li');
      }
      if (!issuesLi && (href.indexOf('/issues') > -1 || tabItem.indexOf('issues') > -1)) {
        issuesLi = a.closest('li');
      }
    }

    if (issuesLi) return { li: issuesLi, isIssues: true };
    if (codeLi) return { li: codeLi, isIssues: false };
    return null;
  }

  function ensureTab() {
    var repoPath = getRepoPath();
    if (!repoPath) return;
    log('ensureTab for', repoPath);

    var href = repoPath + '/releases';

    var existed = document.getElementById(LINK_ID);
    if (existed) {
      if (existed.getAttribute('href') !== href) existed.setAttribute('href', href);
      return;
    }

    waitForNav(function (nav) {
      if (document.getElementById(LINK_ID)) return;

      var anchor = findAnchor(nav);
      if (!anchor) {
        log('Anchor (Code/Issues) not found inside nav');
        return;
      }

      var sampleLi = anchor.li;
      var sampleA = sampleLi.querySelector('a');

      var newLi = document.createElement('li');
      newLi.className = (sampleLi.className || '').replace(/selected|js-selected-navigation-item/g, '').trim() || 'd-inline-flex';

      var newA = document.createElement('a');
      newA.id = LINK_ID;
      newA.href = href;
      newA.className = (sampleA ? sampleA.className : '').replace(/selected|js-selected-navigation-item/g, '').trim() || 'UnderlineNav-item';
      newA.setAttribute('data-tab-item', 'releases-tab');
      newA.setAttribute('aria-label', 'Downloads');
      newA.appendChild(document.createTextNode('Downloads'));

      newLi.appendChild(newA);

      if (anchor.isIssues) {
        nav.insertBefore(newLi, sampleLi);
        log('Inserted before Issues');
      } else {
        nav.insertBefore(newLi, sampleLi.nextSibling);
        log('Inserted after Code (Issues not found)');
      }
    });
  }

  var timer = null;
  function schedule(delay) {
    if (timer !== null) return;
    timer = setTimeout(function () { timer = null; ensureTab(); }, typeof delay === 'number' ? delay : 200);
  }

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { schedule(0); }, false);
  } else {
    schedule(0);
  }

  // 监听 GitHub SPA 导航事件
  ['turbo:load', 'turbo:render', 'pjax:end', 'pjax:success'].forEach(function (ev) {
    document.addEventListener(ev, function () { schedule(100); }, true);
  });

  // 轮询 URL 变化，作为 SPA 导航的兜底
  var lastHref = location.href;
  setInterval(function () {
    if (location.href !== lastHref) {
      lastHref = location.href;
      schedule(150);
    }
  }, 800);

  // 全局观察器，应对非 URL 变化导致的导航栏重绘
  new MutationObserver(function () { schedule(300); }).observe(document.documentElement, { childList: true, subtree: true });

})();