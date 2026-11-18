---
name: Synthetic retry scenario feedback
about: Report a missing edge case or inaccurate model behavior (synthetic examples only)
title: "[Feedback] "
labels: []
assignees: []
---

Thanks for trying Noruvale Retry Lab!

**Do not include API keys, customer data, private n8n exports, production logs, or personal information.** Please use made-up names and values.

### Which scenario did you try?
- [ ] Write committed but response lost
- [ ] HTTP 503 without a write (fixture assumption)
- [ ] Stale lookup after write
- [ ] Concurrent workers
- [ ] Other synthetic case

### Which retry strategy?
- [ ] Blind retry
- [ ] Stable idempotency key enforced by destination
- [ ] Lookup before retry
- [ ] Hold ambiguous result for review

### What outcome did you expect?

<!-- Explain in plain language; use only synthetic inputs. -->

### What actually happened in the demo?

### What real-world edge case does the model fail to represent?

<!-- General behavior only. No confidential details. -->

### Would you use a synthetic retry test in your workflow-building process? Why or why not?

### Any documentation link that supports your observation? (optional)
