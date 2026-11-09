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
translation: A reusable framework that stress-tests whether LLM unlearning actually holds up.
stack: [Python, HPC, Embeddings, Evaluation pipelines]
languages: []
links: {}
todo: [Add repo link, Add paper link]
---

## What I built

- A reusable framework that stress-tests LLM unlearning systems with semantically related surrogate datasets, to judge how robust and reliable unlearning evaluation really is.
- Scalable data and evaluation pipelines covering dataset generation, embedding optimization, likelihood filtering, model inference, and automated metric computation, for comparative experiments across Llama, Qwen, and Zephyr.
- Distributed experiment workflows on HPC infrastructure that benchmarked NPO and RMU across 3 datasets and 7 metrics and exposed systematic robustness gaps.
- Reproducible software artifacts, plus a contribution to a published research paper.
