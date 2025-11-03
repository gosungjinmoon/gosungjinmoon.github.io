---
layout: page
title: Home
lang: en
permalink: /en/
---

{% assign posts_in_lang = site.posts | where: "lang", "en" %}

<div id="post-list">
  {% for post in posts_in_lang %}
    <div class="post-preview">
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      <div class="post-meta text-muted">
        <i class="far fa-calendar-alt"></i>
        <time>{{ post.date | date: "%b %d, %Y" }}</time>
      </div>
      <p>{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
    </div>
  {% endfor %}
</div>
