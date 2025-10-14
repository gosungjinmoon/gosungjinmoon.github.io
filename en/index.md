---
title: "Home — GoFunWith"
permalink: /en/
lang: en
---
<section class="grid">
  {% assign posts = site.en | sort: 'date' | reverse %}
  {% for p in posts limit:12 %}
    <a class="card" href="{{ p.url | relative_url }}">
      <h3>{{ p.title }}</h3>
      <div class="meta">{{ p.date | date: "%Y-%m-%d" }}</div>
      <p>{{ p.excerpt | strip_html | truncate: 140 }}</p>
    </a>
  {% endfor %}
</section>
