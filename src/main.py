import os
import sys
import threading
import time
import signal
from flask import Flask, send_from_directory

from src.models.user import db
from src.routes.user import user_bp
from src.routes.certificate import certificate_bp
from src.routes.auth import auth_bp
from src.routes.certificate_view import certificate_view_bp

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# قراءة متغيرات البيئة فقط من النظام (مثل Render)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')

database_url = os.getenv('DATABASE_URL')
if not database_url:
    raise RuntimeError("DATABASE_URL environment variable not set!")

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(certificate_bp, url_prefix='/api')
app.register_blueprint(certificate_view_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')

with app.app_context():
    db.create_all()

def shutdown_server_after_delay(delay_minutes=30):
    def shutdown():
        time.sleep(delay_minutes * 60)
        print("⏰ انتهت مدة التجربة، سيتم إيقاف السيرفر الآن.")
        os.kill(os.getpid(), signal.SIGINT)
    threading.Thread(target=shutdown, daemon=True).start()

shutdown_server_after_delay(30)  # إيقاف السيرفر بعد 10 دقائق

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

# على Render علق هذا السطر
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)
