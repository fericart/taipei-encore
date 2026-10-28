// A new cast built entirely from cuboids and original pixel-color surfaces.
// No sculpted portrait geometry, downloaded models, or reference-image textures.
export function createVoxelCharacters(THREE, world, {makeBadge, makeCape}={}) {
  const cube=new THREE.BoxGeometry(1,1,1),pending=new Map(),materials=new Map();
  const gestureHands=[];
  const C={skin:'#edb383',skinShade:'#dc9c6b',hair:'#33251f',hairLight:'#423025',blue:'#196ac8',blueLight:'#247bdb',red:'#de3146',gold:'#efbd42',fur:'#714a2f',furLight:'#845836',cream:'#d9b989',scale:'#386c60',scaleLight:'#467c6a',belly:'#91aa83',dark:'#1b2421',white:'#fff1d6',spine:'#71cfd3'};
  function group(parent,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
  function material(input,plain=false){
    const color=Array.isArray(input)?input[0]:input,key=color+'/'+plain;
    if(materials.has(key))return materials.get(key);
    const mat=new THREE.MeshStandardMaterial({color:plain?color:'#ffffff',roughness:1,metalness:0,emissive:color,emissiveIntensity:.025});
    if(!plain){
      const n=16,data=new Uint8Array(n*n*4),hex=new THREE.Color(color).getHex(),rgb=[hex>>16&255,hex>>8&255,hex&255];
      for(let y=0;y<n;y++)for(let x=0;x<n;x++){
        // Broad coherent pixel patches, with small restrained variation inside them.
        const cell=(Math.imul((x>>1)+11,73856093)^Math.imul((y>>1)+7,19349663))>>>0;
        const fine=(Math.imul(x+3,83492791)^Math.imul(y+9,2971215073))>>>0;
        const tone=1+((cell%7)-3)*.017+((fine%3)-1)*.008;
        const at=(y*n+x)*4;for(let j=0;j<3;j++)data[at+j]=Math.min(255,Math.round(rgb[j]*tone));data[at+3]=255;
      }
      const texture=new THREE.DataTexture(data,n,n,THREE.RGBAFormat);texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=texture.minFilter=THREE.NearestFilter;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.generateMipmaps=false;texture.needsUpdate=true;mat.map=texture;
      mat.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <uv_vertex>',`#include <uv_vertex>
        #if defined(USE_MAP) && defined(USE_INSTANCING)
          vec3 blockSize=vec3(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz),length(instanceMatrix[2].xyz));
          vec2 pixelSpan=abs(normal.x)>.5?blockSize.zy:(abs(normal.y)>.5?blockSize.xz:blockSize.xy);
          vMapUv=uv*pixelSpan/1.6;
        #endif`);};
      mat.customProgramCacheKey=()=> 'voxel-cast-pixel-grid-1';
    }
    materials.set(key,mat);return mat;
  }
  function block(parent,x,y,z,w,h,d,color,plain=false){
    if(!pending.has(parent))pending.set(parent,new Map());const m=material(color,plain),map=pending.get(parent);
    if(!map.has(m))map.set(m,[]);map.get(m).push([x,y,z,w,h,d]);
  }
  function flush(){
    const t=new THREE.Object3D();
    for(const[parent,batches]of pending)for(const[m,parts]of batches){
      const mesh=new THREE.InstancedMesh(cube,m,parts.length);
      parts.forEach((p,i)=>{t.position.set(...p.slice(0,3));t.scale.set(...p.slice(3));t.updateMatrix();mesh.setMatrixAt(i,t.matrix);});
      mesh.castShadow=mesh.receiveShadow=true;mesh.instanceMatrix.needsUpdate=true;parent.add(mesh);
    }pending.clear();
  }
  function segment(parent,a,b,w,d,color){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),g=group(parent);g.position.copy(va).add(vb).multiplyScalar(.5);g.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vb.clone().sub(va).normalize());block(g,0,0,0,w,va.distanceTo(vb)+.025,d,color);return g;}
  function fist(parent,p,size,color){block(parent,...p,size,size*.86,size*.78,color);for(let i=0;i<4;i++)block(parent,p[0]+(i-1.5)*size*.225,p[1]-.05*size,p[2]+size*.40,size*.19,size*.39,size*.10,color);block(parent,p[0]-size*.49,p[1]-size*.11,p[2]+size*.17,size*.22,size*.37,size*.37,color);}
  function hand(parent,p,size,color,rock=false,claws=false){
    const h=group(parent,...p);block(h,0,0,0,size,size*.68,size*.43,color);
    const count=claws?3:4;
    for(let i=0;i<count;i++){
      const x=(i-(count-1)/2)*size*(claws?.31:.245),outer=i===0||i===count-1;
      const length=rock&&!outer?size*.10:size*([.38,.48,.48,.35][i]);
      block(h,x,size*.27+length/2,rock&&!outer?size*.20:0,size*(claws?.23:.19),length,size*.28,color);
      if(claws)block(h,x,size*.27+length,size*.035,size*.17,size*.09,size*.26,C.white,true);
    }
    block(h,-size*.55,-size*.06,0,size*.25,size*.33,size*.37,color);
    return h;
  }
  function arm(parent,shoulder,elbow,end,color,handColor,width,gestures=false,claws=false){
    const g=group(parent);segment(g,shoulder,elbow,width,width*1.05,color);segment(g,elbow,end,width*.94,width, color);
    if(gestures){const opened=hand(g,end,width*1.14,handColor,false,claws),rocking=hand(g,end,width*1.14,handColor,true,claws);rocking.visible=false;gestureHands.push({opened,rocking});}else fist(g,end,width*1.12,handColor);return g;
  }
  function eye(head,x,y,z,w,h,iris='#32261f',monster=false){
    block(head,x,y,z,w,h,.020,C.white,true);
    const pupil=group(head,x,y,z+.021);block(pupil,0,0,0,w*.46,h*.94,.022,iris,true);
    if(iris==='#bba247')block(pupil,0,0,.015,w*.25,h*.90,.018,C.dark,true);
    block(pupil,-w*.095,h*.27,.027,w*.12,h*.15,.008,'#ffffff',true);
    pupil.userData.rest=pupil.position.clone();pupil.userData.gazeLimit=[w*.19,h*.02];(head.userData.eyes??=[]).push(pupil);
    if(monster)block(head,x,y+h*.56,z-.004,w+.045,.075,.05,monster,true);
  }
  function mayorHead(head){
    block(head,0,0,0,1.30,1.28,1.16,C.skin);
    for(const s of[-1,1]){block(head,s*.71,-.08,-.03,.15,.30,.24,C.skin);block(head,s*.744,-.08,.10,.05,.15,.025,C.skinShade,true);}
    // Stepped, swept hairline and a solid rear scalp, all on the same square grid.
    block(head,0,.53,-.035,1.38,.37,1.25,C.hair);block(head,0,.06,-.565,1.34,1.15,.15,C.hair);
    for(const s of[-1,1])block(head,s*.625,.14,-.13,.12,.70,.93,C.hair);
    block(head,-.42,.395,.593,.48,.24,.10,C.hair);block(head,-.16,.47,.598,.26,.15,.11,C.hair);
    block(head,.10,.53,.600,.26,.12,.11,C.hair);block(head,.47,.40,.585,.23,.20,.10,C.hair);
    block(head,-.24,.752,-.04,.62,.08,.97,C.hairLight);block(head,.26,.706,-.03,.44,.07,1.07,C.hair);
    // Large, bright pixel eyes from the new reference: brown irises, dark pupils,
    // square catchlights and clean upper lids. Keep each iris as a tracked group.
    for(const s of[-1,1]){
      const x=s*.315,y=.045,z=.597;
      block(head,x,.321,.600,.355,.082,.028,C.hair,true);
      block(head,x,y,z,.355,.405,.024,'#fff8e8',true);
      block(head,x,.260,.618,.355,.035,.025,'#493024',true);
      const pupil=group(head,x,y,z+.024);
      block(pupil,0,0,0,.235,.360,.022,'#66331f',true);
      block(pupil,0,.033,.015,.183,.282,.020,'#211a18',true);
      block(pupil,0,-.146,.016,.155,.045,.020,'#9c5029',true);
      block(pupil,-.053,.111,.032,.080,.084,.012,'#ffffff',true);
      block(pupil,.060,-.091,.033,.032,.032,.012,'#e4b580',true);
      pupil.userData.rest=pupil.position.clone();pupil.userData.gazeLimit=[.045,.010];
      (head.userData.eyes??=[]).push(pupil);
    }
    block(head,0,-.17,.614,.104,.073,.060,'#dfa071');
    // A gently rising pixel smile rather than a flat, neutral mouth.
    for(const [x,y,w]of[[-.184,-.326,.067],[-.115,-.354,.072],[-.037,-.368,.090],[.052,-.361,.090],[.137,-.335,.079],[.204,-.300,.057]])block(head,x,y,.595,w,.033,.022,'#884b35',true);
    for(const s of[-1,1])block(head,s*.443,-.207,.593,.065,.035,.018,'#e7a076',true);
  }
  function kongHead(head){
    block(head,0,0,0,1.62,1.42,1.32,C.fur);block(head,0,.77,-.08,.66,.12,1.08,C.furLight);
    for(const s of[-1,1]){block(head,s*.945,.015,-.02,.29,.42,.30,C.fur);block(head,s*.952,.015,.142,.19,.27,.03,'#c29465');}
    block(head,0,.02,.683,1.28,.98,.095,C.cream);
    for(const s of[-1,1]){
      block(head,s*.66,-.31,.728,.17,.40,.11,C.furLight);
      eye(head,s*.32,.143,.743,.33,.28,'#211f19');
      block(head,s*.32,.335,.739,.36,.085,.06,'#62412c');
    }
    block(head,0,-.30,.88,1.03,.36,.36,'#dec39a');block(head,0,-.53,.81,.89,.14,.34,'#c7a478');
    for(const s of[-1,1])block(head,s*.18,-.154,1.069,.105,.068,.018,'#896446',true);
    block(head,0,-.375,1.069,.58,.078,.022,'#795338',true);
    for(const s of[-1,1])block(head,s*.32,-.335,1.069,.07,.075,.022,'#795338',true);
    block(head,0,-.338,1.085,.50,.038,.015,C.white,true);
  }
  function plate(parent,x,y,z,w=.48,h=.57,d=.20){
    block(parent,x,y,z,w,h*.38,d,C.spine);
    block(parent,x,y+h*.27,z,w*.60,h*.40,d*.90,C.spine);
    block(parent,x,y+h*.53,z,w*.25,h*.24,d*.73,'#b6eeee');
  }
  function godzillaHead(head){
    block(head,0,.02,0,1.24,1.08,1.20,C.scale);block(head,0,.59,-.12,.83,.12,.84,C.scaleLight);
    for(const s of[-1,1]){
      eye(head,s*.388,.24,.615,.245,.205,'#bba247',C.scaleLight);
      block(head,s*.565,-.02,.52,.15,.20,.33,C.scaleLight);
    }
    block(head,0,-.075,.895,1.16,.42,.86,C.scaleLight);
    block(head,0,-.438,.85,1.06,.25,.89,'#739477');
    block(head,0,-.296,1.33,1.00,.13,.022,'#1b3531',true);
    for(const s of[-1,1]){block(head,s*.286,.027,1.334,.095,.060,.016,'#284a3f',true);block(head,s*.576,-.293,.94,.018,.13,.68,'#1b3531',true);}
    for(const x of[-.375,-.225,-.075,.075,.225,.375])block(head,x,-.265,1.347,.083,.060,.018,C.white,true);
    for(const x of[-.30,-.10,.10,.30])block(head,x,-.340,1.347,.065,.034,.018,C.white,true);
    plate(head,0,.47,-.55,.35,.30,.22);
  }
  function mayor(){
    const g=group(world,0,-7.8,10.2);g.scale.setScalar(5);
    block(g,0,2.12,0,1.30,1.64,.82,C.blue);block(g,0,3.02,0,.42,.22,.43,C.skin);
    block(g,0,1.36,0,1.34,.17,.86,C.gold);block(g,0,1.12,0,1.16,.30,.78,C.red);block(g,0,1.36,.454,.24,.16,.045,'#ffe283',true);
    for(const s of[-1,1]){block(g,s*.57,2.14,.421,.075,1.32,.025,C.blueLight);block(g,s*.42,2.95,.0,.29,.10,.74,C.red);}
    const head=group(g,0,3.69,.04);mayorHead(head);
    if(makeBadge){const badge=makeBadge();badge.position.set(0,2.22,.425);g.add(badge);g.badge=badge;}
    if(makeCape)makeCape(g);
    const idleLegs=group(g);
    segment(idleLegs,[-.32,1.13,0],[-.38,.48,.03],.46,.54,C.blue);segment(idleLegs,[-.38,.48,.03],[-.43,-.28,.09],.47,.55,C.red);
    block(idleLegs,-.43,-.32,.24,.53,.28,.82,C.red);block(idleLegs,-.43,-.485,.24,.55,.07,.84,'#9d2634');
    segment(idleLegs,[.32,1.13,0],[.44,.72,.29],.46,.54,C.blue);segment(idleLegs,[.44,.72,.29],[.62,.24,.62],.47,.55,C.red);
    block(idleLegs,.62,.20,.80,.53,.28,.76,C.red);block(idleLegs,.62,.035,.80,.55,.07,.78,'#9d2634');
    const hold=arm(g,[.70,2.75,0],[1.06,2.58,.25],[1.02,3.07,.55],C.blue,C.skin,.42,true);
    const cheer=group(g,-.70,2.85,0);arm(cheer,[0,0,0],[-.04,.91,.02],[-.08,1.82,.05],C.blue,C.skin,.43,true);block(cheer,-.08,1.61,.05,.46,.15,.46,C.red);
    const flightLimbs=group(g);flightLimbs.visible=false;
    arm(flightLimbs,[-.70,2.8,0],[-.57,3.89,.0],[-.47,4.92,.01],C.blue,C.skin,.43);block(flightLimbs,-.47,4.65,.01,.45,.14,.46,C.red);
    arm(flightLimbs,[.70,2.75,0],[.91,2.00,-.10],[.78,1.40,-.07],C.blue,C.skin,.41);
    for(const s of[-1,1]){const offset=s>0?.11:0;segment(flightLimbs,[s*.32,1.13,0],[s*.34,.19+offset,-.03],.46,.54,C.blue);segment(flightLimbs,[s*.34,.19+offset,-.03],[s*.37,-.75+offset,-.06],.47,.55,C.red);block(flightLimbs,s*.37,-.89+offset,.01,.50,.30,.65,C.red);block(flightLimbs,s*.37,-1.07+offset,.01,.52,.06,.67,'#9d2634');}
    g.rotation.set(-.06,0,-.07);g.userData={name:'蔣萬安',message:'五號一起舉起來，台北安可！',base:-7.8,head,cheer,hold,idleLegs,flightLimbs,kind:'mayor'};return g;
  }
  function kong(){
    const g=group(world,-10,1.5,-.3);g.scale.setScalar(4.15);
    block(g,0,2.49,0,2.18,1.14,1.54,C.fur);block(g,0,1.55,.0,1.70,1.03,1.38,C.fur);
    block(g,0,2.21,.797,1.35,1.50,.085,C.cream);block(g,0,1.39,.735,.91,.18,.08,'#c8a475');
    for(const s of[-1,1]){block(g,s*.91,2.78,.0,.64,.66,1.0,C.furLight);block(g,s*.54,1.07,.06,.71,.54,1.0,C.fur);}
    const head=group(g,0,3.65,.10);kongHead(head);
    // Familiar red necktie, constructed in rectangular pixel steps.
    block(g,0,2.97,.88,.62,.20,.14,'#e43949');block(g,0,2.68,.88,.28,.42,.14,'#d82b3f');block(g,0,2.39,.88,.38,.20,.14,'#d82b3f');block(g,0,2.25,.88,.20,.08,.14,'#d82b3f');block(g,0,2.57,.962,.11,.13,.014,C.gold,true);
    segment(g,[-.56,1.09,.0],[-.73,.30,.10],.71,.77,C.fur);block(g,-.73,.13,.39,.77,.30,1.03,C.cream);
    segment(g,[.58,1.12,0],[1.12,1.12,.10],.70,.78,C.fur);segment(g,[1.12,1.12,.10],[1.42,.67,.34],.66,.70,C.fur);block(g,1.42,.55,.60,.72,.30,.90,C.cream);
    for(const [x,y,z]of[[-.73,.13,.92],[1.42,.55,1.065]])for(let i=0;i<4;i++)block(g,x+(i-1.5)*.17,y,z,.14,.23,.05,'#f0d4ac');
    const hold=arm(g,[1.02,2.9,0],[1.53,3.38,-.17],[2.02,3.55,-.25],C.fur,C.cream,.70);
    const cheer=group(g,-1.1,2.85,.05);arm(cheer,[0,0,0],[-.70,-.24,.43],[-.14,-.63,1.02],C.fur,C.cream,.76,true);
    g.userData={name:'大金剛',message:'吼吼！一起捶胸，大聲安可！',base:1.5,head,cheer,hold,kind:'kong'};return g;
  }
  function godzilla(){
    const g=group(world,10.2,-20.5,.5);g.scale.setScalar(4.9);
    block(g,0,1.85,0,1.80,1.80,1.45,C.scale);block(g,0,2.91,-.03,1.49,.45,1.20,C.scale);block(g,0,3.25,-.04,.91,.32,.93,C.scale);
    block(g,0,1.87,.752,1.11,1.72,.075,C.belly);block(g,0,2.80,.66,.83,.18,.08,C.belly);
    for(let i=0;i<6;i++)block(g,0,1.22+i*.27,.801,1.12,.036,.024,'#698e72',true);
    for(const s of[-1,1])for(let i=0;i<5;i++)block(g,s*.917,1.25+i*.30,.32,.045,.17,.28,C.scaleLight);
    const head=group(g,0,3.8,0);godzillaHead(head);
    for(const s of[-1,1]){block(g,s*.60,.70,.09,.70,.75,.89,C.scale);block(g,s*.62,.16,.48,.83,.38,1.23,C.scaleLight);for(const dx of[-.25,0,.25])block(g,s*.62+dx,.12,1.16,.15,.16,.26,C.white);}
    const tail=group(g,0,1.30,-.50);
    for(let i=0;i<10;i++){const size=1.05-i*.087;block(tail,i*i*.033,-i*.063,-i*.49,size,size*.80,.61,C.scale);if(i<8)plate(tail,i*i*.033,size*.39-i*.063,-i*.49,.34-i*.025,.42-i*.03,.19);}
    for(let i=0;i<5;i++){plate(g,0,1.35+i*.48,-.84,.64,.59,.32);for(const s of[-1,1])plate(g,s*.50,1.30+i*.45,-.76,.30,.34,.22);}
    const hold=arm(g,[-.89,2.8,.20],[-1.15,3.26,.62],[-1.32,3.15,.84],C.scale,C.belly,.44,false,true);
    const cheer=group(g,.84,2.75,.13);arm(cheer,[0,0,0],[.42,.32,.40],[.59,.91,.55],C.scale,C.belly,.43,true,true);
    g.rotation.y=-.14;g.userData={name:'哥吉拉',message:'嘎嗷！藍色光焰，點亮台北！',base:-20.5,head,cheer,hold,tail,kind:'godzilla'};return g;
  }
  const characters=[mayor(),kong(),godzilla()];
  return {characters,gestureHands,flush,colors:C,helpers:{group,box:(p,x,y,z,w,h,d,c)=>block(p,x,y,z,w,h,d,c),voxelBox:(p,x,y,z,w,h,d,c)=>block(p,x,y,z,w,h,d,c),segment,fist}};
}
