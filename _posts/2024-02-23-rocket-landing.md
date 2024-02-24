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

With terminal-phase Guidance Navigation and Control in the news lately with the (qualified) success of [Intuitive Machines](https://spacenews.com/im-1-lunar-lander-tipped-over-on-its-side/) and [JAXA's](https://www.pbs.org/newshour/science/japans-1st-moon-lander-has-hit-its-target-but-it-appears-to-be-upside-down) lunar landers, I wanted to provide an approachable look at the mathematics of rocket landing, and the ways it's both easier and harder than you might expect.
{: .notice}

To me, there's nothing more awe-inspiring than watching [rockets land autonomously](https://www.youtube.com/watch?v=lw3KEg6b6bE) (fun fact: I teared up watching this while finding the video for this post), and in fact watching this as a college freshman with the rocketry team was what inspired me to become a Guidance Navigation and Control (GN&C) Engineer at SpaceX[^1] in the first place.

But trajectory optimization and GN&C in general is notoriously math heavy and intimidating to learn - any primer on the subject I've encountered online either brushes over the math entirely ("the rocket uses grid fins for control") or mentions semidefinite matrices within the first two paragraphs. For a beginner genuinely interested in the subject, neither is ideal.

In this post, I aim to provide a *gentle* (~calculus-level) introduction to the math behind these problems - what is the intuition for the methods which underpin the solution methods, how do they work in practice, and what makes this problem so hard anyway?

### 1. Background: What's the problem, and why is it challenging?
The problem of controlling a spacecraft in space is relatively easy[^2] up until the landing attempt - in space, things mostly do what you tell them to do. Other than gravity, there are no pesky "atmospheres" or "solid items" to run into and knock you off course. This is an engineers dream - in space, [every cow is spherical](https://en.wikipedia.org/wiki/Spherical_cow).

This changes once you attempt to land on the surface - not only are there a variety of disturbances to contend with (poorly modeled atmospheres, wind, etc.), but things are much more high stakes - with every second, the spacecraft gets closer and closer to a rather prominent solid item named "the ground."

We've been doing soft planetary landings for a few decades, and a few clear strategies have emerged:

| **Landing Strategy**          | **Description**                                                                     | **Pros**                                            | **Cons**                                            | **Notable Missions**                                                                                                                                                                                                                                                                 |
|-------------------------------|-------------------------------------------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Landing bags                  | Deploy massive airbags and bounce off the surface                                   | -Relatively simple                                  | -High deceleration loads<br>-Imprecise landing zone | -[Luna 9](https://en.wikipedia.org/wiki/Luna_9) in 1966, the first ever planetary soft landing<br>-Several Mars rovers ([Sojourner](https://en.wikipedia.org/wiki/Sojourner_(rover)), [Opportunity](https://en.wikipedia.org/wiki/Opportunity_(rover)))                              |
| Piloted propulsive landing    | Allow a human pilot to guide the spacecraft down manually                           | -Algorithmically simple                             | -High risk<br>-Does not apply to robotic missions   | -[Apollo 11](https://en.wikipedia.org/wiki/Apollo_11) and others                                                                                                                                                                                                                     |
| Parachutes                    | Deploy parachutes to slow down craft before attempting propulsive or airbag landing | -Simple                                             | -Needs an atmosphere<br>-Not reusable               | -Majority of missions to planets with atmospheres                                                                                                                                                                                                                                    |
| Autonomous propulsive landing | Fire boosters backwards to minimize speed and land softly on the surface            | -Completely reusable<br>-High precision (in theory) | -Super hard!                                        | -SpaceX booster landings on Earth<br>-[Perseverance](https://en.wikipedia.org/wiki/Perseverance_(rover)) Mars Rover<br>-[SLIM](https://en.wikipedia.org/wiki/Smart_Lander_for_Investigating_Moon) and [IM-1](https://en.wikipedia.org/wiki/Intuitive_Machines_Nova-C) Lunar Missions |

Many missions use a mixture of these approaches, but fully autonomous propulsive landing remains the holy grail - only this method promises pinpoint landing, full reusability, and high safety for hardware and humans.

Propulsive landing has been done in some form for decades, but there is still a large amount of room for improvement. In the words of the late Jim Martin, on the 1976 Viking mission, "[they] had no hazard avoidance whatsoever, just a lot of luck." To meet the mission requirements of the future (including having humans aboard), we need algorithms that can achieve pinpoint landing on the surface, avoid obstacles, and adapt to changing circumstances on the fly. While most recently Perserverance landed within 1km of it's desired target, the performance of the recent SLIM and IM-1 missions make it clear that we have a long way to go for truly robust and efficient methods. This makes it, in my opinion, one of the clear open problems in aerospace engineering research today.

### 2. Sequential Convex Programming

#### 2.1 Linearization

### 3. Simple Example

### 4. Challenges and the Future of Propulsive Landing

[^1]: Note that while I've worked on GN&C control software on the Orion spacecraft and for satellites at SpaceX, I've never worked directly on the landing problem at SpaceX or any other company. As such, take this information with a grain of salt.
[^2]: OK, [I said "relatively"](https://en.wikipedia.org/wiki/Quaternion)...