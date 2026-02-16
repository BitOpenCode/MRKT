import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from database import db

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///marketplace.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Session configuration for cross-origin cookies
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)

# CORS configuration with credentials support
CORS(app, 
     origins=os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(','),
     supports_credentials=True)

# Import models
from models import user, contract, marketplace, mining, lottery, transaction

# Import and register blueprints
from api import user_bp, marketplace_bp, mining_bp, lottery_bp, wallet_bp, activity_bp, auth_bp, contract_bp

app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(marketplace_bp, url_prefix='/api/marketplace')
app.register_blueprint(mining_bp, url_prefix='/api/mining')
app.register_blueprint(lottery_bp, url_prefix='/api/lottery')
app.register_blueprint(wallet_bp, url_prefix='/api/wallet')
app.register_blueprint(activity_bp, url_prefix='/api/activity')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(contract_bp, url_prefix='/api/contracts')

# Health check endpoint
@app.route('/health')
def health():
    return {'status': 'ok', 'message': 'TON Mining Marketplace API is running'}

@app.route('/')
def index():
    return {
        'name': 'TON Mining Marketplace API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'user': '/api/user',
            'marketplace': '/api/marketplace',
            'mining': '/api/mining',
            'lottery': '/api/lottery',
            'wallet': '/api/wallet',
            'activity': '/api/activity',
        }
    }

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return {'success': False, 'error': 'Not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'success': False, 'error': 'Internal server error'}, 500

if __name__ == '__main__':
    # Create tables
    with app.app_context():
        db.create_all()
    
    # Run app
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5001)),
        debug=os.getenv('FLASK_DEBUG', 'True') == 'True'
    )
