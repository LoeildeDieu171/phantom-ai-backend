def validate_message(message: str):
    if not message or len(message.strip()) < 1:
        raise ValueError("Message vide")

    if len(message) > 2000:
        raise ValueError("Message trop long")
