from flask import Flask, jsonify
import psycopg2
import os

app = Flask(__name__)

def get_db_connection():
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

@app.route('/health')
def health():
    conn = get_db_connection()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute('SELECT 1')
            cur.close()
            conn.close()
            return jsonify({"status": "healthy", "message": "Service is running and database is connected"}), 200
        except Exception as e:
            return jsonify({"status": "unhealthy", "message": str(e)}), 500
    return jsonify({"status": "unhealthy", "message": "Database connection failed"}), 500

@app.route('/payments', methods=['GET'])
def get_payments():
    return jsonify({"message": "Payment service operational"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)