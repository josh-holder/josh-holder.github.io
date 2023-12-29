---
title: "Writings"
permalink: /writings/
---

{% for post in site.categories.writings %}
  <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
  <p>{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
{% endfor %}