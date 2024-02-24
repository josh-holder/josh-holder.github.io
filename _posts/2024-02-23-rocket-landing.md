---
title: "How TO Land an Orbital Rocket Booster - a gentle mathematical introduction"
excerpt_separator: "<!--more-->"
categories:
  - writings
tags:
  - GN&C
  - Optimization
  - Spaceflight
toc: true
---

With terminal-phase Guidance Navigation and Control in the news lately with the (qualified) success of [Intuitive Machines](https://spacenews.com/im-1-lunar-lander-tipped-over-on-its-side/) and [JAXA's](https://www.pbs.org/newshour/science/japans-1st-moon-lander-has-hit-its-target-but-it-appears-to-be-upside-down) lunar landers, I wanted to provide an approachable look at the mathematics of rocket landing (calculus-level), and the ways it's both easier and harder than you might expect.
{: .notice}

To me, there's nothing more awe-inspiring than watching [rockets land autonomously](https://www.youtube.com/watch?v=lw3KEg6b6bE) (fun fact: I teared up watching this while finding the video for this post), and in fact watching this as a college freshman with the rocketry team was what inspired me to become a Guidance Navigation and Control (GN&C) Engineer at SpaceX[^1] in the first place.

But trajectory optimization and GN&C in general is notoriously math heavy and intimidating to learn - any primer on the subject I've encountered online either brushes over the math entirely ("the rocket uses grid fins for control") or mentions semidefinite matrices within the first two paragraphs. For a beginner genuinely interested in the subject, neither is ideal.

In this post, I aim to provide a *gentle* introduction to the math behind these problems - what is the intuition for the methods which underpin the solution methods, how does they work in practice, and what makes this problem so hard anyway?

### 1. Background: What's the problem, and why is it challenging?
The problem of controlling a spacecraft in space is surprisingly easy[^2] up until the landing attempt - 

[^1]: Note that while I've worked on GN&C control software on the Orion spacecraft and for satellites at SpaceX, I've never worked directly on the landing problem at SpaceX or any other company. As such, take this information with a grain of salt.
[^2]: Anyone who's ever attempted to deal with rotational dynamics can confirm it is not in fact easy, but it's a relatively thing OK...