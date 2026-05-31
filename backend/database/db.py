"""
FitFusion Backend – Database Connection Pool
Uses mysql-connector-python pooled connections.
"""
import mysql.connector
from mysql.connector import pooling
from config import Config

# Global connection pool (created once on import)
_pool = None


def get_pool() -> pooling.MySQLConnectionPool:
    global _pool
    if _pool is None:
        _pool = pooling.MySQLConnectionPool(
            pool_name="fitfusion_pool",
            pool_size=5,
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            database=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            charset="utf8mb4",
            autocommit=False,
        )
    return _pool


def get_db():
    """Return a connection from the pool. Caller is responsible for closing."""
    return get_pool().get_connection()
