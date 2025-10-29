---
layout: default
title: Tags
lang: en
permalink: /en/tags/
---
# Tags
{% for t in site.tags %}
  {% assign tag = t[0] %}
  {% assign posts = t[1] | where: 'lang', 'en' %}
  {% if posts.size > 0 %}
  <h3 id="{{ tag | slugify }}">{{ tag }}</h3>
  <ul>
    {% for p in posts %}<li><a href="{{ p.url | relative_url }}">{{ p.title }}</a> <small>{{ p.date | date: "%Y-%m-%d" }}</small></li>{% endfor %}
  </ul>
  {% endif %}
{% endfor %}
