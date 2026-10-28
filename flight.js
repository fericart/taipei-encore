// Flight has its own silhouette: the body's long axis follows travel, chest faces down.
export function createMayorFlight(THREE,hero,uniforms){
 const state={active:false,progress:0,amount:0,alignment:0};
 const before=new THREE.Vector3(),after=new THREE.Vector3(),direction=new THREE.Vector3(),right=new THREE.Vector3(),front=new THREE.Vector3(),down=new THREE.Vector3(0,-1,0),axis=new THREE.Vector3(0,1,0),matrix=new THREE.Matrix4(),rotation=new THREE.Quaternion(),bank=new THREE.Quaternion();
 const amount=p=>THREE.MathUtils.smoothstep(p,0,1.3)*(1-THREE.MathUtils.smoothstep(p,8.7,10));
 function position(p,idleY,out){const f=p/10,a=f*Math.PI*2,e=amount(p);return out.set(Math.sin(a)*44*e,THREE.MathUtils.lerp(idleY,12+Math.sin(f*Math.PI)*3,e),THREE.MathUtils.lerp(10.2,Math.cos(a)*43,e))}
 function update(t){
  const p=t%60,u=hero.userData;state.active=t>=60&&p<10;state.progress=state.active?p/10:0;state.amount=state.active?amount(p):0;state.alignment=0;
  const e=state.amount,flying=e>.12;uniforms.heroFlight.value=e;u.flightLimbs.visible=flying;u.idleLegs.visible=!flying;u.cheer.visible=!flying;u.hold.visible=!flying;
  if(!state.active)return state;
  const idleY=hero.position.y;position(p,idleY,hero.position);position(Math.max(0,p-.01),idleY,before);position(Math.min(10,p+.01),idleY,after);direction.copy(after).sub(before).normalize();
  // Matrix columns are local +X (right), +Y (headward), +Z (chestward).
  right.crossVectors(direction,down).normalize();if(right.lengthSq()<.001)right.set(1,0,0);front.crossVectors(right,direction).normalize();matrix.makeBasis(right,direction,front);rotation.setFromRotationMatrix(matrix);
  bank.setFromAxisAngle(axis,-.10*Math.sin(p/10*Math.PI));rotation.multiply(bank);hero.quaternion.slerp(rotation,e);
  u.neck.rotation.set(THREE.MathUtils.lerp(u.neck.rotation.x,-1.18,e),u.neck.rotation.y*(1-e),u.neck.rotation.z*(1-e));
  state.alignment=axis.clone().applyQuaternion(hero.quaternion).dot(direction);return state;
 }
 return {state,update};
}
