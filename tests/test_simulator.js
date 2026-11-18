const assert=require('node:assert/strict');
const m=require('../simulator.js');
const cases={lost_ack:{blind:2,key:1,lookup:1,review:1},error_503:{blind:1,key:1,lookup:1,review:1},stale_lookup:{blind:2,key:1,lookup:2,review:1},race:{blind:2,key:1,lookup:2,review:1}};
for(const [s,strategies] of Object.entries(cases)) for(const [t,count] of Object.entries(strategies)){
 const r=m.simulate(s,t);assert.equal(r.records,count,`${s}/${t}`);assert.equal(r.duplicates,Math.max(0,count-1));assert.ok(r.requests>=1);assert.ok(r.timeline.length>0);assert.ok(m.markdown(r).includes('Synthetic'));
}
assert.equal(m.suite().length,16); assert.throws(()=>m.simulate('bad','key'));
console.log('PASS: 16 deterministic scenario/strategy combinations, markdown export, invalid input');