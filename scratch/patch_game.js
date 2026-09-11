const fs = require('fs');
const path = require('path');

// 1. Read game.js
let gameJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'games', 'echo-abyss', 'game.js'), 'utf8');

// Optimize Z4 to precompute lenSq
gameJs = gameJs.replace(
  /'ay':w\(n3,n5,n9\),'bx':w\(n2,n4,nZ\),'by':w\(n3,n5,nZ\),'mat':n0,'lit':0x0,'bounce':0x0\}/,
  "'ay':w(n3,n5,n9),'bx':w(n2,n4,nZ),'by':w(n3,n5,nZ),'mat':n0,'lit':0x0,'bounce':0x0,'lenSq':(w(n2,n4,nZ)-w(n2,n4,n9))**2+(w(n3,n5,nZ)-w(n3,n5,n9))**2||1}"
);

// Optimize ZL to reuse object
const optimizedZL = `const _reusableZL={'d':0,'px':0,'py':0};function ZL(qD,qf,n0){const n1=qD['bx']-qD['ax'],n2=qD['by']-qD['ay'],n3=qD['lenSq']||(n1*n1+n2*n2||0x1);let n4=((qf-qD['ax'])*n1+(n0-qD['ay'])*n2)/n3;n4=n4<0?0:n4>1?1:n4;const n5=qD['ax']+n1*n4,n6=qD['ay']+n2*n4,dx=qf-n5,dy=n0-n6;_reusableZL['d']=Math['hypot'](dx,dy),_reusableZL['px']=n5,_reusableZL['py']=n6;return _reusableZL;}`;
gameJs = gameJs.replace(/function ZL\(qD,qf,n0\)\{[\s\S]*?return\{'d':Math\['hypot'\]\(qf-n5,n0-n6\),'px':n5,'py':n6\};?\}/, optimizedZL);

// Optimize Z3 and Zz to eliminate all allocations and use query stamp
const optimizedZ3andZz = `let _eaQueryStamp=0;const _eaQueryArr=[];function Z3(qD,qf,n0){_eaQueryArr['length']=0;const qId=++_eaQueryStamp,minGY=Math['floor']((qf-n0)/v),maxGY=Math['floor']((qf+n0)/v),minGX=Math['floor']((qD-n0)/v),maxGX=Math['floor']((qD+n0)/v);for(let gy=minGY;gy<=maxGY;gy++){for(let gx=minGX;gx<=maxGX;gx++){const bk=h['hash']['get'](Z1(gx,gy));if(!bk)continue;for(let i=0;i<bk['length'];i++){const sg=bk[i];if(sg['_qs']===qId)continue;sg['_qs']=qId,_eaQueryArr['push'](sg);}}}return _eaQueryArr;}function Zz(qD,qf,n0){let minDistSq=n0*n0;const qId=++_eaQueryStamp,minGY=Math['floor']((qf-n0)/v),maxGY=Math['floor']((qf+n0)/v),minGX=Math['floor']((qD-n0)/v),maxGX=Math['floor']((qD+n0)/v);for(let gy=minGY;gy<=maxGY;gy++){for(let gx=minGX;gx<=maxGX;gx++){const bk=h['hash']['get'](Z1(gx,gy));if(!bk)continue;for(let i=0;i<bk['length'];i++){const sg=bk[i];if(sg['dead']||sg['_qs']===qId)continue;sg['_qs']=qId;const ax=sg['ax'],ay=sg['ay'],bx=sg['bx'],by=sg['by'],abx=bx-ax,aby=by-ay,lenSq=sg['lenSq']||(abx*abx+aby*aby||1);let t=((qD-ax)*abx+(qf-ay)*aby)/lenSq;t=t<0?0:t>1?1:t;const dx=qD-(ax+abx*t),dy=qf-(ay+aby*t),dSq=dx*dx+dy*dy;if(dSq<minDistSq)minDistSq=dSq;}}}return Math['sqrt'](minDistSq);}`;

gameJs = gameJs.replace(/function Z3\(qD,qf,n0\)\{[\s\S]*?return n1;\}function Zz\(qD,qf,n0\)\{[\s\S]*?return n1;\}/, optimizedZ3andZz);

fs.writeFileSync(path.join(__dirname, '..', 'public', 'games', 'echo-abyss', 'game.js'), gameJs, 'utf8');
console.log('Successfully optimized public/games/echo-abyss/game.js');
