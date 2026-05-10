from flask import jsonify


def success(data=None, message=None, status=200):
    payload = {}

    if message is not None:
        payload["message"] = message

    if data is not None:
        if isinstance(data, dict):
            payload.update(data)
        else:
            payload["data"] = data

    return jsonify(payload), status


def error(message="Erreur serveur", status=500):
    return jsonify({"error": message}), status