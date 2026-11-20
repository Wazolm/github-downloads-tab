# GitHub Downloads Tab

> Adds a **Downloads** tab between **Code** and **Issues** in the GitHub repository navigation bar, linking directly to the repository's Releases page.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**English** | [简体中文](./README.md)

## About

GitHub's Releases page hosts version notes, source archives (zip / tar.gz) and author-uploaded binary assets, but its entry is buried in the sidebar or navigation. This userscript inserts a **Downloads** tab between **Code** and **Issues** in the repository navigation bar, so a single click takes you to `https://github.com/<owner>/<repo>/releases`.

## Features

- Automatically inserts a **Downloads** tab between **Code** and **Issues** on any repository home page.
- Clicking **Downloads** navigates to that repository's Releases page.
- If a repository has Issues disabled, the tab falls back to right after **Code**.
- On GitHub soft navigation (switching between repositories), the link updates to the current repository automatically — no page refresh needed.
- Does not modify any original GitHub content; it only adds one entry.

## Why "Downloads" instead of "Releases"?

The Releases page not only shows release notes but also aggregates source archives (zip / tar.gz) and author-uploaded binary assets. For most users who just want to grab something, **Downloads** is more intuitive. The label is Downloads; the destination is still the official Releases page.

## Installation

### Prerequisites

- A userscript manager such as [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/) or Greasemonkey 4+.

### Steps

1. Open `github-downloads-tab.user.js` in this repository.
2. Click the **Raw** button; your userscript manager will prompt you to install.
3. Confirm the installation and refresh any GitHub repository home page.

### Chrome users

- **Chrome 138+**: enable Tampermonkey's *Allow User Scripts* toggle in `chrome://extensions`.
- **Chrome 137 and below**: enable **Developer mode** in the top-right corner of `chrome://extensions`.

## Usage

1. Open any repository home page, e.g. `https://github.com/torvalds/linux`.
2. The navigation bar now shows **Code · Downloads · Issues · Pull requests · …**
3. Click **Downloads** to open that repository's Releases page.
4. When switching between repositories, the entry updates automatically.

> The script only targets the repository home page navigation bar. On Issues, Pull Request or file browsing pages, GitHub uses a different layout, so the entry may not appear — this is expected.

## Compatibility

- **Browsers**: the most restrictive API used is `Element.closest()`, which requires **Chrome 41+**. Works on modern Chrome, Edge, Firefox and Safari.
- **Userscript managers**: Tampermonkey, Violentmonkey, Greasemonkey 4+.
- **Page scope**: `https://github.com/*`, effective on repository home pages only.

## Known limitations

- The entry depends on GitHub's navigation bar DOM. If GitHub significantly redesigns the navigation (e.g. changes the container's `aria-label` or class names), the script may stop working and the selectors need updating.
- Not available for GitHub Enterprise private domains. If needed, change `@match` in the script to your domain.

## Privacy

- No user data is collected.
- No additional network requests are made.
- No page content or account information is read or uploaded.
- All logic runs locally in your browser.

## Contributing

Issues and pull requests are welcome. When reporting a problem, please include:

- Browser version and userscript manager version;
- The repository URL that reproduces the issue (public repositories only);
- Any errors from the browser console (F12 → Console).

## License

[MIT License](./LICENSE)