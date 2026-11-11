import {jsPDF} from 'jspdf';
const safe = s => String(s??'').trim();
const wrap = (doc,text,x,y,width,line=5) => {const lines=doc.splitTextToSize(safe(text)||'—',width);doc.text(lines,x,y);return y+lines.length*line;};
async function imageData(file){
  if(!file) return null;
  const url=URL.createObjectURL(file);
  try {const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url;});
    const max=1300,scale=Math.min(1,max/Math.max(img.width,img.height));
    const canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
    canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
    return {data:canvas.toDataURL('image/jpeg',0.78),w:canvas.width,h:canvas.height};
  } finally {URL.revokeObjectURL(url);}
}
export async function downloadPDF(report){
  const doc=new jsPDF({unit:'mm',format:'a4'});const margin=18;const usable=174;let y=20;
  function header(){doc.setFillColor(16,40,63);doc.rect(0,0,210,27,'F');doc.setFont('helvetica','bold');doc.setFontSize(16);doc.setTextColor(255);doc.text('INSPECTPRO',18,17);doc.setTextColor(28,42,56);doc.setFontSize(10);y=38;}
  function room(h){if(y+h>277){doc.addPage();header();}}
  function field(label,value){room(17);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text(label,margin,y);y+=5;doc.setFont('helvetica','normal');y=wrap(doc,value,margin,y,usable,5)+5;}
  header();doc.setFont('helvetica','bold');doc.setFontSize(17);doc.text('Rapport d’inspection',margin,y);y+=12;
  field('Référence',report.id.slice(0,8).toUpperCase());field('Type de rapport',report.type);field('Site / bâtiment',report.site);field('Date de l’inspection',report.date);field('Inspecteur',report.inspector);field('Remarques générales',report.notes);
  room(20);y+=4;doc.setFont('helvetica','bold');doc.setFontSize(14);doc.text(`Signalements (${report.issues.length})`,margin,y);y+=10;
  for(let idx=0;idx<report.issues.length;idx++){
    const issue=report.issues[idx];room(45);doc.setFillColor(236,242,247);doc.rect(margin,y-5,usable,9,'F');doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text(`${idx+1}. ${safe(issue.title)||'Anomalie'}`.slice(0,80),margin+3,y+1);y+=13;
    field('Localisation',issue.location);field('Gravité',issue.severity);field('Description',issue.description);field('Action recommandée',issue.action);
    for(const photo of issue.photos||[]){
      try{const image=await imageData(photo);if(!image)continue;const w=Math.min(usable,100);const h=Math.min(75,w*image.h/image.w);room(h+10);doc.addImage(image.data,'JPEG',margin,y,w,h);y+=h+10;}catch(e){console.warn('Photo ignorée',e);}
    }
    y+=5;
  }
  const pages=doc.getNumberOfPages();for(let p=1;p<=pages;p++){doc.setPage(p);doc.setFontSize(9);doc.setTextColor(120);doc.text(`Page ${p} / ${pages}`,190,288,{align:'right'});}
  doc.save(`inspection-${report.date}-${report.id.slice(0,8)}.pdf`);
}
