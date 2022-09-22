---
title: "Judgement Card Game AI"
excerpt_separator: "<!--more-->"
categories:
  - Project
tags:
  - Algorithms
  - Game Theory
  - Machine Learning
---

An ongoing investigation into the use of machine learning algorithms to optimally play [Judgement/Kachufool](https://en.wikipedia.org/wiki/Kachufool), a trick-taking card game which I've played far, *far* too much of.
{: .notice}

### Quick Links

[Beginning of an Obsession](#1-beginning-of-an-obsession)

[No Unique Thoughts](#2-no-unique-thoughts)

[SPL-T Strategy](#3-spl-t-strategy)

[Probabilistic Weighting Algorithm](#4-probabilistic-weighting-algorithm)

[Final Algorithm - "ParanoidPlay"](#5-final-algorithm-paranoidplay)

[Going Beyond the World Record - Human-AI Collaboration](#6-going-beyond-the-world-record---human-ai-collaboration)

[A Note on Machine/Reinforcement Learning as Applied to SPL-T](#a-note-on-machinereinforcement-learning-as-applied-to-spl-t)

### 1. Background

Over my college career, I've played a LOT of the card game called Judgement (rules [here](https://card-games.wonderhowto.com/how-to/play-card-game-judgment-0122237/)). An embarassing amount, almost. So much so that I developed an entire software based infastructure around the game, including automated scoring:

![scoring](/assets/judgement/judgement_scoring.png)

advanced statistics (and there about 25 more stats not in this screenshot):

![stats](/assets/judgement/judgement_stats.png)

and an entire league system complete with seeding and playoffs, where eight of my friends and I played dozens of games of Judgement at locations as varied as coffee shops, the laundry room, and of course IHOP:

![ihop](/assets/judgement/ihop.png)

After all this effort and the heights of competition that were reached in the Judgement league, it was only natural that I would try to use computers to defeat my friends at the game.

### 2. Note on the suitability of machine learning for Judgement

For the same reason that I was able to generate advanced statistics for the game, Judgement is actually uniquely suited for the application of machine learning. Because it's convenient for scoring to happen within an Excel spreadsheet, the data from thousands of hands of Judgement was already precollected. For certain parts of a Judgement playing AI, I can use this data to augment the learning process.

Within the game, there are also several sub-problems, many of which are perfectly suited for machine learning. One such subproblem is betting, which comprises a large part of the complexity of the game. At the start of every round of Judgement, the player is dealt a hand of cards, and based on this hand of cards, needs to respond with a number of hands they think they can win. For example, if the player has all Aces, they might expect to win a higher number of rounds than if they strictly 2s. This is a textbook classification problem! As input, you have a set of cards, and as output, you have a single number. More on this later.

### 3. Overall architecture of a Judgement AI

As mentioned above, 

### 4. Betting AI

### 5. Playing AI

### 6. Combined AI