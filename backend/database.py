"""
Database instance - отдельный файл чтобы избежать circular imports
"""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
