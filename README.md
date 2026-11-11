# InspectPro — inspections locales, même sans Internet

Application en français pour créer des rapports d'inspection d'usine, de dortoir ou de catégories personnalisées depuis un téléphone ou un ordinateur.

## Fonctionnalités

- Catégories de rapports personnalisables
- Plusieurs signalements par inspection : localisation, gravité, description, actions recommandées
- Photos prises avec l'appareil photo ou choisies depuis la galerie
- Rapports PDF téléchargeables, avec photos
- Historique local, recherche et modification de rapports
- Stockage local sur le téléphone (IndexedDB) ; aucun compte, aucune base de données cloud
- Application web installable (PWA) et cache des fichiers pour fonctionnement hors connexion **après un premier chargement en ligne réussi**
- Sauvegarde complète JSON (rapports, photos, catégories), à exporter dans les fichiers du téléphone
- Import d'une sauvegarde JSON (fusion avec les rapports existants)

## Tester le projet sur ordinateur

Installer Node.js 20.19+ ou 22.12+ et npm :

```bash
npm install
npm run dev
```

Ouvrez l'URL locale affichée. **Le mode hors connexion PWA fonctionne dans la version construite, pas dans le serveur de développement**. Pour le tester :

```bash
npm run build
npm run preview
```

Le site doit être servi en HTTPS (ou localhost) pour installer un service worker.

## Mettre sur GitHub

Créez un dépôt `inspectpro` sur GitHub, puis importez **le contenu de ce dossier**. Exemple en ligne de commande :

```bash
git init
git add .
git commit -m "InspectPro local et hors ligne"
git branch -M main
git remote add origin https://github.com/VOTRE-IDENTIFIANT/inspectpro.git
git push -u origin main
```

## Mettre en ligne, puis installer sur téléphone

Il faut une connexion Internet pour le **premier accès** et pour les mises à jour du code. Ensuite, les inspections et les PDF sont créés localement. Publiez le site sur un hébergement statique HTTPS, par exemple Vercel ou Netlify, en connectant le dépôt GitHub :

- Commande de build : `npm run build`
- Dossier publié : `dist`

Sur **Android** : ouvrir le site dans Chrome puis menu → « Ajouter à l'écran d'accueil » ou « Installer l'application » (si proposé).

Sur **iPhone** : ouvrir le site dans Safari puis Partager → « Sur l'écran d'accueil ».

Ouvrir l'application une fois avec Internet, puis vérifier le fonctionnement en mode avion. Certaines versions de navigateur peuvent limiter l'installation ou le fonctionnement hors connexion. L'application n'est pas un fichier APK / une application native.

## Où sont les données ?

Les rapports et photos sont stockés dans **IndexedDB dans le navigateur sur cet appareil**. Ils ne sont **pas enregistrés dans le dépôt GitHub**, et ils ne sont pas synchronisés avec un serveur. Le stockage peut être perdu en cas de réinitialisation du navigateur, de nettoyage des données, de désinstallation ou de panne de l'appareil. L'espace disponible dépend du téléphone et du navigateur. Les fichiers PDF sont enregistrés séparément lorsque vous les téléchargez.

**Il faut exporter régulièrement une sauvegarde JSON depuis le menu « Sauvegardes » et conserver le fichier hors de l'application.** Pour récupérer vos rapports, utiliser « Restaurer une sauvegarde ». Une sauvegarde peut contenir des photos sensibles : protégez vos fichiers et votre appareil.

## Limitations

- Ni synchronisation multi-appareils, ni authentification, ni stockage cloud.
- Le stockage local des navigateurs n'est pas une garantie de conservation permanente ; un export régulier reste indispensable.
- Les fichiers JSON contenant de nombreuses photos peuvent être volumineux et difficiles à importer sur certains téléphones.
- Les polices PDF standard peuvent mal représenter certains caractères spéciaux.
- Le mode hors connexion nécessite une première installation avec accès Internet et un navigateur compatible.

## Technologies

JavaScript, Vite, IndexedDB avec `idb`, jsPDF, service worker local et manifest PWA.
