---
title: "A perspective on the decoupling of spacecraft launch cost with spacecraft mass and volume"
excerpt_separator: "<!--more-->"
categories:
  - writings
  - featured
tags:
  - Spaceflight
---

This piece clearly and concisely lays out the bull case for a post-Starship space industry. While I wasn't breaking new ground with this analysis (a lot of the core ideas are inspired by [Casey Handmer's excellent blog post](https://caseyhandmer.wordpress.com/2021/10/28/starship-is-still-not-understood/)), it was a fantastic exercise to distill this core thesis into a two page brief aimed at those with little previous exposure to the space industry. I also dipped my toes into the world of company annual reports to perform some rudimentary financial analysis. How this thesis pans out is an open question, but I feel that it faithfully communicates the pro case. (This piece was written as a writing sample answering the prompt "What is a trend you see as being transformational to an industry, and how do you think that should inmpact a VC investment thesis?")
{: .notice}

### Summary

With new reusable heavy-lift launch vehicles on the horizon, spacecraft mass and volume will no longer be a major cost driver for space missions. This will massively expand the design space for future missions and drive an explosion in growth for the space economy.

### Background
It’s well known that in recent years, reusable launch vehicles such as Falcon 9 and Electron have driven launch costs to plummet, causing an explosion of activity in the space economy<sup>1</sup>. However, as seen in Table 1, these launch vehicles still place significant restrictions on the mass and volume of payloads that they can carry into orbit, while heavy-lift options like the Space Launch System (SLS) have historically been exorbitantly expensive, if they’re even available.


It’s hard to overstate the effect that these hard mass and volume constraints have on the spacecraft design process – hundreds of scientific papers and entire subfields<sup>2</sup> have been borne out of the problem of spacecraft mass optimization. These constraints often ripple throughout the design process in unintuitive ways. For example, if you try to lower mass by using thinner materials, you might run into vibration issues which complicate software and flight operations.


These difficulties directly translate to cost– compare the ~$40 million spent on each Lunar Rover<sup>3</sup> to ~$20,000 for a far less optimized, but fundamentally similar John Deere tractor. Starship, SpaceX’s new offering, promises to change this equation. By bringing full reusability to the heavy launch market, the marginal cost for a large launch vehicle reduces to just fuel and refurbishment (estimated to be ~$2 million total<sup>4</sup>) – effectively the exact same launch cost as a smaller launch vehicle. Even assuming SpaceX massively marks up the price of launch to $100 million to be in line with other providers, **this makes Starship no more expensive than other options on the market despite being far more capable, decoupling payload mass and volume with launch cost.**


| **Launch Vehicle** (* = reusable)         | **Mass**         | **Volume**            | **Cost**        |
|-------------------------------------------|------------------|-----------------------|-----------------|
| Starship*<sup>5</sup>                     | 100T+ to LEO     | 894 m<sup>3</sup>     | ~$100 million   |
| Space Launch System (SLS) <sup> 6  </sup> | 105T to LEO      | 612 m<sup>3</sup>     | **>$1 billion** |
| Falcon 9*<sup>7</sup>                     | **17.5T to LEO** | **212 m<sup>3</sup>** | $67 million     |
| Electron*<sup>8</sup>                     | **300 kg**       | **1 m<sup>3</sup>**   | $7.5 million    |

**Table 1:** Selected Launch Vehicles and Capabilities

**Projected Economic Impact**
As launch prices reduced by 5x from 2010 to 2020, the number of objects being sent to orbitincreased by 2000%<sup>9</sup>. This suggests that the price elasticity of launch demand is high, and that we can expect a large increase in demand for heavy-lift vehicles with the expected >10x reduction in launch cost.


Part of the reason launch cost is such a meaningful driver of the space industry is that it reduces the huge upfront cost of deploying new space assets, which makes the payback period for space startups long. According to my analysis, even Viasat’s $2B constellation of geostationary internet satellites, one of the least speculative and most profitable possible space investments, has had a payback period of 8.4 years<sup>10</sup>. Any reduction in launch cost shrinks this payback
period and makes space a more attractive investment.

However, Starship will do far more than simply increase existing demand for heavy-lift launch, which is currently mostly limited to government agencies like NASA. Without mass and volume constraints, space technologies look (and cost) a lot more like earth technologies – if you can partner with and modify vehicles from companies with expertise in building for Earth, it’s hard to imagine spending $2 billion dollars on a single asset. In the post-Starship world of the next few years, space companies can begin to design their vehicles more like Ford and less like Ferrari.

Not only will this benefit classic space businesses like communications, this fundamental shift will increase the diversity of the entire market by potentially enabling previously infeasible verticals like in-space manufacturing, large-scale tourism, or asteroid mining to reach viability.

**Startup Opportunities**
Several space companies are already betting on this idea – just this past month, new entrant to the space station market Vast Space<sup>11</sup> announced they would launch their entire space station to orbit in a single Starship, allowing them to leapfrog the cost and timeline estimates of existing and more traditional players like Axiom Space and Blue Origin. Similarly, K2 Space<sup>12</sup> is developing large, generic, and Starship-compatible satellite buses to allow companies to deploy satellites that would currently cost hundreds of millions of dollars for <$15 million.

And like any gold rush, there’s just as much business in outfitting the miners as there is being one yourself – this leaves startups like Turion Space<sup>13</sup>, LeoLabs<sup>14</sup>, Starfish Space<sup>15</sup>, and countless others well-positioned to provide the inspection, maintenance, and monitoring tasks that will be necessary to grow a robust in-space economy. Any venture firm would be well-served by deeply understanding and recognizing this trend.

**Citations**
<font size="1">
1. Annual number of objects launched into space: https://ourworldindata.org/grapher/yearly-number-of-objects-launched-into-outer-space 
2. Topological mass optimization https://www.sciencedirect.com/topics/computer-science/topology-optimization
3. The Apollo Lunar Roving Vehicle https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html 
4. Statement on Starship flight costs: https://www.space.com/spacex-starship-flight-passenger-cost-elon-musk.html 
5. Starship User Guide: https://www.spacex.com/media/starship_users_guide_v1.pdf (numbers are subject to change) 
6. SLS Launch Capabilities: https://www.nasa.gov/sites/default/files/atoms/files/sls_lift_capabilities_and_configurations_508_08202018_0.pdf 
7. Falcon 9 User Guide: https://www.spacex.com/media/falcon-users-guide-2021-09.pdf 
8. Electron Payload User Guide: https://www.rocketlabusa.com/assets/Uploads/Electron-Payload-User-Guide-7.0.pdf
9. Annual number of objects launched into space: https://ourworldindata.org/grapher/yearly-number-of-objects-launched-into-outer-space 
10. Viasat Annual Reports, 2019 and 2022: https://investors.viasat.com/financial-information/annual-reports 
11. Vast Space: https://www.vastspace.com/ 
12. K2 Space: https://www.k2space.com/ 
13. https://turionspace.com/ 
14. https://leolabs.space/
15. https://www.starfishspace.com/
</font>