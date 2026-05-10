from flask import Blueprint, request, jsonify
from psycopg2 import errors

from db import get_db_connection


payment_bp = Blueprint("payments", __name__)


@payment_bp.route("/group/<int:group_id>", methods=["GET"])
def get_group_payments(group_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            SELECT
                payments.id,
                users.id,
                users.full_name,
                payments.amount,
                payments.status,
                payments.paid_at
            FROM payments
            JOIN users ON payments.user_id = users.id
            WHERE payments.group_id = %s
            ORDER BY payments.id DESC
            """,
            (group_id,),
        )

        rows = cursor.fetchall()
        payments = []

        for row in rows:
            payments.append({
                "id": row[0],
                "user_id": row[1],
                "member_name": row[2],
                "amount": row[3],
                "status": row[4],
                "paid_at": str(row[5]) if row[5] else None,
            })

        return jsonify(payments), 200

    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()


@payment_bp.route("/", methods=["POST"])
def create_payments():
    data = request.get_json() or {}

    user_id = data.get("user_id")
    group_id = data.get("group_id")
    amount = data.get("amount")
    status = data.get("status", "paid")

    if not user_id or not group_id:
        return jsonify({"error": "user_id et group_id obligatoires"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        if amount is None:
            cursor.execute(
                "SELECT amount FROM tontine_groups WHERE id = %s",
                (group_id,),
            )

            group = cursor.fetchone()

            if group is None:
                return jsonify({"error": "Groupe introuvable"}), 404

            amount = group[0]

        # Vérifier si paiement existe déjà
        cursor.execute(
            """
            SELECT id FROM payments
            WHERE user_id = %s AND group_id = %s
            """,
            (user_id, group_id),
        )

        existing_payment = cursor.fetchone()

        if existing_payment:
            # UPDATE
            paid_at_sql = "NOW()" if status == "paid" else "NULL"

            cursor.execute(
                f"""
                UPDATE payments
                SET status = %s,
                    paid_at = {paid_at_sql}
                WHERE user_id = %s
                AND group_id = %s
                RETURNING id, user_id, group_id, amount, status, paid_at
                """,
                (status, user_id, group_id),
            )

        else:
            # INSERT
            paid_at_sql = "NOW()" if status == "paid" else "NULL"

            cursor.execute(
                f"""
                INSERT INTO payments (
                    user_id,
                    group_id,
                    amount,
                    status,
                    paid_at
                )
                VALUES (%s, %s, %s, %s, {paid_at_sql})
                RETURNING id, user_id, group_id, amount, status, paid_at
                """,
                (user_id, group_id, amount, status),
            )

        payment = cursor.fetchone()

        connection.commit()

        return jsonify({
            "id": payment[0],
            "user_id": payment[1],
            "group_id": payment[2],
            "amount": payment[3],
            "status": payment[4],
            "paid_at": str(payment[5]) if payment[5] else None,
        }), 200

    except Exception as exc:
        connection.rollback()
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()


@payment_bp.route("/delay/<int:group_id>/<int:user_id>", methods=["POST"])
def mark_payment_delay(group_id, user_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "SELECT amount FROM tontine_groups WHERE id = %s",
            (group_id,),
        )

        group = cursor.fetchone()

        if group is None:
            return jsonify({"error": "Groupe introuvable"}), 404

        amount = group[0]

        cursor.execute(
            """
            INSERT INTO payments (user_id, group_id, amount, status, paid_at)
            VALUES (%s, %s, %s, %s, NULL)
            RETURNING id, user_id, group_id, amount, status
            """,
            (user_id, group_id, amount, "late"),
        )

        payment = cursor.fetchone()
        connection.commit()

        return jsonify({
            "message": "Retard enregistré",
            "payment": {
                "id": payment[0],
                "user_id": payment[1],
                "group_id": payment[2],
                "amount": payment[3],
                "status": payment[4],
            },
        }), 201

    except errors.ForeignKeyViolation:
        connection.rollback()
        return jsonify({"error": "Utilisateur ou groupe introuvable"}), 400

    except Exception as exc:
        connection.rollback()
        return jsonify({"error": str(exc)}), 500

    finally:
        cursor.close()
        connection.close()