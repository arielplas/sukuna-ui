---
"sukuna-ui": patch
---

Breadcrumbs: key items by position instead of `href`. Keying by `href` produced duplicate React
keys when two crumbs shared one (e.g. repeated or placeholder hrefs); a breadcrumb trail is a fixed,
ordered list, so the index is the correct stable key.
