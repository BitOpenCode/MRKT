from flask import Blueprint, request, jsonify, session
from models import SmartContract, User
from database import db
import json

contract_bp = Blueprint('contract', __name__)

@contract_bp.route('/user', methods=['GET'])
def get_user_contracts():
    """Get all contracts owned by current user"""
    try:
        from models.user import User
        
        user_id = session.get('user_id')
        
        print(f"[DEBUG] /contracts/user - user_id from session: {user_id}")
        
        if not user_id:
            print("[DEBUG] No user_id in session - returning empty array")
            return jsonify({'success': True, 'data': []})
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"[DEBUG] User {user_id} not found in DB - clearing session")
            session.clear()
            return jsonify({'success': False, 'error': 'User not found. Please login again.'}), 401
        
        contracts = SmartContract.query.filter_by(owner=user_id).all()
        
        print(f"[DEBUG] Found {len(contracts)} contracts for user {user_id}")
        
        return jsonify({
            'success': True,
            'data': [contract.to_dict() for contract in contracts]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@contract_bp.route('/<contract_id>', methods=['GET'])
def get_contract(contract_id):
    """Get contract by ID"""
    try:
        contract = SmartContract.query.filter_by(id=contract_id).first()
        
        if not contract:
            return jsonify({'success': False, 'error': 'Contract not found'}), 404
        
        return jsonify({
            'success': True,
            'data': contract.to_dict()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@contract_bp.route('/<contract_id>/start-mining', methods=['POST'])
def start_mining(contract_id):
    """Start mining on a contract"""
    try:
        from datetime import datetime, timedelta
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401
        
        contract = SmartContract.query.filter_by(id=contract_id, owner=user_id).first()
        
        if not contract:
            return jsonify({'success': False, 'error': 'Contract not found'}), 404
        
        if contract.status == 'mining':
            return jsonify({'success': False, 'error': 'Already mining'}), 400
        
        # Lock contract for 7 days minimum
        contract.status = 'mining'
        contract.mining_started_at = datetime.utcnow()
        contract.mining_locked_until = datetime.utcnow() + timedelta(days=7)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Mining started',
            'data': contract.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@contract_bp.route('/<contract_id>/stop-mining', methods=['POST'])
def stop_mining(contract_id):
    """Stop mining on a contract"""
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401
        
        contract = SmartContract.query.filter_by(id=contract_id, owner=user_id).first()
        
        if not contract:
            return jsonify({'success': False, 'error': 'Contract not found'}), 404
        
        if contract.status != 'mining':
            return jsonify({'success': False, 'error': 'Not mining'}), 400
        
        contract.status = 'owned'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Mining stopped',
            'data': contract.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@contract_bp.route('/<contract_id>/list', methods=['POST'])
def list_contract(contract_id):
    """List contract on marketplace"""
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        price = data.get('price')
        
        if not price or price <= 0:
            return jsonify({'success': False, 'error': 'Invalid price'}), 400
        
        contract = SmartContract.query.filter_by(id=contract_id, owner=user_id).first()
        
        if not contract:
            return jsonify({'success': False, 'error': 'Contract not found'}), 404
        
        if contract.listed_on_marketplace:
            return jsonify({'success': False, 'error': 'Already listed'}), 400
        
        contract.listed_on_marketplace = True
        contract.current_price = price
        contract.status = 'on_sale'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Contract listed on marketplace',
            'data': contract.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@contract_bp.route('/<contract_id>/withdraw', methods=['POST'])
def withdraw_contract(contract_id):
    """Withdraw contract to TON wallet (simulate)"""
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401
        
        contract = SmartContract.query.filter_by(id=contract_id, owner=user_id).first()
        
        if not contract:
            return jsonify({'success': False, 'error': 'Contract not found'}), 404
        
        if contract.listed_on_marketplace:
            return jsonify({'success': False, 'error': 'Cannot withdraw listed contract'}), 400
        
        if contract.status == 'mining':
            return jsonify({'success': False, 'error': 'Cannot withdraw mining contract'}), 400
        
        # Simulate withdrawal - in real app would transfer NFT to wallet
        contract.status = 'withdrawn'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Contract withdrawn to wallet',
            'data': contract.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@contract_bp.route('/import', methods=['POST'])
def import_from_wallet():
    """Import contract from TON wallet (simulate)"""
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        token_id = data.get('tokenId')
        
        if not token_id:
            return jsonify({'success': False, 'error': 'Token ID required'}), 400
        
        # Check if contract with this token_id exists
        contract = SmartContract.query.filter_by(token_id=token_id).first()
        
        if not contract:
            return jsonify({'success': False, 'error': 'Contract not found'}), 404
        
        if contract.status == 'withdrawn':
            # Re-import from wallet
            contract.owner = user_id
            contract.status = 'owned'
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Contract imported from wallet',
                'data': contract.to_dict()
            })
        else:
            return jsonify({'success': False, 'error': 'Contract not available for import'}), 400
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
