---
title: Semantic Entropy Probes
context: Research project
period: Jan – Aug 2025
order: 5
gloss:
  - { w: Linear probes, g: probe-hidden.state }
  - { w: Entropy metrics, g: semantic-uncertainty }
  - { w: Eval pipeline, g: embed-compare }
translation: Probes that read a language model's uncertainty directly from its internal representations.
stack: [Python, PyTorch, Transformers]
languages: []
links:
  paper: https://openreview.net/pdf?id=UfvxT346jK
todo: [Add repo link, Verify exact paper title and publication details from an accessible PDF]
---

## What I built

Linear probes that estimate semantic uncertainty from a language model’s internal representations. The goal is to understand how hidden states relate to uncertainty about the meaning of an answer.

Built evaluation pipelines combining semantic entropy, sentence embeddings, and generation analysis to compare uncertainty and reasoning consistency across model families.

[Read the paper on OpenReview](https://openreview.net/pdf?id=UfvxT346jK).
