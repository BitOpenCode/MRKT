from flask import Blueprint, request, jsonify
from database import db
from models.user import User
from models.contract import SmartContract

wallet_bp = Blueprint('wallet', __name__)

@wallet_bp.route('/connect', methods=['POST'])
def connect_wallet():
    """Подключить TON кошелек"""
    try:
        data = request.get_json()
        user_id = data.get('userId')  # TODO: Get from auth
        address = data.get('address')
        network = data.get('network', 'mainnet')
        
        if not all([user_id, address]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        # Update user wallet
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        user.wallet_address = address
        db.session.commit()
        
        # Get wallet info
        wallet_info = {
            'address': address,
            'balance': 0.0,  # TODO: Get real balance from TON
            'nfts': [],
            'connected': True,
            'network': network
        }
        
        return jsonify({
            'success': True,
            'data': wallet_info
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@wallet_bp.route('/disconnect', methods=['POST'])
def disconnect_wallet():
    """Отключить кошелек"""
    try:
        user_id = request.json.get('userId')  # TODO: Get from auth
        
        user = User.query.get(user_id)
        
        if user:
            user.wallet_address = None
            db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Wallet disconnected'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@wallet_bp.route('/nfts/<address>', methods=['GET'])
def get_wallet_nfts(address):
    """Получить NFT из кошелька"""
    try:
        # TODO: Fetch from TON blockchain
        # For now, return contracts owned by user
        user = User.query.filter_by(wallet_address=address).first()
        
        if not user:
            return jsonify({
                'success': True,
                'data': []
            })
        
        contracts = SmartContract.query.filter_by(owner=user.id).all()
        
        return jsonify({
            'success': True,
            'data': [c.to_dict() for c in contracts]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@wallet_bp.route('/import-nft', methods=['POST'])
def import_nft():
    """Импортировать NFT из кошелька"""
    try:
        data = request.get_json()
        user_id = data.get('userId')  # TODO: Get from auth
        token_id = data.get('tokenId')
        
        if not all([user_id, token_id]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        # TODO: Verify NFT ownership on blockchain
        # TODO: Fetch NFT metadata
        
        # For demo, create a new contract
        contract = SmartContract.query.filter_by(token_id=token_id).first()
        
        if contract:
            if contract.owner != user_id:
                contract.owner = user_id
                db.session.commit()
        
        return jsonify({
            'success': True,
            'data': contract.to_dict() if contract else None
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
