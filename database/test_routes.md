# Tests Postman obligatoires — FasoTontine

Backend : http://localhost:5000
Frontend : http://localhost:5173

## Test 1 — Vérifier serveur
GET http://localhost:5000/

Réponse attendue :
{
  "message": "API FasoTontine fonctionne correctement"
}

## Test 2 — Inscription
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "full_name": "Issa Sawadogo",
  "phone": "76000000",
  "password": "123456"
}

Résultat attendu : code 201 avec user.id.

## Test 3 — Connexion
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "phone": "76000000",
  "password": "123456"
}

Résultat attendu : code 200 avec les informations de l’utilisateur.

## Test 4 — Créer tontine
POST http://localhost:5000/api/groups/
Content-Type: application/json

{
  "name": "Tontine Projet",
  "amount": 10000,
  "frequency": "mensuel",
  "created_by": 4
}

Important : created_by doit être l’id de l’utilisateur créé au test 2.

## Test 5 — Ajouter membre
POST http://localhost:5000/api/groups/1/members
Content-Type: application/json

{
  "user_id": 2,
  "role": "member"
}

## Test 6 — Voir détails tontine
GET http://localhost:5000/api/groups/1

## Test 7 — Enregistrer paiement
POST http://localhost:5000/api/payments/
Content-Type: application/json

{
  "user_id": 2,
  "group_id": 1,
  "amount": 5000,
  "status": "paid"
}

## Test 8 — Voir paiements
GET http://localhost:5000/api/payments/group/1

## Test 9 — Marquer retard
POST http://localhost:5000/api/payments/delay/1/2

## Test 10 — Créer projet
POST http://localhost:5000/api/projects/
Content-Type: application/json

{
  "title": "Réparation route",
  "description": "Réparation de la voie principale",
  "location": "Ouagadougou",
  "requested_amount": 300000
}

## Test 11 — Voir projets
GET http://localhost:5000/api/projects/

## Test 12 — Voter
POST http://localhost:5000/api/projects/1/vote
Content-Type: application/json

{
  "user_id": 1,
  "vote": "yes"
}

## Tests d’erreurs à vérifier
1. Connexion avec mauvais mot de passe : doit retourner 401.
2. Double ajout d’un membre : doit retourner 409.
3. Vote double sur le même projet : doit retourner 409.
4. Création tontine sans created_by : doit retourner 400.