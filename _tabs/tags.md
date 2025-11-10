---
layout: tags
title: "{{ 'tabs.tags' | t }}"
icon: fas fa-tag
order: 3
---

{% assign current_lang = page.lang | default: site.default_lang %}
<div class="ps-lg-2 mt-4">
  {% for tag in site.tags %}
    {% assign tag_posts = tag[1] | where: "lang", current_lang %}
    {% if tag_posts.size > 0 %}
      <section class="mb-3" id="{{ tag[0] | slugify }}">
        <h3># {{ tag[0] }} ({{ tag_posts.size }})</h3>
        <ul class="ps-3">
          {% for post in tag_posts %}
            <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
          {% endfor %}
        </ul>
      </section>
    {% endif %}
  {% endfor %}
</div>
