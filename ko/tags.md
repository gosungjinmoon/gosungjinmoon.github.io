---
layout: default
title: 태그
lang: ko
permalink: /ko/tags/
---

<h1>Tags</h1>
<ul>
  {% for tag in site.tags %}
    {% assign tag_name = tag[0] %}
    <li><a href="/ko/tags/#{{ tag_name | slugify }}">{{ tag_name }}</a></li>
  {% endfor %}
</ul>
