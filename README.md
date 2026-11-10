# InspectPro — application de rapports d'inspection

Application web responsive en français permettant de créer des inspections (usine, dortoir, etc.), ajouter des signalements avec photos, générer un PDF et consulter l'historique.

## Installation locale

Prérequis : Node.js 20.19+ ou 22.12+ et npm.

```bash
npm install
npm run dev
```

Ouvrez l'adresse affichée dans le terminal (généralement http://localhost:5173).

## Mettre le projet sur GitHub

1. Créez un dépôt GitHub vide, par exemple `inspectpro`.
2. Décompressez le ZIP, puis ouvrez un terminal dans le dossier `inspectpro`.
3. Exécutez :

```bash
git init
git add .
git commit -m "Première version InspectPro"
git branch -M main
git remote add origin https://github.com/VOTRE-NOM/inspectpro.git
git push -u origin main
```

Remplacez `VOTRE-NOM` par votre identifiant GitHub.

## Publier en ligne

Pour Vercel ou Netlify, importez le dépôt GitHub. Commande de build : `npm run build` ; dossier de sortie : `dist`. Le site utilise Vite.

## Fonctionnalités

- Catégories d'inspection personnalisables
- Fiches d'inspection : site, date, inspecteur et notes
- Plusieurs anomalies par rapport : titre, localisation, gravité, description, action corrective
- Plusieurs photos par anomalie (caméra ou galerie selon l'appareil)
- PDF téléchargeable avec images et pagination
- Historique consultable, recherche, réouverture et suppression
- Fonctionnement sans compte, données enregistrées localement via IndexedDB

## Limites importantes de cette version

**Les rapports sont enregistrés dans le navigateur de l'appareil**, pas sur GitHub ni sur un serveur. Ils ne se synchronisent pas entre appareils et peuvent être perdus si les données du navigateur sont effacées. Faites régulièrement des exports PDF. Il n'y a pas encore de connexion utilisateur, de partage entre inspecteurs, de sauvegarde cloud, ni de véritable mode hors connexion garanti. Pour un usage professionnel en équipe, il faudra ajouter une base de données et un stockage d'images sécurisés (par exemple Supabase), ainsi qu'une authentification et des sauvegardes.

La génération PDF utilise les polices standard de jsPDF, qui peuvent afficher imparfaitement certains caractères Unicode. Les photos volumineuses peuvent occuper beaucoup d'espace sur l'appareil.

## Technologies

- JavaScript + Vite
- IndexedDB via `idb`
- `jspdf` pour les PDF
- CSS responsive, sans framework d'interface
