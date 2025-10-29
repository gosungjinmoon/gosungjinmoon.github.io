---
layout: default
title: "Tags"
lang: en
permalink: /en/tags/
---
<ul>
{% assign posts_lang = site.posts | where: "lang", "en" %}
{% assign tags = posts_lang | map: "tags" | join: "," | split: "," | uniq | sort %}
{% for tag in tags %}
  {% assign t = tag | strip %}
  {% if t != "" %}<li><strong>{{ t }}</strong></li>{% endif %}
{% endfor %}
</ul>
