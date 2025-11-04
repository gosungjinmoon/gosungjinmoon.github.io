---
layout: page
title: Home
icon: fas fa-home
order: 1
---

{% if page.lang == 'en' %}
  {% assign posts_to_show = site.posts | where_exp: "item", "item.lang == 'en'" %}
{% else %}
  {% assign posts_to_show = site.posts | where_exp: "item", "item.lang == 'ko'" %}
{% endif %}

<div id="post-list">
  {% for post in posts_to_show %}
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
