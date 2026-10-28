// Original voxel models and animation; no third-party images, logos or models.
export const milkSite={x:0,z:-19.5,r:10.3};
export const nvidiaSite={x:36,z:-34};
export function reservedPartySpace(x,z,pad=0){return (Math.abs(x)<16&&z<-24)||Math.hypot(x-milkSite.x,z-milkSite.z)<milkSite.r+pad||(Math.abs(x-nvidiaSite.x)<13+pad&&Math.abs(z-nvidiaSite.z)<9+pad)}
export function createParty(THREE,world,{group,box,voxelBox,oval,segment,sign},policySigns,badge){
 const tau=Math.PI*2,cows=[],glows=[];
 const plaza=group(world,milkSite.x,-25.2,milkSite.z);
 const floor=new THREE.Mesh(new THREE.CylinderGeometry(10.3,10.3,.25,48),new THREE.MeshStandardMaterial({color:'#303547',roughness:.6}));plaza.add(floor);const plinth=new THREE.Mesh(new THREE.CylinderGeometry(10,10.3,2.4,32),new THREE.MeshStandardMaterial({color:'#263b46',roughness:.7}));plinth.position.y=-1.3;plaza.add(plinth);
 for(let i=0;i<64;i++){const a=i/64*tau;box(plaza,Math.sin(a)*10.2,.18,Math.cos(a)*10.2,.32,.12,.32,i%2?'#ffbfe5':'#b4ffed',1.2)}
 for(let i=0;i<3;i++){
  const root=group(plaza),body=group(root),white='#fffdf4',black='#202435',pink='#ffc0cc',accent=['#ff9dcf','#9deeff','#dbb2ff'][i];root.scale.setScalar(2.15);
  oval(body,0,2.05,0,.73,1.02,.52,white,.14);
  for(const [x,y,z,w,h,d]of[[-.35,2.35,.47,.46,.51,.13],[.37,1.89,.49,.36,.43,.12],[.22,2.65,-.46,.56,.43,.13],[-.41,1.72,-.45,.34,.36,.12]])voxelBox(body,x,y,z,w,h,d,black,.12);
  const head=group(body,0,3.34,.07);voxelBox(head,0,0,0,1.19,1.02,.91,white,.12);voxelBox(head,-.37,.23,.45,.43,.48,.06,black,.10);
  voxelBox(head,0,-.29,.57,1.04,.47,.47,pink,.11);
  for(const s of[-1,1]){
   const ear=group(head,s*.72,.25,0);ear.rotation.z=s*.28;voxelBox(ear,0,0,0,.48,.28,.23,white,.1);box(ear,0,0,.13,.31,.12,.04,pink);
   segment(head,[s*.4,.5,-.07],[s*.5,.79,-.06],.16,.18,'#f2dba6');box(head,s*.49,.84,-.06,.10,.13,.12,'#fff1d0');
   box(head,s*.25,.12,.48,.25,.25,.05,'#fff');box(head,s*.25,.12,.52,.13,.19,.035,black);box(head,s*.25-.03,.17,.55,.052,.055,.018,'#fff');
   box(head,s*.31,-.26,.82,.11,.075,.03,'#9f536e');box(head,s*.4,-.39,.81,.12,.045,.03,'#f095b5');
  }
  box(head,0,-.48,.82,.29,.052,.025,'#934759');box(head,0,-.51,.82,.19,.03,.025,'#fffdf4');
  // Two horns, large ears, black patches and a broad pink muzzle keep every view bovine.
  const arms=[];for(const s of[-1,1]){const arm=group(body,s*.64,2.63,0);segment(arm,[0,0,0],[s*.39,-.48,.04],.25,.29,white);segment(arm,[s*.39,-.48,.04],[s*.58,-.75,.12],.23,.26,white);voxelBox(arm,s*.61,-.81,.13,.29,.28,.29,black,.1);arms.push(arm)}
  const legs=[];for(const s of[-1,1]){const leg=group(body,s*.3,1.23,0);segment(leg,[0,0,0],[0,-.55,.02],.30,.33,white);const knee=group(leg,0,-.55,.02);segment(knee,[0,0,0],[0,-.48,.01],.26,.29,white);const foot=group(knee,0,-.51,.09);voxelBox(foot,0,-.04,.03,.32,.22,.46,black,.1);box(foot,0,.045,.19,.25,.055,.12,accent);legs.push({leg,knee,foot})}
  const skirt=group(body,0,1.61,0);for(let j=0;j<12;j++){const a=j/12*tau,p=group(skirt,Math.sin(a)*.71,0,Math.cos(a)*.59);p.rotation.y=a;p.rotation.x=-.16;box(p,0,0,0,.39,.13,.43,accent,.12)}
  box(body,0,2.91,.52,.49,.16,.12,accent);box(body,0,2.89,.61,.12,.2,.08,'#fff4d4');
  const tail=group(body,0,1.94,-.51);segment(tail,[0,0,0],[.12,-.72,-.3],.10,.10,white);voxelBox(tail,.12,-.8,-.3,.22,.29,.22,black,.1);
  cows.push({root,body,head,arms,legs,tail,phase:i*tau/3});
 }
 const milkSigns=[];for(const facing of[0,Math.PI]){const frame=group(plaza,0,0,0);frame.rotation.y=facing;const s=sign(frame,0,1.7,10.4,9.5,2.7,'生生有鮮奶','每週1瓶鮮奶或豆漿 · 點看官方資料','#c7ffde');s.userData.landmark='milk';policySigns.push(s);milkSigns.push(s)}
 // An imagined campus, deliberately labelled as a concept rather than a completed replica.
 const hq=group(world,nvidiaSite.x,-27.8,nvidiaSite.z);
 box(hq,0,.15,0,26,.3,18,'#2d3e3e');
 for(const side of[-1,1]){
  const wing=group(hq,side*6.1,0,0);box(wing,0,4.6,0,10.8,8.6,13.3,'#15372c');
  for(let y=1;y<8.8;y+=1.15){box(wing,0,y,6.69,10.8,.09,.08,'#b5ff86',.9);for(let x=-5;x<=5;x+=.8)box(wing,x,y+.42,6.69,.06,.78,.09,'#47766b')}
  for(let z=-6;z<6.5;z+=.8)box(wing,side*5.44,4.7,z,.08,7.8,.08,'#69a892',.3);
  const vertices=[[-5.8,9,-7],[5.8,9,-7],[side*1.4,14,1],[5.8,9,-7],[5.8,9,7],[side*1.4,14,1],[5.8,9,7],[-5.8,9,7],[side*1.4,14,1],[-5.8,9,7],[-5.8,9,-7],[side*1.4,14,1]];
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices.flat(),3));geo.computeVertexNormals();wing.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:'#b6d1c5',metalness:.55,roughness:.38,side:THREE.DoubleSide})));
  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:'#a5ff38',toneMapped:false}));wing.add(edges);
  for(let i=0;i<8;i++)box(wing,side*(4.7-i*.45),9+i*.55,5-i*.58,.25,.15,.25,'#b1ff4d',2);
 }
 box(hq,0,3.6,2,3.3,6.8,5.5,'#b2c4ba');box(hq,0,7.1,2,4.1,.3,6.2,'#9fff3f',1.5);
 for(const side of[-1,1])for(let i=0;i<5;i++){box(hq,side*(2.6+i*2.15),.43,8,.8,.5,.8,'#568b47');box(hq,side*(2.6+i*2.15),1.05,8,.9,.8,.9,'#a7d45c')}
 for(const facing of[0,Math.PI]){const frame=group(hq);frame.rotation.y=facing;const s=sign(frame,0,10.6,7.1,19,4.2,'NVIDIA 台北總部','北士科 · 粉絲概念示意','#b7ff45');s.userData.landmark='nvidia';policySigns.push(s)}
 // Soft luminous outlines retain the readable text at the centre of each billboard.
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=256;const ctx=glowCanvas.getContext('2d');ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.shadowColor='#fff';ctx.shadowBlur=22;ctx.strokeRect(30,30,196,196);ctx.strokeRect(30,30,196,196);const map=new THREE.CanvasTexture(glowCanvas);
 for(const s of policySigns){const p=s.geometry.parameters,m=new THREE.MeshBasicMaterial({map,color:s.userData.landmark==='nvidia'?'#a4ff38':'#7ceaff',transparent:true,opacity:.03,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,side:THREE.DoubleSide});const halo=new THREE.Mesh(new THREE.PlaneGeometry(p.width*1.28,p.height*1.28),m);halo.position.z=.035;halo.raycast=()=>{};s.add(halo);glows.push(halo)}
 const bc=document.createElement('canvas');bc.width=bc.height=256;const bctx=bc.getContext('2d'),gradient=bctx.createRadialGradient(128,128,63,128,128,127);gradient.addColorStop(0,'#ff6e7b00');gradient.addColorStop(.32,'#fff5e9cc');gradient.addColorStop(.5,'#ff354dc0');gradient.addColorStop(1,'#ff354d00');bctx.fillStyle=gradient;bctx.fillRect(0,0,256,256);
 const badgeGlow=new THREE.Mesh(new THREE.PlaneGeometry(1.68,1.68),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(bc),transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));badgeGlow.position.z=.003;badge.add(badgeGlow);
 const state={cows:3,cowMode:'圍圈跳舞',cowSpin:0,signGlow:0,badgeGlow:0};
 let previousTime=0,spin=0;
 function update(t,mix,encoreTime){spin+=Math.max(0,t-previousTime)*mix*1.65;previousTime=t;
  const beat=encoreTime*128/60,pulse=.5+.5*Math.cos(beat*tau),orbit=t*.15;
  for(const c of cows){const a=c.phase+orbit;c.root.position.set(Math.sin(a)*5.95,.10+mix*.13+Math.max(0,Math.sin(t*3+c.phase))*.12*(1-mix),Math.cos(a)*5.95);c.root.rotation.y=a+Math.PI+spin;c.body.rotation.z=Math.sin(t*2+c.phase)*.055*(1-mix);c.head.rotation.z=Math.sin(t*1.7+c.phase)*.08;c.tail.rotation.x=Math.sin(t*4+c.phase)*.3;
   c.arms.forEach((arm,j)=>arm.rotation.z=(j?1:-1)*(-.15+mix*1.95+Math.sin(t*2+c.phase)*.08));
   c.legs.forEach(({leg,knee,foot},j)=>{leg.rotation.z=j?mix*-.77:mix*.06;leg.rotation.x=j?mix*-.4:0;knee.rotation.x=j?mix*1.25:0;foot.rotation.x=mix*.65;});
  }
  glows.forEach((g,i)=>g.material.opacity=.035+mix*(.43+pulse*.36+Math.sin(i)*.03));policySigns.forEach((s,i)=>s.material.color.setScalar(1+Math.sin(t*.8+i)*.045+mix*(.26+pulse*.55)));
  badge.material.color.setScalar(1+mix*(.55+pulse*.95));badgeGlow.material.opacity=mix*(.58+pulse*.4);
  state.cowMode=mix>.5?'踮腳芭蕾旋轉':'圍圈跳舞';state.cowSpin=cows[0].root.rotation.y;state.signGlow=glows[0].material.opacity;state.badgeGlow=badgeGlow.material.opacity;
 }
 update(0,0,0);return {update,state};
}
