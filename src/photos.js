// Photos d'inspection : stocker des JPEG compatibles avec Safari et jsPDF.
// Ne jamais remplacer les photos existantes lors d'une migration implicite.
export function photoUrl(photo) {
  if (photo instanceof Blob && photo.size > 0) return URL.createObjectURL(photo);
  if (typeof photo === 'string' && /^data:image\//.test(photo)) return photo;
  return '';
}

export async function jpegFromFile(file) {
  if (!(file instanceof Blob) || !file.size) throw new Error('Le fichier photo est vide.');
  if (file.size > 35 * 1024 * 1024) throw new Error('Photo trop volumineuse (35 Mo maximum).');
  // iOS peut produire des HEIC/HEIF; la lecture dans un <img> est tentée
  // sur le téléphone, puis le rendu canvas est exporté en JPEG.
  const url=URL.createObjectURL(file);
  let image;
  try {
    image=await new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=()=>reject(new Error('Format photo non pris en charge. Réessayez avec une photo JPEG.'));
      img.src=url;
    });
    const w=image.naturalWidth||image.width;
    const h=image.naturalHeight||image.height;
    if(!w||!h) throw new Error('La photo est illisible.');
    const ratio=Math.min(1,1600/Math.max(w,h));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(w*ratio));
    canvas.height=Math.max(1,Math.round(h*ratio));
    const ctx=canvas.getContext('2d');
    if(!ctx) throw new Error('Impossible de préparer la photo.');
    ctx.drawImage(image,0,0,canvas.width,canvas.height);
    const jpeg=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.82));
    if(!jpeg || !jpeg.size || jpeg.type!=='image/jpeg') throw new Error('Conversion JPEG impossible.');
    return jpeg;
  } finally {URL.revokeObjectURL(url);}
}

export function renderPhoto(photo, alt='Photo') {
  const url=photoUrl(photo);
  if(!url) return '<span class="photo-error">Photo indisponible</span>';
  // La fonction appelante gère la révocation des object URLs au prochain rendu.
  return url;
}
