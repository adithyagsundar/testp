---
title: Proximal Surrogate Generation
context: University of Illinois Urbana–Champaign · Software Engineer Intern
period: May – Dec 2024
order: 2
gloss:
  - { w: Surrogate datasets, g: generate-neighbor }
  - { w: Eval pipeline, g: embed-filter-infer-score }
  - { w: HPC workflows, g: distribute-bench }
  - { w: Models, g: llama·qwen·zephyr }
translation: Tests whether a model has forgotten knowledge—or just the exact text used to evaluate it.
stack: [Python, HPC, Embeddings, Evaluation pipelines]
languages: []
links:
  paper: https://arxiv.org/pdf/2512.19025
todo: [Add repo link, Confirm contribution attribution and internship dates against the December 2025 preprint]
---

## The idea

A model can stop reproducing training text and still retain related knowledge. Proximal Surrogate Generation creates semantically related but distinct test data to expose that gap.

## My contribution

Built data-generation and evaluation pipelines spanning embeddings, likelihood filtering, model inference, and automated scoring, with distributed experiments on HPC infrastructure.

## What the evaluation showed

Across three model families, three datasets, and seven metrics, standard evaluations often overstated forgetting. Testing related content revealed knowledge that the original tests missed.

The work is described in [The Erasure Illusion: Stress-Testing the Generalization of LLM Forgetting Evaluation](https://arxiv.org/abs/2512.19025), an arXiv preprint released in December 2025.
