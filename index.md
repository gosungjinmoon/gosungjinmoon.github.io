
---
layout: page
title: Home
permalink: /
---

{% for post in paginator.posts %}
<article class="post-preview">
  <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
  <p class="post-meta">{{ post.date | date: "%Y-%m-%d" }}{% if post.tags %} • {{ post.tags | join: ', ' }}{% endif %}</p>
  <p>{{ post.excerpt | strip_html | truncate: 160 }}</p>
  <hr>
</article>
{% endfor %}

{% if paginator.total_pages > 1 %}
<nav class="pagination">
  {% if paginator.previous_page %}<a class="prev" href="{{ paginator.previous_page_path | relative_url }}">&laquo; Prev</a>{% endif %}
  <span>Page {{ paginator.page }} of {{ paginator.total_pages }}</span>
  {% if paginator.next_page %}<a class="next" href="{{ paginator.next_page_path | relative_url }}">Next &raquo;</a>{% endif %}
</nav>
{% endif %}
