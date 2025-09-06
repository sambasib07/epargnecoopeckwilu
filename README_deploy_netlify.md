
Coopec Kwilu - Fichiers accessoires pour déploiement Netlify & PWA
=================================================================

Fichiers générés (dans l'archive) :
- index.html                (copie nettoyée de indexo.html, prête pour Netlify)
- manifest.webmanifest      (manifeste PWA)
- sw.js                     (service worker pour mise en cache offline & app-shell)
- netlify.toml              (configuration Netlify : redirection SPA + headers)
- _headers                  (headers Netlify, cache-control pour SW/manifest)
- /icons/*.png              (icônes PWA en plusieurs tailles)
- apple-touch-icon.png      (icône iOS 180x180)
- README_deploy_netlify.md  (ce fichier d'instructions détaillées)

Étapes rapides pour déployer (rapide) :
1) Dans Netlify, créez un nouveau site (drag & drop) : glissez l'archive ZIP ou déposez les fichiers (index.html à la racine).
   - Ou liez un dépôt Git contenant ces fichiers.
2) Vérifiez que le site est servi en HTTPS (Netlify le fait par défaut).
3) Ouvrez le site sur Chrome Android -> Ouvrez DevTools (Lighthouse) ou utilisez le menu -> Ajouter à l'écran d'accueil.
4) Sur iOS Safari : utilisez le bouton Partager -> "Sur l'écran d'accueil".
5) Sur Desktop Chrome / Edge : cliquez sur l'icône d'installation dans la barre d'adresse (si disponible).

Notes importantes de sécurité & corrections recommandées :
- Ne laissez jamais de mot de passe hardcodé côté client (ex: "coopec2023" dans le JS). Stockez l'authentification côté serveur et utilisez tokens/session sécurisés.
- La requête fetch() vers Google Apps Script est faite en mode 'no-cors' : cela empêche de lire la réponse du serveur. Si vous voulez confirmer l'enregistrement et afficher les erreurs, retirez `mode: 'no-cors'` et configurez CORS côté Apps Script.
- Évitez les IDs dupliqués dans le HTML (ex: 'home-page' apparaît plusieurs fois). Ce package contient une copie nettoyée (index.html) où une duplication a été retirée.
- Testez le service worker et forcez son rafraîchissement lors du déploiement (DevTools -> Application -> Service Workers -> Update).
- Netlify sert correctement les fichiers statiques en HTTPS ; les policies CSP (Content Security Policy) peuvent être ajoutées si besoin.

Si vous souhaitez :
- Que je transforme entièrement votre code en structure d'un petit projet (avec build, icons SVG, README complet en français + CI pour déploiement automatique), dites-le et je fournirai tout en une fois.
- Je peux aussi corriger et améliorer le code JavaScript (suppression de duplicata, extraction de fonctions, meilleure gestion des erreurs réseau, etc.).
