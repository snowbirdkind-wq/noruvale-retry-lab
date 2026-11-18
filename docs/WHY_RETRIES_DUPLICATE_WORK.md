# When HTTP retries duplicate work: four cases to test

*An educational guide to ambiguous outcomes in automation. No real production systems were tested for this document.*

A common mistake in workflow automation is treating **"the client did not receive a success response"** as **"the server did not complete the action."** These are different facts.

Suppose your workflow calls a service to create an order. The server commits the order, but the response is lost. Your workflow sees a timeout and repeats the request. If the destination does not deduplicate that logical operation, you may create two orders.

## Four controlled failure cases

| Case | First attempt | What goes wrong if you retry? | What to verify |
| --- | --- | --- | --- |
| Response lost after commit | The server writes; the client times out | A blind retry may write again | Is there server-enforced idempotency and a way to reconcile the outcome? |
| 503 before commit (controlled fixture) | The test destination *guarantees* no write | A retry can be safe **under that fixture's assumption** | Does your real provider make any such guarantee? A 503 alone is not proof. |
| Lookup lag | The server writes; a subsequent read temporarily shows nothing | A “not found” check can cause a duplicate write | Is the lookup authoritative and read-after-write consistent? |
| Concurrent workers | Two workers attempt the same operation at once | Both may pass a preflight lookup and write | Is uniqueness or idempotency enforced **atomically** at the destination? |

## What a stable idempotency key can and cannot do

1. Generate a unique logical operation ID (such as an order ID), not a random new key per retry.
2. Reuse that same ID for every retry of the same logical operation.
3. Confirm that the destination **actually enforces** this key atomically and documents the retention period, conflict behavior, and body-mismatch handling.
4. Test what happens after the destination commits but the acknowledgement is lost.
5. Define an escalation path if the outcome remains unknown. Sometimes the correct next action is **review**, not resend.

**Important:** Sending an `Idempotency-Key` header does *not* automatically make an arbitrary API idempotent. The receiving service must implement and honor the guarantee.

## Try it without touching a real API

Use the free [Noruvale Retry Lab demo](https://snowbirdkind-wq.github.io/noruvale-retry-lab/):

1. Choose **Write succeeds · response lost** and **Blind retry**. Run the synthetic test: the model produces two writes.
2. Switch to **Stable idempotency key**. In the model, the destination recognizes the second request and preserves one write.
3. Choose **Write succeeds · lookup lags** and **Lookup then retry**. A stale read makes the retry unsafe.
4. Choose **Two workers · same operation** and compare the strategies.
5. Run **all 16 comparisons** and download a local Markdown report if useful.

These outputs are **deterministic teaching scenarios**, not measured probabilities or evidence that a real n8n workflow is safe. We deliberately do not execute a live workflow, contact a provider, or test production systems.

## Would this catch your bug?

Maybe, if the bug is about retry assumptions. It will not detect arbitrary workflow logic errors, API-provider-specific semantics, delayed webhooks, network partitions, malformed customer data, or concurrency bugs outside the four modeled cases.

If you know of a missing retry edge case, please [submit a synthetic example](https://github.com/snowbirdkind-wq/noruvale-retry-lab/issues/new?template=feedback.md). Never upload API keys, private exports, customer data, or real incident logs.

---

*Free/open-source educational material. AI-assisted development and writing; please verify provider-specific behavior against its official documentation before changing production workflows.*
