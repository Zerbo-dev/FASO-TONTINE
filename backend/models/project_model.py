# Modèle conceptuel Project et Vote.

VALID_VOTES = ["yes", "no"]


def is_valid_vote(vote):
    return vote in VALID_VOTES