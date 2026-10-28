// Original procedural fan animation. No film frames, audio, textures or models are used.
export function createCinematic(THREE,world,chars,{group,box,voxelBox,segment,fist}){
 const tau=Math.PI*2,Y=new THREE.Vector3(0,1,0),scratch=new THREE.Vector3(),temp=new THREE.Object3D();
 const smooth=(a,b,t)=>THREE.MathUtils.smoothstep(t,a,b);
 const envelope=(t,start,end,fade=.6)=>smooth(start,start+fade,t)*(1-smooth(end-fade,end,t));
 const kong=chars[1],godzilla=chars[2],ku=kong.userData,gu=godzilla.userData;
 for(const [c,p,lean]of[[kong,[2.02,3.55,-.25],.23],[godzilla,[-1.32,3.15,.84],-.20]]){
  c.updateWorldMatrix(true,false);c.userData.gripLocal=new THREE.Vector3(...p);c.userData.gripAnchor=c.localToWorld(c.userData.gripLocal.clone());c.userData.outwardLean=lean;
 }
 function anchorBody(c,roll){const u=c.userData;c.rotation.z=roll;scratch.copy(u.gripLocal).multiply(c.scale).applyQuaternion(c.quaternion);c.position.copy(u.gripAnchor).sub(scratch)}
 // A separate bent arm makes the chest contact visible while the other hand grips 101.
 const pound=group(kong),upper=group(pound),fore=group(pound),knuckles=group(pound);
 voxelBox(upper,0,0,0,.78,1,.83,'#99572c',.13);voxelBox(fore,0,0,0,.72,1,.78,'#99572c',.12);fist(knuckles,[0,0,0],.78,'#e3b77c');pound.visible=false;
 const shoulder=new THREE.Vector3(-1.05,2.85,.08),elbow=new THREE.Vector3(),hand=new THREE.Vector3();
 function fitBone(mesh,a,b){mesh.position.copy(a).add(b).multiplyScalar(.5);scratch.copy(b).sub(a);mesh.scale.y=scratch.length();mesh.quaternion.setFromUnitVectors(Y,scratch.normalize())}
 // The complete breath effect is attached to the mouth, so every sweep follows the head.
 const breath=group(gu.head,0,-.15,1.38),layers=[];
 for(const [radius,color,opacity]of[[.54,'#116bff',.20],[.31,'#29d9ff',.45],[.13,'#d9ffff',.85]]){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,.065,6.6,10,8,true),new THREE.MeshBasicMaterial({color,transparent:true,opacity,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));mesh.rotation.x=Math.PI/2;mesh.position.z=3.3;breath.add(mesh);layers.push({mesh,opacity});
 }
 const sparks=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:'#4ccfff',transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}),90);sparks.frustumCulled=false;breath.add(sparks);
 const throat=new THREE.PointLight('#3cdaff',0,35,2);throat.position.set(0,0,.3);breath.add(throat);breath.visible=false;
 const charge=new THREE.PointLight('#167dff',0,26,2);charge.position.set(0,3.1,-.7);godzilla.add(charge);
 // One original red/blue masked web-slinger crosses the city.
 const spiders=[];
 function spider(side){
  const g=group(world);g.scale.setScalar(2.5);const red='#df3450',blue='#185fc7',dark='#1a2136';
  voxelBox(g,0,.88,0,.56,.74,.34,red,.1);for(const s of[-1,1])box(g,s*.25,.77,.02,.16,.48,.37,blue);
  voxelBox(g,0,1.52,.02,.57,.63,.5,red,.08);
  for(const s of[-1,1]){const eye=group(g,s*.16,1.57,.29);eye.rotation.z=s*-.22;box(eye,0,0,0,.22,.18,.025,dark);box(eye,0,.01,.018,.155,.105,.018,'#f4ffff');}
  for(let i=0;i<5;i++){box(g,0,1.28+i*.115,.279,.025,.035,.025,dark);for(const s of[-1,1])box(g,s*(.12+i*.025),1.27+i*.09,.28,.025,.035,.025,dark)}
  for(let y=.61;y<1.19;y+=.15)box(g,0,y,.184,.48,.023,.02,dark);
  box(g,0,.91,.21,.11,.21,.04,dark);for(const s of[-1,1])for(let i=0;i<3;i++)segment(g,[s*.04,.97-i*.055,.22],[s*.21,1.1-i*.16,.22],.022,.022,dark);
  const webArm=group(g,side*.34,1.17,0);segment(webArm,[0,0,0],[side*.18,.38,.02],.18,.2,red);segment(webArm,[side*.18,.38,.02],[side*.1,.85,.07],.17,.18,red);
  const wrist=group(webArm,side*.1,.88,.07);box(wrist,0,0,0,.18,.19,.16,red);for(const s of[-1,1])box(wrist,s*.065,.13,0,.045,.16,.06,red);
  segment(g,[-side*.32,1.15,0],[-side*.62,.91,.18],.19,.2,blue);segment(g,[-side*.62,.91,.18],[-side*.48,.69,.38],.17,.18,red);
  const legs=[];for(const s of[-1,1]){const leg=group(g,s*.16,.53,0);segment(leg,[0,0,0],[s*.12,-.4,.1],.21,.23,blue);segment(leg,[s*.12,-.4,.1],[s*.18,-.69,.34],.2,.22,red);box(leg,s*.18,-.7,.4,.23,.19,.38,red);legs.push(leg)}
  const anchor=new THREE.Vector3(side*3.7,20.875,3.2),positions=new Float32Array(25*3),geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));const web=new THREE.Line(geo,new THREE.LineBasicMaterial({color:'#e7faff',transparent:true,opacity:.9}));web.frustumCulled=false;world.add(web);
  g.visible=false;web.visible=false;spiders.push({g,web,wrist,webArm,legs,anchor,side,positions,start:side<0?18:19.3,handWorld:new THREE.Vector3()});
 }
 spider(-1);
 function updateSpiders(phase,t){let visible=0;
  for(const s of spiders){const age=phase-s.start;s.g.visible=age>=0&&age<8;s.web.visible=s.g.visible&&age<6.3;if(!s.g.visible)continue;visible++;
   const swing=THREE.MathUtils.clamp((age-.65)/5.6,0,1),theta=-.99+swing*1.8,arc=Math.sin(theta)*34;
   s.g.position.set(s.anchor.x-s.side*arc,s.anchor.y-Math.cos(theta)*34,10+Math.sin(swing*Math.PI)*10);
   if(age>6.3){const release=age-6.3;s.g.position.x-=s.side*release*13;s.g.position.y+=release*14;s.g.position.z-=release*7;}
   s.g.rotation.set(.2+Math.sin(swing*Math.PI)*.25,-s.side*.18,-s.side*(theta*.75+.1));
   s.legs[0].rotation.x=-.45-Math.sin(swing*Math.PI)*.5;s.legs[1].rotation.x=.25+Math.sin(swing*Math.PI)*.6;
   // Wrist rotates toward the actual building attachment, and the web grows outward first.
   s.g.updateWorldMatrix(true,true);s.wrist.getWorldPosition(s.handWorld);
   const shot=smooth(0,.55,age);
   for(let j=0;j<25;j++){const u=j/24*shot;scratch.copy(s.handWorld).lerp(s.anchor,u);scratch.y-=Math.sin(u*Math.PI)*(.08+Math.max(0,.65-age)*1.8);scratch.z+=Math.sin(u*Math.PI*5+t*11)*.035*Math.sin(u*Math.PI);s.positions[j*3]=scratch.x;s.positions[j*3+1]=scratch.y;s.positions[j*3+2]=scratch.z;}
   s.web.geometry.attributes.position.needsUpdate=true;
  }return visible;
 }
 const safetySphere=new THREE.Sphere(new THREE.Vector3(),12),fireRay=new THREE.Ray(),mouthWorld=new THREE.Vector3(),directionWorld=new THREE.Vector3(),intersection=new THREE.Vector3(),closest=new THREE.Vector3();
 const arcOrigin=new THREE.Vector3(),arcTarget=new THREE.Vector3(),arcDirection=new THREE.Vector3(),forward=new THREE.Vector3(0,0,1),inverseBody=new THREE.Quaternion(),aimRotation=new THREE.Quaternion();
 const state={clearance:0,phase:0,act:'開場',breath:0,spiders:0,gripError:0,breathTip:[0,0,0],sweepProgress:0};
 function update(t){
  const p=t%30,k=envelope(p,1.5,9),g=envelope(p,10,18.5),fire=envelope(p,11.6,17.9,.5);state.phase=p;
  anchorBody(kong,ku.outwardLean+Math.sin(t*.7)*.018+k*Math.sin((p-2)*tau*2)*.015);
  anchorBody(godzilla,gu.outwardLean+Math.sin(t*.6)*.015);
  ku.neck.rotation.x=THREE.MathUtils.lerp(ku.neck.rotation.x,-.40+Math.sin(t*12)*.035,k);ku.neck.rotation.y*=1-k;ku.neck.rotation.z*=1-k;
  pound.visible=k>.05;ku.cheer.visible=!pound.visible;
  if(pound.visible){const beat=((p-1.5)*2.25)%1,recoil=beat<.22?1-beat/.22:(beat-.22)/.78;hand.set(.07,2.42,1.36+.95*smooth(0,1,recoil));elbow.set(-1.15,2.15,1.0+recoil*.32);fitBone(upper,shoulder,elbow);fitBone(fore,elbow,hand);knuckles.position.copy(hand);knuckles.rotation.y=-.22;}
  // Aim along the user's right-side arc: high right, out to the side, then low right.
  state.sweepProgress=smooth(11.6,17.9,p);const arcAngle=THREE.MathUtils.lerp(1.15,-1.43,state.sweepProgress);
  gu.neck.getWorldPosition(arcOrigin);arcTarget.set(arcOrigin.x+Math.cos(arcAngle)*27,Math.max(-22,arcOrigin.y+Math.sin(arcAngle)*31),arcOrigin.z+18);
  godzilla.getWorldQuaternion(inverseBody).invert();arcDirection.copy(arcTarget).sub(arcOrigin).normalize().applyQuaternion(inverseBody);aimRotation.setFromUnitVectors(forward,arcDirection);gu.neck.quaternion.slerp(aimRotation,g);
  charge.intensity=g*(9+Math.sin(t*13)*2);breath.visible=fire>.005;state.breath=fire;throat.intensity=fire*16;
  if(breath.visible){
   // Keep the visible endpoint on the outside arc and retain the full-body safety bound.
   breath.scale.set(1,1,1);breath.updateWorldMatrix(true,false);chars[0].updateWorldMatrix(true,false);safetySphere.center.set(0,2.3,.1);chars[0].localToWorld(safetySphere.center);breath.getWorldPosition(mouthWorld);breath.getWorldDirection(directionWorld);fireRay.set(mouthWorld,directionWorld);
   const fullLength=7.2*godzilla.scale.z;let allowed=Math.min(fullLength,mouthWorld.distanceTo(arcTarget))*(.5+fire*.5);
   if(safetySphere.containsPoint(mouthWorld))allowed=0;else if(fireRay.intersectSphere(safetySphere,intersection))allowed=Math.min(allowed,Math.max(0,mouthWorld.distanceTo(intersection)-.7));
   breath.scale.z=allowed/fullLength;breath.visible=allowed>.1;state.breathTip=mouthWorld.clone().addScaledVector(directionWorld,allowed).toArray();
   const projected=THREE.MathUtils.clamp(safetySphere.center.clone().sub(mouthWorld).dot(directionWorld),0,allowed);closest.copy(mouthWorld).addScaledVector(directionWorld,projected);state.clearance=closest.distanceTo(safetySphere.center)-safetySphere.radius;
   for(const {mesh,opacity}of layers){mesh.material.opacity=opacity*fire*(.9+Math.sin(t*23)*.1);mesh.scale.x=mesh.scale.z=1+Math.sin(t*21)*.05;}
   for(let i=0;i<90;i++){const f=(i/90+t*1.9)%1,a=i*2.399+t*7,r=(.08+f*.48)*(i%3===0?.9:.55);temp.position.set(Math.cos(a)*r,Math.sin(a)*r,f*7.1);temp.rotation.set(t+i,i*.7,t*2);const size=(.06+f*.11)*(1-f*.55);temp.scale.set(size,size,size*(2+f*2));temp.updateMatrix();sparks.setMatrixAt(i,temp.matrix)}sparks.instanceMatrix.needsUpdate=true;
  }
  state.spiders=updateSpiders(p,t);state.act=k>.05?'金剛抬頭捶胸':g>.05?'哥吉拉右側弧形掃射':state.spiders?'蜘蛛人射絲飛躍':'城市歡呼';
  let error=0;for(const c of[kong,godzilla]){c.updateWorldMatrix(true,false);scratch.copy(c.userData.gripLocal);c.localToWorld(scratch);error=Math.max(error,scratch.distanceTo(c.userData.gripAnchor))}state.gripError=error;
  return state;
 }
 // Keep the outward lean even when reduced motion starts in a paused state.
 anchorBody(kong,ku.outwardLean);anchorBody(godzilla,gu.outwardLean);
 return {update,state};
}
