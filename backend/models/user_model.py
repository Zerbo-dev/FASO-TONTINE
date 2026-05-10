# Modèle conceptuel User.
# Les routes utilisent actuellement du SQL direct pour garder le prototype simple.

USER_FIELDS = ["id", "full_name", "phone", "password", "created_at"]


def serialize_user(row):
    return {
        "id": row[0],
        "full_name": row[1],
        "phone": row[2],
    }