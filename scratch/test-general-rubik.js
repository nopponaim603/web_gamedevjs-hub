/**
 * Test generalized Rubik's Cube planar math for N = 2, 3, 4, 5, 6
 */

function testOrder(N) {
  console.log(`\n=== Testing Order N = ${N} ===`);
  const FACES = ['U','D','F','B','L','R'];
  const AXES3 = ['X','Y','Z'];
  const axisToFace = { X:{pos:'R',neg:'L'}, Y:{pos:'U',neg:'D'}, Z:{pos:'F',neg:'B'} };
  const bundleAngleDeg = { X:30, Y:270, Z:150 };
  const CENTER_DIST = 150;
  const Rc3 = CENTER_DIST / Math.sqrt(3);

  const R_min = 105 + (6 - N) * 6;
  const R_max = 205;
  const RADII = N === 1 ? [160] : Array.from({length: N}, (_, i) => R_min + i * (R_max - R_min) / (N - 1));

  function bundleCenter(axis){
    const th = bundleAngleDeg[axis] * Math.PI/180;
    return [Rc3*Math.cos(th), Rc3*Math.sin(th)];
  }
  const bundleCenters = {};
  AXES3.forEach(a => bundleCenters[a] = bundleCenter(a));

  function circleIntersect(c1, r1, c2, r2){
    const [x1,y1] = c1, [x2,y2] = c2;
    const dx = x2-x1, dy = y2-y1;
    const d = Math.hypot(dx,dy);
    if(d > r1+r2 || d < Math.abs(r1-r2) || d===0) return null;
    const a = (d*d + r1*r1 - r2*r2) / (2*d);
    const h = Math.sqrt(Math.max(0, r1*r1 - a*a));
    const xm = x1 + a*dx/d, ym = y1 + a*dy/d;
    const rx = -dy/d, ry = dx/d;
    return [[xm+h*rx, ym+h*ry], [xm-h*rx, ym-h*ry]];
  }

  // Count intersections
  let totalIntersections = 0;
  const pairs = [['X','Y'], ['Y','Z'], ['Z','X']];
  pairs.forEach(([a1, a2]) => {
    for (let r1 of RADII) {
      for (let r2 of RADII) {
        const pts = circleIntersect(bundleCenters[a1], r1, bundleCenters[a2], r2);
        if (pts) totalIntersections += pts.length;
      }
    }
  });

  const expectedFacelets = 6 * N * N;
  console.log(`Total circles: 3 x ${N} = ${3*N}`);
  console.log(`Total intersection points: ${totalIntersections}`);
  console.log(`Expected facelets (6 * ${N}^2): ${expectedFacelets}`);
  console.log(`Match: ${totalIntersections === expectedFacelets ? '✅ SUCCESS' : '❌ FAILED'}`);
}

[2, 3, 4, 5, 6].forEach(testOrder);
