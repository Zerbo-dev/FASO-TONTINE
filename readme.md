# Documentation du Diagramme de Classes
## Application Tontine + Crowdfunding

> **Version** 1.0 · **Standard** UML 2.5 · **Auteur** Conception produit

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Classes abstraites (héritage)](#2-classes-abstraites)
3. [Acteurs](#3-acteurs)
4. [Projets financiers](#4-projets-financiers)
5. [Cycles & votes](#5-cycles--votes)
6. [Transactions](#6-transactions)
7. [Transversal système](#7-transversal-système)
8. [Énumérations](#8-énumérations)
9. [Relations entre classes](#9-relations-entre-classes)
10. [Règles métier importantes](#10-règles-métier-importantes)

---

## 1. Vue d'ensemble

Le diagramme est organisé en **6 zones colorées** :

| Zone | Couleur | Classes |
|------|---------|---------|
| Héritage abstrait | Bleu nuit | `ProjetFinancier`, `Transaction` |
| Acteurs | Vert | `Utilisateur`, `Moderateur` |
| Projets financiers | Bleu | `Groupe`, `Campagne` |
| Cycles & votes | Violet | `Cycle`, `Membre`, `Candidature`, `Vote`, `Allocation` |
| Transactions | Orange | `Cotisation`, `Don`, `Penalite` |
| Transversal système | Gris | `ScoreFilabilite`, `Notification`, `Signalement` |

### Principe fondamental — Héritage

```
ProjetFinancier (abstrait)
├── Groupe        (tontine privée + publique)
└── Campagne      (crowdfunding)

Transaction (abstrait)
├── Cotisation    (paiement d'un membre dans une tontine)
└── Don           (contribution à une campagne)
```

---

## 2. Classes abstraites

### `ProjetFinancier` *(abstract)*

> Classe parent commune à `Groupe` et `Campagne`. Regroupe tous les attributs partagés entre les deux types de projets financiers.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `nom` | String | Nom du projet |
| `description` | Text | Description détaillée |
| `statut` | StatutProjet | État courant (voir énumérations) |
| `dateCreation` | DateTime | Date de création |
| `dateMiseAJour` | DateTime | Dernière modification |
| `createurId` | UUID | Référence vers `Utilisateur` |

| Méthode | Retour | Description |
|---------|--------|-------------|
| `valider()` | Boolean | Vérifie les règles avant activation |
| `cloturer()` | void | Ferme définitivement le projet |
| `getStatutLabel()` | String | Libellé lisible du statut |

---

### `Transaction` *(abstract)*

> Classe parent commune à `Cotisation` et `Don`. Centralise toute la logique de paiement Mobile Money (CinetPay).

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `montant` | Decimal | Montant en FCFA |
| `devise` | String | Devise (XOF par défaut) |
| `datePaiement` | DateTime | Date effective du paiement |
| `statut` | StatutTransaction | État du paiement |
| `modePaiement` | ModePaiement | Orange Money, Moov Money, etc. |
| `referenceExterne` | String | Référence CinetPay |
| `dateCreation` | DateTime | Date de création |

| Méthode | Retour | Description |
|---------|--------|-------------|
| `initier()` | String | Lance le paiement, retourne l'URL CinetPay |
| `confirmer(ref)` | Boolean | Confirme via webhook CinetPay |
| `annuler()` | Boolean | Annule la transaction |
| `getRecu()` | PDF | Génère le reçu PDF |

---

## 3. Acteurs

### `Utilisateur`

> Tout utilisateur de la plateforme. S'inscrit uniquement par OTP SMS — pas d'email.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `telephone` | String | Numéro unique, sert d'identifiant |
| `nom` | String | Vrai nom (confidentiel) |
| `nomMasque` | String | Nom affiché publiquement (ex: `anonyme_1`) |
| `motDePasseHash` | String | Mot de passe chiffré (bcrypt) |
| `role` | RoleUtilisateur | ADMIN, MEMBRE, MODERATEUR, SUPER_ADMIN |
| `estVerifie` | Boolean | OTP validé = compte vérifié |
| `estActif` | Boolean | Compte non suspendu |
| `dateInscription` | DateTime | Date d'inscription |
| `dernierAcces` | DateTime | Dernière connexion |

| Méthode | Retour | Description |
|---------|--------|-------------|
| `sInscrire(otp)` | Token | Valide l'OTP et crée le compte |
| `seConnecter()` | Token | Retourne un JWT |
| `demanderOTP()` | void | Envoie un SMS OTP via AfricasTalking |
| `getNomAffiche()` | String | Retourne `nomMasque` si anonyme, sinon `nom` |
| `desactiver()` | void | Suspend le compte |

---

### `Moderateur`

> Hérite de `Utilisateur`. Un modérateur est un utilisateur avec un rôle élevé, créé par le Super Admin.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `utilisateurId` | UUID | Référence vers `Utilisateur` |
| `domaine` | DomaineModo | TONTINES, CROWDFUNDING ou LITIGES |
| `niveauAcces` | Integer | Niveau de permissions (1–5) |
| `creePar` | UUID | Super Admin qui l'a créé |
| `dateCreation` | DateTime | Date de création du rôle |

| Méthode | Retour | Description |
|---------|--------|-------------|
| `approuver(cibleId)` | Boolean | Approuve une tontine ou campagne |
| `rejeter(cibleId, motif)` | Boolean | Rejette avec motif obligatoire |
| `suspendre(cibleId)` | void | Suspend immédiatement |

> ⚠️ Un modérateur ne peut agir **que dans son domaine**. Un modérateur Tontines ne peut pas approuver une campagne crowdfunding.

---

## 4. Projets financiers

### `Groupe` *(hérite de ProjetFinancier)*

> Représente une tontine, qu'elle soit privée (code 6 chiffres) ou publique (visible sur le fil).

| Attribut | Type | Description |
|----------|------|-------------|
| `montantCotisation` | Decimal | Montant fixe par cycle en FCFA |
| `frequence` | Frequence | MENSUEL, HEBDO, BIMENSUEL |
| `typeAcces` | TypeAcces | PRIVE ou PUBLIC |
| `codeAcces` | String(6) | Code numérique à 6 chiffres |
| `codeExpiresAt` | DateTime | Expiration du code (30 jours) |
| `codeNbUtilisations` | Integer | Nombre de fois utilisé |
| `placesMax` | Integer | Nombre maximum de membres |
| `placesRestantes` | Integer | Places encore disponibles |
| `estPublic` | Boolean | Apparaît sur le fil public |
| `estApprouve` | Boolean | Approuvé par modérateur (si public) |

| Méthode | Retour | Description |
|---------|--------|-------------|
| `genererCode()` | String | Génère un code 6 chiffres unique |
| `verifierCode(code)` | Boolean | Vérifie validité + expiration |
| `demarrer()` | void | Lance le premier cycle |
| `getCagnotteCycle()` | Decimal | `nbMembres × montantCotisation` |
| `getNbMembresActifs()` | Integer | Compte les membres actifs |

---

### `Campagne` *(hérite de ProjetFinancier)*

> Représente une campagne crowdfunding. Modèle **tout-ou-rien** : si l'objectif n'est pas atteint à la date limite, tous les contributeurs sont remboursés.

| Attribut | Type | Description |
|----------|------|-------------|
| `objectifMontant` | Decimal | Montant cible à atteindre |
| `montantCollecte` | Decimal | Montant collecté en temps réel |
| `dateLimite` | DateTime | Date limite de collecte |
| `typeCampagne` | TypeCampagne | COMMUNAUTAIRE, PERSONNEL, PRE_COMMANDE, URGENCE |
| `estUrgence` | Boolean | Campagne express (72h max) |
| `dureeMaxUrgence` | Integer | Durée max en heures (72) |
| `plafondUrgence` | Decimal | Plafond urgent (100 000 FCFA) |
| `estApprouvee` | Boolean | Approuvée par modérateur Crowdfunding |
| `contrepartie` | Text | Description contrepartie (pré-commande) |

| Méthode | Retour | Description |
|---------|--------|-------------|
| `calculerProgression()` | Float | `montantCollecte / objectifMontant × 100` |
| `estObjectifAtteint()` | Boolean | Vérifie si objectif atteint |
| `debloquerFonds()` | void | Déclenche virement porteur (SD-09) |
| `rembourserContributeurs()` | void | Rembourse tous les dons (SD-10) |
| `calculerCommission()` | Decimal | 2% gratuit / 1% premium / 0% si échec |

---

## 5. Cycles & votes

### `Cycle`

> Un cycle représente un tour de collecte dans une tontine. À chaque cycle, un membre est bénéficiaire de la cagnotte.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `groupeId` | UUID | Référence vers `Groupe` |
| `numero` | Integer | Numéro du cycle (1, 2, 3...) |
| `beneficiaireId` | UUID | Membre qui reçoit la cagnotte |
| `statut` | StatutCycle | EN_ATTENTE, EN_COURS, COMPLET, ANNULE |
| `dateDebut` | Date | Début du cycle |
| `dateFin` | Date | Fin effective |
| `dateEcheance` | Date | Date limite de paiement |

> 💡 `montantCagnotte` n'est **pas stocké** — il est calculé à la volée : `Groupe.montantCotisation × nbMembresActifs`

---

### `Membre`

> Table pivot entre `Utilisateur` et `Groupe`. Un utilisateur peut être membre de plusieurs groupes.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `utilisateurId` | UUID | Référence vers `Utilisateur` |
| `groupeId` | UUID | Référence vers `Groupe` |
| `ordre` | Integer | Position dans l'ordre des tours |
| `statut` | StatutMembre | ACTIF, SUSPENDU, SORTI |
| `dateAdhesion` | DateTime | Date d'entrée dans le groupe |
| `aBeneficie` | Boolean | A déjà reçu la cagnotte ce cycle |
| `totalCotise` | Decimal | Total des cotisations versées |

---

### `Candidature`

> Demande d'un utilisateur pour rejoindre une tontine publique. Doit être approuvée par l'admin du groupe.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `utilisateurId` | UUID | Candidat |
| `groupeId` | UUID | Groupe ciblé |
| `statut` | StatutCandidature | EN_ATTENTE, ACCEPTE, REFUSE |
| `message` | Text | Message optionnel du candidat |
| `dateEnvoi` | DateTime | Date de la demande |
| `dateTraitement` | DateTime | Date de décision |
| `traitePar` | UUID | Admin qui a décidé |

---

### `Vote`

> Vote d'un membre pour une proposition d'allocation tontine → crowdfunding. L'unanimité est requise.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `membreId` | UUID | Membre qui vote |
| `allocationId` | UUID | Proposition concernée |
| `decision` | Boolean | `true` = OUI, `false` = NON |
| `dateVote` | DateTime | Date du vote |
| `commentaire` | Text | Commentaire optionnel |

---

### `Allocation`

> Proposition de contribution d'un groupe tontine vers une campagne crowdfunding. Nécessite un vote unanime.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `groupeId` | UUID | Groupe source |
| `campagneId` | UUID | Campagne cible |
| `cycleId` | UUID | Cycle concerné |
| `montant` | Decimal | Montant fixe proposé |
| `pourcentage` | Float | OU pourcentage de la cagnotte |
| `statut` | StatutAllocation | EN_ATTENTE_VOTE, APPROUVEE, REJETEE, EXECUTEE |
| `dateProposition` | DateTime | Date de la proposition |
| `dateVote` | DateTime | Date de clôture du vote |

> ⚠️ Un seul des deux champs `montant` ou `pourcentage` est renseigné, pas les deux.

---

## 6. Transactions

### `Cotisation` *(hérite de Transaction)*

> Paiement d'un membre pour un cycle donné. Hérite de tous les attributs de `Transaction`.

| Attribut spécifique | Type | Description |
|---------------------|------|-------------|
| `cycleId` | UUID | Cycle concerné |
| `membreId` | UUID | Membre qui cotise |
| `dateEcheance` | Date | Date limite de paiement |
| `dateReglement` | DateTime | Date effective du paiement |
| `nbJoursRetard` | Integer | Nombre de jours de retard |
| `estEnRetard` | Boolean | Marqueur de retard |

---

### `Don` *(hérite de Transaction)*

> Contribution à une campagne crowdfunding. Peut être anonyme.

| Attribut spécifique | Type | Description |
|---------------------|------|-------------|
| `campagneId` | UUID | Campagne ciblée |
| `contributeurId` | UUID | Contributeur (null si anonyme) |
| `estAnonyme` | Boolean | Contribution anonyme |
| `nomMasque` | String | Nom affiché si anonyme (ex: `anonyme_7`) |
| `telephoneRemboursement` | String | Téléphone haché pour remboursement |
| `contrepartieRecue` | Boolean | Contrepartie livrée (pré-commande) |
| `messageContributeur` | Text | Message public optionnel |

---

### `Penalite`

> Pénalité financière appliquée à un membre en retard. Classe indépendante pour un historique complet.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `cotisationId` | UUID | Cotisation en retard |
| `membreId` | UUID | Membre pénalisé |
| `montant` | Decimal | Montant de la pénalité |
| `motif` | String | Raison de la pénalité |
| `statut` | StatutPenalite | APPLIQUEE, REGLÉE, ANNULEE |
| `dateApplication` | DateTime | Date d'application |
| `dateReglement` | DateTime | Date de règlement |

---

## 7. Transversal système

### `ScoreFilabilite`

> Score de confiance d'un utilisateur. Calculé automatiquement à chaque événement de paiement ou cycle. Conditionne l'accès aux tontines publiques.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `utilisateurId` | UUID | Lié à un seul utilisateur (1-1) |
| `valeur` | Float | Score entre 0 et 100 |
| `nbTontinesCompletes` | Integer | Nombre de tontines terminées |
| `nbPaiementsTemps` | Integer | Paiements effectués à temps |
| `nbRetards` | Integer | Nombre de retards |
| `poidsPonctualite` | Float | Poids calcul ponctualité (60%) |
| `poidsCompletion` | Float | Poids calcul complétion (40%) |
| `dateMiseAJour` | DateTime | Dernière mise à jour |

**Formule de calcul :**
```
score_initial     = 50 (à l'inscription)
+ paiement temps  = +3 points
+ cycle complété  = +5 points
- jour de retard  = -2 points par jour
- abandon groupe  = -10 points
seuil accès public = 40 points minimum
```

---

### `Notification`

> Notification in-app envoyée à un utilisateur. Les SMS (premium) passent par AfricasTalking.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `destinataireId` | UUID | Utilisateur destinataire |
| `canal` | CanalNotification | IN_APP, SMS, PUSH |
| `type` | TypeNotification | RAPPEL_J2, RETARD, BENEFICIAIRE, etc. |
| `message` | Text | Contenu de la notification |
| `estLue` | Boolean | Lue ou non |
| `dateEnvoi` | DateTime | Date d'envoi |
| `dateLecture` | DateTime | Date de lecture |
| `priorite` | Integer | NORMALE (1), HAUTE (2), URGENTE (3) |

---

### `Signalement`

> Signalement d'une tontine ou campagne frauduleuse par un utilisateur.

| Attribut | Type | Description |
|----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `signaleurId` | UUID | Utilisateur qui signale |
| `cibleId` | UUID | ID de la tontine ou campagne |
| `typeCible` | TypeCible | GROUPE ou CAMPAGNE |
| `motif` | MotifSignalement | FRAUDE, CONTENU_INAPPROPRIE, etc. |
| `description` | Text | Détails du signalement |
| `statut` | StatutSignalement | OUVERT, EN_TRAITEMENT, CLOS, REJETE |
| `dateSignalement` | DateTime | Date du signalement |
| `traitePar` | UUID | Modérateur qui traite |
| `dateTraitement` | DateTime | Date de traitement |

---

## 8. Énumérations

### `StatutProjet`
| Valeur | Description |
|--------|-------------|
| `BROUILLON` | Créé mais non démarré |
| `EN_ATTENTE` | En attente d'approbation modérateur |
| `ACTIF` | En cours de fonctionnement |
| `PAUSE` | Temporairement suspendu |
| `CLOS` | Terminé définitivement |
| `ANNULE` | Annulé |

### `StatutTransaction`
| Valeur | Description |
|--------|-------------|
| `INITIEE` | Paiement initié chez CinetPay |
| `EN_COURS` | En attente de confirmation webhook |
| `CONFIRMEE` | Paiement confirmé |
| `ECHOUEE` | Échec du paiement |
| `ANNULEE` | Annulée avant confirmation |
| `REMBOURSEE` | Remboursée (campagne échouée) |

### `TypeCampagne`
| Valeur | Description |
|--------|-------------|
| `COMMUNAUTAIRE` | Mosquée, école, puits... |
| `PERSONNEL` | Santé, études, business |
| `PRE_COMMANDE` | Produit avec contrepartie |
| `URGENCE` | 72h max, 100 000 F max |

### `StatutCycle`
| Valeur | Description |
|--------|-------------|
| `EN_ATTENTE` | Pas encore démarré |
| `EN_COURS` | Collecte active |
| `COMPLET` | Tous les membres ont payé |
| `ANNULE` | Interrompu |

### `ModePaiement`
| Valeur | Description |
|--------|-------------|
| `ORANGE_MONEY` | Orange Money BF |
| `MOOV_MONEY` | Moov Money BF |
| `ESPECES` | Paiement manuel (admin valide) |
| `VIREMENT` | Virement bancaire |

### `DomaineModo`
| Valeur | Description |
|--------|-------------|
| `TONTINES` | Modère tontines publiques |
| `CROWDFUNDING` | Modère campagnes |
| `LITIGES` | Traite les signalements |

### `CanalNotification`
| Valeur | Description |
|--------|-------------|
| `IN_APP` | Notification dans l'application |
| `SMS` | SMS via AfricasTalking *(premium)* |
| `PUSH` | Push mobile *(V3)* |

---

## 9. Relations entre classes

### Légende
| Symbole | Type | Signification |
|---------|------|---------------|
| `◆───` | Composition | L'enfant ne peut exister sans le parent |
| `◇───` | Agrégation | L'enfant peut exister indépendamment |
| `───▷` | Héritage | Spécialisation d'une classe parent |
| `- - →` | Dépendance | Utilisation ponctuelle |

### Toutes les relations

```
Utilisateur  ───▷  (parent de) Moderateur
Groupe       ───▷  ProjetFinancier
Campagne     ───▷  ProjetFinancier
Cotisation   ───▷  Transaction
Don          ───▷  Transaction

Utilisateur  ◆─1──1─  ScoreFilabilite
Utilisateur  ◇─1──*─  Membre
Utilisateur  ◇─1──*─  Notification
Utilisateur  ──────*─  Candidature
Utilisateur  ──────*─  Signalement

Groupe       ◆─1──*─  Cycle
Groupe       ◆─1──*─  Membre        (min 2)
Groupe       ──────*─  Candidature
Groupe       ──────*─  Allocation

Cycle        ◆─1──*─  Cotisation
Cotisation   ◆─1──1─  Penalite      (0 ou 1)

Campagne     ◆─1──*─  Don

Allocation   ◆─1──*─  Vote          (min 2)
Allocation   ─ ─ ─→   Campagne      (cible externe)

Membre       ──────*─  Vote
```

---

## 10. Règles métier importantes

### Tontine privée
- Le code 6 chiffres est **unique** en base et expire après **30 jours**
- Un groupe démarre avec **minimum 2 membres**
- Le montant et la fréquence sont **verrouillés** après le démarrage du 1er cycle
- Un **admin peut aussi être membre** d'un autre groupe

### Tontine publique
- Visible uniquement par les **membres vérifiés OTP**
- Score de fiabilité **minimum 40** pour accéder au fil
- Toute candidature nécessite une **approbation admin**
- Doit être **approuvée par un modérateur** avant publication

### Crowdfunding
- Modèle **tout-ou-rien** : si objectif non atteint → remboursement automatique
- Commission : **2%** plan gratuit / **1%** plan premium / **0%** si remboursement
- Campagne urgence : durée **≤ 72h**, montant **≤ 100 000 FCFA**
- Le remboursement d'un contributeur anonyme se fait via son **numéro de téléphone**

### Allocation tontine → crowdfunding
- Proposée par l'admin, votée par **tous les membres** (unanimité)
- Un seul **NON** suffit à bloquer l'allocation
- La campagne cible est **indépendante** du groupe

### Score de fiabilité
- Initialisé à **50** à l'inscription
- Mis à jour automatiquement après chaque paiement ou fin de cycle
- Valeur clampée entre **0 et 100**
- Seuil d'accès aux tontines publiques : **40**

### Sécurité
- Téléphone des anonymes **haché** en base (RGPD)
- Webhook CinetPay vérifié par **signature HMAC**
- Tous les UUID sont **non séquentiels** (UUID v4)

---

*Documentation générée à partir du diagramme de classes UML — Application Tontine & Crowdfunding*
