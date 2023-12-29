---
title: "Projects"
permalink: /projects/
---

{% for post in site.categories.projects %}
  <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
  <p>{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
{% endfor %}