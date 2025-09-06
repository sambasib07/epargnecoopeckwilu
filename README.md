# Coopec Kwilu — Pack d'installation PWA (Netlify)

Ce pack ajoute l'installation comme application (Android, iOS, Desktop) **sans changer le fonctionnement** de votre page existante.

## Contenu
- `manifest.json` : manifeste Web App (icônes, couleurs, affichage).
- `sw.js` : Service Worker pour le mode "installable" + cache.
- `icons/` : icônes (maskable) 192, 256, 384, 512.
- `offline.html` : page de secours hors-ligne.
- `netlify.toml` : configuration Netlify (redirige `/*` vers `indexo.html`, entêtes PWA).

> Votre fichier existant reste **indexo.html**. Aucun script n'est modifié.

## Déploiement sur Netlify (rapide)
1. Téléversez **tous** ces fichiers (ainsi que votre `indexo.html`) à la racine de votre site Netlify.
2. Si le projet est sur Git :
   - Copiez ces fichiers à la racine du dépôt (dossier `/icons` inclus).
   - Poussez les changements sur la branche liée à Netlify.
3. Assurez-vous que l'URL de production est en **HTTPS** (Netlify l'est par défaut).
4. Ouvrez le site :
   - Android/Chrome : Menu (⋮) → *Ajouter à l'écran d'accueil*.
   - iOS/Safari : Partager (⎗) → *Sur l'écran d'accueil*.
   - Desktop (Chrome/Edge/Opera) : Icône *Installer* dans la barre d'adresse.
   - Desktop Safari : Fichier → Ajouter à la liste de lecture (mode app via Sonoma/Sequoia).

## Points techniques
- Le service worker est enregistré depuis votre page via `navigator.serviceWorker.register('/sw.js')`.
- `netlify.toml` inclut `Service-Worker-Allowed: /` pour étendre la portée au site entier.
- `redirects` renvoie `/*` vers `indexo.html` (status 200) — votre application s'ouvre quelle que soit l'URL.
- Les icônes fournies sont **maskable**, conformes aux stores d'icônes modernes.
- Le cache applique *stale‑while‑revalidate* pour les ressources tierces; Apps Script reste *network‑first*.

## Personnalisations (optionnel)
- Remplacez les icônes du dossier `icons/` par vos logos exportés aux mêmes tailles.
- Si vous renommez `indexo.html` en `index.html`, supprimez la règle de redirection dans `netlify.toml`.

Bon déploiement !
