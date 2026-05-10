# Modèle conceptuel Payment.

PAYMENT_STATUS = ["paid", "late", "pending"]


def is_valid_payment_status(status):
    return status in PAYMENT_STATUS