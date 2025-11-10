---
layout: archives
title: "{{ 'tabs.archives' | t }}"
icon: far fa-calendar-alt
order: 4
---

{% assign current_lang = page.lang | default: site.default_lang %}
{% assign posts_lang = site.posts | where: "lang", current_lang | sort: "date" | reverse %}

<div class="ps-lg-2 mt-4">
  {% assign current_year = "" %}
  {% for post in posts_lang %}
    {% assign y = post.date | date: "%Y" %}
    {% if y != current_year %}
      {% if current_year != "" %}</ul>{% endif %}
      <h3 class="mt-3">{{ y }}</h3>
      <ul class="ps-3">
      {% assign current_year = y %}
    {% endif %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
  {% endfor %}
  {% if posts_lang.size > 0 %}</ul>{% endif %}
</div>
