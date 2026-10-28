import * as THREE from './assets/three.module.min.js';
import {createLowPolyKit} from './lowpoly.js?v=20261028-12';
const art=createLowPolyKit(THREE);
import {createCharacterPortraits} from './portraits.js?v=20261028-12';
const portraits=createCharacterPortraits(THREE,art);
import {createCinematic} from './cinematic.js?v=20261028-12';
import {createParty,reservedPartySpace} from './party.js?v=20261028-12';
import {createMayorFlight} from './flight.js?v=20261028-12';
import {createFlightWatch} from './watch.js?v=20261028-12';
import {policyTexture} from './billboards.js?v=20261028-12';
const $=s=>document.querySelector(s),host=$('#scene');
const scene=new THREE.Scene();scene.background=new THREE.Color('#09051d');scene.fog=new THREE.FogExp2('#100725',.009);
const camera=new THREE.PerspectiveCamera(46,1,.2,260);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;renderer.info.autoReset=false;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.append(renderer.domElement);
const hemisphere=new THREE.HemisphereLight(0x9b91f9,0x1d1c49,1.6);scene.add(hemisphere);const key=new THREE.DirectionalLight(0xffd5a8,3.4);key.position.set(-25,28,35);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-37,right:37,top:46,bottom:-43,near:.5,far:150});key.shadow.normalBias=.05;key.shadow.bias=-.0003;scene.add(key);const rim=new THREE.DirectionalLight(0xff37ba,3.5);rim.position.set(18,12,-24);scene.add(rim);const fill=new THREE.DirectionalLight(0x36e6ff,2.6);fill.position.set(-24,3,8);scene.add(fill);
const portraitFill=new THREE.DirectionalLight('#fff2df',1.25);portraitFill.position.set(4,12,45);scene.add(portraitFill);
const world=new THREE.Group();scene.add(world);
const geometry=art.architecture,mats=new Map(),batches=new Map();
const solidGeometries={block:geometry,soft:art.soft,oval:art.oval};
function mat(color,glow=0){const key=color+glow;if(!mats.has(key))mats.set(key,new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:glow,roughness:.78,metalness:.025,flatShading:true,vertexColors:true}));return mats.get(key)}
function solid(parent,x,y,z,w,h,d,color,glow=0,kind='block'){if(!batches.has(parent))batches.set(parent,new Map());const map=batches.get(parent),m=mat(color,glow),key=kind+':'+m.uuid;if(!map.has(key))map.set(key,{m,kind,parts:[]});map.get(key).parts.push([x,y,z,w,h,d])}
function box(parent,x,y,z,w,h,d,color,glow=0){solid(parent,x,y,z,w,h,d,color,glow)}
function group(parent,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g}
function flush(){const t=new THREE.Object3D();for(const[parent,map]of batches)for(const {m,kind,parts:a}of map.values()){const mesh=new THREE.InstancedMesh(solidGeometries[kind],m,a.length);a.forEach((p,i)=>{t.position.set(p[0],p[1],p[2]);t.scale.set(p[3],p[4],p[5]);t.updateMatrix();mesh.setMatrixAt(i,t.matrix)});mesh.instanceMatrix.needsUpdate=true;mesh.receiveShadow=true;let root=parent;while(root&&!chars.includes(root))root=root.parent;mesh.castShadow=!!root;parent.add(mesh)}batches.clear()}
let seed=318;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
const neon=['#ff28b8','#19dfff','#a85cff','#d7ff48','#ff9d31','#4a70ff'];
// A luminous, stepped Taipei 101, with every face wrapped in pixel light.
const tower=group(world);tower.scale.y=1.15;tower.position.y=4.2;host.dataset.towerHeightScale='1.15';box(tower,0,-24,0,13,5,11,'#112e49');
for(let i=0;i<8;i++){const y=-20+i*4.05,w=11-i*.52,d=9.8-i*.43;box(tower,0,y,0,w,3.85,d,'#173952');box(tower,0,y-1.80,0,w-.18,.19,d-.18,'#354e68');for(const sx of[-1,1])for(const sz of[-1,1])box(tower,sx*(w/2-.11),y,sz*(d/2-.11),.20,3.65,.20,'#6694a4');box(tower,0,y+1.9,0,w+1.05,.3,d+1.05,'#26b6d3',.9);box(tower,0,y+1.58,0,w+.6,.15,d+.6,i%2?'#de42d9':'#53dcff',1.9);for(const z of[-1,1])for(let c=-4;c<=4;c++){box(tower,c*w/10,y,z*(d/2+.03),.085,3.2,.075,'#58cfe8',.7);for(let r=-1;r<=1;r++)if(rand()>.28)box(tower,c*w/10+.22,y+r*.85,z*(d/2+.07),.16,.38,.055,neon[(i+c+12)%6],1.2)}for(const x of[-1,1])for(let c=-3;c<=3;c++)box(tower,x*(w/2+.03),y,c*d/8,.075,3.2,.09,'#22bad3',.65);for(const x of[-1,1])for(const z of[-1,1])box(tower,x*(w/2+.22),y+1.55,z*(d/2+.22),.6,.9,.6,'#54d6ec',.7)}
box(tower,0,13.4,0,5.7,4.2,5,'#1a4265');box(tower,0,15.7,0,6.4,.3,5.8,'#c857f6',1.2);box(tower,0,17.1,0,3.1,2.5,2.7,'#38759a');box(tower,0,18.45,0,3.6,.2,3.2,'#47e1f9',1.3);box(tower,0,20.2,0,1.3,3.3,1.3,'#3683a1');box(tower,0,23.4,0,.28,4,.28,'#e3d5ff',2);box(tower,0,25.6,0,.55,.55,.55,'#ff48c8',3);
function screenTexture(title,subtitle,color,bg='#110621'){const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,256);ctx.strokeStyle=color;ctx.lineWidth=7;ctx.strokeRect(10,10,492,236);ctx.globalAlpha=.16;for(let y=15;y<250;y+=7){ctx.fillStyle=color;ctx.fillRect(14,y,484,1)}ctx.globalAlpha=1;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=14;ctx.font='900 79px Arial';ctx.fillText(title,256,105,466);ctx.font='600 26px Arial';ctx.fillText(subtitle,256,191,460);const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx}
const signs=[];function sign(parent,x,y,z,w,h,title,sub,color,rot=0){const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:screenTexture(title,sub,color),side:THREE.DoubleSide}));mesh.position.set(x,y,z);mesh.rotation.y=rot;parent.add(mesh);signs.push(mesh);box(parent,x,y,z-.11,w+.3,h+.3,.18,'#1d1338');return mesh}
// Compact rooftop identifiers. No large concert platform: all three giants grip the building itself.
sign(tower,0,13.4,2.54,4.8,2.4,'101','TAIPEI','#bafffb');
// Shared faceted solids give the characters sculpted silhouettes and clean planar lighting.
const chars=[],gestureHands=[];
const palette={skin:['#efbc93'],hair:['#282032'],shirt:['#f1edff'],fur:['#584236'],tan:['#847265'],scale:['#324e4d'],belly:['#65786b']};
function shade(colors){return Array.isArray(colors)?colors[Math.floor(rand()*colors.length)]:colors}
function voxelBox(parent,x,y,z,w,h,d,colors,step=.145){solid(parent,x,y,z,w,h,d,shade(colors),0,'soft')}
function oval(parent,x,y,z,rx,ry,rz,colors,step=.15){solid(parent,x,y,z,rx*2,ry*2,rz*2,shade(colors),0,'oval')}
function segment(parent,a,b,width,depth,colors){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),g=group(parent);g.position.copy(va).add(vb).multiplyScalar(.5);g.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vb.clone().sub(va).normalize());voxelBox(g,0,0,0,width,va.distanceTo(vb)+.08,depth,colors);return g}
function fist(parent,p,thick,colors){voxelBox(parent,...p,thick*1.15,thick,thick*1.2,colors,.12);for(let i=0;i<4;i++)box(parent,p[0]+(i-1.5)*thick*.24,p[1]+thick*.1,p[2]+thick*.64,thick*.21,thick*.5,thick*.22,shade(colors));box(parent,p[0]+thick*.6,p[1]-.12,p[2]+thick*.25,thick*.3,thick*.55,thick*.52,shade(colors))}
function arm(parent,shoulder,elbow,hand,colors,skin,thick=.43,rock=false){const g=group(parent);segment(g,shoulder,elbow,thick,thick*1.1,colors);segment(g,elbow,hand,thick*.92,thick,colors);if(rock){const opened=group(g),rocking=group(g);openHand(opened,hand,thick*1.12,skin,colors===palette.scale);rockHand(rocking,hand,thick*1.12,skin,colors===palette.scale);rocking.visible=false;gestureHands.push({opened,rocking})}else fist(g,hand,thick,skin);return g}
// Short, padded voxel fingers with stepped tips keep all five digits readable.
function cartoonFinger(parent,a,b,width,depth,colors,tipColor){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),g=group(parent),length=start.distanceTo(end);g.position.copy(start).add(end).multiplyScalar(.5);g.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());voxelBox(g,0,0,0,width,length+width*.24,depth,colors);if(tipColor)voxelBox(g,0,length*.33,depth*.12,width*.66,width*.39,depth*.75,tipColor)}
function openHand(parent,p,size,colors,claws=false){voxelBox(parent,p[0],p[1],p[2],size,size*.82,size*.49,colors,.085);const lengths=[.82,1.08,1.18,.91];for(let i=0;i<4;i++){const x=(i-1.5)*size*.255,spread=(i-1.5)*size*.08,h=(lengths[i]+.12)*size*.5,a=[p[0]+x,p[1]+size*.28,p[2]],b=[p[0]+x+spread,p[1]+size*.28+h,p[2]-.01];cartoonFinger(parent,a,b,size*.245,size*.27,colors,claws?'#e3ead1':null)}cartoonFinger(parent,[p[0]-size*.42,p[1]-size*.13,p[2]],[p[0]-size*.68,p[1]+size*.165,p[2]+size*.03],size*.28,size*.28,colors);}
function rockHand(parent,p,size,colors,claws=false){voxelBox(parent,p[0],p[1],p[2],size,size*.78,size*.62,colors,.09);for(const side of[-1,1]){const x=p[0]+side*size*.36,h=size*(side<0?.44:.365);cartoonFinger(parent,[x,p[1]+size*.35,p[2]-.02],[x,p[1]+size*.35+h,p[2]-.02],size*.27,size*.28,colors,claws?'#e3ead1':null)}
for(const side of[-1,1])box(parent,p[0]+side*size*.13,p[1]+size*.12,p[2]+size*.35,size*.25,size*.29,size*.24,shade(colors));segment(parent,[p[0]-size*.46,p[1]-.13,p[2]+size*.28],[p[0]+size*.14,p[1]-.06,p[2]+size*.45],size*.2,size*.2,colors)}
host.dataset.handStyle='短圓低多邊形手掌';host.dataset.artStyle='成熟人物・巨獸原型';
const heroUniforms={heroTime:{value:0},heroFlight:{value:0}};
function heroBadge(){const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#ef3032';ctx.beginPath();ctx.arc(256,256,247,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fffdf9';ctx.beginPath();ctx.arc(256,256,214,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ef3032';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 390px Arial,sans-serif';ctx.fillText('5',256,282);const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return new THREE.Mesh(new THREE.PlaneGeometry(1.12,1.12),new THREE.MeshBasicMaterial({map:tx,transparent:true}))}
function flyingCape(parent){const geo=new THREE.PlaneGeometry(1,1,10,14),pos=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<pos.count;i++){const u=uv.getX(i),v=1-uv.getY(i);pos.setXYZ(i,(u-.5)*(1.28+v*1.7)-v*.22,2.98-v*3.15,-.48-v*.26-Math.sin(u*Math.PI)*v*.13)}geo.computeVertexNormals();const m=new THREE.MeshStandardMaterial({color:'#e92c43',emissive:'#b91533',emissiveIntensity:.12,roughness:.7,side:THREE.DoubleSide,flatShading:true});m.onBeforeCompile=shader=>{Object.assign(shader.uniforms,heroUniforms);shader.vertexShader='uniform float heroTime; uniform float heroFlight;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`vec3 transformed=vec3(position);float trailing=1.0-uv.y;transformed.y-=heroFlight*trailing*.9;transformed.z-=heroFlight*sin(trailing*3.14159)*.28;transformed.x+=sin(heroTime*2.2+trailing*5.5)*.22*trailing;transformed.z+=sin(heroTime*3.4+trailing*8.0+uv.x*5.0)*.34*pow(trailing,1.2);transformed.y+=sin(heroTime*2.7+uv.x*6.0)*.15*trailing;`)};m.customProgramCacheKey=()=> 'flowing-hero-cape-v2';const mesh=new THREE.Mesh(geo,m);mesh.frustumCulled=false;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function mayor(){const g=group(world,0,-7.8,10.2);g.scale.setScalar(5);const blue=['#176cdb'],red=['#e72f46'];art.mesh(g,art.torso,0,2.18,0,1.42,1.65,.78,'#176cdb');voxelBox(g,0,1.39,0,1.16,.18,.78,['#f4c74a'],.085);box(g,0,1.39,.43,.29,.18,.1,'#ffde70');voxelBox(g,0,1.18,0,1.04,.3,.7,red,.1);const badge=heroBadge();badge.position.set(0,2.25,.415);g.add(badge);g.badge=badge;flyingCape(g);for(const side of[-1,1])box(g,side*.45,2.98,-.12,.29,.13,.65,'#f04751');
const head=group(g,0,3.69,0);portraits.mayor(head);
// Tailored layers, faceted shoulders, collar and boot cuffs stay on the animated rig.
for(const side of[-1,1]){
 art.mesh(g,art.soft,side*.52,2.80,.02,.40,.43,.76,'#207be4',[0,0,-side*.20]);
 art.polygon(g,[[side*.12,2.99],[side*.48,2.99],[side*.54,2.79],[side*.30,2.82]],.36,.045,'#ef4350');
 voxelBox(g,side*.46,2.01,.345,.075,.73,.065,'#3589e7');
}
voxelBox(g,0,2.98,.02,.52,.16,.55,'#f4c875');
const idleLegs=group(g);segment(idleLegs,[-.31,1.18,0],[-.41,.48,.04],.43,.52,blue);segment(idleLegs,[-.41,.48,.04],[-.5,-.26,.13],.45,.54,red);voxelBox(idleLegs,-.5,-.29,.31,.52,.25,.86,red,.1);segment(idleLegs,[.31,1.18,0],[.48,.78,.37],.44,.52,blue);segment(idleLegs,[.48,.78,.37],[.67,.38,.72],.45,.55,red);voxelBox(idleLegs,.7,.32,.91,.52,.25,.75,red,.1);
for(const [x,y,z] of[[-.5,-.34,.32],[.7,.27,.91]])voxelBox(idleLegs,x,y,z,.55,.095,.87,'#9c2442');
const hold=arm(g,[.74,2.77,0],[1.12,2.63,.3],[1.00,3.12,.61],blue,palette.skin,.4,true);const cheer=group(g,-.7,2.85,0);arm(cheer,[0,0,0],[-.10,.9,.04],[-.16,1.86,.08],blue,palette.skin,.43,true);box(cheer,-.16,1.59,.08,.44,.14,.46,'#ef354a');const flightLimbs=group(g);flightLimbs.visible=false;
// One straight leading arm, one tucked arm, extended legs and pointed boots.
arm(flightLimbs,[-.70,2.85,0],[-.59,3.90,.01],[-.49,4.98,.02],blue,palette.skin,.43);box(flightLimbs,-.49,4.68,.02,.44,.16,.48,'#ef354a');
arm(flightLimbs,[.70,2.77,0],[.94,2.03,-.11],[.83,1.45,-.08],blue,palette.skin,.40);
for(const side of[-1,1]){const hip=side*.31,knee=side*.34,ankle=side*.39,offset=side>0?.12:0;segment(flightLimbs,[hip,1.18,0],[knee,.22+offset,-.04],.43,.51,blue);segment(flightLimbs,[knee,.22+offset,-.04],[ankle,-.72+offset,-.09],.44,.52,red);voxelBox(flightLimbs,ankle,-.86+offset,-.07,.46,.36,.58,red,.09);voxelBox(flightLimbs,ankle,-1.01+offset,-.07,.48,.08,.61,'#a92945');}
g.rotation.z=-.07;g.rotation.x=-.06;g.userData={name:'蔣萬安',message:'ROCK ON！披上紅斗篷，朝台北的夜空飛起來！',base:-7.8,head,cheer,hold,idleLegs,flightLimbs,kind:'mayor'};return g}
function kong(){const g=group(world,-10,1.5,-.3);g.scale.setScalar(4.15);art.mesh(g,art.torso,0,2.1,0,2.38,2.65,1.60,'#584236');art.mesh(g,art.torso,0,2.12,.69,1.60,1.95,.32,'#786454');for(const s of[-1,1])oval(g,s*.39,2.54,.75,.43,.32,.18,'#806b59');for(const s of[-1,1])oval(g,s*.82,2.8,0,.5,.65,.63,palette.fur,.14);
const head=group(g,0,3.65,.1);portraits.kong(head);
voxelBox(g,0,2.94,.93,.66,.25,.17,['#f42e67','#e52d58'],.10);art.polygon(g,[[-.19,2.78],[.19,2.78],[.26,2.06],[0,1.86],[-.26,2.06]],.91,.14,'#dd3654');box(g,0,2.35,1.05,.18,.21,.04,'#ffdc4d');
segment(g,[-.6,1.2,0],[-.8,.58,.12],.78,.82,palette.fur);fist(g,[-.8,.22,.4],.78,palette.tan);segment(g,[.65,1.23,0],[1.26,1.35,.18],.72,.8,palette.fur);segment(g,[1.26,1.35,.18],[1.49,.97,.5],.64,.68,palette.fur);fist(g,[1.53,.87,.64],.65,palette.tan);
const hold=arm(g,[1.02,2.9,0],[1.55,3.43,-.18],[2.02,3.55,-.25],palette.fur,palette.tan,.73);for(let i=0;i<4;i++)box(hold,2.22,3.35+i*.17,-.48,.37,.14,.26,shade(palette.tan));const cheer=group(g,-1.1,2.85,.05);arm(cheer,[0,0,0],[-.72,-.25,.45],[-.12,-.6,1.03],palette.fur,palette.tan,.82,true);for(const side of[-1,1])for(let j=0;j<5;j++){art.mesh(head,art.crystal,side*(.66+j*.04),-.03-j*.15,.35,.30,.52,.48,j%2?'#4d392f':'#65503e',[0,0,side*.35+Math.PI]);art.mesh(g,art.crystal,side*(.94+j*.025),2.92-j*.16,.13,.42,.65,.64,j%2?'#4c382e':'#65503e',[.1,0,side*.35+Math.PI]);}
g.userData={name:'大金剛',message:'吼吼！左上攀樓、捶胸應援！整座台北一起歡呼！',base:1.5,head,cheer,hold,kind:'kong'};return g}
function spine(parent,x,y,z,w,h,d){art.mesh(parent,art.dorsal,x,y+h*.20,z,w*1.45,h*1.4,d*1.7,'#8bb7b5',[.16,0,0],.20)}
function godzilla(){const g=group(world,10.2,-20.5,.5);g.scale.setScalar(4.9);oval(g,0,2,0,.96,1.47,.86,palette.scale,.145);oval(g,0,1.9,.79,.65,1.12,.22,palette.belly,.13);for(let i=0;i<7;i++)voxelBox(g,0,1.18+i*.25,.91,.98-Math.abs(i-3)*.08,.20,.24,i%2?'#77867a':'#65776b');
const head=group(g,0,3.8,0);portraits.godzilla(head);
for(let side of[-1,1])for(let row=0;row<7;row++)for(let col=0;col<2;col++)art.mesh(g,art.soft,side*(.74+col*.1),1.25+row*.26,.45-col*.22,.20,.21,.11,'#49625a',[0,0,.35]);
const tail=group(g,0,1.3,-.5);for(let i=0;i<10;i++){const s=1.16-i*.095,z=-i*.5;segment(tail,[i*i*.035,-i*.075,z+.26],[(i+1)*(i+1)*.035,-(i+1)*.075,z-.33],s,s,palette.scale);spine(tail,i*i*.035,.48-i*.065,z,.34,.55,.4)}for(let i=0;i<6;i++){spine(g,0,1.35+i*.54,-.92,.38,.68,.63);for(const s of[-1,1])spine(g,s*.48,1.3+i*.46,-.7,.22,.42,.45)}
for(const x of[-.65,.65]){oval(g,x,.68,.12,.51,.68,.55,palette.scale,.14);voxelBox(g,x,.1,.61,.95,.4,1.52,palette.scale,.13);for(const dx of[-.28,0,.28]){box(g,x+dx,.1,1.4,.17,.23,.3,'#eff8c9');box(g,x+dx,.05,1.59,.12,.12,.13,'#fff7dd')}}
const hold=arm(g,[-.95,2.85,.3],[-1.15,3.3,.7],[-1.32,3.15,.84],palette.scale,palette.belly,.47);for(const x of[-1.5,-1.28,-1.06])box(hold,x,3.22,1.16,.12,.27,.23,'#fff7db');const cheer=group(g,.9,2.9,.3);arm(cheer,[0,0,0],[.45,.27,.45],[.65,.94,.55],palette.scale,palette.belly,.45,true);g.rotation.y=-.14;g.userData={name:'哥吉拉',message:'嘎嗷——！右下抱緊 101，和滿城人群一起吶喊！',base:-20.5,head,cheer,hold,tail,kind:'godzilla'};return g}
chars.push(mayor(),kong(),godzilla());
// Preserve the established city layout when portrait geometry consumes a different amount of randomness.
seed=989701977;
for(const c of chars){const gripY=c.userData.kind==='kong'?3.55:c.userData.kind==='godzilla'?3.15:0,raise=.15*(c.position.y+28+gripY*c.scale.y);c.position.y+=raise;c.userData.base+=raise}
// Articulate each complete head from the neck; the tower-gripping arms stay anchored.
for(const c of chars){const u=c.userData,pivot=group(c,u.head.position.x,u.head.position.y-.45,u.head.position.z);u.head.position.set(0,.45,0);pivot.add(u.head);u.neck=pivot}

// Times-Square-like imaginary Taipei: a dense electric city, no third-party logos or ads.
const billboardDefs=[
 {x:-24,y:-6,z:-10,w:13,h:10,title:'AI黃金世紀',metric:'300公頃構想',note:'松機遷移仍待中央支持',status:'未來願景 · 非已完成',story:'ai-city',color:'#fb66d6'},
 {x:24,y:-4,z:-14,w:13,h:10,title:'AI教育',metric:'四年規劃92億',note:'AI教育中心 × 高中實驗室',status:'政策規劃 · 非已全數執行',story:'ai-education',color:'#65edff'},
 {x:-36.5,y:-13,z:9,w:11,h:9,title:'敬老新生活',metric:'2027擴大通路',note:'超商・超市・藥局・農會',status:'已宣布 · 預定2027年',story:'senior-next',color:'#e0ff63'},
 {x:42,y:-14,z:7,w:11,h:8,title:'1,200月票',metric:'四市一起行',note:'基隆 × 臺北 × 新北 × 桃園',status:'已推動 · 四市合作',story:'transit',color:'#ffbd70'},
 {x:-32,y:-18,z:24,w:9,h:6,title:'敬老卡',metric:'每月600點',note:'照顧每一個年紀',status:'已實施 · 敬老福利',story:'senior',color:'#bca0ff'},
 {x:43,y:-18,z:26,w:10,h:6,title:'臺北大巨蛋',metric:'2023啟用',note:'運動與文化的城市舞台',status:'任內成果 · 已啟用',story:'dome',color:'#ff81ca'},
 {x:-17,y:-1,z:-35,w:12,h:8,title:'AI教育',metric:'投資下一代',note:'四年92億元規劃',status:'政策規劃',story:'ai-education',color:'#83e5ff'},
 {x:16,y:1,z:-35,w:12,h:8,title:'臺北AI園區',metric:'城市新想像',note:'300公頃整體規劃構想',status:'未來願景 · 非已完成',story:'ai-city',color:'#de9aff'}
];
const domeSite={x:-20,z:7,rx:10.8,rz:8.1};function insideDome(x,z,pad=0){return ((x-domeSite.x)/(domeSite.rx+pad))**2+((z-domeSite.z)/(domeSite.rz+pad))**2<1}
const tmcSite={x:25,z:2};function insideTmc(x,z,pad=0){return Math.abs(x-tmcSite.x)<10.6+pad&&Math.abs(z-tmcSite.z)<7+pad}
const rooftops=[];
const city=group(world,0,-28,0);box(city,0,-.7,0,160,1,150,'#10142b');
for(let x=-58;x<=58;x+=8)for(let z=-52;z<=34;z+=8){if(reservedPartySpace(x,z,3)||(x>-30&&x<-9&&z>14)||(x>14&&x<39&&z>10)||insideDome(x,z,3)||insideTmc(x,z,3)||(Math.abs(x)<16&&Math.abs(z)<17)||(Math.abs(x)<18&&z>-4&&z<34)||billboardDefs.some(a=>Math.abs(x-a.x)<a.w/2+3&&Math.abs(z-(a.z-3))<6))continue;const h=4+rand()*14,w=3+rand()*2.5,d=3+rand()*2.5;const color=['#17263c','#292142','#232d4b','#253044'][Math.floor(rand()*4)],light=neon[Math.floor(rand()*6)];rooftops.push({x,z,w,d,h});box(city,x,h/2,z,w,h,d,color);box(city,x,.28,z,w+.45,.56,d+.45,'#45516b');box(city,x,h-.32,z,w+.18,.32,d+.18,'#4a536d');box(city,x,h+.1,z,w+.2,.16,d+.2,light,1.05);for(const sx of[-1,1]){box(city,x+sx*w*.47,h*.5,z+d/2+.08,.11,h-.7,.12,'#52647c');box(city,x+sx*w*.26,.97,z+d/2+.08,w*.32,1.05,.10,'#162d43');box(city,x+sx*w*.26,.97,z+d/2+.15,w*.23,.8,.055,'#efd2a2',.45);}box(city,x,1.70,z+d/2+.15,w+.25,.12,.38,light,.32);for(const dx of[-w/2,w/2])box(city,x+dx,h/2,z+d/2+.04,.08,h,.08,light,.8);for(let y=1;y<h-.5;y+=1.3)for(const dx of[-w*.3,0,w*.3])if(rand()>.2)box(city,x+dx,y,z+d/2+.04,.36,.57,.06,rand()>.45?light:'#ffd689',1.1);for(let y=1;y<h-.5;y+=1.5)for(const dz of[-d*.25,d*.25])if(rand()>.3)box(city,x+w/2+.03,y,z+dz,.07,.65,.4,light,.9)}
for(let x=-55;x<58;x+=8){box(city,x+3.5,-.12,-2,.12,.03,104,'#e648bf',1.6);box(city,x+4.2,-.1,-2,.1,.03,104,'#32dfff',1.6)}for(let z=-47;z<=33;z+=8)box(city,0,-.08,z+3.6,120,.03,.12,'#596bff',1.1);
// Policy headlines become real facade screens. Every screen opens its cited city story.
const policySigns=[];
for(const [index,a] of billboardDefs.entries()){
 const roof=a.y+a.h/2+.6,depth=6,buildingH=roof+28,centerZ=a.z-depth/2-.1;
 box(world,a.x,-28+buildingH/2,centerZ,a.w+.7,buildingH,depth,'#1d1b37');box(world,a.x,roof,centerZ,a.w+1,.16,depth+.4,a.color,.7);
 const texture=policyTexture(THREE,a,index);
 for(const facing of[1,-1]){
  const faceZ=centerZ+facing*(depth/2+.15);
  for(const side of[-1,1])box(world,a.x+side*(a.w/2+.2),-28+buildingH/2,faceZ,.13,buildingH,.12,a.color,1.3);
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(a.w,a.h),new THREE.MeshBasicMaterial({map:texture}));screen.position.set(a.x,a.y,faceZ+.01*facing);screen.rotation.y=facing===1?0:Math.PI;screen.userData.story=a.story;screen.userData.facade=facing===1?'front':'rear';world.add(screen);policySigns.push(screen);
 }
 rooftops.push({x:a.x,z:centerZ,w:a.w-.5,d:depth-.5,h:roof+28});
}
host.dataset.policyFacades='16';host.dataset.rearPolicyFacades='8';

