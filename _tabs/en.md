---
title: Home
lang: en
icon: fas fa-home
order: 1
---

{% assign posts_in_lang = site.posts | where: "lang", "en" %}
<div id="post-list">
  {% for post in posts_in_lang %}
    <div class="post-preview">
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      <p>{{ post.excerpt | strip_html }}</p>
    </div>
  {% endfor %}
</div>
