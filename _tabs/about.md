---
layout: page
title: "{{ site.data.locales[page.lang].tabs.about | default: 'About' }}"
icon: fas fa-info-circle
order: 4
permalink: /:lang/about/
---

{% if page.lang == 'ko' %}
이곳은 GOFUNWITH 블로그의 소개 페이지입니다.
{% else %}
Welcome to the GOFUNWITH blog introduction page.
{% endif %}
