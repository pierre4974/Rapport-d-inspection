import {defineConfig} from 'vite';
import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join, relative} from 'node:path';

async function recursiveFiles(dir) {
  const entries=await readdir(dir,{withFileTypes:true});
  const files=[];
  for (const entry of entries) {
    const path=join(dir,entry.name);
    if(entry.isDirectory()) files.push(...await recursiveFiles(path));
    else if(entry.isFile()) files.push(path);
  }
  return files;
}

function offlineWorker() {
  return {name:'inspectpro-offline-worker',apply:'build',async closeBundle(){
    const dir=join(process.cwd(),'dist');
    const files=(await recursiveFiles(dir)).map(path=>relative(dir,path).replaceAll('\\','/')).filter(path=>!['sw.js'].includes(path));
    const version='inspectpro-'+Date.now();
    const source=`const CACHE=${JSON.stringify(version)};\nconst FILES=${JSON.stringify(files)};\nconst urls=FILES.map(file=>new URL(file,self.registration.scope).href);\nself.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(urls)).then(()=>self.skipWaiting())));\nself.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('inspectpro-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));\nself.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;event.respondWith(req.mode==='navigate'?fetch(req).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(req,response.clone()));return response;}).catch(()=>caches.match(new URL('index.html',self.registration.scope).href)):caches.match(req).then(hit=>hit||fetch(req).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(req,response.clone()));return response;})));});`;
    await writeFile(join(dir,'sw.js'),source);
  }};
}
export default defineConfig({base:'/Rapport-d-inspection/',plugins:[offlineWorker()]});
