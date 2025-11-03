---
layout: about
title: About
icon: fas fa-info-circle
order: 4
---

{% assign posts_in_lang = site.posts | where: "lang", site.lang %}

<div id="post-list">
  {% for post in posts_in_lang %}
    <div class="post-preview">
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      <p>{{ post.excerpt | strip_html }}</p>
    </div>
  {% endfor %}
</div>
