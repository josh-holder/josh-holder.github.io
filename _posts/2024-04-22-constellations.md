---
title: "Internet Constellations are Still Not Understood."
excerpt_separator: "<!--more-->"
categories:
  - writings
  - featured
tags:
  - Spaceflight
toc: true
header:
  image: /assets/images/constellation_header.jpg
  image_description: "view of a satellite constellation"
---

It's May 2024: [Falcon 9 is roughly on-target](https://en.wikipedia.org/w/index.php?title=List_of_Falcon_9_and_Falcon_Heavy_launches) for a mind-boggling 144 launches this year, [Starship continues its march to full capability,](https://en.wikipedia.org/wiki/SpaceX_Starship_integrated_flight_test_3) and thanks to [various](https://josh-holder.github.io/writings/launch-mass/) [articles](https://ntrs.nasa.gov/citations/20200001093) (most prominently [Starship is Still Not Understood](https://caseyhandmer.wordpress.com/2021/10/28/starship-is-still-not-understood/) by Casey Handmer), many in the tech community have built an intuition for what this might mean for the space industry as a whole - cheaper mass to orbit leads to more lenient mass constraints leads to far cheaper satellites leads to an explosion in the usage of space by a wide array of players.

While over the long term this thesis may play out, I'd argue that this obscures the deeper, much more near-term trend enabled by this new paradigm: the rise of satellite constellations. And in fact this rise might be the key factor which allows the flywheel to get started in the first place. Internet infrastructure in space allows individual satellite owners to link directly into the terrestrial internet without having to worry about expensive and bandwidth-limited downlinking. More data, delivered faster, with fewer constraints - **it's about so much more than just consumer internet.**[^0][^3]

<span style="font-size:0.75em;">Note that as of the writing of this article I have never worked directly on Starlink or any other megaconstellation, nor am I privy to any inside information about SpaceX/Kuiper or their plans going forward. This blog post contains only my speculation based on public information which I've synthesized after following the space for a while and writing my Masters thesis on the subject.</span>

## The Birth of the Constellation Era

The rapid drop in the price of launch has in some sense already caused a major phase shift in the space industry - looking at the now familiar graph of objects launched to space over time, shown below, it's hard to miss the story of explosive growth. However, removing the contributions of major constellations, it becomes clear that the real phenomenom is not yet an explosion in use-cases, but an explosion in the *number of satellites employed for a given use case*.[^1]

![objects_launched](/assets/constellation/objects_launched.png){: width="700px" .align-center}

