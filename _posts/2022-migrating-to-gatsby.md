---
title: Switching from Nikola to Gatsby (static site generators)
slug: switch-from-nikola-to-gatsby
date: 2022-03-10T17:03:35+01:00
tags: Python, Lektor, Nikola, Tech, Gatsby, Javascript
category: Tech
link:
description:
type: text
---

Interestingly, exactly two years after [migrating from Python-based Lektor to Python-based Nikola](/posts/switch-from-lektor-to-nikola)
with this blog, I'm migrating to JS-based Gatsby.
Since the page was becoming out of date
and after successfully building [my company's page](https://loreyventures.com) with Gatsby in just a few hours,
I thought why not try it with this page and a little more data.

## The good

The conversion of the pages was finished really quickly.
Also converting the existing static CSS-based design over to tailwind was fun and made things much more structured
while keeping the layout 95% the same.
Overall, Gatsby with its static site generation gives you the best of both worlds:
One the one side modern frontend capabilities with React, Tailwind, and other modules,
on the other side strong SEO through static site generation.
Finally, the deployment was done within minutes just by setting up Github Actions.

## The bad

After converting layouts and pages, I started with the blog.
Since Gatsby provides much of its functionality via an GraphQL-based data layer,
you need to integrate your existing data into it as well to leverage core functionality.
As long as you keep the data simple, that's quite convenient and quickly done,
but as soon as you have customized objects,
it becomes really cumbersome.
For example, Lektor supported Markdown frontmatters with the draft status.
To replicate this in Gatsby took me more time than necessary by adapting page generation and filtering blog entries.
An explanation much better than the one I can provide,
can be found at Jared Palmer's [Gatsby vs. NextJS](https://jaredpalmer.com/gatsby-vs-nextjs).

## The ugly

Maybe it is just me being not that experienced in the Javascript world,
but I feel the integration of data with GraphQL forces you to repeat filtering logic quickly in different components.
Also, that integration basically resulting in a shared data antipattern
as data is accessed from each component directly.
Which will result in having to change several components
if you change something in the data.
For small projects this is not an issue, but for bigger projects I don't see a quick fix.
As recommended in the article linked above, I'll look into NextJS next (pun not intended).
