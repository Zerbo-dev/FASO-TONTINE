# Documentation API FasoTontine

Base URL : http://localhost:5000

## Vérifier serveur
GET /
Réponse :
{
  "message": "API FasoTontine fonctionne correctement"
}

## Authentification
POST /api/auth/register
Body :
{
  "full_name": "Ali Ouedraogo",
  "phone": "70000000",
  "password": "123456"
}

POST /api/auth/login
Body :
{
  "phone": "70000000",
  "password": "123456"
}

## Tontines
GET /api/groups/

POST /api/groups/
Body :
{
  "name": "Tontine Famille",
  "amount": 5000,
  "frequency": "mensuel",
  "created_by": 1
}

GET /api/groups/1

POST /api/groups/1/members
Body :
{
  "user_id": 2,
  "role": "member"
}

## Paiements
GET /api/payments/group/1

POST /api/payments/
Body :
{
  "user_id": 2,
  "group_id": 1,
  "status": "paid"
}

POST /api/payments/delay/1/2

## Projets
GET /api/projects/

POST /api/projects/
Body :
{
  "title": "Forage communautaire",
  "description": "Construction d’un forage pour le quartier",
  "location": "Ouagadougou",
  "requested_amount": 250000
}

POST /api/projects/1/vote
Body :
{
  "user_id": 1,
  "vote": "yes"
}