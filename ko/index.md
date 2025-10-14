---
title: "홈 — GoFunWith"
permalink: /ko/
lang: ko
---
<section class="grid">
  {% assign posts = site.ko | sort: 'date' | reverse %}
  {% for p in posts limit:12 %}
    <a class="card" href="{{ p.url | relative_url }}">
      <h3>{{ p.title }}</h3>
      <div class="meta">{{ p.date | date: "%Y-%m-%d" }}</div>
      <p>{{ p.excerpt | strip_html | truncate: 120 }}</p>
    </a>
  {% endfor %}
</section>
