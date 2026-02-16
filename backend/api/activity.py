from flask import Blueprint, request, jsonify
from database import db
from models.transaction import Transaction
from models.marketplace import MarketplaceListing
from datetime import datetime, timedelta
import random

activity_bp = Blueprint('activity', __name__)

@activity_bp.route('/feed', methods=['GET'])
def get_activity_feed():
    """Получить ленту активности"""
    try:
        limit = request.args.get('limit', 20, type=int)
        
        activities = []
        
        # Get recent transactions
        transactions = Transaction.query.filter(
            Transaction.created_at >= datetime.utcnow() - timedelta(hours=1)
        ).order_by(Transaction.created_at.desc()).limit(limit).all()
        
        for tx in transactions:
            activity = {
                'id': tx.id,
                'type': 'sale' if tx.type == 'buy' else tx.type,
                'userId': tx.user_id,
                'username': f'***{str(tx.user_id)[-4:]}',
                'message': generate_activity_message(tx),
                'highlight': f'${tx.amount:.2f}' if tx.type in ['buy', 'sell'] else None,
                'itemId': tx.item_id,
                'timestamp': tx.created_at.isoformat()
            }
            activities.append(activity)
        
        # Get recent listings
        listings = MarketplaceListing.query.filter(
            MarketplaceListing.listed_at >= datetime.utcnow() - timedelta(hours=1)
        ).order_by(MarketplaceListing.listed_at.desc()).limit(limit // 2).all()
        
        for listing in listings:
            activity = {
                'id': listing.id,
                'type': 'listing',
                'userId': listing.seller,
                'username': f'***{str(listing.seller)[-4:]}',
                'message': f'New listing: Mining contract',
                'highlight': f'Price: ${listing.price:.2f}',
                'itemId': listing.item_id,
                'timestamp': listing.listed_at.isoformat()
            }
            activities.append(activity)
        
        # Sort by timestamp
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'success': True,
            'data': activities[:limit]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@activity_bp.route('/online', methods=['GET'])
def get_online_users():
    """Получить количество пользователей онлайн"""
    try:
        # TODO: Implement real online tracking with Redis
        # For demo, return random number
        count = random.randint(70, 120)
        
        return jsonify({
            'success': True,
            'data': {
                'count': count
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def generate_activity_message(transaction):
    """Генерирует сообщение для активности"""
    if transaction.type == 'buy':
        return f'User bought mining contract'
    elif transaction.type == 'sell':
        return f'User sold mining contract'
    elif transaction.type == 'mining_payout':
        return f'Mining payout claimed'
    elif transaction.type == 'transfer':
        return f'Contract transferred'
    else:
        return 'Transaction completed'
