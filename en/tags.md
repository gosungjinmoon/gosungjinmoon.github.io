---
layout: default
title: Tags
lang: en
permalink: /en/tags/
---

<h1>Tags</h1>
<ul>
  {% for tag in site.tags %}
    {% assign tag_name = tag[0] %}
    <li><a href="/en/tags/#{{ tag_name | slugify }}">{{ tag_name }}</a></li>
  {% endfor %}
</ul>