// A handcrafted, silver oval Taipei Dome beside the 101 in this imaginary fan city.
const dome=group(world,domeSite.x,-27.9,domeSite.z);
const domeBase=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.26,48),new THREE.MeshStandardMaterial({color:'#5a647b',roughness:.75}));domeBase.scale.set(10.4,1,7.6);domeBase.position.y=.13;domeBase.receiveShadow=true;dome.add(domeBase);
const domeVertices=[],domeColors=[];function domePoint(r,a){const q=r/7*Math.PI/2;return [Math.sin(q)*9.8*Math.cos(a),1.8+3.35*Math.cos(q),Math.sin(q)*7.1*Math.sin(a)]}
for(let r=0;r<7;r++)for(let j=0;j<40;j++){const a=j/40*Math.PI*2,b=(j+1)/40*Math.PI*2,pts=[domePoint(r,a),domePoint(r+1,a),domePoint(r+1,b),domePoint(r,a),domePoint(r+1,b),domePoint(r,b)];const shade=new THREE.Color(['#cbd9e1','#dbe5e9','#bacbd5','#cfdee5'][(j+r*3)%4]);for(const point of pts){domeVertices.push(...point);domeColors.push(shade.r,shade.g,shade.b)}}
const domeRoofGeo=new THREE.BufferGeometry();domeRoofGeo.setAttribute('position',new THREE.Float32BufferAttribute(domeVertices,3));domeRoofGeo.setAttribute('color',new THREE.Float32BufferAttribute(domeColors,3));domeRoofGeo.computeVertexNormals();const domeRoof=new THREE.Mesh(domeRoofGeo,new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true,side:THREE.DoubleSide,metalness:.3,roughness:.58}));domeRoof.receiveShadow=true;dome.add(domeRoof);
for(let i=0;i<104;i++){const a=i/104*Math.PI*2,x=Math.cos(a)*9.55,z=Math.sin(a)*6.95;box(dome,x,1,z,.64,1.7,.64,i%4===0?'#e1e9e9':'#253b54');if(i%4!==0)box(dome,x,1.1,z,.57,1.12,.57,'#f5bf6f',.65);box(dome,x,1.89,z,.64,.12,.64,'#8df2ff',1.15)}
for(let z=-5.6;z<=5.7;z+=1.4){const points=[],maxX=9.8*Math.sqrt(1-(z/7.1)**2);for(let i=0;i<=32;i++){const x=-maxX+i/32*2*maxX,q=(x/9.8)**2+(z/7.1)**2;points.push(new THREE.Vector3(x,1.84+3.35*Math.sqrt(Math.max(0,1-q)),z))}const rib=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#718fa5',transparent:true,opacity:.65}));dome.add(rib)}
const domeName=sign(dome,0,1.25,7.58,11.4,1.8,'臺北大巨蛋','TAIPEI DOME','#baf7ff');const domeLabel=document.createElement('canvas');domeLabel.width=1024;domeLabel.height=160;const domeCtx=domeLabel.getContext('2d');domeCtx.fillStyle='#10283f';domeCtx.fillRect(0,0,1024,160);domeCtx.strokeStyle='#7deafa';domeCtx.lineWidth=8;domeCtx.strokeRect(5,5,1014,150);domeCtx.fillStyle='#e4fbff';domeCtx.textAlign='center';domeCtx.textBaseline='middle';domeCtx.font='800 74px Arial,"PingFang TC",sans-serif';domeCtx.fillText('臺北大巨蛋  TAIPEI DOME',512,84,975);const domeLabelMap=new THREE.CanvasTexture(domeLabel);domeLabelMap.colorSpace=THREE.SRGBColorSpace;domeName.material.map.dispose();domeName.material.map=domeLabelMap;domeName.userData.story='dome';policySigns.push(domeName);
for(const side of[-1,1]){box(dome,side*7,1.02,5.5,2.3,1.9,1.2,'#d9e3e5');for(let i=0;i<3;i++)box(dome,side*7+(i-1)*.6,.98,6.14,.42,1.45,.08,'#f6c877',.7)}host.dataset.landmark='101 + Taipei Dome';

// Taipei Music Center: an original faceted shell, folded metal panels and a lit foyer.
// This is a compressed imaginary city composition, not a geographic map or a policy claim.
const tmc=group(world,tmcSite.x,-27.9,tmcSite.z);
box(tmc,0,.12,0,21.4,.24,14.2,'#414c63');
box(tmc,0,1.45,0,17.7,2.7,10.3,'#152d42');
for(let x=-8.4;x<8.5;x+=.7){box(tmc,x,1.5,5.2,.5,2.3,.09,'#eab174',.52);box(tmc,x,1.5,5.29,.07,2.65,.11,'#96b9c7')}
for(let z=-4.8;z<5;z+=.7){box(tmc,8.88,1.45,z,.08,2.2,.5,'#386177',.16);box(tmc,8.94,1.45,z,.09,2.5,.055,'#9ebdc6')}
const shellRows=[
 [[-9,2.4,-5.6],[-5,4.1,-6.2],[-1,5.2,-6.4],[3,4.7,-6.1],[7,3.8,-5.7],[9.8,2.5,-4.8]],
 [[-9.7,3.8,-2.7],[-6,6.3,-3],[-2,8.6,-3],[2.2,7.2,-2.8],[6.6,6.1,-2.4],[10.1,3.4,-2]],
 [[-10.3,3.2,.8],[-6.3,5.7,.5],[-2,7.2,.7],[2.3,8.1,.6],[6.7,5.4,1],[10,3.3,1.4]],
 [[-9.7,2.65,5],[-5.7,3.7,5.8],[-1.8,4.7,6],[2.4,3.55,6.1],[6.7,4.1,5.6],[9.6,2.5,4.8]]
];
const shellVertices=[],shellColors=[],shellPalette=['#9daeb4','#b9c8ca','#d4dedc','#8ea4af','#c1d2d2'];let panelIndex=0;
function shellTriangle(a,b,c){const color=new THREE.Color(shellPalette[panelIndex++%shellPalette.length]);for(const v of[a,b,c]){shellVertices.push(...v);shellColors.push(color.r,color.g,color.b)}}
for(let r=0;r<3;r++)for(let c=0;c<5;c++){const a=shellRows[r][c],b=shellRows[r][c+1],d=shellRows[r+1][c],e=shellRows[r+1][c+1];if((r+c)%2){shellTriangle(a,b,d);shellTriangle(b,e,d)}else{shellTriangle(a,b,e);shellTriangle(a,e,d)}}
const shellGeo=new THREE.BufferGeometry();shellGeo.setAttribute('position',new THREE.Float32BufferAttribute(shellVertices,3));shellGeo.setAttribute('color',new THREE.Float32BufferAttribute(shellColors,3));shellGeo.computeVertexNormals();
const shell=new THREE.Mesh(shellGeo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.48,metalness:.38,side:THREE.DoubleSide,flatShading:true,emissive:'#27445b',emissiveIntensity:.18}));tmc.add(shell);
const seams=new THREE.LineSegments(new THREE.WireframeGeometry(shellGeo),new THREE.LineBasicMaterial({color:'#527585',transparent:true,opacity:.75}));tmc.add(seams);
// Small stepped blocks stitch the outer rim into the surrounding voxel city.
for(const row of[shellRows[0],shellRows[3]])for(let i=0;i<row.length-1;i++){const a=new THREE.Vector3(...row[i]),b=new THREE.Vector3(...row[i+1]),steps=Math.ceil(a.distanceTo(b)/.3);for(let k=0;k<=steps;k++){const v=a.clone().lerp(b,k/steps);box(tmc,v.x,v.y+.035,v.z,.31,.12,.23,'#bcf1ed',.5)}}
for(let i=0;i<4;i++)box(tmc,0,.15+i*.12,6.75-i*.27,16.4-i*.4,.18,.55,'#71828e');
box(tmc,0,2.7,5.3,18,.10,.12,'#65ffe1',1.2);
const tmcName=sign(tmc,0,4.2,6.24,11.5,1.55,'北流 TMC','臺北流行音樂中心','#a5ffe6');const tmcLabel=document.createElement('canvas');tmcLabel.width=1024;tmcLabel.height=160;const tmcCtx=tmcLabel.getContext('2d');tmcCtx.fillStyle='#112e37';tmcCtx.fillRect(0,0,1024,160);tmcCtx.strokeStyle='#a5ffe6';tmcCtx.lineWidth=7;tmcCtx.strokeRect(5,5,1014,150);tmcCtx.fillStyle='#e8fff7';tmcCtx.font='900 115px Arial,"PingFang TC",sans-serif';tmcCtx.textAlign='center';tmcCtx.textBaseline='middle';tmcCtx.fillText('北流 TMC',512,85,960);const tmcMap=new THREE.CanvasTexture(tmcLabel);tmcMap.colorSpace=THREE.SRGBColorSpace;tmcName.material.map.dispose();tmcName.material.map=tmcMap;tmcName.userData.landmark='tmc';policySigns.push(tmcName);
const equalizer=group(tmc,9.7,1.5,3.1);equalizer.rotation.y=.32;
for(let i=0;i<9;i++)box(equalizer,(i-4)*.22,0,0,.12,.35+Math.sin(i*.8)**2*1.4,.12,neon[i%6],1.2);
host.dataset.landmark='101 + Taipei Dome + Taipei Music Center';

