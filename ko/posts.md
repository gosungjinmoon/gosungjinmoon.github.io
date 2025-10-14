---
title: "블로그 — Posts"
permalink: /ko/posts/
lang: ko
---
<h2>전체 글</h2>
<section class="grid">
  {% assign posts = site.ko | sort: 'date' | reverse %}
  {% for p in posts %}
    <a class="card" href="{{ p.url | relative_url }}">
      <h3>{{ p.title }}</h3>
      <div class="meta">{{ p.date | date: "%Y-%m-%d" }}</div>
      <p>{{ p.excerpt | strip_html | truncate: 160 }}</p>
    </a>
  {% endfor %}
</section>
