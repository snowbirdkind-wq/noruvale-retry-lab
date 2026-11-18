/* Noruvale Retry Lab v0.4: deterministic synthetic model, no live n8n */
(function (root, make) { const api=make(); if (typeof module === 'object' && module.exports) module.exports=api; root.NoruvaleSim=api; })(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const scenarios = {
    lost_ack: { label: 'Write succeeds · response lost', short: 'Committed / no ACK', description: 'The destination commits one record, but the response is lost. The client cannot tell whether the write happened.' },
    error_503: { label: 'HTTP 503 · nothing committed', short: 'Rejected / 503', description: 'The first request is rejected before any write. The client receives a known 503 response.' },
    stale_lookup: { label: 'Write succeeds · lookup lags', short: 'Committed / stale read', description: 'The destination commits, the response times out, and a lookup temporarily shows no record.' },
    race: { label: 'Two workers · same operation', short: 'Concurrent workers', description: 'Two workers both try the same logical action before either can observe the other\'s write.' }
  };
  const strategies = {
    blind: { label: 'Blind retry', description: 'Repeat on timeout/error without deduplicating the operation.' },
    key: { label: 'Stable idempotency key', description: 'The destination atomically recognizes repeated calls with the same operation key.' },
    lookup: { label: 'Lookup then retry', description: 'Check the destination before retrying. A delayed or concurrent lookup may be misleading.' },
    review: { label: 'Hold ambiguous result', description: 'Do not resend when the outcome is unknown; queue for a trusted check or human review.' }
  };
  function simulate(scenario, strategy) {
    if (!(scenario in scenarios) || !(strategy in strategies)) throw new Error('Unknown scenario or strategy');
    const timeline=[]; let records=0, requests=0, unknown=false, blocked=false, resolved='Confirmed';
    function log(tag, text, tone='neutral') { timeline.push({tag,text,tone}); }
    function send(label, options={}) {
      requests++;
      if (options.dedupe && records>0) { log('API', label + ': same operation key → original record returned', 'success'); return; }
      records++; log('API', label + ': destination committed synthetic record #' + records, 'success');
    }
    if (scenario==='lost_ack' || scenario==='stale_lookup') {
      log('CLIENT','POST operation=demo-order-001'); send('Attempt 1');
      log('NETWORK','Response not received (timeout). Outcome is UNKNOWN.', 'warn'); unknown=true;
      if (strategy==='key') { log('CLIENT','Retry with the SAME stable idempotency key.'); send('Attempt 2',{dedupe:true}); unknown=false; }
      if (strategy==='blind') { log('CLIENT','Retry immediately without a stable key.'); send('Attempt 2'); unknown=false; }
      if (strategy==='lookup') {
        if (scenario==='stale_lookup') { log('LOOKUP','Stale view says “not found” even though a write exists.', 'warn'); log('CLIENT','Unsafe inference: retry after a negative lookup.'); send('Attempt 2'); }
        else { log('LOOKUP','Authoritative view confirms the original record.', 'success'); log('CLIENT','Do not resend.'); }
        unknown=false;
      }
      if (strategy==='review') { log('CLIENT','Leave outcome UNKNOWN; stop automatic retry.', 'warn'); log('REVIEW','Escalate until the destination confirms the outcome.'); blocked=true;resolved='Unresolved / review'; }
    } else if (scenario==='error_503') {
      requests++; log('CLIENT','POST operation=demo-order-001'); log('API','HTTP 503 returned; simulated destination rejected BEFORE writing.', 'warn');
      log('CLIENT','Known no-write response in this fixture: a retry is safe.'); send('Attempt 2');
    } else if (scenario==='race') {
      log('WORKER A','Starts operation demo-order-001.'); log('WORKER B','Starts the same logical operation.');
      if (strategy==='key') { send('Worker A'); send('Worker B',{dedupe:true}); log('RULE','Destination-enforced atomic key makes the second call a replay.', 'success'); }
      else if (strategy==='review') { send('Worker A'); log('LOCK','Second worker holds for single-flight review rather than writing.', 'warn'); blocked=true;resolved='Held / review'; }
      else if (strategy==='lookup') { log('LOOKUP','Both workers see no existing record before either commits.', 'warn'); send('Worker A'); send('Worker B'); }
      else { send('Worker A'); send('Worker B'); }
    }
    const duplicates=Math.max(0,records-1);
    return {scenario,strategy,scenarioLabel:scenarios[scenario].label,strategyLabel:strategies[strategy].label,requests,records,duplicates,review:blocked,status:duplicates>0?'DUPLICATE':blocked?'REQUIRES REVIEW':'NO DUPLICATE',timeline,disclaimer:'Synthetic model only. Does not run n8n or verify any external system.'};
  }
  function suite(){ return Object.keys(scenarios).flatMap(s=>Object.keys(strategies).map(k=>simulate(s,k))); }
  function markdown(r){ const lines=[`# Noruvale Retry Lab — Synthetic Test Report`,'',`Scenario: ${r.scenarioLabel}`,`Strategy: ${r.strategyLabel}`,`Result: ${r.status}`,'',`Requests: ${r.requests}`,`Simulated writes: ${r.records}`,`Duplicate writes: ${r.duplicates}`,`Held for review: ${r.review?'yes':'no'}`,'','## Timeline','']; r.timeline.forEach((e,i)=>lines.push(`${i+1}. [${e.tag}] ${e.text}`)); lines.push('','## Limitations','This is a deterministic model with synthetic operations. No n8n instance, real API, messages, payments or client data was executed or verified.','For production, confirm the destination actually enforces idempotency; a client-side header alone is insufficient.');return lines.join('\n'); }
  return {scenarios,strategies,simulate,suite,markdown};
});