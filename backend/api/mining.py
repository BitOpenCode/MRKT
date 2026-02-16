from flask import Blueprint, request, jsonify
from database import db
from models.mining import MiningSession
from models.contract import SmartContract
from models.transaction import Transaction
from models.user import User
import uuid
from datetime import datetime, timedelta

mining_bp = Blueprint('mining', __name__)

@mining_bp.route('/stats', methods=['GET'])
def get_mining_stats():
    """Получить статистику майнинга пользователя"""
    try:
        user_id = request.args.get('user_id')  # TODO: Get from auth
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'User ID required'
            }), 400
        
        # Get all active sessions
        sessions = MiningSession.query.filter_by(
            user_id=user_id,
            status='active'
        ).all()
        
        # Calculate totals
        total_hashrate = sum(s.hashrate for s in sessions)
        total_earned = sum(s.total_earned for s in sessions)
        daily_income = sum(s.daily_income for s in sessions)
        
        stats = {
            'totalHashrate': total_hashrate,
            'activeSessions': len(sessions),
            'totalEarned': total_earned,
            'dailyIncome': daily_income,
            'contracts': [s.to_dict() for s in sessions]
        }
        
        return jsonify({
            'success': True,
            'data': stats
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@mining_bp.route('/start/<contract_id>', methods=['POST'])
def start_mining(contract_id):
    """Начать майнинг контракта"""
    try:
        user_id = request.json.get('userId')  # TODO: Get from auth
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'User ID required'
            }), 400
        
        # Check contract
        contract = SmartContract.query.get(contract_id)
        
        if not contract:
            return jsonify({
                'success': False,
                'error': 'Contract not found'
            }), 404
        
        if contract.owner != user_id:
            return jsonify({
                'success': False,
                'error': 'You do not own this contract'
            }), 403
        
        if contract.status == 'mining':
            return jsonify({
                'success': False,
                'error': 'Contract already mining'
            }), 400
        
        # Check if session already exists
        existing_session = MiningSession.query.filter_by(
            contract_id=contract_id
        ).first()
        
        if existing_session:
            if existing_session.status == 'paused':
                # Resume mining
                existing_session.status = 'active'
                db.session.commit()
                
                return jsonify({
                    'success': True,
                    'message': 'Mining resumed'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Mining session already exists'
                }), 400
        
        # Create new mining session
        session = MiningSession(
            id=str(uuid.uuid4()),
            contract_id=contract_id,
            user_id=user_id,
            hashrate=contract.hashrate,
            daily_income=contract.daily_income,
            status='active'
        )
        
        # Update contract
        contract.status = 'mining'
        
        db.session.add(session)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Mining started'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@mining_bp.route('/stop/<contract_id>', methods=['POST'])
def stop_mining(contract_id):
    """Остановить майнинг контракта"""
    try:
        user_id = request.json.get('userId')  # TODO: Get from auth
        
        session = MiningSession.query.filter_by(
            contract_id=contract_id,
            user_id=user_id
        ).first()
        
        if not session:
            return jsonify({
                'success': False,
                'error': 'Mining session not found'
            }), 404
        
        # Update session
        session.status = 'paused'
        session.stopped_at = datetime.utcnow()
        
        # Update contract
        contract = SmartContract.query.get(contract_id)
        contract.status = 'available'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Mining stopped'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@mining_bp.route('/claim/<contract_id>', methods=['POST'])
def claim_rewards(contract_id):
    """Забрать награды с майнинга"""
    try:
        user_id = request.json.get('userId')  # TODO: Get from auth
        
        session = MiningSession.query.filter_by(
            contract_id=contract_id,
            user_id=user_id
        ).first()
        
        if not session:
            return jsonify({
                'success': False,
                'error': 'Mining session not found'
            }), 404
        
        if session.total_earned == 0:
            return jsonify({
                'success': False,
                'error': 'No rewards to claim'
            }), 400
        
        # Create transaction
        transaction = Transaction(
            id=str(uuid.uuid4()),
            type='mining_payout',
            amount=session.total_earned,
            from_address='mining_pool',
            to_address=user_id,
            item_id=contract_id,
            user_id=user_id,
            status='confirmed',
            tx_hash=str(uuid.uuid4())
        )
        
        # Reset earned
        claimed_amount = session.total_earned
        session.total_earned = 0
        session.last_payout_at = datetime.utcnow()
        
        # Update contract
        contract = SmartContract.query.get(contract_id)
        contract.total_earned += claimed_amount
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': transaction.to_dict(),
            'amount': claimed_amount
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@mining_bp.route('/calculate-earnings', methods=['POST'])
def calculate_earnings():
    """Начислить BTC за майнинг (вызывать периодически)"""
    try:
        sessions = MiningSession.query.filter_by(status='active').all()
        for session in sessions:
            last_update = session.updated_at or session.started_at
            hours_passed = (datetime.utcnow() - last_update).total_seconds() / 3600
            earnings = (session.daily_income / 24) * hours_passed
            session.total_earned += earnings
            session.updated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'success': True, 'updated': len(sessions)})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
