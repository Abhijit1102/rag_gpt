import logging
from logging.handlers import RotatingFileHandler
import os
import sys

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)  # Ensure logs directory exists

def get_logger(name: str = "app_logger"):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Prevent adding multiple handlers if the logger is already configured
    if logger.hasHandlers():
        logger.handlers.clear()

    # File handler (rotates when file size exceeds 5MB, keeps 5 backups)
    file_handler = RotatingFileHandler(
        os.path.join(LOG_DIR, "app.log"),
        maxBytes=5*1024*1024,
        backupCount=5,
        encoding='utf-8'  # Ensure UTF-8 for Unicode
    )
    file_handler.setLevel(logging.INFO)

    # Console handler (also UTF-8 safe)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)

    # Formatter
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s"
    )
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    # Add handlers
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger

# Create a default logger
logger = get_logger()

# Example usage
logger.info("ℹ️ This is an info message with an emoji.")
