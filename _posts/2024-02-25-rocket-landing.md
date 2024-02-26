---
title: "How TO Land an Orbital Rocket Booster: a gentle mathematical introduction"
excerpt_separator: "<!--more-->"
categories:
  - writings
tags:
  - GN&C
  - Optimization
  - Spaceflight
toc: true
---

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-mml-chtml.js">
</script>

With terminal-phase Guidance Navigation and Control in the news lately with the (qualified) success of [Intuitive Machines](https://spacenews.com/im-1-lunar-lander-tipped-over-on-its-side/) and [JAXA's](https://www.pbs.org/newshour/science/japans-1st-moon-lander-has-hit-its-target-but-it-appears-to-be-upside-down) lunar landers, I wanted to provide an approachable look at the mathematics of rocket landing, and the ways it's both easier and harder than you might expect.
{: .notice}

To me, there's nothing more awe-inspiring than watching [rockets land autonomously](https://www.youtube.com/watch?v=lw3KEg6b6bE) (fun fact: I teared up watching this while finding the video for this post), and in fact watching this as a college freshman with the rocketry team was what inspired me to become a Guidance Navigation and Control (GN&C) Engineer at SpaceX[^1] in the first place.

But trajectory optimization and GN&C in general is notoriously math heavy and intimidating to learn - any primer on the subject I've encountered online either brushes over the math entirely ("the rocket uses grid fins for control") or mentions semidefinite matrices within the first two paragraphs. For a beginner genuinely interested in the subject, neither is ideal.

In this post, I aim to provide a *gentle* (~calculus-level) introduction to the math behind these problems - what is the intuition for the math which underpins the solution methods, how do they work in practice, and what makes this problem so hard anyway?

### 1. Historical Approaches
The problem of controlling a spacecraft in space is relatively easy[^2] up until the landing attempt - in space, things mostly do what you tell them to do. Other than gravity, there are no pesky "atmospheres" or "solid items" to run into and knock you off course. This is an engineers dream - in space, [every cow is spherical](https://en.wikipedia.org/wiki/Spherical_cow).

This changes once you attempt to land on the surface - not only are there a variety of disturbances to contend with (poorly modeled atmospheres, wind, etc.), but things are much more high stakes - with every second, the spacecraft gets closer and closer to a rather prominent solid item named "the ground."

We've been doing soft planetary landings for a few decades, and a few clear strategies have emerged:

| **Landing Strategy**          | **Description**                                                                     | **Pros**                                            | **Cons**                                            | **Notable Missions**                                                                                                                                                                                                                                                                 |
|-------------------------------|-------------------------------------------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Landing bags                  | Deploy massive airbags and bounce off the surface                                   | -Relatively simple                                  | -High deceleration loads<br>-Imprecise landing zone | -[Luna 9](https://en.wikipedia.org/wiki/Luna_9) in 1966, the first ever planetary soft landing<br>-Several Mars rovers ([Sojourner](https://en.wikipedia.org/wiki/Sojourner_(rover)), [Opportunity](https://en.wikipedia.org/wiki/Opportunity_(rover)))                              |
| Piloted propulsive landing    | Allow a human pilot to guide the spacecraft down manually                           | -Minimal algorithms required                             | -High risk<br>-Does not apply to robotic missions   | -[Apollo 11](https://en.wikipedia.org/wiki/Apollo_11) and others                                                                                                                                                                                                                     |
| Parachutes                    | Deploy parachutes to slow down craft before attempting propulsive or airbag landing | -Simple                                             | -Needs an atmosphere<br>-Not reusable               | -Majority of missions to planets with atmospheres                                                                                                                                                                                                                                    |
| Autonomous propulsive landing | Fire boosters backwards to minimize speed and land softly on the surface            | -Completely reusable<br>-High precision (in theory) | -Super hard!                                        | -SpaceX booster landings on Earth<br>-[Perseverance](https://en.wikipedia.org/wiki/Perseverance_(rover)) Mars Rover<br>-[SLIM](https://en.wikipedia.org/wiki/Smart_Lander_for_Investigating_Moon) and [IM-1](https://en.wikipedia.org/wiki/Intuitive_Machines_Nova-C) Lunar Missions |

Many missions use a mixture of these approaches, but fully autonomous propulsive landing remains the holy grail - only this method promises pinpoint landing, full reusability, and high safety for hardware and humans.

Propulsive landing has been done in some form for decades, but there is still a large amount of room for improvement. In the words of the late Jim Martin, on the 1976 Viking mission, "[they] had no hazard avoidance whatsoever, just a lot of luck." To meet the mission requirements of the future (including having humans aboard), we need algorithms that can achieve pinpoint landing on the surface, avoid obstacles, and adapt to changing circumstances on the fly.

While most recently Perserverance landed within 1km of it's desired target, more accuracy is still desired and the performance of the recent SLIM and IM-1 missions make it clear that we have a long way to go for truly robust and efficient methods. This makes it, in my opinion, one of the clear open problems in aerospace engineering research today.

### 2. Problem Setup
Broadly, we care about getting a rocket from a starting location to the location of the landing site, with zero velocity[^3]. Along the way, we likely have some secondary objectives, like minimizing fuel or the time spent along the way. 

![landing_diagram](/assets/rocket_landing/landing_diagram.png){: width="700px" .align-center}

Typically, the position, velocity, and orientation of the rocket is represented by $$x$$, called the "state" of the rocket. Similarly, we have some way of influencing the state of the rocket (i.e. a rocket engine), which we denote the "input" $$u$$. Hopefully we also have an idea about how the position of the rocket will evolve over time according to the laws of physics and our input - in other words, we know some function $$f$$ such that:

 $$x_{k+1} = f(x_k, u_k)$$

This function could be as simple as a force pushing on a box in one dimension:

![box_f_example](/assets/rocket_landing/simple_f.png){: width="500px" .align-center}

or as complicated as spacecraft rotational dynamics:

![rot_dynamics](/assets/rocket_landing/rot_dynamics.png){: width="500px" .align-center}

but the only thing that matters is that we can write this function down[^5]! Bringing this all together, mathematically, we can formulate a simple version of this problem as follows[^4]:

$$\underset{u}{\min} \ \sum_{k=1}^T ||u_k||_2 \quad \textit{(minimize fuel use)}$$
{: .text-center}

$$\text{s.t. } x_{k+1} = f(x_{k}, u_k) \ \forall k=1 \ldots T-1 \quad \textit{(move according to the laws of physics)}$$
{: .text-center}

$$||u_k||_2 \leq u_{\text{max}} \ \forall k=1\ldots T \quad \textit{(force can never be too high)}$$
{: .text-center}

$$x_{T}=x_f \quad \textit{(make it to the landing site at the final time)}$$
{: .text-center}

$$\dot{x}_T=0 \quad \textit{(have zero velocity at the final time)}$$
{: .text-center}

$$(x_y)_k \geq 0 \ \forall k=1\ldots T \quad \textit{(stay above the ground)}$$
{: .text-center}

Although everything we've written down has a relatively simple motivation, looking at this as a human, this is a mess - how can you possibly come up with a sequence of $$u$$'s that get you to your goal, let alone an *optimal* sequence, especially if $$f$$ is a complicated function? Luckily, we can do this systematically with little more math than is taught in high school calculus.

### 3. Sequential Convex Programming

The first thing to note is that there is a large difference between following a path and coming up with a path yourself - think about the difference between solving a maze for the first time, and tracing a correct path someone has shown you with your pencil. If we can invest some effort into coming up with a path through the maze, all we have to do later is follow the path we've laid out. This saves us critical computation time onboard our spacecraft.

One of the primary enabling technologies of propulsive landing has been Sequential Convex Programming (SCP), which is a method of generating these feasible trajectories ahead of time.

<div>
<b>Aside: Linearization</b>

One key concept we need to develop in our discussion of successive convexification is linearization[^6]. Recall from calculus class that if we take the derivative of a function $f(x)$ w.r.t $$x$$, plug in our point of interest $$x_0$$, and use that as the slope $$A$$ of a new function, we can come up with an approximation to an arbitrarily complicated $$f(x)$$ which is pretty good, as long as we're near our point $$x_0$$.

<img src="/assets/rocket_landing/linearization.png" alt="linearization example">

In the above example, we managed to replace our extremely complicated $$f(x)$$, which has multiple local minima and maxima, with a MUCH simpler straight line, that performs basically the same way as long as we stay close to our linearization point $$x_0$$. As it turns out, it's much easier to optimize these functions as well.
</div>
{: .notice--info}

#### 3.2 Simple Example

#### 3.3 Rocket Landing Example

### 5. Challenges and the Future of Propulsive Landing

[^1]: Note that while I've worked on GN&C control software on the Orion spacecraft at NASA and for satellites at SpaceX, I've never worked directly on the landing problem at SpaceX or any other company. As such, take this information with a grain of salt.
[^2]: OK, [I said "relatively"](https://en.wikipedia.org/wiki/Quaternion)...
[^3]: Note that this means vertical AND horizontal velocity, and zero means ZERO. [Intuitive Machines had ~2 mph crossrange velocity](https://www.youtube.com/watch?v=ZWEwR8fscFY), and it resulted in the lander tipping over.
[^5]: And that we can take the derivative of it. Importantly, this means that things get way harder if $f(x,u)$ is just a simulation, rather than a mathematical equation.
[^4]: Of course, a real and useful rocket landing problem might have more constraints, including minimum thrust requirements, glidescope position constraints, gimbaling limits, etc. - see the seminal [G-FOLD](https://www.researchgate.net/publication/258676350_G-FOLD_A_Real-Time_Implementable_Fuel_Optimal_Large_Divert_Guidance_Algorithm_for_Planetary_Pinpoint_Landing) paper. Things get more complicated in these cases, but the procedure doesn't fundamentally change (as long as your constraints aren't too nasty).
[^6]: [This](https://www.youtube.com/watch?v=u7dhn-hBHzQ) is a great resource for understanding this process better.
