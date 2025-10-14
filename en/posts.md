---
title: "Blog — Posts"
permalink: /en/posts/
lang: en
---
<h2>All Posts</h2>
<section class="grid">
  {% assign posts = site.en | sort: 'date' | reverse %}
  {% for p in posts %}
    <a class="card" href="{{ p.url | relative_url }}">
      <h3>{{ p.title }}</h3>
      <div class="meta">{{ p.date | date: "%Y-%m-%d" }}</div>
      <p>{{ p.excerpt | strip_html | truncate: 160 }}</p>
    </a>
  {% endfor %}
</section>
