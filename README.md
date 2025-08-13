# Négocé IA 🚀🧠

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Client%20v2-3fcf8e?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Licence: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Application Next.js moderne (App Router) en TypeScript, prête pour la mise en production, avec Tailwind CSS v4, intégration Supabase (client JS), et déploiement sur Vercel.

🌐 Production: https://negoce-ia.vercel.app

---

## Sommaire 📚

- [Aperçu](#aperçu-)
- [Fonctionnalités](#fonctionnalités-)
- [Stack technique](#stack-technique-)
- [Prérequis](#prérequis-)
- [Installation](#installation-)
- [Configuration (variables d’environnement)](#configuration-variables-denvironnement-)
- [Lancer le projet](#lancer-le-projet-)
- [Scripts NPM](#scripts-npm-)
- [Arborescence](#arborescence-)
- [Architecture & conventions](#architecture--conventions-)
- [Qualité du code](#qualité-du-code-)
- [Déploiement](#déploiement-)
- [Supabase (intégration)](#supabase-intégration-)
- [FAQ](#faq-)
- [Roadmap](#roadmap-)
- [Contribuer](#contribuer-)
- [Licence](#licence-)

---

## Aperçu 👀

Négocé IA est une base Next.js 15 utilisant le routeur App, React 19 et Tailwind CSS 4, pensée pour accélérer la construction d’une application web moderne autour de la visualisation/interaction et d’une possible intégration de données via Supabase. Elle s’appuie sur les bonnes pratiques de l’écosystème Vercel pour un déploiement rapide. ✨

---

## Fonctionnalités ✨

- ⚛️ Next.js 15 (App Router) avec TypeScript
- ⚙️ React 19
- 🎨 Tailwind CSS v4 (configuration PostCSS minimale)
- 🧹 ESLint configuré pour Next.js/TypeScript
- ⚡ Turbopack en développement pour des itérations rapides
- 🖼️ Icônes avec lucide-react
- 📝 Rendu Markdown côté client via react-markdown
- 🔌 Intégration Supabase prête côté client (supabase-js v2)
- 🚀 Configuration de build et déploiement sur Vercel

---

## Stack technique 🧰

- Framework: Next.js 15
- Langage: TypeScript
- UI: Tailwind CSS 4
- Icônes/UI: lucide-react (+ utilitaires tailwind-merge)
- Données: Supabase (client JS)
- Rendu Markdown: react-markdown
- Hébergement: Vercel

---

## Prérequis ✅

- 🟢 Node.js >= 18.18.0 (Node 20+ recommandé)
- 📦 npm (recommandé, un `package-lock.json` est présent)

---

## Installation 🛠️

Cloner le dépôt puis installer les dépendances:

```bash
git clone https://github.com/Okpeyemi/negoce-ia.git
cd negoce-ia
npm ci    # installation déterministe (ou: npm install)
```

---

## Configuration (variables d’environnement) 🔐

Créez un fichier `.env.local` à la racine si vous utilisez Supabase:

```bash
touch .env.local
```

Exemples de variables:

```bash
# Supabase (exemples)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Notes:
- 🧭 Les clés NEXT_PUBLIC_ sont exposées au client. Ne mettez pas de secrets serveur dans ces variables.
- 🛡️ Pour des usages serveur (si vous en ajoutez), préférez des variables non exposées (sans préfixe NEXT_PUBLIC_) et des routes/Server Actions.

---

## Lancer le projet ▶️

Développement (Turbopack):

```bash
npm run dev
# puis ouvrez http://localhost:3000
```

Build et production locale:

```bash
npm run build
npm start
# http://localhost:3000
```

---

## Scripts NPM 📜

Définis dans `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

- ▶️ dev: lance le serveur de dev (Turbopack)
- 🏗️ build: compile le projet (production)
- 🚀 start: démarre le serveur Next.js en mode production
- 🧹 lint: exécute ESLint

---

## Arborescence 🌳

Aperçu des principaux éléments du dépôt:

```
.
├─ app/                      # Routes App Router, pages, layouts, etc.
├─ components/               # Composants UI réutilisables
├─ lib/                      # Utilitaires, fonctions partagées
├─ public/                   # Assets statiques (images, favicons, ...)
├─ .gitignore
├─ components.json           # Configuration UI (ex: shadcn/ui)
├─ eslint.config.mjs         # ESLint (Next + TS)
├─ next-env.d.ts
├─ next.config.ts            # Configuration Next.js
├─ package.json
├─ package-lock.json
├─ postcss.config.mjs        # Config PostCSS pour Tailwind v4
├─ tsconfig.json             # TypeScript config
├─ LICENSE
└─ README.md
```

---

## Architecture & conventions 🏗️

- App Router (dossier `app/`):
  - 🧩 `layout.tsx`: layout racine de l’application
  - 📄 `page.tsx`: page associée à la route `/`
  - 🗂️ Structurez en sous-répertoires pour créer des routes imbriquées.
- Composants (`components/`):
  - 🔁 Composants UI isolés et testables.
  - 🧱 Utilisez `tailwind-merge` pour composer proprement des classes Tailwind.
- Lib (`lib/`):
  - 🧰 Fonctions utilitaires (formatage, accès aux données, etc.).
- Style:
  - 🎨 Tailwind CSS v4 via PostCSS, classes utilitaires directement dans les composants.
- Icônes:
  - 🖼️ `lucide-react` pour une librairie d’icônes légère et cohérente.

---

## Qualité du code 🧹

Exécuter linter:

```bash
npm run lint
```

Recommandations:
- ✅ Respecter les conventions TypeScript (types explicites, réutilisables).
- 🧠 Préférer des composants fonctionnels et éviter les effets de bord.
- ✂️ Découper en petits composants pour améliorer la lisibilité et les performances.

---

## Déploiement 🚀

Le projet est conçu pour être déployé sur Vercel.

1) ⤴️ Pousser la branche sur GitHub.
2) 🛬 Sur Vercel, importer le repo GitHub `Okpeyemi/negoce-ia`.
3) 🔐 Définir les variables d’environnement nécessaires (ex: Supabase) dans les paramètres du projet Vercel.
4) 🚀 Déployer. Vercel détectera Next.js et utilisera la configuration par défaut.

Raccourcis utiles:
- 🏠 Page d’accueil: https://negoce-ia.vercel.app

---

## Supabase (intégration) 🔌

La dépendance `@supabase/supabase-js` (v2) est disponible pour interagir avec Supabase côté client.

Guidelines:
- 🗄️ Créez un projet Supabase pour obtenir:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 🧱 Initialisez le client Supabase dans un utilitaire (ex: `lib/supabase.ts`) pour le réutiliser dans vos composants.
- 🛡️ Pour des opérations sensibles (insertions protégées, RLS, etc.), préférez des routes API/Server Actions (côté serveur) et des clés sécurisées (non exposées).

Exemple d’initialisation (à adapter):

```ts
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## FAQ ❓

- Quelle version de Node utiliser ?
  - 🟢 Node 18.18+ (Node 20 recommandé).
- Puis-je utiliser Yarn/Pnpm ?
  - 📦 Le projet fournit un `package-lock.json`, donc npm est recommandé pour un lockfile cohérent. Vous pouvez utiliser d’autres gestionnaires, mais restez consistant dans l’équipe.

---

## Roadmap 🗺️

- [ ] 🧱 Pages et composants applicatifs (selon les besoins du produit)
- [ ] 🎨 Configuration d’un thème/design system (ex: shadcn/ui)
- [ ] 🔐 Intégration Supabase avancée (auth, BDD, RLS)
- [ ] ✅ Tests (unitaires et e2e)
- [ ] 🔭 Observabilité (logs, métriques)
- [ ] ♿ Accessibilité (audit a11y)
- [ ] 🔎 SEO (métadonnées, Open Graph)

---

## Contribuer 🤝

Les contributions sont les bienvenues !

1. 🍴 Forkez le dépôt
2. 🌱 Créez une branche: `git checkout -b feat/ma-fonctionnalite`
3. 💬 Commitez: `git commit -m "feat: ajoute ma fonctionnalité"`
4. ⤴️ Poussez: `git push origin feat/ma-fonctionnalite`
5. 🔄 Ouvrez une Pull Request

---

## Licence 📄

Ce projet est sous licence MIT – voir le fichier [LICENSE](./LICENSE).

---

## Auteur 👤

- GitHub: [@Okpeyemi](https://github.com/Okpeyemi)
