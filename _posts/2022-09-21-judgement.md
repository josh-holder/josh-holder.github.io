---
title: "Human-level Trick-Taking Card Game AI "
excerpt_separator: "<!--more-->"
categories:
  - Independent Project
tags:
  - Algorithms
  - Game Theory
  - Machine Learning
---
<!-- 
<style>
body, p {
    font-size: 10px;
}
</style> -->

Leveraging a 2016 Macbook and reinforcement, imitation, and supervized learning to optimally play [Judgement](https://en.wikipedia.org/wiki/Kachufool), a playing card game which I've played far, *far* too much of [(repository here - try your hand at beating the bot!)](https://github.com/josh-holder/JudgmentBot), with applications to general trick-taking games.
{: .notice}

### Quick Links

[Background: The League of Judgement](#1-background-the-league-of-judgement)

[Structure of a Trick-Taking Game](#2-structure-of-a-trick-taking-game)

[Data, Data, Data](#3-data-data-data)

[KEY INSIGHT: Unique NN Architecture](#4-key-insight-unique-nn-architecture)

[Training: RL, SL, and the Kitchen Sink](#5-training-rl-sl-and-the-kitchen-sink)

[Testing the AI](#6-testing-the-ai)

[Towards Superhuman Performance](#7-towards-superhuman-performance)

### 1. Background: The League of Judgement

Over my college career, I played a LOT of the trick-taking card game called Judgement/Kachufool (rules [here](https://card-games.wonderhowto.com/how-to/play-card-game-judgment-0122237/)). An embarassing amount, almost. So much so that I developed an entire software based infastructure around the game, including automated scoring:

![scoring](/assets/judgement/judgement_scoring.png){: width="500px"}

advanced statistics (and there about 25 more stats not in this screenshot):

![stats](/assets/judgement/judgement_stats.png){: width="500px"}

and an entire league system complete with seeding and playoffs, where eight of my friends and I played dozens of games of Judgement at locations as varied as coffee shops, the laundry room, and of course IHOP:

![ihop](/assets/judgement/ihop_wide.JPG){: width="500px"}

After all this effort and the heights of competition that were reached in the Judgement League, it was only natural that I would try to use computers to defeat my friends at the game.

### 2. Structure of a trick-taking game

Judgment, and trick-taking games in general, can mostly be separated into two distinct phases - the pre-round phase, and the trick-taking phase. 

![flow](/assets/judgement/judgement_flow.png)

As shown in the flow chart above, in the pre-round phase, cards are dealt and the player bets how many hands they think they can win. Once all bets are determined, the players then actually play out the rounds, trying to win exactly as many hands as they predicted while preventing other players from doing so.

Critically, these two phases are completely separable. This allows us to train models for each phase separately, with each individual problem seeming far more tractable.

The pre-round phase takes the form of a bread-and-butter machine learning problem - as input, the model gets a hand of cards, other player's bets, etc., and as output it simply returns an integer corresponding the number of cards to bet. The trick-taking phase is a bit more difficult for a machine learning system, requiring inputs of a hand of cards, the cards already in play, the cards that have already been played, etc., and having effectively 52 outputs (a card to play).

With a clear path forward, it remained to figure out the many, many details of such a project. How would I obtain data? How would I architect the networks? How would I set up the training process?

### 3. Data, Data, Data

As with almost all projects in AI, the first bottleneck was training data. While my spreadsheet captured enough information to develop detailed performance statistics, it didn't involve the critical data needed about what cards players had in their hands when they were making their decisions - I needed to obtain this data some other way.

As a AlphaGo fan, I was of course tempted to use pure RL and self-play to brute-force a sensible policy. Given my extremely limited compute, though, I was not quite naïve enough to believe that would work. I would need to get more creative.

#### Simulating games

The first order of business would be to create a simulation environment within which to simulate an arbitrary number of games of Judgement. Within `JudgmentGame.py`, I encoded the rules of the game and the architecture to ask for bets and moves from multiple agents and simulate out an entire game. Within `JudgementAgent.py`, I created the default class which would provide the structure that a Judgement agent would need to have to interact with a `JudgementGame` object and declare it's bets and moves.

On top of this foundation, I would be able to create and evaluate custom Judgement agents. I also built the infrastructure to save the inputs and eventual results of each of the decisions that an agent made, so that this could be saved and later used in reinforcement learning.

#### Generating trick-taking data

While the structure of the machine learning problem for the trick-taking phase is far more challenging, in a way it was easier to collect data for this phase.

Judgment is a game that is relatively amenable to a heuristic policy for actually playing cards. The heuristic algorithm implements a very bare-bones Judgement playing strategy, similar to a beginner player. If the agent has not yet reached its goal, it will try to win the round by playing the *highest* card possible, unless it cannot win, in which case it plays the *lowest* card possible. On the other hand, if its goal has already been reached, it attempts to lose the round with the largest card possible.

By running this heuristic policy for thousands of games in my simulated environment, I could generate an arbitrary amount of input-output data with which to use in imitation learning later.

On top of this foundation, I wrote entirely random betting and card-playing algorithms, as well as a simplistic betting algorithm and a simplistic card-playing algorithm to which aim to be slightly better than random.

#### Generating betting data

Although the betting machine learning problem is simpler, policies are significantly harder to create (in fact, this is where much of the strategy of the game comes in). It's almost impossible to come up with a reasonable heuristic policy for this problem. I needed to find a way to get real human data on bets. Luckily, I had a captive audience of Judgement-obssessed friends to serve as data-collection drones.

All I had to do was write some code which could generate sensible-seeming Judgement situations and hands (not as easy as it sounds - see `bet_data_generator.py`), wrap it in a clean UI, and recruit some friends to use the UI and bet as they would in a real game. 

![bet_record_ui](/assets/judgement/betrecord_ui.png)

For a few weeks my friends would crank out Judgement bets in their free time (Robert Alexander and Alyson Resnick were especially prolific) and send me their data to be used in training the AI. By the time the semester ended, I had a few thousand bet situations saved, and could begin training in earnest.

### 4. KEY INSIGHT: Unique NN Architecture

With a large amount of data collected, and a plan to acquire much more, I began architecting the actual structure of the neural network models.

#### Pre-round phase model

Betting comprises a large part of the complexity of the game. At the start of every round of Judgement, the player is dealt a hand of cards, and based on this hand of cards, needs to respond with a number of hands they think they can win. For example, if the player has all Aces, a high card, they might expect to win a higher number of rounds than if they have all 2s, a low card. 

In simple terms, as input, you have a set of cards, and as output, you have a single integer. This is a textbook classification problem, and thus a standard neural network is a perfect choice for this algorithm - the architecture writes itself! In plain english, the architecture input/output relationship should look something like this:

![simple_bet_arch](/assets/judgement/simple_bet.png)

However, in reality, when trying to make this palatable for a neural network to take as input, things need to get a bit more complicated for several reasons:

1. The list of bets that have been made can be different in size depending on where you are in the betting order, ranging from length 0 to length 3. Neural networks generally don't like inputs of varying sizes (although [there are ways around this](https://ai.stackexchange.com/questions/2008/how-can-neural-networks-deal-with-varying-input-sizes))
2. When at least one player bets zero, the round is fundamentally different than a round in which noone bets zero, thus the neural network has to have access to this information. Any solution to issue 1 needed to also ensure that the algorithm still had access to this information. 
3. Data normalization - in round 1, bet sizes will be far different than in round 13. This requires careful consideration about scaling of the input data.

These considerations result in an architecture of the following form:

![complex_bet_arch](/assets/judgement/complex_bet.png)

Rather than using something like a RNN to handle variable amounts of betting data, we simply add all previous bets together and take it as a percentage of the maximum, being sure to also feed the network the number of zero bets directly. This bakes in a certain amount of human knowledge into the network (i.e. zero bets are uniquely important) and makes it harder for the agent to learn behaviors like "hate-betting," but greatly speeds training. Layer sizes were chosen with trial and error, aiming to strike a balance between overfitting, computational speed, and expressiveness.

#### Trick-taking phase model

In my opinion, the design of the trick-taking model is where the critical insight of project lies, and the secret of its success despite extremely limited computational resources. A naïve model might do simply play all it's cards one after another, receive it's rewards at the end of the round, and perform RL updates on this information.

This would be a mistake though: trick-taking card games provide a rich source of feedback which comes each and every time you play a card, not just at the end of the round - namely, did you win or lose the hand! Often, in Judgement, you have a clear idea of whether you want to win or lose a specific hand, but the strategy emerges when you try to select what card to play to let this happen.

Therefore, in addition to a "what card to play" model, we can create an intermediate "evaluation" which determines, given playing a card, the likelihood of winning the round with that card. Given the high frequency of feedback (~676 data points per game simulated, compared to 100 scoring and betting events per game), this model can quickly become very effective, and using it as an input to the larger "what card to play"/action model allows for a significant performance boost. 

The other significant nuance is how to deal with information on other agents. This information (points scored, their target bet, how many hands they've won thus far, what cards they've already played) is clearly critical to the decision of what card to play, but determining the best represenation for this information can be somewhat difficult because the number of agents going before and after the current agent is variable. For example, if the agent is going first, the list of agents who have already played is 0, but the list of agents yet to play is 3 - this changes as the position of the current agent changes. To handle this variablity, we use an LSTM structure for the agents yet to come.

Thus, the architecture of the action model is structured as follows:

![eval_model](/assets/judgement/eval_model.png){: width="300px"} ![act_model](/assets/judgement/act_model.png){: width="300px"}


#### Initial training results

Initial training results, even with this relatively small amount of data, were shockingly positive. In a head to head match between an:

1. Agent betting with Neural Network, playing cards with simple algorithm
2. Agent betting with simple algorithm, playing cards with simple algorithm
3. Agent betting randomly, playing cards with simple algorithm
4. Agent betting and playing randomly

The agent betting with the Neural Network performs far and away the best of any agent:

![mlbet_perform](/assets/judgement/mlbet_perform.jpg)

For context, in typical human games, each player averages ~280 points. Sure, this algorithm's opponents were easier than other humans, but relative to the amount of training data and effort put into the algorithm, performance is surprisingly good. This can clearly be used as a baseline while moving on to the card-playing part of the AI.

### 5. Training: RL, SL, and the Kitchen Sink

Creating a card-playing AI using machine learning will be a significantly harder challenge. First of all, there is no simple way to collect training data.

Because of this lack of training data, reinforcement learning is an attractive option - by using millions of games of self-play, we can generate our own training data! Additionally, in contrast to many other reinforcement learning environments, the reward landscape is not as sparse. Although points are only awarded after all cards in a hand have been played (after up to 13 decisions have been made), each time you play a card you can get feedback on whether or not you won the hand.

Therefore, if we split the neural network evaluation into two parts: "grand strategy", determining whether we WANT to win a hand given our eventual goal, and "micro strategy", whether playing a given card will win us a hand, we may be able to use a much richer reward environment to accelerate training.

On the other hand, just because you want to win a hand doesn't mean you want to play the card that is MOST LIKELY to win a hand - sometimes you might want to save your best cards for later, even if they would increase your chances to win now. From an architectural perspective, though, combining grand and micro strategy is a challenge. 

With all of these considerations in play, I'm still in the process of formulating the best way to structure the algorithm for optimal performance. Stay tuned for more updates - IN PROGRESS.

### 6. Testing the AI

Once both the card-playing and betting AI have been designed, they can be combined into a single agent.

Stay tuned for more updates - IN PROGRESS.

### 7. Towards Superhuman Performance