# Noruvale Retry Lab

[**▶ Try the free live demo**](https://snowbirdkind-wq.github.io/noruvale-retry-lab/) · [**Report a synthetic edge case**](https://github.com/snowbirdkind-wq/noruvale-retry-lab/issues/new?template=feedback.md) · [**Source code**](https://github.com/snowbirdkind-wq/noruvale-retry-lab)


> A free, browser-based **synthetic experiment** showing why API retries can accidentally duplicate work — and why some prevention techniques depend on the destination system.

**Status:** Free research demo (v0.4.1). Not a production monitoring or security tool.

[![16 synthetic test cases](https://github.com/snowbirdkind-wq/noruvale-retry-lab/actions/workflows/test.yml/badge.svg)](https://github.com/snowbirdkind-wq/noruvale-retry-lab/actions/workflows/test.yml)

## Try a failure in 30 seconds

1. Open the **[free live demo](https://snowbirdkind-wq.github.io/noruvale-retry-lab/)** (no signup, no API key).
2. Leave **Write succeeds · response lost** selected with **Blind retry**. The synthetic result shows **two writes for one intended operation**.
3. Switch to **Stable idempotency key** and run it again. The destination-enforced key in this *model* holds the result to one write.
4. Choose **Write succeeds · lookup lags** and **Lookup then retry** to explore how an outdated read can lead to another write.
5. Try **Run all 16 comparisons**, and tell us which real-world failure case this educational model doesn't cover.

> **A key in the client is not enough**: the destination must enforce idempotency atomically. The demo never executes a live API or n8n workflow.

## What you can try

- Four controlled scenarios: response lost after a write, confirmed non-writing 503 fixture, stale lookup, and two concurrent workers.
- Four retry strategies: blind retry, destination-enforced idempotency key, lookup-first, and hold for review.
- A 4 × 4 comparison matrix and a local Markdown report export.
- Everything runs in your browser. No accounts, API keys, real messages, real workflow executions, cookies, analytics or external requests are built into the demo.

## Demo

**[Open the live demo](https://snowbirdkind-wq.github.io/noruvale-retry-lab/)** — no signup, installation, or real API calls. Choose a failure scenario and retry strategy, then press **Run synthetic test**. Try **Run all 16 comparisons** for the whole matrix.

To run it offline, download this repository and open `index.html` in a modern browser.

## Important limitations

This is a **deterministic educational model**, not a test of n8n itself. It **does not** connect to customer systems or prove that any workflow is reliable.

The `HTTP 503 · nothing committed` scenario explicitly assumes no write happened. **A real HTTP 503 or timeout is not proof of non-delivery or non-commit.** Real integrations need destination-side guarantees, careful idempotency, authoritative reconciliation, and a human path for ambiguous outcomes.

No feature here verifies that a remote service actually enforces an idempotency key. A key sent by the client alone does not guarantee protection.

## Feedback — help us make the model more accurate

**[Open the feedback form](https://github.com/snowbirdkind-wq/noruvale-retry-lab/issues/new?template=feedback.md)** (GitHub account required). We especially want to hear from automation builders who have hit an ambiguous timeout or replay.

Useful feedback is specific: **Which of the four synthetic scenarios is closest? What did the simulator miss? Which failure would you want to reproduce?**

Please share *only a minimal, synthetic reproduction*. Never post real API keys, customer data, private workflow exports, or identifying log excerpts.

Useful questions: Which workflow tool? What happened? Which side effect was at risk? What did you expect? Would a synthetic test fixture have helped you find it sooner?

## Local test

With Node.js installed:

```bash
node tests/test_simulator.js
```

The demo itself requires only a modern browser; Node.js is for tests, not the app.

## License and attribution

MIT (see [LICENSE](./LICENSE)). AI-assisted development was used. The tool is not affiliated with n8n.

The MIT license applies to this free demo; any future commercial product would be developed and licensed separately. No commercial offering is included here.