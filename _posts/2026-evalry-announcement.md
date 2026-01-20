---
title: "How Benchmarking LLMs on Our Use Case Saved Us $1000+"
slug: benchmarking-llms-on-our-use-case-saved-us-thousands
date: 2026-01-19T12:00:00+01:00
tags: LLM, AI, Tools, Startups
category: Projects
description: "We benchmarked 300+ models on our actual task and found a cheaper alternative that works just as well."
type: text
status: published
---

This is the story of how I benchmarked LLMs for a friend of mine, saved him thousands in the process, and built a product around it.

Let me first tell you about my friend. He's an entrepreneur, and a successful one at that.
After he successfully built his last company, a SaaS business, he's now building his next business as a solo founder.
Although his last company was a SaaS startup, he's non-technical. While I cannot go into details, he's re-thinking a traditional business with AI.
As part of this business, he's been deploying a lot of prompts to automate processes that have previously been done by humans.
And for that, he picked GPT-5 because, well, it's the default choice. 
It's solid in most benchmarks, everyone uses it, they never questioned it.

But as adoption grew, so did the API bill. Hundreds of dollars monthly.
As I also do a lot of LLM engineering for my company, he asked me to take a look and help him out.
As part of this process, we benchmarked different LLMs against his use cases.
It quickly became clear that he can swap out ChatGPT with cheaper alternatives for a fraction of the costs, saving him north of $1000 monthly.

## The Problem: Benchmarks don't predict performance on your specific task

When picking an LLM, most people just use choose a model from their favorite provider. 
For me, that's anthropic, and so depending on the task, I choose Opus, Sonnet, or Haiku.
Same for OpenAI with a slightly higher variance.
If you're sophisticated, you might event check the latest benchmark, e.g. Artificial Analysis or LM Arena. 
Or whatever is the latest hot benchmark for something related to your use case:
GPQA Diamond, AIME, SWE Bench, MATH 500, Humanity's Last Exam, ARC-AGI, MMMLU...

But here's the thing: 
NONE of these predict performance on YOUR specific task.

A model that tops reasoning benchmarks might be mediocre at damage cost estimation. 
Or customer support in your customers' native tongue. 
Or spatial reasoning in Germany.
Or data extraction via playwright. 
Or whatever you're actually building.

The only way to know is to test on your actual prompts.

## Building benchmarks ourselves

So we built the benchmarks.
We identified the main use cases of prompts, e.g. customer support and cost calculation.
We already had the prompts that were used to do this. Sometimes fully automated, sometimes to generate an answer that would then be refined.
To create a ground truth for all use cases, we collected as many real-life examples as possible.
For customer support, we extracted the actual chats via [WHAPI](https://whapi.cloud/) along with the agents (my friends) answer.
Or for cost estimation, we collected all the data we had about the contract along with the human-made estimate that got sent out to the customer.
If you know a specific model is good enough, you can also simply use its output.

Now we had the context, the pompts, and the expected outputs. 
But how to now score all the LLMs against each other?
For this, we applied the "LLM as a judge" approach.
For all our samples, we used prompt + context to generate an answer.
Then we let a (frontier) LLM judge the result based on the given answer of the model we benchmarked.
This then gave us a score for every LLM.
We also checked the results to make sure they aligned with our subjective scoring.

## Deciding on the best model

Now that we had a score to measure quality per LLM, the question was:
Which model should we choose?
In practice, you want a model that provides a balance of quality, cost, and latency.
For our customer support case, latency was important. We couldn't wait for GPT-5 that took up to a minute with enough context.
For price estimation, we wanted the results to be as good as possible for a reasonable price.

This made us realize, we needed to measure both cost and latency.
- Cost: For cost, we quickly realized that simply comparing token costs is not enough:
  Since response tokens (thinking + actual answer) are costlier and answers varied significantly in token count,
  we decided to simply measure overall cost per answer and average per use case or benchmark.
- Latency: Since for both of our use cases the overall time until we get a full response was the only timing-related variable we needed, we used that.
  Of course, that differs for chat applications where time to first token, etc. can be essential UX, too.

This finally gave us a list of models per use case with price, cost, and latency.
To decide, it was usually enough to sort by quality and choose a somewhat cheap/fast model.

In theory, there's a concept called Pareto Efficiency that can be applied:
For the formal definition, Wikipedia sure does a better job than me.
For the informal definition, here's my take:

> Given that you have a benchmark across 100 LLMs with a cost and score (let's forget latency for a second).
  There's no point in comparing all 100 LLMs.
  For most LLMs, you will find a model that cheaper AND better.
  This means there's no point in looking at it, as you have one that's better in both dimensions.
  Doing this for all LLMs in a benchmark, you get a pareto frontier:
  The best LLM for a given price.
  The higher the price, the more quality you get.

## Saving $1000 monthly by switching the models

With the described method, we found a significantly chepaer model for both use cases.
Across the two use cases, this saved him roughly 80% of the monthly costs and over $1000.

Since no technical post ends without a small plug,
in the following section, I will tell you that I launched this as a small tool.
Stop here if you're not interested.

## evalry: a tool to benchmark your usecase across 300+ LLMs

As you see, benchmarking and truly finding an optimal model is more complex than we initially though.
That's why my friend never did it, that why I unsually don't do it.
You need to (re-)build all this, integrate multiple APIs, write scoring logic, error logic, etc.
Manually testing even 5 models can quickly become a multi-hour endeavor.
And new models drop weekly. Keeping up is impossible.
The same model in a month? Half the price because some LLM wizard like Simon Bohm dropped inference costs in half.

So to help my friend and anyone else with the same problem, I built [Evalry](https://evalry.com).
It provides all this in one simple tool that does the heavy lifting for you:
It tests your actual prompts against 300+ models at once. Compare quality, speed, and cost side-by-side. No code required, results in seconds.
I'm also planning to set up continuous monitoring. So when a better model appears, that's cheaper, faster, or higher quality for your use case, you get notified.

So if you're paying for LLM APIs and have never tested alternatives on your actual prompts, you're likely overpaying.
Give [Evalry](https://evalry.com) a try. It takes 5 minutes to find out if there's a better model for your use case.
Or if you're short on time, find the model you're currently using and try the five models that have similar performance on average.
