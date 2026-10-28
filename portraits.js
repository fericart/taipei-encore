// Original, individually sculpted fan portraits. Reference images guide style;
// they are not distributed, traced into textures, or used as model assets.
export function createCharacterPortraits(THREE, art) {
  const skin='#e9b18b', hair='#241f1f', fur='#584236', muzzle='#847265';
  const scale='#324e4d', ridge='#435f5b';
  function group(parent,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
  const form=(g,geo,x,y,z,w,h,d,c,r=[0,0,0])=>art.mesh(g,geo,x,y,z,w,h,d,c,r);
  const soft=(g,x,y,z,w,h,d,c,r)=>form(g,art.soft,x,y,z,w,h,d,c,r);
  const oval=(g,x,y,z,w,h,d,c,r)=>form(g,art.oval,x,y,z,w,h,d,c,r);
  const plane=(g,points,z,c,depth=.018)=>art.polygon(g,points,z,depth,c);
  function wedge(g,points,faces,color){
    const vertices=[],center=new THREE.Vector3();for(const p of points)center.add(new THREE.Vector3(...p));center.divideScalar(points.length);for(const face of faces)for(let i=1;i<face.length-1;i++){let ids=[face[0],face[i],face[i+1]],a=new THREE.Vector3(...points[ids[0]]),b=new THREE.Vector3(...points[ids[1]]),c=new THREE.Vector3(...points[ids[2]]);if(b.clone().sub(a).cross(c.clone().sub(a)).dot(a.clone().add(b).add(c).multiplyScalar(1/3).sub(center))<0)ids.reverse();for(const n of ids)vertices.push(...points[n]);}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    geo.setAttribute('color',new THREE.Float32BufferAttribute(Array(vertices.length).fill(1),3));geo.computeVertexNormals();
    return form(g,geo,0,0,0,1,1,1,color);
  }
  function eye(g,x,y,z,width,height,iris,kind='human'){
    const frame=group(g,x,y,z),s=Math.sign(x);
    // Thin almond lids, with a generous white aperture for the tracked pupil.
    const outline=[[-width/2,0],[-width*.26,height*.48],[width*.12,height*.54],[width/2,height*.05],[width*.28,-height*.40],[-width*.24,-height*.44]];
    plane(frame,outline.map(([xx,yy])=>[xx*1.09,yy*1.18]),0,kind==='human'?'#654337':'#182625');
    plane(frame,outline,.014,kind==='human'?'#f5e9d9':kind==='kong'?'#d1bb8f':'#cdb775');
    const pupil=group(g,x,y,z+.040),radius=kind==='human'?.045:.049;
    oval(pupil,0,0,0,radius*2,height*.72,.026,iris);
    oval(pupil,0,0,.014,kind==='godzilla'?.025:kind==='human'?.052:.065,height*.61,.018,'#101b1c');
    oval(pupil,-.018,height*.20,.026,.020,.020,.010,'#fff7df');
    pupil.userData.rest=pupil.position.clone();pupil.userData.gazeLimit=[.055,.008];(g.userData.eyes??=[]).push(pupil);
    if(kind==='human'){
      plane(frame,[[-width*.53,.008],[-width*.24,height*.55],[width*.12,height*.57],[width*.51,height*.08],[width*.10,height*.40],[-width*.24,height*.38]],.042,'#755040');
      plane(frame,[[-width*.43,-height*.55],[width*.36,-height*.56],[width*.48,-height*.29],[width*.18,-height*.38],[-width*.33,-height*.40]],.018,'#d59774');
    }
    return frame;
  }
  function mayor(g){
    // Adult proportions: long cheek planes, tapered jaw and a distinct neck.
    soft(g,0,-.74,-.02,.40,.42,.43,skin);
    const skull=art.profile([[-.70,.55,.61],[-.56,.76,.76],[-.24,.98,.90],[.15,1.02,.98],[.46,.96,.94],[.66,.78,.78]],.20);
    form(g,skull,0,0,0,1,1,1,skin);
    for(const s of[-1,1]){
      oval(g,s*.516,-.03,-.015,.15,.30,.18,'#e4aa83');
      soft(g,s*.539,-.03,.069,.072,.173,.036,'#c78b69',[0,0,s*.12]);
      eye(g,s*.235,.155,.501,.236,.089,'#49372f');
      const brow=group(g,s*.237,.267,.511);brow.rotation.z=s*.085;
      plane(brow,[[-.156,-.025],[.142,-.028],[.151,.024],[.04,.060],[-.147,.045]],0,'#302725',.040);

    }
    wedge(g,[[-.055,.24,.48],[.055,.24,.48],[-.08,-.18,.50],[.08,-.18,.50],[0,.16,.60],[0,-.13,.72],[-.105,-.17,.62],[.105,-.17,.62],[0,-.23,.55]],[[0,4,5,6,2],[1,3,7,5,4],[0,1,4],[6,5,7,8],[2,6,8],[3,8,7],[2,8,3],[0,2,3,1]],'#dfa67e');
    for(const s of[-1,1])oval(g,s*.077,-.212,.626,.054,.025,.022,'#8f5a45');
    // Restrained, confident smile: shaped lips rather than an oversized tooth grid.
    plane(g,[[-.205,-.359],[-.10,-.378],[0,-.369],[.10,-.375],[.205,-.35],[.142,-.402],[0,-.416],[-.14,-.406]],.470,'#835142',.018);
    plane(g,[[-.159,-.402],[0,-.414],[.159,-.397],[.105,-.437],[0,-.448],[-.10,-.438]],.477,'#c17f65',.018);
    plane(g,[[-.155,-.378],[0,-.386],[.15,-.373],[.10,-.390],[0,-.397],[-.10,-.392]],.493,'#eddac4',.009);
    // Complete scalp and nape, with one deliberate swept part and large calm planes.
    soft(g,0,.50,-.13,1.045,.48,.91,hair);
    soft(g,0,.04,-.411,.94,.97,.22,hair);
    for(const s of[-1,1])soft(g,s*.459,.22,-.10,.15,.69,.66,hair,[0,0,-s*.055]);
    soft(g,-.24,.655,-.015,.58,.33,.83,'#292322',[.04,.08,-.23]);
    soft(g,.15,.694,-.04,.61,.31,.81,'#302724',[.06,-.10,.18]);
    soft(g,.40,.566,-.085,.28,.30,.72,'#241f1f',[.08,-.04,.23]);
    plane(g,[[-.49,.56],[-.24,.72],[.06,.70],[.31,.59],[.08,.47],[-.15,.46],[-.33,.34],[-.43,.27]],.403,'#302725',.10);
    plane(g,[[.10,.69],[.39,.61],[.49,.44],[.43,.26],[.33,.42],[.17,.48]],.397,'#211e1e',.085);
    plane(g,[[-.37,.59],[-.17,.68],[.07,.65],[-.12,.57]],.515,'#45362e',.012);
    g.userData.portrait='adult-sculpted';
  }
  function kong(g){
    // Gorilla anatomy: small ears, a sagittal crest, deep eye sockets and a broad nose.
    form(g,art.profile([[-.78,.96,.99],[-.42,1.49,1.27],[.12,1.72,1.43],[.58,1.45,1.22],[.82,.86,.79]],.23),0,0,0,1,1,1,fur);
    oval(g,0,.70,-.12,.58,.54,.72,'#4c382e');
    for(const s of[-1,1]){
      oval(g,s*.84,.06,-.03,.23,.34,.26,fur);
      oval(g,s*.88,.06,.095,.12,.21,.07,'#8a6d56');
      soft(g,s*.34,.20,.681,.62,.43,.22,'#342b27',[0,0,-s*.09]);
      eye(g,s*.33,.175,.813,.26,.096,'#b4803c','kong');
      oval(g,s*.36,.343,.688,.73,.26,.36,'#655043',[0,0,s*.10]);
      soft(g,s*.63,-.04,.55,.30,.55,.30,'#6f594a',[0,0,s*.12]);
      for(let i=0;i<4;i++)form(g,art.crystal,s*(.70-i*.05),-.20-i*.16,.24,.26,.47,.40,i%2?'#624937':'#4a362d',[.05,0,Math.PI+s*.23]);
    }
    oval(g,0,-.19,.80,1.13,.60,.61,muzzle);
    soft(g,0,-.04,1.082,.62,.29,.27,'#3a302d');
    for(const s of[-1,1])oval(g,s*.16,-.053,1.225,.19,.085,.026,'#191e1d',[0,0,s*.14]);
    // Sculpted lower jaw and a celebratory roar, with characteristic canine teeth.
    oval(g,0,-.60,.70,1.04,.40,.67,'#756054');
    plane(g,[[-.48,-.30],[-.24,-.34],[.24,-.34],[.48,-.30],[.43,-.58],[.22,-.67],[-.22,-.67],[-.43,-.58]],1.016,'#241e23',.045);
    soft(g,0,-.365,1.095,.55,.09,.05,'#e3d3b5');
    for(const s of[-1,1])form(g,art.crystal,s*.352,-.455,1.10,.127,.25,.10,'#ead9ba',[0,0,Math.PI]);
    oval(g,0,-.598,1.085,.42,.075,.036,'#a56e6c');
    g.userData.portrait='gorilla-brow-muzzle';
  }
  function godzilla(g){
    // A reptile skull: eyes sit above a long, narrow snout, not on a human face.
    form(g,art.profile([[-.53,.78,.91],[-.18,1.08,1.20],[.24,1.13,1.16],[.39,.91,.95],[.51,.57,.64]],.22),0,.02,-.16,1,1,1,scale);
    for(const s of[-1,1]){
      oval(g,s*.415,.17,.43,.43,.35,.52,'#2b4545',[0,s*.18,-s*.10]);
      eye(g,s*.398,.191,.679,.25,.112,'#edb446','godzilla');
      oval(g,s*.405,.305,.54,.49,.22,.45,ridge,[.08,s*.14,s*.16]);
      for(let i=0;i<3;i++)soft(g,s*(.49-i*.035),-.03-i*.15,.23,.19,.22,.27,'#3e5954',[0,s*.18,s*.25]);
    }
    // Narrowed muzzle retains the mouth attachment at z=1.38 for the breath rig.
    form(g,art.profile([[-.62,.88,.95],[-.36,.94,1],[.34,.77,.85],[.62,.65,.74]],.28),0,-.065,.74,1,1,.43,'#3e5852',[Math.PI/2,0,0]);
    form(g,art.profile([[-.64,.92,.91],[-.40,.95,1],[.36,.77,.90],[.64,.67,.72]],.18),0,-.405,.70,1,1,.25,'#587063',[Math.PI/2,0,0]);
    soft(g,0,-.265,.78,.93,.13,1.13,'#172c30');
    plane(g,[[-.32,-.226],[.32,-.226],[.31,-.344],[-.31,-.344]],1.338,'#17282d',.016);
    for(let i=0;i<7;i++){
      const x=(i-3)*.087;form(g,art.crystal,x,-.259,1.362,.058,.080,.058,'#e1ddc3',[0,0,Math.PI]);
      if(i%2===0)form(g,art.crystal,x,-.332,1.36,.050,.060,.052,'#d3d7bf');
    }
    for(const s of[-1,1]){
      oval(g,s*.207,.008,1.31,.105,.046,.045,'#152e30',[0,0,s*.15]);
      for(let i=0;i<5;i++)form(g,art.crystal,s*(.455-i*.032),-.26,.35+i*.19,.062,.11,.066,'#d6d8bf',[0,0,Math.PI]);
      for(let i=0;i<3;i++)soft(g,s*.28,.13,.66+i*.19,.17,.09,.13,'#4c6760',[.16,0,s*.2]);
    }
    for(let i=0;i<3;i++)form(g,art.dorsal,0,.54-i*.10,-.39-i*.20,.24,.40-i*.045,.48,'#6f9d9b',[.20,0,0]);
    g.userData.portrait='reptile-long-snout';
  }
  return {mayor,kong,godzilla};
}
