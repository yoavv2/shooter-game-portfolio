---
name: GapHunter
rarity: LEGENDARY
blurb: Turn unstructured app reviews into structured insights & reports with AI
progress: 100
order: 1
stack:
  - Next.js
  - Convex
  - OpenAI
# liveUrl: https://gaphunter.example.com
# repoUrl: https://github.com/yoavv2/gaphunter
# image: /missions/gaphunter.png
---

## OBJECTIVE

App teams drown in thousands of unstructured store reviews. GapHunter turns
that noise into structured insights: recurring complaints, feature requests,
and sentiment trends — delivered as readable reports.

## EXECUTION

- Ingestion pipeline pulls reviews and normalizes them into a single schema.
- LLM pass (OpenAI) classifies each review: topic, sentiment, feature gap.
- Convex stores structured results and powers real-time dashboards.
- Report generator aggregates findings into shareable summaries.

## FIELD NOTES

Built end-to-end: data model, ingestion, AI prompting, dashboard UI.
The interesting problem was prompt reliability — getting consistent JSON
classification at scale without hallucinated categories.

## OUTCOME

Shipped to production. Unstructured reviews in, decision-ready reports out.
