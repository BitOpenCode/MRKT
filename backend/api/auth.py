from flask import Blueprint, request, jsonify, session
from models import User
from database import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login with username and password"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'success': False, 'error': 'Username and password required'}), 400
        
        # Find user
        user = User.query.filter_by(username=username).first()
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        # Check password using werkzeug
        if not user.check_password(password):
            return jsonify({'success': False, 'error': 'Invalid password'}), 401
        
        # Set session
        session['user_id'] = user.id
        session['username'] = user.username
        
        return jsonify({
            'success': True,
            'data': {
                'userId': user.id,
                'username': user.username,
                'user': user.to_dict()
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout current user"""
    session.clear()
    return jsonify({'success': True})

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current logged in user"""
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401
        
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'data': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/test-users', methods=['GET'])
def get_test_users():
    """Get list of test users for development"""
    try:
        users = User.query.limit(10).all()
        return jsonify({
            'success': True,
            'data': [{
                'username': u.username,
                'password': 'password123',  # All test users have this password
                'level': u.level,
                'ecosPoints': u.ecos_points
            } for u in users]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
