// Test convolver buffer generation time
const sampleRate = 48000;
const E = [
  { sec: 0.18, decay: 3.5, lp: 0.5 },
  { sec: 1.1, decay: 2.6, lp: 0.25 },
  { sec: 3.4, decay: 2.0, lp: 0.12 }
];

const start = performance.now();
for (const h of E) {
  const F = Math.floor(sampleRate * h.sec);
  const arrL = new Float32Array(F);
  const arrR = new Float32Array(F);
  for (let P = 0; P < 2; P++) {
    const X = P === 0 ? arrL : arrR;
    let hVal = 0;
    const lp = h.lp;
    const decay = h.decay;
    for (let H = 0; H < F; H++) {
      const g = Math.random() * 2 - 1;
      hVal += lp * (g - hVal);
      X[H] = hVal * Math.pow(1 - H / F, decay);
    }
  }
}
const elapsed = performance.now() - start;
console.log(`Audio reverb buffer generation: ${elapsed.toFixed(2)} ms`);
