"""Fix admin password — run inside the backend container"""
import sys
sys.path.insert(0, '/app')
from utils.password_hash import hash_password
from database.db import get_db

h = hash_password('Admin@123')
conn = get_db()
cursor = conn.cursor()
cursor.execute("UPDATE users SET password=%s WHERE email=%s", (h, 'admin@fitfusion.com'))
conn.commit()
print('Admin password updated successfully. Hash:', h)
conn.close()