// The forecourt and connected streets are packed with original miniature voxel fans.
// A shared GPU animation drives all waves and jumps, avoiding per-person work each frame.
const crowdUniforms={crowdTime:{value:0},crowdBoost:{value:0},encoreAmount:{value:0},crowdBeat:{value:0},stadiumAmount:{value:0}},crowdParts=[],glowParts=[];let crowdCount=0;
function fanPart(parts,p,s,color,phase,pivot=[0,0,0],swing=0,rotation=0,waveRadius=0){parts.push({p,s,color,phase,pivot,swing,rotation,waveRadius})}
function fan(x,z,y=-27.8){const waveRadius=Math.hypot(x,z),s=.78+rand()*.27,phase=rand()*Math.PI*2,shirt=neon[Math.floor(rand()*neon.length)],skin=shade(['#f1c8a3','#cf966d','#996341','#e9b58c']),hair=shade(['#241c35','#5d352c','#d5ab69']);crowdCount++;const part=(px,py,pz,w,h,d,c)=>fanPart(crowdParts,[x+px*s,y+py*s,z+pz*s],[w*s,h*s,d*s],c,phase,[0,0,0],0,0,waveRadius);
part(0,.78,0,.44,.57,.28,shirt);part(0,1.24,0,.34,.34,.32,skin);part(0,1.43,-.01,.38,.12,.35,hair);part(-.09,1.48,-.02,.20,.13,.30,hair);part(.07,1.48,-.025,.18,.11,.29,hair);part(0,1.30,-.16,.35,.25,.06,hair);for(const side of[-1,1]){part(side*.12,.32,0,.16,.4,.2,'#353650');part(side*.12,.09,.055,.18,.12,.3,'#eee6fa');part(side*.075,1.26,.165,.075,.065,.018,'#fff3df');part(side*.075,1.26,.18,.038,.047,.016,'#302239');}
part(0,1.15,.17,.095,.045,.025,'#f08b9c');for(const side of[-1,1]){const pivot=[x+side*.23*s,y+1.0*s,z],angle=side*(.35+rand()*.45),len=.63*s,dx=-Math.sin(angle)*len,dy=Math.cos(angle)*len,hand=[pivot[0]+dx,pivot[1]+dy,z];fanPart(crowdParts,[pivot[0]+dx/2,pivot[1]+dy/2,z],[.13*s,len,.14*s],shirt,phase,pivot,side,angle,waveRadius);fanPart(crowdParts,hand,[.17*s,.18*s,.17*s],skin,phase,pivot,side,angle,waveRadius);if(rand()>.42){const stickLen=.41*s;fanPart(glowParts,[hand[0]-Math.sin(angle)*stickLen/2,hand[1]+Math.cos(angle)*stickLen/2,z],[.075*s,stickLen,.075*s],neon[Math.floor(rand()*6)],phase,pivot,side,angle,waveRadius)}}}
for(let z=6.8;z<32;z+=1.03)for(let x=z>14?-28:-15.3;x<16;x+=.92)if(rand()>.10&&!insideDome(x,z,.4)&&!insideTmc(x,z,.5)&&!billboardDefs.some(a=>Math.abs(x-a.x)<a.w/2+.5&&z>a.z-7&&z<a.z+.8))fan(x+(rand()-.5)*.24,z+(rand()-.5)*.23);
for(let x=-54;x<55;x+=8)for(let z=-39;z<32;z+=1.25){if(Math.abs(x)<18&&z>-7)continue;if(rand()>.12&&!reservedPartySpace(x,z,.8)&&!insideDome(x,z,.6)&&!insideTmc(x,z,.6)&&!billboardDefs.some(a=>Math.abs(x-a.x)<a.w/2+.5&&z>a.z-7&&z<a.z+.8))fan(x+(rand()-.5)*.85,z+(rand()-.5)*.22)}
for(let i=0;i<94;i++){const a=i/94*Math.PI*2,x=domeSite.x+Math.cos(a)*11.7,z=domeSite.z+Math.sin(a)*8.95;if(!billboardDefs.some(b=>Math.abs(x-b.x)<b.w/2+.5&&z>b.z-7&&z<b.z+.8))fan(x,z)}
for(let z=10.5;z<22;z+=1.05)for(let x=17;x<36;x+=.95)if(rand()>.1)fan(x,z);
const streetCrowdCount=crowdCount;
for(const r of rooftops){for(let dx=-r.w/2+.65;dx<r.w/2-.4;dx+=1.05)for(let dz=-r.d/2+.65;dz<r.d/2-.4;dz+=1.05)if(rand()>.08)fan(r.x+dx+(rand()-.5)*.15,r.z+dz+(rand()-.5)*.15,-28+r.h+.28)}
host.dataset.rooftopCrowd=String(crowdCount-streetCrowdCount);
function crowdMesh(parts,glow=false){const geo=(glow?new THREE.BoxGeometry(1,1,1):art.profile([[-.5,.84,.88],[.5,1,1]],.19)),material=glow?new THREE.MeshBasicMaterial({color:0xffffff}):new THREE.MeshStandardMaterial({color:0xffffff,roughness:.85,flatShading:true,vertexColors:true,emissive:'#292b3c',emissiveIntensity:.08});const pivot=new Float32Array(parts.length*3),phase=new Float32Array(parts.length),swing=new Float32Array(parts.length),waveRadius=new Float32Array(parts.length),restAngle=new Float32Array(parts.length),mesh=new THREE.InstancedMesh(geo,material,parts.length),o=new THREE.Object3D();parts.forEach((a,i)=>{o.position.set(...a.p);o.scale.set(...a.s);o.rotation.set(0,0,a.rotation);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);mesh.setColorAt(i,new THREE.Color(a.color).multiplyScalar(glow?2.5:1));pivot.set(a.pivot,i*3);phase[i]=a.phase;swing[i]=a.swing;waveRadius[i]=a.waveRadius;restAngle[i]=a.rotation});geo.setAttribute('crowdPivot',new THREE.InstancedBufferAttribute(pivot,3));geo.setAttribute('crowdPhase',new THREE.InstancedBufferAttribute(phase,1));geo.setAttribute('crowdSwing',new THREE.InstancedBufferAttribute(swing,1));geo.setAttribute('crowdRadius',new THREE.InstancedBufferAttribute(waveRadius,1));geo.setAttribute('crowdRestAngle',new THREE.InstancedBufferAttribute(restAngle,1));
material.onBeforeCompile=shader=>{Object.assign(shader.uniforms,crowdUniforms);shader.vertexShader='uniform float crowdTime; uniform float crowdBoost; uniform float encoreAmount; uniform float crowdBeat; uniform float stadiumAmount; attribute float crowdRadius; attribute float crowdRestAngle; attribute vec3 crowdPivot; attribute float crowdPhase; attribute float crowdSwing;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`vec4 mvPosition=vec4(transformed,1.0);
#ifdef USE_INSTANCING
mvPosition=instanceMatrix*mvPosition;
#endif
float idleWave=sin(crowdTime*(2.6+crowdBoost*1.8)+crowdPhase)*(.30+crowdBoost*.18);
float danceWave=.22+sin(crowdBeat*6.283185+crowdPhase*.12)*.58;
// Every part of a spectator shares its radius: hands, body and glow stick travel together.
float stadiumCrest=pow(max(0.0,sin(crowdTime*2.1-crowdRadius*.23)),3.0);
float stadiumWave=-crowdSwing*(2.15-2.02*stadiumCrest)-crowdRestAngle;
float wave=mix(mix(idleWave,danceWave,encoreAmount)*crowdSwing,stadiumWave,stadiumAmount);
vec2 offset=mvPosition.xy-crowdPivot.xy;
mvPosition.xy=crowdPivot.xy+mat2(cos(wave),sin(wave),-sin(wave),cos(wave))*offset;
float idleHop=max(0.0,sin(crowdTime*3.4+crowdPhase))*(.12+crowdBoost*.15);
float jumpPhase=fract(crowdBeat+sin(crowdPhase)*.035);
float airborne=clamp(jumpPhase/.80,0.0,1.0);
float accent=mod(floor(crowdBeat),4.0)<1.0?1.20:1.0;
float jump=4.0*airborne*(1.0-airborne)*(1.25+.25*sin(crowdPhase))*accent;
float stadiumHop=stadiumCrest*(1.35+encoreAmount*.45)+jump*encoreAmount*.2;
mvPosition.y+=mix(mix(idleHop,jump,encoreAmount),stadiumHop,stadiumAmount);
mvPosition=modelViewMatrix*mvPosition;
gl_Position=projectionMatrix*mvPosition;`)};material.customProgramCacheKey=()=>glow?'crowd-glow-v5':'crowd-body-v5';mesh.frustumCulled=false;world.add(mesh);return mesh}
crowdMesh(crowdParts);crowdMesh(glowParts,true);host.dataset.crowdCount=String(crowdCount);
// Neon ribbons frame the crowd-filled pedestrian forecourt.
for(const x of[-16.5,16.5])box(city,x,0,19.5,.16,.08,26,'#f454d8',1.1);

// Pixel stars, orbit rings, and light shafts add a festival skyline.
const skyPositions=[];for(let i=0;i<150;i++)skyPositions.push((rand()-.5)*150,2+rand()*55,-30-rand()*70);const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.Float32BufferAttribute(skyPositions,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xbdc4ff,size:.12,transparent:true,opacity:.8}));world.add(stars);
const beams=[];for(let i=0;i<8;i++){const g=group(world,(i-3.5)*10,-25,-22+(i%2)*12);const mesh=new THREE.Mesh(new THREE.ConeGeometry(5,65,4,1,true),new THREE.MeshBasicMaterial({color:neon[i%6],transparent:true,opacity:.055,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));mesh.position.y=32;mesh.rotation.z=Math.PI;g.add(mesh);beams.push(g)}
const rings=[];for(let i=0;i<2;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(6.6+i*.3,.035,4,80),new THREE.MeshBasicMaterial({color:i?0xff4fdf:0x38e9ff}));ring.rotation.x=Math.PI/2;ring.position.y=21.22+i*.7;world.add(ring);rings.push(ring)}
// Three invented broadcast aircraft: original geometry and no real broadcaster marks.
const helicopters=[],flightTarget=new THREE.Vector3(0,9,5),heliUp=new THREE.Vector3(0,1,0),heliDelta=new THREE.Vector3(),heliSource=new THREE.Vector3();
function helicopter(i,color){const g=group(world);g.scale.setScalar(1.3);voxelBox(g,0,0,0,1.8,1.3,2.8,['#e4e9ee'],.2);voxelBox(g,0,-.1,-1.52,1.58,.96,1.05,[color],.18);box(g,0,.36,-1.69,1.42,.53,.74,'#143951');box(g,0,.36,-2.07,.085,.55,.05,color);for(const side of[-1,1]){box(g,side*.915,.22,-.55,.06,.65,1.45,'#1f506c');box(g,side*.95,-.1,.62,.06,1,1.1,color);box(g,side*.99,-.1,.94,.04,.1,.29,'#e5f5ff');box(g,side*.93,-1.05,.1,.13,.13,3.6,'#323c55');segment(g,[side*.7,-.49,-.85],[side*.93,-1.04,-.85],.11,.11,'#becbd5');segment(g,[side*.7,-.49,.93],[side*.93,-1.04,.93],.11,.11,'#becbd5');const label=new THREE.Mesh(new THREE.PlaneGeometry(1.24,.6),new THREE.MeshBasicMaterial({map:screenTexture('LIVE '+(i+1),'FAN CAM',color)}));label.position.set(side*.99,.09,.55);label.rotation.y=side*Math.PI/2;g.add(label)}
segment(g,[0,.12,1.2],[0,.4,4.35],.3,.34,color);box(g,0,.86,4.3,.13,1.43,.78,color);box(g,0,.42,3.9,1.45,.12,.62,color);box(g,0,.92,-.2,.85,.4,1.4,'#3c4961');box(g,0,1.3,-.2,.18,.65,.18,'#d6e4e9');const rotor=group(g,0,1.65,-.2);for(let k=0;k<4;k++){const blade=group(rotor);blade.rotation.y=k*Math.PI/2;box(blade,1.85,0,0,3.8,.065,.24,'#41495d');box(blade,3.68,0,0,.35,.07,.25,color)}const tailRotor=group(g,.21,.69,4.35);box(tailRotor,0,0,0,.08,1.47,.13,'#3d4558');box(tailRotor,0,0,0,.08,.13,1.47,'#3d4558');box(g,0,1.57,4.3,.15,.15,.15,'#ff5064',1.2);
const cam=group(g,0,-.91,-1.2);box(cam,0,0,0,.56,.5,.65,'#172034');box(cam,0,0,.39,.38,.34,.17,'#5ce5f7',.5);box(cam,0,0,.49,.23,.23,.06,'#1a497a');box(cam,.23,.16,.1,.08,.08,.06,'#ff4567',1.1);
const beam=new THREE.Mesh(new THREE.ConeGeometry(2.7,1,12,1,true),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.028,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));beam.frustumCulled=false;world.add(beam);const data={g,rotor,tailRotor,cam,beam,radius:[26,30,23][i],altitude:[17,20.5,23.5][i],phase:[2.65,.1,4.7][i],speed:[.14,-.11,.12][i]};helicopters.push(data);return data}
helicopter(0,'#f7c451');helicopter(1,'#60deef');helicopter(2,'#f875a8');host.dataset.helicopters='3';
function updateHelicopters(t){helicopters.forEach((h,i)=>{const a=h.phase+t*h.speed;h.g.position.set(Math.cos(a)*h.radius,h.altitude+Math.sin(t*.8+i)*.65,Math.sin(a)*h.radius*.7);const dx=-Math.sin(a)*h.radius*h.speed,dz=Math.cos(a)*h.radius*.7*h.speed;h.g.rotation.set(Math.sin(t*.7+i)*.025,Math.atan2(-dx,-dz),Math.sin(t*.9+i)*.045);h.rotor.rotation.y=t*24+i;h.tailRotor.rotation.x=t*32;h.g.updateMatrixWorld(true);h.cam.lookAt(flightTarget);h.cam.getWorldPosition(heliSource);h.beam.position.copy(heliSource).add(flightTarget).multiplyScalar(.5);heliDelta.copy(heliSource).sub(flightTarget);h.beam.scale.y=heliDelta.length();h.beam.quaternion.setFromUnitVectors(heliUp,heliDelta.normalize())})}
updateHelicopters(0);

const party=createParty(THREE,world,{group,box,voxelBox,oval,segment,sign},policySigns,chars[0].badge);
host.dataset.cowCount='3';host.dataset.maxSpiderCount='1';
const cinematic=createCinematic(THREE,world,chars,{group,box,voxelBox,segment,fist});
flush();
// Lightweight HDR glow pass: original shader, no downloaded effects or imagery.
const rt=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,depthBuffer:true});const postScene=new THREE.Scene(),postCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);const postMaterial=new THREE.ShaderMaterial({uniforms:{t:{value:rt.texture},px:{value:new THREE.Vector2(1,1)}},vertexShader:'varying vec2 uvv; void main(){uvv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`uniform sampler2D t; uniform vec2 px; varying vec2 uvv;
vec3 bright(vec2 q){vec3 c=texture2D(t,q).rgb;return max(c-.72,vec3(0.));}
void main(){vec3 c=texture2D(t,uvv).rgb;vec3 g=vec3(0.);for(int i=0;i<8;i++){float a=float(i)*.785398;vec2 v=vec2(cos(a),sin(a));g+=bright(uvv+v*px*3.)*.065;g+=bright(uvv+v*px*8.)*.035;}c+=g*.8;c=vec3(1.)-exp(-c*.95);c=pow(c,vec3(1./2.2));float vig=1.-.24*pow(length((uvv-.5)*1.4),2.);gl_FragColor=vec4(c*vig,1.);}`});postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),postMaterial));
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,paused=reduced,encore=false,encoreMix=0,encoreTime=0,blue=false,angle=.12,elevation=.38,distance=86,aspect=1,time=0,last=performance.now(),burstTimer=.1,bubbleTimer=0,shake=0,crowdCheerUntil=0,perfFrames=0,perfStamp=performance.now();
let milkView=false,flightFraming=0;const target=new THREE.Vector3(),desired=new THREE.Vector3();
function cameraUpdate(force=false){const narrow=host.clientWidth<680;target.set(milkView?0:-2,milkView?-12:.5+flightFraming*4,milkView?-15:0);const d=distance*(1+(milkView?0:flightFraming*.28))*Math.max(1,.85/aspect);desired.set(target.x+Math.sin(angle)*Math.cos(elevation)*d,target.y+Math.sin(elevation)*d,target.z+Math.cos(angle)*Math.cos(elevation)*d);if(force)camera.position.copy(desired);else camera.position.lerp(desired,.1);if(shake>0&&!paused){camera.position.x+=Math.sin(time*22)*shake*.09;camera.position.y+=Math.cos(time*18)*shake*.04}camera.lookAt(target)}
function resize(){aspect=host.clientWidth/host.clientHeight;camera.aspect=aspect;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight);const size=renderer.getDrawingBufferSize(new THREE.Vector2());rt.setSize(size.x,size.y);postMaterial.uniforms.px.value.set(1/size.x,1/size.y);cameraUpdate(true)}new ResizeObserver(resize).observe(host);resize();
function announce(text){$('#character-bubble').textContent=text;$('#character-bubble').hidden=false;clearTimeout(bubbleTimer);bubbleTimer=setTimeout(()=>$('#character-bubble').hidden=true,4300)}
function greet(i){chars[i].userData.cheerUntil=time+4;announce(chars[i].userData.name+'：'+chars[i].userData.message);if(!paused)launchRocket((i-1)*19,25,10,1.25)}
document.querySelectorAll('[data-character]').forEach(b=>b.onclick=()=>greet(Number(b.dataset.character)));
$('#zoom-in').onclick=()=>distance=Math.max(47,distance-6);$('#zoom-out').onclick=()=>distance=Math.min(100,distance+6);$('#reset-view').onclick=()=>{milkView=false;distance=86;angle=.12;elevation=.38;announce('回到巨獸派對的最佳視角')};
$('#milk-view').onclick=()=>{milkView=true;angle=Math.PI+.18;elevation=.43;distance=65;announce('鮮奶芭蕾廣場：按全場安可，三隻乳牛踮腳轉圈！')};
function motionState(){const b=$('#motion');b.textContent=paused?'▶':'Ⅱ';b.setAttribute('aria-label',paused?'恢復動畫':'暫停動畫');b.setAttribute('aria-pressed',String(paused));b.title=paused?'恢復動畫':'暫停動畫'}motionState();$('#motion').onclick=()=>{paused=!paused;motionState()};
$('#dance').onclick=()=>{encore=!encore;if(encore&&encoreMix<.05)encoreTime=0;host.dataset.encore=String(encore);$('#dance').setAttribute('aria-pressed',String(encore));$('#dance').innerHTML='<span>♫</span> '+(encore?'回到派對':'全場安可');if(encore&&paused){paused=false;motionState()}announce(encore?'全場安可！鮮奶乳牛踮腳轉圈，政策看板與 5 號跟著重拍發光！':'回到派對節奏，煙火繼續。')};
$('#time-toggle').onclick=()=>{blue=!blue;scene.background.set(blue?'#031326':'#09051d');scene.fog.color.set(blue?'#04172a':'#100725');host.dataset.lightMode=blue?'藍綠白強光':'霓虹派對';host.dataset.crowdMode=blue?'全城人浪':'自由歡呼';$('#time-toggle').setAttribute('aria-pressed',String(blue));$('#time-label').textContent=blue?'電光藍調':'霓虹派對';$('#time-toggle').innerHTML='<span>◒</span> '+(blue?'霓虹派對':'電光藍調');announce(blue?'電光藍調！街道與屋頂一起舉手，讓人浪繞遍台北。':'回到霓虹派對，自由歡呼！')};
const pointers=new Map();let start=null,moved=false,pinch=0;host.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});start={x:e.clientX,y:e.clientY};moved=false;host.setPointerCapture(e.pointerId);if(pointers.size===2){const p=[...pointers.values()];pinch=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)}});host.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId),dx=e.clientX-old.x,dy=e.clientY-old.y;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>5)moved=true;if(pointers.size===2){const p=[...pointers.values()],n=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);distance=THREE.MathUtils.clamp(distance+(pinch-n)*.1,47,100);pinch=n}else{angle-=dx*.005;if(e.pointerType!=='touch')elevation=THREE.MathUtils.clamp(elevation+dy*.003,-.03,.65)}});
const raycaster=new THREE.Raycaster();host.addEventListener('pointerup',e=>{if(!moved&&start&&pointers.size===1){const r=host.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=raycaster.intersectObjects([...chars,...policySigns],true)[0];if(hit?.object.userData.landmark){document.dispatchEvent(new CustomEvent('open-landmark',{detail:hit.object.userData.landmark}))}else if(hit?.object.userData.story){document.dispatchEvent(new CustomEvent('open-city-story',{detail:hit.object.userData.story}))}else if(hit){let n=hit.object;while(n&&!chars.includes(n))n=n.parent;if(n)greet(chars.indexOf(n))}}pointers.delete(e.pointerId);start=null});host.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);start=null});host.addEventListener('wheel',e=>{if(!host.matches(':focus')&&!e.ctrlKey)return;e.preventDefault();distance=THREE.MathUtils.clamp(distance+e.deltaY*.035,47,100)},{passive:false});host.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','r','R'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')angle+=.12;if(e.key==='ArrowRight')angle-=.12;if(e.key==='ArrowUp')$('#zoom-in').click();if(e.key==='ArrowDown')$('#zoom-out').click();if(e.key.toLowerCase()==='r')$('#reset-view').click()}});
// Continuous fireworks with a fixed-size particle pool. Large bursts are deliberately much larger.
const count=1900,particleMesh=new THREE.InstancedMesh(new THREE.BoxGeometry(.14,.14,.14),new THREE.MeshBasicMaterial({color:0xffffff}),count);particleMesh.frustumCulled=false;world.add(particleMesh);const particles=Array.from({length:count},()=>({life:0})),tmp=new THREE.Object3D(),up=new THREE.Vector3(0,1,0),particleDirection=new THREE.Vector3();let cursor=0;for(let i=0;i<count;i++){tmp.scale.setScalar(0);tmp.updateMatrix();particleMesh.setMatrixAt(i,tmp.matrix)}
function particle(x,y,z,vx,vy,vz,life,color,size){const i=cursor++%count;Object.assign(particles[i],{x,y,z,vx,vy,vz,life,max:life,size});particleMesh.setColorAt(i,new THREE.Color(color).multiplyScalar(3.5));}
function burst(x,y,z,scale=1){const n=Math.round(95*scale),colors=[neon[Math.floor(rand()*6)],'#fff1ab'];for(let i=0;i<n;i++){const a=rand()*Math.PI*2,u=rand()*2-1,s=Math.sqrt(1-u*u),speed=(2.6+rand()*2.8)*scale;particle(x,y,z,Math.cos(a)*s*speed,u*speed,Math.sin(a)*s*speed,1.7+rand()*1.4,colors[i%7===0?1:0],.7+scale*.45)}particleMesh.instanceColor.needsUpdate=true;}
const rockets=[];function launchRocket(x,y,z,scale=1){if(rockets.length>=12)rockets.shift();rockets.push({x,y:-20,z,target:y,scale,color:neon[Math.floor(rand()*6)]})}
$('#fireworks').onclick=()=>{if(paused){announce('✷ 巨獸級安可！目前採靜態應援；可用播放鍵恢復動畫。');return}burst(-24,18,-3,2.7);burst(24,21,-5,2.7);burst(0,29,-12,2.9);launchRocket(-28,24,2,2.4);launchRocket(28,22,2,2.4);chars.forEach(c=>c.userData.cheerUntil=time+5);shake=1.1;crowdCheerUntil=time+5;announce('巨獸級安可！這整片夜空，都送給你。')};
function updateParticles(dt){for(let j=rockets.length-1;j>=0;j--){const r=rockets[j];r.y+=30*dt;particle(r.x,r.y,r.z,(rand()-.5)*.4,-2,(rand()-.5)*.4,.5,r.color,1.2);if(r.y>=r.target){burst(r.x,r.y,r.z,r.scale);rockets.splice(j,1)}}for(let i=0;i<count;i++){const p=particles[i];if(p.life>0){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vy-=1.1*dt;p.vx*=1-dt*.3;p.vz*=1-dt*.3;tmp.position.set(p.x,p.y,p.z);const f=Math.max(0,p.life/p.max),speed=Math.hypot(p.vx,p.vy,p.vz);tmp.quaternion.setFromUnitVectors(up,particleDirection.set(p.vx,p.vy,p.vz).normalize());tmp.scale.set(f*p.size*.7,f*p.size*(2+speed*.55),f*p.size*.7)}else tmp.scale.setScalar(0);tmp.updateMatrix();particleMesh.setMatrixAt(i,tmp.matrix)}particleMesh.instanceMatrix.needsUpdate=true;if(particleMesh.instanceColor)particleMesh.instanceColor.needsUpdate=true}
// A few initial bursts make the party unmistakable, except with reduced motion.
if(!reduced){burst(-25,20,-8,1.1);burst(20,28,-12,1.2);burst(-12,32,-25,1)}
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('#scene-loading').hidden=false;$('#scene-loading').innerHTML='3D 顯示暫時中斷<span>請重新整理；城市故事與 MV 仍可使用</span>'});$('#scene-loading').hidden=true;
// A shared 128 BPM animation clock gives each giant a firm downbeat and quick rebound.
// It is an animation rhythm, independent of the optional YouTube player.
function updateCharacters(){
 const beat=encoreTime*Math.PI*2*128/60;
 chars.forEach((c,i)=>{
  const u=c.userData,boost=u.cheerUntil>time,phase=time*(boost?1.9:1),b=beat-i*.10;
  const punch=Math.sin(b-.45)+.20*Math.sin(2*b-.45);
  const idlePitch=(u.kind==='kong'?-.07:0)+Math.sin(phase*(u.kind==='kong'?3:2)+i)*.04;
  const dancePitch=.16+punch*(u.kind==='godzilla'?.49:u.kind==='kong'?.57:.54);
  u.neck.rotation.set(THREE.MathUtils.lerp(idlePitch,dancePitch,encoreMix),Math.sin(phase*1.3)*.06*(1-encoreMix),THREE.MathUtils.lerp(Math.sin(phase*3+i)*.06,Math.sin(b*.5)*.09,encoreMix));
  c.position.y=u.base+Math.sin(phase*2.3+i)*(boost?.22:.09);
  if(u.kind==='mayor'){
   u.cheer.rotation.z=Math.sin(phase*2)*.06+encoreMix*Math.sin(b)*.14;
   u.cheer.position.y=2.85+Math.sin(phase*2)*.035+encoreMix*Math.sin(b)*.08;
   c.position.y=u.base+.45+Math.sin(time*.8)*.45+encoreMix*Math.sin(b)*.23;
   c.position.x=0;c.position.z=10.2;c.rotation.set(-.06,0,-.07+Math.sin(phase*2)*.016);
  }else if(u.kind==='kong'){
   u.cheer.rotation.y=THREE.MathUtils.lerp(Math.sin(phase*6)*.45,Math.sin(b)*.60,encoreMix);
   u.cheer.rotation.x=.1+THREE.MathUtils.lerp(Math.sin(phase*6)*.22,Math.sin(b-.3)*.38,encoreMix);
  }else{
   u.tail.rotation.y=Math.sin(phase*1.4)*.24;
   u.cheer.rotation.z=THREE.MathUtils.lerp(Math.sin(phase*4)*.25,Math.sin(b)*.40,encoreMix);
  }
 });
}
// One ten-second lap begins at each active minute; pause/hidden-tab time does not count.
const mayorFlight=createMayorFlight(THREE,chars[0],heroUniforms),flightState=mayorFlight.state,flightWatch=createFlightWatch(THREE,chars);
function updateMayorFlight(){mayorFlight.update(time);flightFraming=flightState.amount}
function updatePartyLights(){const beat=time*Math.PI*2*128/60,p=.5+.5*Math.sin(beat);key.color.set(blue?'#edfaff':'#fff0df');portraitFill.intensity=blue?1.15:1.25;key.intensity=blue?3.8+p*.8:3.1;fill.color.set(blue?'#168fff':'#36e6ff');fill.intensity=blue?2.7+p*1.2:1.1;rim.color.set(blue?'#74ff35':'#ff37ba');rim.intensity=blue?3.2+(1-p)*1.1:1.7;hemisphere.intensity=blue?1.4:1.15;beams.forEach((b,i)=>{const m=b.children[0].material;m.color.set(blue?['#1975ff','#81ff43','#e6ffff'][i%3]:neon[i%6]);m.opacity=blue?.10+(.5+.5*Math.sin(beat+i*.5))*.075:.055;b.rotation.z=Math.sin(time*(blue?.73:.3)+i)*.53;b.rotation.x=Math.cos(time*(blue?.57:.24)+i)*.40});host.dataset.lightPulse=blue?p.toFixed(2):'0'}
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(document.hidden)return;if(!paused){time+=dt;heroUniforms.heroTime.value=time;updateHelicopters(time);crowdUniforms.crowdTime.value=time;crowdUniforms.stadiumAmount.value=THREE.MathUtils.damp(crowdUniforms.stadiumAmount.value,blue?1:0,5,dt);encoreMix=THREE.MathUtils.damp(encoreMix,encore?1:0,8,dt);if(encoreMix>.001)encoreTime+=dt;crowdUniforms.encoreAmount.value=encoreMix;crowdUniforms.crowdBeat.value=encoreTime*128/60;crowdUniforms.crowdBoost.value=crowdCheerUntil>time?1:0;shake=Math.max(0,shake-dt);burstTimer-=dt;if(burstTimer<0){burstTimer=encore?.7:1.25;launchRocket((rand()>.5?1:-1)*(16+rand()*17),13+rand()*13,-10-rand()*24,.7+rand()*.55)}updateCharacters();updateMayorFlight();party.update(time,encoreMix,encoreTime);gestureHands.forEach(h=>{h.opened.visible=encoreMix<.5;h.rocking.visible=encoreMix>=.5});updatePartyLights();const show=cinematic.update(time);flightWatch.update(flightState);if($('#show-cue').textContent!==show.act+' · 每30秒循環')$('#show-cue').textContent=show.act+' · 每30秒循環';rings.forEach((r,i)=>{r.rotation.z=time*(i?-.12:.15);r.position.y=21.22+i*.7+Math.sin(time*.5+i)*.15});for(const [k,m]of mats)if(k.includes('#42ecff'))m.emissiveIntensity=1.8+Math.sin(time*2)*.7;updateParticles(dt)}if(++perfFrames===120){host.dataset.handGesture=encoreMix<.5?'五指張開':'搖滾手勢';host.dataset.flightWatching=flightWatch.state.amount.toFixed(2);host.dataset.gazeShift=flightWatch.state.shifts.map(a=>a.map(v=>v.toFixed(3)).join(',')).join(';');host.dataset.breathTip=cinematic.state.breathTip.map(v=>v.toFixed(1)).join(',');host.dataset.stadiumWave=crowdUniforms.stadiumAmount.value.toFixed(2);host.dataset.cowMode=party.state.cowMode;host.dataset.cowSpin=party.state.cowSpin.toFixed(2);host.dataset.signGlow=party.state.signGlow.toFixed(2);host.dataset.badgeGlow=party.state.badgeGlow.toFixed(2);host.dataset.flightPose=flightState.amount>.95?'超人俯身領飛':'起落或應援';host.dataset.flightAlignment=flightState.alignment.toFixed(3);host.dataset.mayorFlight=String(flightState.active);host.dataset.flightProgress=flightState.progress.toFixed(2);host.dataset.showPhase=cinematic.state.phase.toFixed(2);host.dataset.showAct=cinematic.state.act;host.dataset.breathClearance=cinematic.state.clearance.toFixed(2);host.dataset.breath=cinematic.state.breath.toFixed(2);host.dataset.webSwingers=String(cinematic.state.spiders);host.dataset.gripError=cinematic.state.gripError.toExponential(1);host.dataset.triangles=String(renderer.info.render.triangles);host.dataset.drawCalls=String(renderer.info.render.calls);host.dataset.frameMs=((now-perfStamp)/perfFrames).toFixed(1);host.dataset.animationTime=time.toFixed(2);host.dataset.encoreMix=encoreMix.toFixed(2);host.dataset.headPitch=chars.map(c=>c.userData.neck.rotation.x.toFixed(2)).join(',');perfStamp=now;perfFrames=0}cameraUpdate();renderer.info.reset();renderer.setRenderTarget(rt);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(postScene,postCamera)}requestAnimationFrame(animate);
