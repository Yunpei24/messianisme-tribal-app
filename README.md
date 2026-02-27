# Messianisme Tribal (Application Mobile)

L'application **Messianisme Tribal** est un outil de collecte de données terrain (enquêtes) conçu pour fonctionner de manière transparente avec ou sans connexion internet (approche **Offline-First**). Elle permet d’enregistrer des sessions, des participants (enquêteurs) et des personnes interrogées.

Les données sont sauvegardées localement via SQLite sur le téléphone de l'utilisateur, puis synchronisées automatiquement avec une base de données cloud (Supabase) dès qu’une connexion internet est détectée.

---

## Fonctionnalités Principales

- **🔄 Fonctionnement Hors ligne** : Remplissage des formulaires d'enquête sans connexion.
- **☁️ Synchronisation Automatique** : Transfert automatique des enquêtes vers Supabase au retour du réseau.
- **👤 Gestion des Participants** : Ajouter, modifier et supprimer des enquêteurs.
- **📅 Gestion des Sessions** : Planifier les localités et les dates d'activités.
- **📋 Collecte de données détaillée** : Nom, Prénoms, Sexe, Situation civile, Date de naissance, Profession, Localité et Téléphone.
- **📊 Liste et Filtrage** : Liste complète des répondants avec possibilité de filtrer par Session ou par Participant.
- **📱 Design Adaptatif** : Interface soignée utilisant React Native Paper (compatible Light et Dark mode stabilisé).

---

## Technologies Utilisées (Stack)

- **Frontend / Mobile** : [React Native](https://reactnative.dev/) avec [Expo](https://expo.dev/) (SDK 54)
- **UI Framework** : [React Native Paper](https://callstack.github.io/react-native-paper/)
- **Navigation** : [React Navigation](https://reactnavigation.org/) (Bottom Tabs, Stack)
- **Base de données Locale** : [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Backend / Base de données Distante** : [Supabase](https://supabase.com/) (PostgreSQL)
- **Build & Déploiement** : [EAS Build (Expo Application Services)](https://expo.dev/eas)

---

## 🛠 Installation & Configuration Locale

### 1. Prérequis

- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- Un compte [Expo](https://expo.dev/) (pour compiler l'application)
- Un projet [Supabase](https://supabase.com/) configuré
- L'application **Expo Go** installée sur votre téléphone Android/iOS (pour le développement)

### 2. Cloner le projet et installer les dépendances

\`\`\`bash
git clone https://github.com/Yunpei24/messianisme-tribal-app.git
cd messianisme-tribal
npm install
\`\`\`

### 3. Configuration de la base de données (Supabase)

Exécutez le script SQL fourni dans votre éditeur Supabase (SQL Editor) pour créer les tables nécessaires. Le script se trouve généralement dans le fichier `supabase_schema.sql` (ou à la racine du projet `App/supabase_schema.sql`).

Assurez-vous que les informations d'identification de votre projet (URL et Clé Anonyme) soient correctement configurées dans le fichier de service Supabase du projet Expo (`src/services/supabase.js`).

### 4. Lancer l'application en développement

\`\`\`bash
npx expo start
\`\`\`
Scannez le QR Code généré dans le terminal avec l'application "Expo Go" sur votre téléphone.

---

## 📦 Compilation et Génération de l'APK (Android)

Pour générer un fichier `.apk` installable et distribuable sur des téléphones Android, nous utilisons **EAS Build**.

1. Connectez-vous à EAS :
   \`\`\`bash
   eas login
   \`\`\`

2. Lancez le build avec le profil *preview* configuré dans `eas.json` :
   \`\`\`bash
   eas build -p android --profile preview
   \`\`\`

3. Une fois terminé, le lien de téléchargement apparaîtra dans votre terminal. Téléchargez-le, partagez-le et installez-le.

*(Ne pas oublier d'incrémenter manuellement le numéro de `version` dans le fichier `app.json` avant chaque nouveau build pour que le téléphone détecte la mise à jour).*

---

## 🏗 Architecture des données

L'application comporte 3 entités principales :
1. **Sessions** (`local_sessions` / `sessions_messianisme`) : La localité et l'intervalle de temps de l'activité.
2. **Participants** (`local_participants` / `participants`) : Les enquêteurs réalisant l'activité.
3. **Personnes** (`local_personnes` / `personnes_temoignees`) : Les enregistrements individuels des enquêtes liées à une *Session* et un *Participant*.

L'application possède un système robuste (`src/services/database.js` et `src/services/sync.js`) pour stocker d'abord dans les tables `local_` puis de les pousser vers Supabase en arrière-plan.
