import { reports, getCategories, importData } from './db';

const FILE_VERSION = 1;
const photoToDataURL = blob => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(blob);
});

async function dataURLToBlob(value) {
  if (typeof value !== 'string' || !/^data:image\/(jpeg|png|webp|gif);base64,/.test(value)) throw new Error('Photo invalide');
  const response = await fetch(value);
  return response.blob();
}

export async function exportBackup() {
  const all = await reports();
  const serialized = [];
  for (const report of all) {
    const issues = [];
    for (const issue of report.issues || []) {
      const photos = [];
      for (const photo of issue.photos || []) photos.push(await photoToDataURL(photo));
      issues.push({...issue, photos});
    }
    serialized.push({...report, issues});
  }
  const backup = {app:'InspectPro',version:FILE_VERSION,exportedAt:new Date().toISOString(),categories:await getCategories(),reports:serialized};
  const blob = new Blob([JSON.stringify(backup)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  try {
    const a=document.createElement('a');a.href=url;a.download=`inspectpro-sauvegarde-${new Date().toISOString().slice(0,10)}.json`;
    document.body.append(a);a.click();a.remove();
  } finally {setTimeout(()=>URL.revokeObjectURL(url),2000);}
}

export async function restoreBackup(file) {
  // This import merges reports by ID; existing reports not present in backup are kept.
  if (file.size > 200 * 1024 * 1024) throw new Error('La sauvegarde dépasse 200 Mo.');
  const obj = JSON.parse(await file.text());
  if (obj.app !== 'InspectPro' || obj.version !== FILE_VERSION || !Array.isArray(obj.reports) || !Array.isArray(obj.categories)) {
    throw new Error('Ce fichier n’est pas une sauvegarde InspectPro valide.');
  }
  const categories = obj.categories.filter(v => typeof v === 'string' && v.length > 0 && v.length < 100).slice(0,100);
  if (!categories.length || obj.reports.length > 10000) throw new Error('Sauvegarde invalide.');
  const normalized = [];
  for (const report of obj.reports) {
    if (!report || typeof report.id !== 'string' || typeof report.type !== 'string' || !Array.isArray(report.issues) || report.issues.length > 1000) throw new Error('Rapport invalide.');
    const issues=[];
    for (const issue of report.issues) {
      if (!issue || !Array.isArray(issue.photos) || issue.photos.length > 100) throw new Error('Signalement invalide.');
      const photos=[];
      for (const photo of issue.photos) photos.push(await dataURLToBlob(photo));
      issues.push({...issue,photos});
    }
    normalized.push({...report,issues});
  }
  await importData(normalized,categories);
  return normalized.length;
}
