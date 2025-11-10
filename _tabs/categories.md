---
layout: categories
title: "{{ 'tabs.categories' | t }}"
icon: far fa-folder-open
order: 2
---

{% assign current_lang = page.lang | default: site.default_lang %}
<div class="ps-lg-2 mt-4">
  {% for cat in site.categories %}
    {% assign lang_posts = cat[1] | where: "lang", current_lang %}
    {% if lang_posts.size > 0 %}
      <section class="mb-3">
        <h3># {{ cat[0] }} ({{ lang_posts.size }})</h3>
        <ul class="ps-3">
          {% for post in lang_posts %}
            <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
          {% endfor %}
        </ul>
      </section>
    {% endif %}
  {% endfor %}
</div>
