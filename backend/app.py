from flask import Flask
from flask_cors import CORS

from routes.auth_routes import auth_bp
from routes.group_routes import group_bp
from routes.payment_routes import payment_bp
from routes.project_routes import project_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(group_bp, url_prefix="/api/groups")
app.register_blueprint(payment_bp, url_prefix="/api/payments")
app.register_blueprint(project_bp, url_prefix="/api/projects")


@app.route("/")
def home():
    return {"message": "API FasoTontine fonctionne correctement"}


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)