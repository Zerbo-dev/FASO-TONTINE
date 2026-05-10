# Modèle conceptuel TontineGroup.

GROUP_FIELDS = ["id", "name", "amount", "frequency", "created_by", "created_at"]


def serialize_group(row):
    return {
        "id": row[0],
        "name": row[1],
        "amount": row[2],
        "frequency": row[3],
        "created_by": row[4],
    }