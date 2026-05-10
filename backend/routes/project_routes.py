from flask import Blueprint, request, jsonify
from psycopg2 import errors

from db import get_db_connection


project_bp = Blueprint("projects", __name__)


@project_bp.route("/", methods=["GET"])
def get_projects():
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            SELECT
                id,
                title,
                description,
                location,
                requested_amount,
                status
            FROM projects
            ORDER BY id DESC
            """
        )

        rows = cursor.fetchall()
        projects = []

        for row in rows:
            projects.append({
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "location": row[3],
                "requested_amount": row[4],
                "status": row[5],
            })

        return jsonify(projects), 200

    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()


@project_bp.route("/", methods=["POST"])
def create_project():
    data = request.get_json() or {}

    title = data.get("title")
    description = data.get("description")
    location = data.get("location")
    requested_amount = data.get("requested_amount")

    if not title:
        return jsonify({"error": "Titre obligatoire"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO projects (title, description, location, requested_amount)
            VALUES (%s, %s, %s, %s)
            RETURNING id, title, description, location, requested_amount, status
            """,
            (title, description, location, requested_amount),
        )

        project = cursor.fetchone()
        connection.commit()

        return jsonify({
            "id": project[0],
            "title": project[1],
            "description": project[2],
            "location": project[3],
            "requested_amount": project[4],
            "status": project[5],
        }), 201

    except Exception as exc:
        connection.rollback()
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()


@project_bp.route("/<int:project_id>/vote", methods=["POST"])
def vote_project(project_id):
    data = request.get_json() or {}

    user_id = data.get("user_id")
    vote = data.get("vote")

    if not user_id or not vote:
        return jsonify({"error": "user_id et vote obligatoires"}), 400

    if vote not in ["yes", "no"]:
        return jsonify({"error": "Vote invalide. Valeurs acceptées : yes ou no"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO votes (user_id, project_id, vote)
            VALUES (%s, %s, %s)
            RETURNING id, user_id, project_id, vote
            """,
            (user_id, project_id, vote),
        )

        result = cursor.fetchone()
        connection.commit()

        return jsonify({
            "message": "Vote enregistré",
            "vote": {
                "id": result[0],
                "user_id": result[1],
                "project_id": result[2],
                "vote": result[3],
            },
        }), 201

    except errors.UniqueViolation:
        connection.rollback()
        return jsonify({"error": "Cet utilisateur a déjà voté pour ce projet"}), 409

    except errors.ForeignKeyViolation:
        connection.rollback()
        return jsonify({"error": "Utilisateur ou projet introuvable"}), 400

    except Exception as exc:
        connection.rollback()
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()