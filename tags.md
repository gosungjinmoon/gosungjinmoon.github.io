
---
layout: page
title: "Tags"
icon: "fas fa-tags"
order: 3
permalink: /tags/
---

<div id="tag-cloud" class="tag-cloud">
  {% assign tags = site.tags | sort %}
  {% for tag in tags %}
    {% assign t = tag | first %}
    <a href="/tags/#{{ t | slugify }}" class="tag-item">{{ t }} ({{ tag[1].size }})</a>
  {% endfor %}
</div>
