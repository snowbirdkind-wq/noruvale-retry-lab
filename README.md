# Noruvale Retry Lab

> A free, browser-based **synthetic experiment** showing why API retries can accidentally duplicate work — and why some prevention techniques depend on the destination system.

**Status:** Free research demo (v0.4.1). Not a production monitoring or security tool.

## What you can try

- Four controlled scenarios: response lost after a write, confirmed non-writing 503 fixture, stale lookup, and two concurrent workers.
- Four retry strategies: blind retry, destination-enforced idempotency key, lookup-first, and hold for review.
- A 4 × 4 comparison matrix and a local Markdown report export.
- Everything runs in your browser. No accounts, API keys, real messages, real workflow executions, cookies, analytics or external requests are built into the demo.

## Demo

After enabling GitHub Pages from the `main` branch root, visit the published site. Alternatively, download this repository and open `index.html` locally.

## Important limitations

This is a **deterministic educational model**, not a test of n8n itself. It **does not** connect to customer systems or prove that any workflow is reliable.

The `HTTP 503 · nothing committed` scenario explicitly assumes no write happened. **A real HTTP 503 or timeout is not proof of non-delivery or non-commit.** Real integrations need destination-side guarantees, careful idempotency, authoritative reconciliation, and a human path for ambiguous outcomes.

No feature here verifies that a remote service actually enforces an idempotency key. A key sent by the client alone does not guarantee protection.

## Feedback

Please share *only a minimal, synthetic reproduction* of a retry edge case via GitHub Issues in this repository. Never post real API keys, customer data, private workflow exports, or identifying log excerpts.

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