Indeed, only with launch costs of on the order of Falcon 9 is it even remotely economically feasible to launch such large groups of satellites, like the 5,000 currently operating in the Starlink constellation. [Iridium](https://www.amazon.com/Eccentric-Orbits-Iridium-John-Bloom/dp/0802126782), the failed internet constellation of the 90's, could only muster 66 satellites, and as such had to drastically scale back their ambitions.

At the highest level of ambition, though, the economics begin to strain even in a world with Falcon 9. To reach SpaceX's goal of 30,000 satellites in orbit (the level at which bandwidth could begin to challenge terrestrial fiber networks) would require \$2 billion annually in launch costs alone. In a world with Starship, though, this number would be closer to \$300 million using reasonable assumptions.[^6] This seems much more feasible, especially when compared to the size of the potential market for a constellation of this size.

Thus, the 2020s will be the first time in history when launch prices are low enough to sustain such a large-scale constellation. As major as the first order effects of a decrease in launch prices will be on the industry, I will argue that the second-order effects of price being below the threshold at which internet constellations are viable will be equally significant, because they remove one of the most significant remaining barriers to entry into the space market.

## Downlink is King

A key but often underappreciated factor in the design of space systems is the process of downlinking data. When a satellite takes an image or acquires a sensor reading, this is merely the start of the journey - that data needs to reach the ground somehow so that it can be used. Typically, this is done by directly sending this information to ground systems via radio waves.

![downlink_pic](/assets/constellation/eos_downlink.png){: width="700px" .align-center} [^2]

However, many satellites generate massive amounts of data to be downlinked (for satellites that continuously image the Earth, this can be ~tens of TB per day), and this induces several non-intuitive technical trades, affecting everything from high-level orbital design to micro-level tasking procedures and power budgets.

 - higher orbits allow for longer line-of-sight connections with ground stations, but require more power for sending signals.
 - higher frequencies allow for higher bandwidth communications, but are more susceptible to performance decreases in [adverse weather conditions](https://en.wikipedia.org/wiki/Rain_fade).
 - satellites can only meaningfully collect data while they have room to store it - [this](https://www.sciencedirect.com/science/article/abs/pii/S0305048315000031) [leads to](https://digitalcommons.usu.edu/smallsat/2017/all2017/98/) [massive](https://arc.aiaa.org/doi/abs/10.2514/1.I011215?journalCode=jais) [complications](https://link.springer.com/article/10.1007/s10957-021-01875-2) in the design of task scheduling algorithms, and a general reduction in satellite efficiency.

Every satellite producer has to carefully weigh these tradeoffs during the design process. The problems don't end once a workable downlink system is developed on the satellite side, either. One still needs to have ground stations to send the data to, either by undertaking [a painful buildout](https://digitalcommons.usu.edu/smallsat/2016/TS9GroundSystems/5/) of private ground stations, or by paying for access to existing ground stations (often equally painful):

![ground_station_tweet](/assets/constellation/ground_station_tweet.png){: width="500px" .align-center}

Indeed, the ground station market has been valued at \$25 billion dollars, and is [projected by some](https://www.gminsights.com/industry-analysis/satellite-ground-station-sgs-market) to grow to \$55 billion by 2032. This problem has been receiving some attention as of late, with companies coming at it from two main angles:

1. **Building better ground stations:** companies like [Northwood Space](https://www.northwoodspace.io/) and [Skygate Technologies](https://www.satellitetoday.com/finance/2020/09/04/japan-ground-station-startup-skygate-technologies-receives-seed-investment/) are aiming to build ground stations that are designed for manufacturability and thus reduced cost.
2. **Edge compute for space:** on the flip side, if the amount of data satellites need to downlink is reduced, that would also free up important design space. To do this, significant aspects of data analysis need to be moved into orbit as it is on the ISS - this is the difference between having to downlink entire videos and only having to downlink positions of objects. To more effectively run the (often AI-enabled) processing loads on space hardware, companies like [Aethero](https://www.aethero.com/) are working to develop space-grade, radiation-hardened chips.

Constellations promise a third path forward: allowing individual satellites to bypass ground stations and downlinking considerations altogether.

## Downlink-as-a-Service

At SATELLITE 2024, to relatively little fanfare, [Gwynne Shotwell announced](https://www.cnbc.com/2024/03/21/investing-in-space-what-to-make-of-spacex-selling-satellite-lasers.html) that SpaceX would begin selling laser terminals to outside customers. This simple statement represents a seismic shift in satellite design. Presumably, these laser links will allow satellites to connect directly to the Starlink network and thus provide a [continuous 100 Gbps link](https://www.pcmag.com/news/starlinks-laser-system-is-beaming-42-million-gb-of-data-per-day) to the ground. Questions remain about what requirements this will levy on user satellites (i.e. power, pointing constraints), but it seems likely that this will be a simpler and easier solution than developing a downlink strategy from scratch.[^7]

This is, of course, a huge deal. Imagine if to connect your home to the internet, you had to lay your own cables manually. And those cables only had signal in 90 second time intervals dispersed randomly throughout the day. And that you only had a 500 Mb hard drive on your computer, and you had to store everything else on Google Drive using the aforementioned internet connection. This is the current situation in the world of in-space connectivity. Starlink promises to bring internet in space into the fiber era;[^4] continuous, high data rate connection made available simply by purchasing a plug-and-play laser terminal. It's not hard to imagine many businesses and technical platforms that are completely infeasible under the first paradigm which are feasible under the second, especially with massively reduced launch cost.

It also has large business implications - if Starlink can capture even 10% of the total ground station market, this represents a near doubling of their current revenue. The national security segment of the ground station market might be a bit tougher to gain traction in as confidentiality requirements might necessitate a separate constellation or other changes, but purpose-built constellations (i.e. [SpaceX's Starshield constellation](https://www.twz.com/space/if-spacexs-secret-constellation-is-what-we-think-it-is-its-game-changing)) will deliver similar transformations in this arena.

Other players in the space no doubt have similar plans - [Rivada Space](https://rivadaspace.com/) is planning a similar 600 satellite constellation, and while Kuiper has stayed quiet so far, [Kuiper satellites](https://www.aboutamazon.com/news/innovation-at-amazon/amazon-project-kuiper-oisl-space-laser-december-2023-update) are equipped with intersatellite laser links as well. In fact, [much of Kuiper's unique edge](https://www.cnbc.com/2022/04/05/amazon-signs-rocket-deal-with-blue-origin-arianespace-ula-for-project-kuiper-internet-satellites.html) over SpaceX relies on their access to the extensive global data center infrastructure of Amazon Web Services, which already offers ["Ground-Station-as-a-Service" capabilities](https://aws.amazon.com/ground-station/). This would position them well to prepare for the incoming flood of data from space assets.

## New Applications

What applications, concretely, will this unprecedented access to bandwidth in space make possible? Below are some ideas:

### 24/7 Earth Observation

Currently, two major factors affect the latency of Earth observation data. One, satellites physically pass by locations on Earth only so often - the [frequency at which a satellite platform can observe a given location](https://en.wikipedia.org/wiki/Satellite_revisit_period) is determined by orbital mechanics, satellite maneuverability, and of course the number of satellites in the constellation. Second, as discussed above, satellites can only transmit their data when they are directly in view of a ground station. To make matters worse, if weather conditions above the ground stations are poor, satellites might have to wait for a future ground station pass to transmit their data. This fundamentally limits the speed at which data, and especially data from remote locations, can reach end users.

Constellations solve both of these issues. Clearly, as earth observation constellations grow in size, revisit time sharply decreases (and sensors could even be colocated on Starlink or Kuiper satellites to allow for dual-use). More significantly though, connection through the laser mesh of a LEO internet constellation means that satellites can "see" all ground stations at once, instantly routing data back to the terrestrial internet even from over the ocean or amid cloudy weather.

Theoretically, this would allow a company to provide *live, high-definition footage and data from the entire surface of Earth.* The applications of this are endless:
 - **Make Google Maps vastly more powerful** - imagine if Google Maps could rely [not just on historical data](https://blog.google/products/maps/google-maps-101-how-ai-helps-predict-traffic-and-determine-routes/) but also real-time imaging information, or direct you to the nearest open parking spot in real time.
 - **Effectively remove fog of war in military engagements** - this would redefine the way military engagements are conducted, and hopefully make them more humane. Speculation on SpaceX's Starshield constellation already [provides a window into this future.](https://www.twz.com/space/if-spacexs-secret-constellation-is-what-we-think-it-is-its-game-changing)
 - **Better weather prediction** - [bleeding-edge weather models]((https://deepmind.google/discover/blog/graphcast-ai-model-for-faster-and-more-accurate-global-weather-forecasting/)) increasingly use data-hungry AI algorithms to make predictions. Currently, though, the data used to train these models is relatively sparse (i.e. [31km, hourly resolution across a handful of modalities](https://www.science.org/stoken/author-tokens/ST-1550/full)). Given how increased model scale and dataset size [has correlated directly with performance in other domains](https://arxiv.org/pdf/2001.08361.pdf), it seems likely that weather models would be similarly improved by an increase in the temporal resolution, accuracy, and multi-modality of the data used to train them. ([At least one financial firm](https://spire.com/press-release/spire-global-secures-multi-million-dollar-deal-with-financial-firm-for-weather-forecasts/) is already betting on the transformative capability of satellite data here.) These same atmospheric models could be used to gain insight into our changing climate and evaluate the potential effectiveness of tools like [solar radiation modification](https://en.wikipedia.org/wiki/Solar_radiation_modification) in mitigating it.

### Reactive Satellite Tasking

Even in architectures with less than the amount of satellites required for continuous full-Earth coverage, broadband constellations can be transformative by allowing platforms to make more efficient, reactive use of the satellites that are available.

Currently, satellites are assigned to tasks[^5] using Tracking, Telemetry and Command (TT&C) radio signals, subject to the same constraints on ground station availability mentioned throughout this post. This means that any changes in task assignment can take a long time to propagate through the system, as a central tasking hub has to recieve telemetry from satellites, compute an efficient assignment of satellites to tasks, and send this information back up to each satellite in the constellation. Any changes in circumstances that occur within this period (on the order of minutes or even hours) cannot be integrated into in the planning process.

Not only can a connection to an internet constellation increase the speed with which TT&C signals can be sent between satellites and central hubs, they can also enable entirely new architectures. Consider a constellation with only a few dozen satellites, all connected via the Starlink network. When one satellite observes an event of interest, it can directly communicate this information to other satellites in the network who can act accordingly at their next opportunity, without ever having to send slow and unreliable communications to the ground.

Recently, there has been a huge amount of demand for these kinds of distributed architectures.

 - The [DARPA Oversight Program](https://www.darpa.mil/program/oversight), in which DARPA aims to develop constellations which can track up to 1000 targets autonomously as they arise, with clear applications to missile tracking and other domains in which highly reactive systems are important. By enabling high-speed communication between nearby satellites, latency is greatly decreased and the system no longer has a single point of failure.
 - [XPRIZE Wildfire](https://www.xprize.org/prizes/wildfire), in which an \$11 million dollar prize will be awarded to a team who "rapidly and accurately detect[s] all fires across a vast and remote area and transmit[s] data to ground stations." One can imagine an architecture where satellites instantly notify nearby satellites of a suspected fire and request more images of the fire to better characterize it.
 - Other science applications like [earthquake monitoring](https://www.preventionweb.net/news/space-based-system-can-provide-seismic-monitoring-large-earthquakes-tsunamis), where satellite-based systems have potential to collect data before the earthquake is even over and thereby speed up tsunami warnings by crucial minutes.

### Tourism and Industry in Space

Finally, as the internet further pervades every aspect of our lives, so too will it pervade every aspect of our usage of space.

Industrial research labs and manufacturing facilities such as those planned by [Varda Space](https://www.varda.com/) will need robust internet connections to transmit vital data on manufacturing processes. The ISS serves as a perfect example of this, where [they already struggle to transmit the vast quantities of data](https://www.nasa.gov/directorates/somd/space-communications-navigation-program/nasa-communications-network-to-double-space-station-data-rates/) generated by experiments down to the ground. High-bandwidth connections to internet constellations will be a key part of enabling any such in-space manufacturing, if the economics do work out.

Similarly, longer-duration space tourism or [entertainment products](https://www.smithsonianmag.com/smart-news/nasa-considers-filming-reality-show-competition-international-space-station-more-space-commercialization-emerges-180977511/) will have a need for strong internet connections for FaceTimes, social media use, and broadcasting. We already see examples of these partnerships, with [Vast Space committing to using Starlink](https://spacenews.com/vast-to-use-starlink-for-space-station-broadband-communications/) for broadband connection to their upcoming space station.

## Quantifying the Impact on Earth Observation

In an industry where [even the most well established firms](https://s29.q4cdn.com/903184914/files/doc_financials/2023/q4/Planet-Fiscal-4Q-23-and-Full-Year-2023-Update-Presentation.pdf) are on track to lose \$40 million in 2024, quantifying claims is critical - despite many years of effort, it has been difficult to fully capture the value of this technology. However, there are some quantitative reasons to believe this transformation will have real effects.

The value landscape of satellite images is highly multi-dimensional - resolution, spectrum, coverage, and revisit time combine in nonlinear ways to determine the value of an image. Focusing on any one parameter, though, it becomes clear that image value scales rapidly with increasing quality. Although on some level resolution and imagery type are limited by optical hardware, simplified downlink design and the removal of bandwidth constraints will no doubt push more imagery products into the exponential part of the curve.

![resolution_cost](/assets/constellation/resolution_cost.png){: width="700px" .align-center}[^8]

Similar trends exist for imaging frequency - the market tells us that satellite imagery customers are willing to shell out for low-latency data (~a 2x premium), and this is precisely where constellations are poised to make the greatest impact.

![timeliness](/assets/constellation/timeliness.png){: width="500px" .align-center}[^9]

As an example, a Starlink laser terminal connection might allow for a 1m resolution image delivered within a day to become a 50cm image delivered in near real-time, **corresponding to a ~7x increase in value.** Effects like these will allow for higher margin businesses which at the same time provide a larger consumer surplus.

Of course, this is an analysis based on currently available data products. Some combinations of image parameters represent complete phase shifts - twice-daily revisit time is a fundamentally different capability than continuous coverage, for example. These novel capabilities (and the resulting applications imagined in the previous section) could spawn entirely new companies and sources of demand.

## The Post-Constellation Future

In all these applications, the common thread is the ability of easy access to bandwidth to not only improve existing capabilities and business categories on-orbit, but also to enable fundamentally new ones. Much ink has been spilled on the viability of the consumer internet business, but **there is a world in which a significant part of the value proposition of Starlink for SpaceX is the new activity it drives to their launch business by lowering the barrier to entry to productively using space.**

Thus, it seems to safe to assume that this future is coming - [in the words of former SpaceX exec Abhi Tripathi](https://www.cnbc.com/2024/03/21/investing-in-space-what-to-make-of-spacex-selling-satellite-lasers.html), "[SpaceX] are laying track. You could decide you want to get in the track-laying business, or you could decide what you want to put on that track." Just as it did for the American West, I expect this interstellar railroad to have transformational impacts, in more ways than just expanded terrestrial access to internet.

There are a lot of important businesses and products to build. Let's get to work.

[^0]: And even this is shaping up to be a large market - Starlink brought in an [estimated \$4 billion in revenue in 2023](https://payloadspace.com/estimating-spacexs-2023-revenue/), with estimates even higher for 2024. Communications is one of the few trillion dollar industries, and [this blog post](https://caseyhandmer.wordpress.com/2019/11/02/starlink-is-a-very-big-deal/) effectively outlines the technical aspects and potential of the consumer internet space.
[^1]: Data from [Our World in Data](https://ourworldindata.org/grapher/yearly-number-of-objects-launched-into-outer-space), minus Starlink and Planet satellite launches.
[^2]: Graphic taken from [this paper.](https://link.springer.com/chapter/10.1007/978-3-031-36625-3_29)
[^3]: **Note that as of the writing of this article I have never worked directly on Starlink or any other megaconstellation, nor am I privy to any inside information about SpaceX/Kuiper or their plans going forward. This blog post contains only my speculation based on public information which I've synthesized after following the space for a while and writing my Masters thesis on the subject.**
[^4]: Or perhaps bring internet access everywhere into the *constellation* era - the [higher speed of light in a vacuum](https://en.wikipedia.org/wiki/Speed_of_light) vs. in air means that in the physical limit, in-space communications could provide lower latency and higher bandwidth than even fiber.
[^5]: Tasks in the context of satellite constellations means the actions you want your satellites to take, i.e. capturing photos of specific locations or providing internet to a geographic region. Task assignment is then the process of optimally assigning satellites to complete tasks. There is an extensive body of work on this problem (including my thesis) - see [this survey article](https://arxiv.org/abs/2003.06169) for a flavor of the problem.
[^6]: Assuming [60 Starlink satellites per Falcon 9, 400 per Starship](https://www.pcmag.com/news/spacex-both-falcon-9-and-starship-will-deploy-second-gen-starlink-satellites), a 5 year satellite lifetime, and internal launch costs of \$20 million for both Falcon 9 and Starship.
[^7]: Although it's easy to brush over the details here, it's also interesting to speculate about the technical details of how this will actually be accomplished. Starlink laser links are paired, so Starlink satellites will have to be cooperative with other satellites attempting to use their service. Will these links with outside satellites occur through standard satellites, or will they design custom multi-ISL satellite buses for this purpose? Some interesting discussion [here.](https://forum.nasaspaceflight.com/index.php?topic=60578.0)
[^8]: Resolution cost data is assuming 2D color images. Pliéades, SPOT, KOMPSAT, and WorldView data from [here](https://landinfo.com/satellite-imagery-pricing/), Landsat data from [here](https://landsat.gsfc.nasa.gov/satellites/landsat-9/), Rapideye data from [here](https://apollomapping.com/rapideye-satellite-imagery).
[^9]: Graphic taken from [this website.](https://up42.com/blog/a-definitive-guide-to-buying-and-using-satellite-imagery)