---
title: "Judgement Card Game AI"
excerpt_separator: "<!--more-->"
categories:
  - Independent Project
tags:
  - Algorithms
  - Game Theory
  - Machine Learning
---

An ongoing investigation into the use of machine learning algorithms to optimally play [Judgement](https://en.wikipedia.org/wiki/Kachufool), a playing card game which I've played far, *far* too much of [(repository here)](https://github.com/josh-holder/JudgmentBot).
{: .notice}

### Quick Links

[Background: The League of Judgement](#1-background-the-league-of-judgement)

[Overall Architecture of a Judgement AI](#2-overall-architecture-of-a-judgement-ai)

[Training Environment](#3-training-environment)

[Betting AI](#4-betting-ai)

[Card-playing AI](#5-card-playing-ai)

[Combined AI](#6-combined-ai)

### 1. Background: The League of Judgement

Over my college career, I've played a LOT of the trick-taking card game called Judgement/Kachufool (rules [here](https://card-games.wonderhowto.com/how-to/play-card-game-judgment-0122237/)). An embarassing amount, almost. So much so that I developed an entire software based infastructure around the game, including automated scoring:

![scoring](/assets/judgement/judgement_scoring.png)

advanced statistics (and there about 25 more stats not in this screenshot):

![stats](/assets/judgement/judgement_stats.png)

and an entire league system complete with seeding and playoffs, where eight of my friends and I played dozens of games of Judgement at locations as varied as coffee shops, the laundry room, and of course IHOP:

![ihop](/assets/judgement/ihop.JPG)

After all this effort and the heights of competition that were reached in the Judgement League, it was only natural that I would try to use computers to defeat my friends at the game.

### 2. Overall architecture of a Judgement AI

Judgement can really be thought of multiple separate games in a single game.

![flow](/assets/judgement/judgement_flow.png)

As shown in the flow chart above, after cards are dealt, the player bets how many hands they think they can win. Once all bets are determined, the players then actually play out the rounds, trying to win exactly as many hands as they predicted while preventing other players from doing so.

These two aspects of the game can be thought of as entirely separate. The input and output space corresponding to choosing a bet (IN: a hand of cards, other player's bets, etc. OUT: a single integer) are completely different than the input and output space of choosing a card from a hand of several cards, multiple times in a row until your hand is empty (IN: a hand of cards, the cards already in play, etc. OUT: a card in the players hand). Any attempt at developing an AI would have to separate these two parts of the game into separate algorithms.

This is quite convenient, as when separated in this way, the game is actually rather simple. In the following sections, I'll describe the architectures of each aspect of the AI, as well as the integration.

*A note on the suitability of machine learning for Judgement:* For the same reason that I was able to generate advanced statistics for the game, Judgement is actually uniquely suited for the application of machine learning. Because it's convenient for scoring to happen within an Excel spreadsheet, the data from thousands of hands of Judgement was already precollected. For certain parts of a Judgement playing AI, I can use this data to augment the learning process.

Additionally, the betting problem is a form of problem that is the bread and butter of machine learning, as I'll discuss in the next section.

### 3. Training Environment

To facilitate my future AI training endeavours, I needed a simulation environment within which to simulate an arbitrary number of games of Judgement. Within `JudgmentGame.py`, I encoded the rules of the game and the architecture to ask for bets and moves from multiple agents and simulate out an entire game. Within `JudgementAgent.py`, I created the default class which would provide the structure that a Judgement agent would need to have to interact with a `JudgementGame` object and declare it's bets and moves.

On top of this foundation, I wrote entirely random betting and card-playing algorithms, as well as a simplistic betting algorithm and a simplistic card-playing algorithm to which aim to be slightly better than random.

The simple betting algorithm takes into account how ambitious the bets made by the other Agents have already been - if other agents have made large bets and have high hopes of winning many rounds, the simple betting algorithm will tend to bet lower, and vice versa. Importantly, this algorithm pays no attention to the cards it is dealt.

The simple card-playing algorithm implements a very bare-bones Judgement playing strategy, similar to a beginner player. If the agent has not yet reached its goal, it will try to win the round by playing the *highest* card possible, unless it cannot win, in which case it plays the *lowest* card possible. On the other hand, if its goal has already been reached, it attempts to lose the round wherever possible.

Using these different elements, different types of agents can be created. For example, one agent could bet randomly and play simplistically, while another agent could bet simplistically and play randomly, and the head-to-head performance of these agents can be compared using `compare_agents.py`. This architecture will be invaluable in testing other, more advanced Judgement bots.

### 4. Betting AI

Betting is a subproblem in Judgement which comprises a large part of the complexity of the game. At the start of every round of Judgement, the player is dealt a hand of cards, and based on this hand of cards, needs to respond with a number of hands they think they can win. For example, if the player has all Aces, a high card, they might expect to win a higher number of rounds than if they have all 2s, a low card. 

In simple terms, as input, you have a set of cards, and as output, you have a single integer. This is a textbook classification problem, and thus a standard neural network is a perfect choice for this algorithm! 

#### Neural Network Architecture

In plain english, the architecture input/output relationship should look something like this:

![simple_bet_arch](/assets/judgement/simple_bet.png)

However, in reality, when trying to make this palatable for a neural network to take as input, things need to get a bit more complicated for several reasons:

1. The list of bets that have been made can be different in size depending on where you are in the betting order, ranging from length 0 to length 3. Neural networks generally don't like inputs of varying sizes (although [there are ways around this](https://ai.stackexchange.com/questions/2008/how-can-neural-networks-deal-with-varying-input-sizes))
2. When people bet zero, the round is fundamentally different than a round in which noone bets zero, thus the neural network has to have access to this information. Based on the way that I planned to work around issue 1, the neural network would lose access to this information, so it had to be specifically relayed to the algorithm another way. This of course bakes in a certain amount of human knowledge into the very structure of the algorithm and isn't the cleanest solution, so a natural improvement is switching to RNNs for this piece of data.
3. Input data should have a mean of or around zero. This means that the representation of cards in hand should best be represented as -0.5 if the card is not present, and 0.5 if the card is present (rather than the natural choices of 0 and 1.)

These considerations result in an architecture of the following form:

![complex_bet_arch](/assets/judgement/complex_bet.png)

This is somewhat more complex, but very manageable by a neural network (the layers sizes were chose by trial and error - having many more layers introduced issues with overfitting.)

#### Acquiring betting data

Even the best neural network architecture is limited by the amount of training data it can acquire. Unfortunately, the scoring sheet didn't record what cards each player had when making their bet, so data had to be collected in another way. Luckily, through the league I had a captive, Judgement-obsessed source of data generation.

All I had to do was write some code which could generate sensible-seeming Judgement situations and hands (not as easy as it sounds - see `bet_data_generator.py`), wrap it in a clean UI, and recruit some friends to use the UI and bet as they would in a real game. 

![bet_record_ui](/assets/judgement/betrecord_ui.png)

For a few weeks my friends would crank out Judgement bets in their free time (Robert Alexander and Alyson Resnick were especially prolific) and send me their data to be used in training the AI. By the time the semester ended, I had a few thousand bet situations saved, and could begin training in earnest.

#### Initial training results

Initial training results, even with this relatively small amount of data, were shockingly positive. In a head to head match between an:

1. Agent betting with Neural Network, playing cards with simple algorithm
2. Agent betting with simple algorithm, playing cards with simple algorithm
3. Agent betting randomly, playing cards with simple algorithm
4. Agent betting and playing randomly

The agent betting with the Neural Network performs far and away the best of any agent:

![mlbet_perform](/assets/judgement/mlbet_perform.jpg)

For context, in typical human games, each player averages ~280 points. Sure, this algorithm's opponents were easier than other humans, but relative to the amount of training data and effort put into the algorithm, performance is surprisingly good. This can clearly be used as a baseline while moving on to the card-playing part of the AI.

### 5. Card-playing AI

Creating a card-playing AI using machine learning will be a significantly harder challenge. First of all, there is no simple way to collect training data.

Because of this lack of training data, reinforcement learning is an attractive option - by using millions of games of self-play, we can generate our own training data! Additionally, in contrast to many other reinforcement learning environments, the reward landscape is not as sparse. Although points are only awarded after all cards in a hand have been played (after up to 13 decisions have been made), each time you play a card you can get feedback on whether or not you won the hand.

Therefore, if we split the neural network evaluation into two parts: "grand strategy", determining whether we WANT to win a hand given our eventual goal, and "micro strategy", whether playing a given card will win us a hand, we may be able to use a much richer reward environment to accelerate training.

On the other hand, just because you want to win a hand doesn't mean you want to play the card that is MOST LIKELY to win a hand - sometimes you might want to save your best cards for later, even if they would increase your chances to win now. From an architectural perspective, though, combining grand and micro strategy is a challenge. 

With all of these considerations in play, I'm still in the process of formulating the best way to structure the algorithm for optimal performance. Stay tuned for more updates - IN PROGRESS.

### 6. Combined AI

Once both the card-playing and betting AI have been designed, they can be combined into a single agent.

Stay tuned for more updates - IN PROGRESS.