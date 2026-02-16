from flask import Blueprint, request, jsonify
from database import db
from models.user import User
import uuid

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
def get_profile():
    """Получить профиль пользователя"""
    try:
        # TODO: Get user from Telegram init data
        telegram_id = request.args.get('telegram_id')
        
        if not telegram_id:
            return jsonify({
                'success': False,
                'error': 'Telegram ID required'
            }), 400
        
        user = User.query.filter_by(telegram_id=int(telegram_id)).first()
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@user_bp.route('/profile', methods=['PUT'])
def update_profile():
    """Обновить профиль"""
    try:
        data = request.get_json()
        telegram_id = data.get('telegram_id')
        
        if not telegram_id:
            return jsonify({
                'success': False,
                'error': 'Telegram ID required'
            }), 400
        
        user = User.query.filter_by(telegram_id=telegram_id).first()
        
        if not user:
            # Create new user
            user = User(
                id=str(uuid.uuid4()),
                telegram_id=telegram_id,
                username=data.get('username'),
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
                wallet_address=data.get('wallet_address')
            )
            db.session.add(user)
        else:
            # Update existing user
            if 'username' in data:
                user.username = data['username']
            if 'first_name' in data:
                user.first_name = data['first_name']
            if 'last_name' in data:
                user.last_name = data['last_name']
            if 'wallet_address' in data:
                user.wallet_address = data['wallet_address']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': user.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
