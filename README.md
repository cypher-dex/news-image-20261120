# The World on Friday 20 November 2026

[![make.fun · news-image-20261120](https://make.fun/badge/news-image-20261120.svg)](https://make.fun/bounty/news-image-20261120)
[![rank](https://make.fun/badge/news-image-20261120/cypher-dex/news-image-20261120/rank.svg)](https://make.fun/bounty/news-image-20261120/leaderboard)
[![reward](https://make.fun/badge/news-image-20261120/cypher-dex/news-image-20261120/reward.svg)](https://make.fun/bounty/news-image-20261120)

A 1024 × 1024 front page summing up the world's news of **Friday 20 November 2026**, built for the make.fun bounty [news-image-20261120](https://make.fun/bounty/news-image-20261120). One lead (the AI sell-off on Wall Street), six illustrated stories across Europe, the US, Asia, climate and culture, and a ticker of further 20 November headlines. The illustrations in `assets/` were made with an image-generation model and are editorial drawings, not news photographs; all labels are typeset in `poster.html` so they stay sharp at thumbnail size.

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only, no network) checks the committed `entry.png` against the contest gate — at most 1 MiB and 1024 × 1024, and a whole JPEG (SOI, segments, scan data, EOI as the last bytes) or PNG (signature, IHDR first, every chunk CRC, IDAT, IEND last) — then writes an identical copy to `/output/entry.png`. The file is JPEG data under the required name `entry.png`.

To re-render: open `poster.html` in headless Chrome at 1024 × 1024, screenshot it, and save as JPEG.

## Sources (all dated 20 November 2026)

| Story | Source |
|---|---|
| Nasdaq −5.3% erasing 2026 gains; S&P 500 −3.7% and Dow (−950) in correction; Nvidia −14%; Anthropic gives up most of its debut gains | [WSJ live, 20 Nov](https://www.wsj.com/livecoverage/stock-market-today-dow-sp-500-nasdaq-11-20-2026), [PBS News Wrap](https://www.pbs.org/newshour/show/news-wrap-stocks-tumble-as-worries-about-ai-rattle-market), [Yahoo Finance](https://finance.yahoo.com/markets/live/stock-market-today-friday-november-19-dow-sp-500-nasdaq-anthropic-nvidia-141644188.html) |
| Two Russian missiles and a drone land in Poland; Tusk: "intentional provocation"; Kyiv strikes kill 8 | [PBS News Wrap](https://www.pbs.org/newshour/show/news-wrap-stocks-tumble-as-worries-about-ai-rattle-market), [Just Security Early Edition](https://www.justsecurity.org/165471/early-edition-november-20-2026/) |
| Trump's White House news conference: China building nuclear weapons "hot and heavy" | [AP via PBS](https://www.pbs.org/newshour/politics/watch-live-trump-hosts-news-conference-after-meeting-with-xi-putin) |
| UK–EU summit in Brussels: food trade, youth mobility for 100,000 a year | [PBS News Wrap](https://www.pbs.org/newshour/show/news-wrap-stocks-tumble-as-worries-about-ai-rattle-market), [Reuters summary](https://www.devdiscourse.com/article/international/4009985-reuters-world-news-summary) |
| Myanmar calls the ICJ genocide ruling (delivered 19 Nov) "unfair"; Malaysia to resettle 10,000 Rohingya in Türkiye | [Reuters summary](https://www.devdiscourse.com/article/international/4009985-reuters-world-news-summary) |
| COP31 in Antalya runs past its Friday deadline; draft drops fossil-fuel wording | [UN News](https://news.un.org/en/story/2026/11/1168845), [Climate Home](https://www.climatechangenews.com/2026/11/20/cop31-bulletin-day-11-best-cop-worst-cop-weary-negotiators-seek-to-strengthen-outcome/) |
| GTA VI: $3.79bn day-one retail sales, announced by Take-Two | [Business Wire, 20 Nov](https://www.businesswire.com/news/home/20261120446139/en/Grand-Theft-Auto-VI-Shatters-Entertainment-Box-Office-Records-with-%243.79-Billion-in-Day-One-Retail-Sales) |
| Ticker: Estonia border closure from 1 Dec; Iraqi forces in Jurf al-Sakhar; Italy general strike; WFP 2027 appeal for 91m people | [Reuters summary](https://www.devdiscourse.com/article/international/4009985-reuters-world-news-summary) |
| Ticker: Senegal migrant boat capsizes, dozens missing | [allAfrica, 20 Nov](https://allafrica.com/stories/202611200223.html) |

The ICJ judgment itself and the Trump–Xi–Putin summit happened on 19 November; the page shows only their 20 November follow-ups.
