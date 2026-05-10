from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from psycopg2 import errors

from db import get_db_connection


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    full_name = data.get("full_name")
    phone = data.get("phone")
    password = data.get("password")

    if not full_name or not phone or not password:
        return jsonify({"error": "Tous les champs sont obligatoires"}), 400

    if len(password) < 6:
        return jsonify({"error": "Le mot de passe doit contenir au moins 6 caractères"}), 400

    hashed_password = generate_password_hash(password)

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO users (full_name, phone, password)
            VALUES (%s, %s, %s)
            RETURNING id, full_name, phone
            """,
            (full_name, phone, hashed_password),
        )

        user = cursor.fetchone()
        connection.commit()

        return jsonify({
            "message": "Compte créé avec succès",
            "user": {
                "id": user[0],
                "full_name": user[1],
                "phone": user[2],
            },
        }), 201

    except errors.UniqueViolation:
        connection.rollback()
        return jsonify({"error": "Ce numéro de téléphone existe déjà"}), 409

    except Exception as exc:
        connection.rollback()
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"error": "Téléphone et mot de passe obligatoires"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "SELECT id, full_name, phone, password FROM users WHERE phone = %s",
            (phone,),
        )

        user = cursor.fetchone()

        if user is None:
            return jsonify({"error": "Utilisateur introuvable"}), 404

        stored_password = user[3]

        # Pour le prototype, on accepte uniquement les mots de passe hashés créés par /register.
        if not check_password_hash(stored_password, password):
            return jsonify({"error": "Mot de passe incorrect"}), 401

        return jsonify({
            "message": "Connexion réussie",
            "user": {
                "id": user[0],
                "full_name": user[1],
                "phone": user[2],
            },
        }), 200

    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()