---
layout: home
title: "{{ 'tabs.home' | t }}"
icon: fas fa-home
order: 1
---

<!-- 언어 감지: 플러그인이 page.lang 설정 -->
{% assign current_lang = page.lang | default: site.default_lang %}

<!-- 최근 업데이트 (언어 필터) -->
<h2>{{ 'labels.recently_updated' | t }}</h2>
<ul class="post-recent">
  {% assign posts = site.posts | where: "lang", current_lang %}
  {% for p in posts limit: 8 %}
    <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a></li>
  {% endfor %}
</ul>
---
layout: home
title: "{{ 'tabs.home' | t }}"
icon: fas fa-home
order: 1
---

<!-- 언어 감지: 플러그인이 page.lang 설정 -->
{% assign current_lang = page.lang | default: site.default_lang %}

<!-- 최근 업데이트 (언어 필터) -->
<h2>{{ 'labels.recently_updated' | t }}</h2>
<ul class="post-recent">
  {% assign posts = site.posts | where: "lang", current_lang %}
  {% for p in posts limit: 8 %}
    <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a></li>
  {% endfor %}
</ul>
