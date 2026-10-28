// Original canvas typography and geometric pictograms; shared by front and rear facades.
export function policyTexture(THREE,a,index){
 const c=document.createElement('canvas');c.width=1024;c.height=768;
 const ctx=c.getContext('2d'),accent=a.color,details={
  'ai-city':['300','公頃・整體規劃構想','FUTURE CITY'],
  'ai-education':['92','億元・四年教育規劃','NEXT GENERATION'],
  'senior-next':['2027','預定擴大通路','AGE FRIENDLY'],
  transit:['1,200','元月票・四市一起行','CONNECTED CITY'],
  senior:['600','點／月・敬老卡','CARE FOR EVERY AGE'],
  dome:['2023','年底啟用','CULTURE & SPORT']
 }[a.story];
 const text=(value,x,y,size,color,max=920,weight=800)=>{ctx.fillStyle=color;ctx.font=`${weight} ${size}px Arial,"PingFang TC",sans-serif`;ctx.fillText(value,x,y,max)};
 ctx.fillStyle='#090c1d';ctx.fillRect(0,0,1024,768);
 const wash=ctx.createLinearGradient(1024,0,200,768);wash.addColorStop(0,accent+'55');wash.addColorStop(1,'#090c1d');ctx.fillStyle=wash;ctx.fillRect(0,0,1024,768);
 ctx.fillStyle=accent;ctx.fillRect(0,0,1024,10);ctx.fillRect(42,39,9,24);
 ctx.textBaseline='middle';text('TAIPEI / ENCORE',67,52,26,'#edf3ff',450);text(details[2],634,52,23,accent,346);
 text(a.title,44,151,94,'#ffffff',935,900);
 ctx.fillStyle=accent+'25';ctx.fillRect(735,238,244,216);
 ctx.strokeStyle=accent;ctx.lineWidth=4;ctx.strokeRect(735,238,244,216);
 ctx.save();ctx.translate(765,270);
 if(a.story.startsWith('ai')){
  for(let y=0;y<3;y++)for(let x=0;x<3;x++){ctx.fillStyle=(x+y)%2?accent:'#edfaff';ctx.fillRect(x*67,y*55,22,22);if(x<2){ctx.fillStyle=accent+'80';ctx.fillRect(x*67+22,y*55+9,45,4)}if(y<2){ctx.fillStyle=accent+'80';ctx.fillRect(x*67+9,y*55+22,4,33)}}
 }else if(a.story==='transit'){
  ctx.fillStyle=accent;ctx.fillRect(0,18,181,104);ctx.fillStyle='#111d2f';for(let x=12;x<170;x+=43)ctx.fillRect(x,30,31,42);ctx.fillStyle='#f6fbff';for(const x of[28,139]){ctx.beginPath();ctx.arc(x,132,17,0,Math.PI*2);ctx.fill()}ctx.fillRect(5,150,172,5);
 }else if(a.story==='dome'){
  ctx.beginPath();ctx.ellipse(91,91,87,60,0,Math.PI,Math.PI*2);ctx.lineTo(178,122);ctx.lineTo(4,122);ctx.closePath();ctx.stroke();for(let x=26;x<165;x+=24){ctx.beginPath();ctx.moveTo(x,88);ctx.lineTo(x,122);ctx.stroke()}ctx.fillStyle=accent;ctx.fillRect(3,135,176,7);
 }else{
  ctx.fillStyle=accent;ctx.beginPath();ctx.moveTo(91,145);ctx.bezierCurveTo(-65,50,32,-32,91,35);ctx.bezierCurveTo(150,-32,246,50,91,145);ctx.fill();ctx.fillStyle='#0a1425';ctx.fillRect(80,52,22,66);ctx.fillRect(58,74,66,22);
 }
 ctx.restore();
 text(details[0],40,335,a.story==='transit'?174:188,accent,668,900);
 text(details[1],48,457,43,'#f2f5ff',650);
 ctx.fillStyle=accent+'19';ctx.fillRect(42,515,938,117);ctx.fillStyle=accent;ctx.fillRect(42,515,7,117);
 text(a.status,67,550,31,accent,882);text(a.note,67,597,29,'#e8eaf8',882,600);
 ctx.fillStyle=accent;ctx.fillRect(0,672,1024,96);text(String(index+1).padStart(2,'0')+' / 城市故事',43,718,28,'#0b1020',420);text('gov.taipei  ↗ 查看政策與來源',460,718,30,'#0b1020',520);
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx;
}
