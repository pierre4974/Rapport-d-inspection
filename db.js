import { openDB } from 'idb';
const database = openDB('inspectpro-db', 1, {upgrade(db) {
  db.createObjectStore('reports', {keyPath:'id'});
  db.createObjectStore('settings', {keyPath:'key'});
}});
export async function reports() {return (await (await database).getAll('reports')).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export async function saveReport(report) {return (await database).put('reports',report);}
export async function removeReport(id) {return (await database).delete('reports',id);}
export async function getCategories() {const row=await (await database).get('settings','categories');return row?.value ?? ['Inspection d’usine','Inspection de dortoir','Inspection générale'];}
export async function saveCategories(value) {return (await database).put('settings',{key:'categories',value});}
