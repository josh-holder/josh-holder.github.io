---
title: "Trajectory Optimization with Discrete Control Constraints"
excerpt_separator: "<!--more-->"
categories:
  - Class Project
tags:
  - GN&C
  - Optimization
---

An investigation on the effect of discrete, on-off thruster constraints in trajectory generation and optimization for spacecraft rendezvous. Really just used this as an excuse to learn and implement [Sequential Convex Programming](https://web.stanford.edu/class/ee364b/lectures/seq_slides.pdf) (SCP) and investigate a long-term curiosity I had stemming from my work at NASA on thrust allocation.
{: .notice}

### Quick Links

[Background: Spacecraft Rendezvous and MPC](#1-background-spacecraft-rendezvous-and-mpc)

### 1. Background: Spacecraft Rendezvous and MPC

Autonomous spacecraft rendezvous is an extremely challenging problem - a typical setup involves maneuvering a multi-ton, multi-million dollar vehicle within inches and degree-seconds of another multi-ton, multi-million dollar vehicle. Did I mention that both vehicles are already moving at ~7km/s? And that every extra pound of fuel you use probably cost thousands of dollars to lug to space?

{:refdef: style="text-align: center;"}
![base_docking](/assets/discrete_trajopt/1280px-Progress_M-05M_docking.jpg)
{: refdef}

I'm consistently shocked that this was first [accomplished by the Soviets in 1967](https://en.wikipedia.org/wiki/Docking_and_berthing_of_spacecraft), with laughably little compute and decades before the first self driving car. One factor that makes this problem far more tractable is that it can be performed in a highly controlled environment, using vehicles for which we have relatively accurate but nonetheless imperfect dynamics models. (Compare this to the problem of autonomous driving, which must be solved in highly dynamic environments, and while interacting with human drivers for which we have no accurate dynamics model.)

What strategies exist to solve problems of this type, where we have a clear objective (reaching a destination using minimum fuel) and a relatively accurate dynamics models with some measure of uncertainty? In general, we can use "trajectory optimization" to compute paths for the spacecraft to take as they move towards eachother. What about when they inevitably diverge from that plan, given that we've acknowledged our dynamics model is imperfect - clearly, we need some way of adapting on the fly.

Here, Model Predictive Control (MPC) enters the picture. I'm not going to reinvent the wheel by diving deep into MPC in this blog post (see [here](https://www.youtube.com/watch?v=YwodGM2eoy4) for a great surface-level explanation and [here](https://sites.engineering.ucsb.edu/~jbraw/mpc/) for a more rigorous treatment.)

At the highest level, MPC involves leveraging optimization to compute optimal solutions to our problem, taking a step along the way, and making a new plan once we see how that first step turns out. One can see how this might help to plan optimal trajectories in the real world - MPC integrates knowledge from the real-world into the planning process. 

In the rest of this blog, I'll explore how we can apply this framework to spacecraft rendezvous while attempting to account for the on-off nature of spacecraft thrusters, which is typically glossed over in this process.

### 2. Problem Setup

We're now ready to describe the mathematics of our problem in such a way that we can apply existing optimization techniques. First, we need to define the way that the system evolves over time, both with and without thruster firings.

#### Autonomous Dynamics

We're interested in the 6-DOF problem, which means we need to define both how the spacecraft translates AND rotates in space, in 3 dimensions.

For the translational dynamics, we assume a circular orbit, and we can thus use the blissfully simple [Clohessy Wiltshire equations](https://en.wikipedia.org/wiki/Clohessy%E2%80%93Wiltshire_equations) for relative motion in orbit. While the inclusion of orbital mechanics make them somewhat more complicated than a simple double integrator model, they still remain relatively workable.

Attitude dynamics are another story, as anyone who has attempted to write a flight or robotics simulator no doubt understands. Rather than deal with the singularities associated with 3-dimensional representations of attitude (Euler angles, rodrigues parameters, etc.), I chose to use quaternions. (I like [this reference](https://vanhunteradams.com/Estimation/MUKF.html) for a quick review on attitude representations.)

Using discrete time dynamics, our autonomous system (the system without input) then evolves as follows:

$$\begin{bmatrix}x_{t+1}\\ y_{t+1} \\ z_{t+1} \\ \dot{x}_{t+1} \\ \dot{y}_{t+1} \\ \dot{z}_{t+1} \\
                q_{s,t+1} \\ q_{x,t+1} \\ q_{y,t+1} \\ q_{z,t+1} \\ \omega_{x,t+1} \\ \omega_{y,t+1} \\ \omega_{z,t+1}\end{bmatrix}=\begin{matrix}\end{bmatrix}$$

test

$help$

$ help $