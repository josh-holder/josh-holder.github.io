---
title: "Writings"
permalink: /writings/
---

{% for post in site.categories.projects %}
  <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
  <p>{{ post.excerpt }}</p>
{% endfor %}