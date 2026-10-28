// The monsters watch the hero leave and return, with pupils kept inside their eyes.
export function createFlightWatch(THREE,chars){
 const target=new THREE.Vector3(),local=new THREE.Vector3(),state={amount:0,shifts:[]};
 function update(flight){
  const f=flight.progress;
  state.amount=flight.active?flight.amount*((1-THREE.MathUtils.smoothstep(f,.20,.38))+THREE.MathUtils.smoothstep(f,.62,.80)):0;
  chars[0].userData.head.getWorldPosition(target);state.shifts=[];
  for(const c of chars.slice(1)){
   const u=c.userData,a=state.amount;
   if(a>0){
    local.copy(target);c.worldToLocal(local);local.sub(u.neck.position);
    const yaw=THREE.MathUtils.clamp(Math.atan2(local.x,local.z),-.65,.65),pitch=THREE.MathUtils.clamp(-Math.atan2(local.y,Math.hypot(local.x,local.z)),-.55,.35);
    u.neck.rotation.y=THREE.MathUtils.lerp(u.neck.rotation.y,yaw,a*.70);
    u.neck.rotation.x=THREE.MathUtils.lerp(u.neck.rotation.x,pitch,a*.55);
   }
   u.head.updateWorldMatrix(true,false);local.copy(target);u.head.worldToLocal(local);
   const dx=THREE.MathUtils.clamp(local.x/Math.max(1,Math.abs(local.z)),-1,1)*.065*a,dy=THREE.MathUtils.clamp(local.y/Math.max(1,Math.abs(local.z)),-1,1)*.030*a;
   for(const eye of u.head.userData.eyes||[]){eye.position.copy(eye.userData.rest);eye.position.x+=dx;eye.position.y+=dy;}
   state.shifts.push([dx,dy]);
  }
  return state;
 }
 return {update,state};
}
