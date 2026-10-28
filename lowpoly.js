// Original faceted geometry. Reference images inform the art direction only;
// no reference image, texture, third-party character mesh or font is distributed.
export function createLowPolyKit(THREE) {
  function profile(rings, corner = .18) {
    const outline = [[.5-corner,.5],[-.5+corner,.5],[-.5,.5-corner],[-.5,-.5+corner],[-.5+corner,-.5],[.5-corner,-.5],[.5,-.5+corner],[.5,.5-corner]];
    const vertices = [], colors = [];
    let face = 0;
    function triangle(a,b,c) {
      const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),vc=new THREE.Vector3(...c);
      const normal=vb.clone().sub(va).cross(vc.clone().sub(va));
      if(normal.dot(va.clone().add(vb).add(vc))<0) [b,c]=[c,b];
      const value=1-((face++*13)%7)*.006;
      for(const p of [a,b,c]) {vertices.push(...p);colors.push(value,value,value);}
    }
    const loops=rings.map(([y,w,d])=>outline.map(([x,z])=>[x*w,y,z*d]));
    for(let r=0;r<loops.length-1;r++)for(let i=0;i<8;i++){
      const j=(i+1)%8,a=loops[r][i],b=loops[r][j],c=loops[r+1][j],d=loops[r+1][i];
      if((r+i)%2){triangle(a,b,d);triangle(b,c,d);}else{triangle(a,b,c);triangle(a,c,d);}
    }
    for(const row of [loops[0],loops.at(-1)])for(let i=1;i<7;i++)triangle(row[0],row[i],row[i+1]);
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
    geo.computeVertexNormals();geo.computeBoundingSphere();return geo;
  }
  const architecture=profile([[-.5,1,1],[.5,1,1]],.055);
  const soft=profile([[-.5,.74,.76],[-.32,1,1],[.32,1,1],[.5,.78,.80]],.17);
  const head=profile([[-.5,.62,.74],[-.34,.92,.98],[.18,1,1],[.43,.91,.90],[.5,.74,.74]],.15);
  const torso=profile([[-.5,.77,.84],[-.29,.83,.92],[.15,1,1],[.40,.95,.86],[.5,.77,.72]],.12);
  const oval=new THREE.SphereGeometry(.5,12,8).toNonIndexed();
  const ovalColors=[];for(let i=0;i<oval.attributes.position.count;i++){const v=1-(Math.floor(i/3)*7%5)*.005;ovalColors.push(v,v,v);}
  oval.setAttribute('color',new THREE.Float32BufferAttribute(ovalColors,3));oval.computeVertexNormals();
  const crystal=new THREE.ConeGeometry(.5,1,5,1).toNonIndexed();
  const plateShape=new THREE.Shape();[[0,-.48],[-.34,-.27],[-.30,.06],[-.49,.30],[-.19,.23],[0,.59],[.18,.29],[.45,.38],[.30,.02],[.39,-.26]].forEach(([x,y],i)=>i?plateShape.lineTo(x,y):plateShape.moveTo(x,y));plateShape.closePath();
  const dorsal=new THREE.ExtrudeGeometry(plateShape,{depth:.16,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.055,bevelThickness:.055,curveSegments:1});dorsal.translate(0,0,-.08);
  for(const geo of[crystal,dorsal])geo.setAttribute('color',new THREE.Float32BufferAttribute(Array(geo.attributes.position.count*3).fill(1),3));
  const materials=new Map();
  function material(color,glow=0,metalness=.02) {
    const key=`${color}/${glow}/${metalness}`;
    if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:glow,roughness:.78,metalness,flatShading:true,vertexColors:true}));
    return materials.get(key);
  }
  function mesh(parent,geometry,x,y,z,w,h,d,color,rotation=[0,0,0],glow=0) {
    const m=new THREE.Mesh(geometry,material(color,glow));m.position.set(x,y,z);m.scale.set(w,h,d);m.rotation.set(...rotation);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }
  function polygon(parent,points,z,depth,color) {
    const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:1});
    // Give this geometry a neutral color attribute, like the shared solids.
    geo.setAttribute('color',new THREE.Float32BufferAttribute(Array(geo.attributes.position.count*3).fill(1),3));
    return mesh(parent,geo,0,0,z,1,1,1,color);
  }
  function hair(parent,base='#302b29') {
    mesh(parent,soft,0,.28,-.14,1.29,.87,1.02,base);
    mesh(parent,soft,0,-.18,-.45,1.12,.61,.28,base);
    // Interlocking, directional locks: a swept top and a complete rear scalp.
    const locks=[[-.43,.49,.10,.46,.62,.80,-.30],[-.18,.64,.08,.51,.48,.84,-.52],[.12,.64,.04,.53,.44,.83,-.57],[.40,.53,.00,.44,.38,.76,-.58],[-.52,.15,-.01,.22,.74,.57,.12],[.53,.22,-.09,.22,.52,.52,-.11]];
    for(const [x,y,z,w,h,d,r]of locks)mesh(parent,soft,x,y,z,w,h,d,base,[.05,.05,r]);
    polygon(parent,[[-.54,.54],[-.10,.65],[.26,.49],[.09,.34],[-.20,.43],[-.46,.25]],.42,.12,'#483a33');
    polygon(parent,[[.05,.64],[.49,.51],[.53,.29],[.28,.33],[.12,.42]],.39,.11,'#282729');
    for(const s of[-1,1])mesh(parent,soft,s*.56,-.05,-.06,.13,.38,.26,base,[0,0,-s*.06]);
  }
  return {architecture,soft,head,torso,oval,crystal,dorsal,profile,mesh,polygon,hair};
}
