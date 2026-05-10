from flask import Blueprint, request, jsonify
from psycopg2 import errors

from db import get_db_connection


group_bp = Blueprint("groups", __name__)


@group_bp.route("/", methods=["GET"])
def get_groups():
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            SELECT id, name, amount, frequency, created_by
            FROM tontine_groups
            ORDER BY id DESC
            """
        )

        rows = cursor.fetchall()
        groups = []

        for row in rows:
            groups.append({
                "id": row[0],
                "name": row[1],
                "amount": row[2],
                "frequency": row[3],
                "created_by": row[4],
            })

        return jsonify(groups), 200

    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()


@group_bp.route("/", methods=["POST"])
def create_group():
    data = request.get_json() or {}

    name = data.get("name")
    amount = data.get("amount")
    frequency = data.get("frequency")
    created_by = data.get("created_by")

    if not name or not amount or not frequency or not created_by:
        return jsonify({"error": "name, amount, frequency et created_by sont obligatoires"}), 400

    try:
        amount = int(amount)
    except ValueError:
        return jsonify({"error": "amount doit être un nombre"}), 400

    if amount <= 0:
        return jsonify({"error": "amount doit être supérieur à 0"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO tontine_groups (name, amount, frequency, created_by)
            VALUES (%s, %s, %s, %s)
            RETURNING id, name, amount, frequency, created_by
            """,
            (name, amount, frequency, created_by),
        )

        group = cursor.fetchone()

        cursor.execute(
            """
            INSERT INTO group_members (user_id, group_id, role)
            VALUES (%s, %s, %s)
            ON CONFLICT (user_id, group_id) DO NOTHING
            """,
            (created_by, group[0], "admin"),
        )

        connection.commit()

        return jsonify({
            "id": group[0],
            "name": group[1],
            "amount": group[2],
            "frequency": group[3],
            "created_by": group[4],
            "members": [],
        }), 201

    except errors.ForeignKeyViolation:
        connection.rollback()
        return jsonify({"error": "created_by ne correspond à aucun utilisateur"}), 400

    except Exception as exc:
        connection.rollback()
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()


@group_bp.route("/<int:group_id>", methods=["GET"])
def get_group_details(group_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            SELECT id, name, amount, frequency, created_by
            FROM tontine_groups
            WHERE id = %s
            """,
            (group_id,),
        )

        group = cursor.fetchone()

        if group is None:
            return jsonify({"error": "Tontine introuvable"}), 404

        cursor.execute(
            """
            SELECT users.id, users.full_name, users.phone, group_members.role
            FROM group_members
            JOIN users ON group_members.user_id = users.id
            WHERE group_members.group_id = %s
            ORDER BY group_members.id ASC
            """,
            (group_id,),
        )

        members_rows = cursor.fetchall()
        members = []

        for member in members_rows:
            members.append({
                "id": member[0],
                "full_name": member[1],
                "phone": member[2],
                "role": member[3],
            })

        return jsonify({
            "id": group[0],
            "name": group[1],
            "amount": group[2],
            "frequency": group[3],
            "created_by": group[4],
            "members": members,
        }), 200

    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()


@group_bp.route("/<int:group_id>/members", methods=["POST"])
def add_member(group_id):
    data = request.get_json() or {}

    user_id = data.get("user_id")
    role = data.get("role", "member")

    if not user_id:
        return jsonify({"error": "user_id obligatoire"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO group_members (user_id, group_id, role)
            VALUES (%s, %s, %s)
            RETURNING id, user_id, group_id, role
            """,
            (user_id, group_id, role),
        )

        member = cursor.fetchone()
        connection.commit()

        return jsonify({
            "id": member[0],
            "user_id": member[1],
            "group_id": member[2],
            "role": member[3],
        }), 201

    except errors.UniqueViolation:
        connection.rollback()
        return jsonify({"error": "Ce membre existe déjà dans cette tontine"}), 409

    except errors.ForeignKeyViolation:
        connection.rollback()
        return jsonify({"error": "Utilisateur ou tontine introuvable"}), 400

    except Exception as exc:
        connection.rollback()
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()