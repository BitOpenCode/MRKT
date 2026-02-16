from flask import Blueprint, request, jsonify
from database import db
from models.marketplace import MarketplaceListing
from models.contract import SmartContract
from models.transaction import Transaction
from models.user import User
import uuid

marketplace_bp = Blueprint('marketplace', __name__)

@marketplace_bp.route('/listings', methods=['GET'])
def get_listings():
    """Получить список объявлений на маркетплейсе"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('perPage', 20, type=int)
        
        # Filters
        item_type = request.args.get('itemType', 'all')
        sort_by = request.args.get('sortBy', 'discount')
        min_price = request.args.get('minPrice', type=float)
        max_price = request.args.get('maxPrice', type=float)
        badges = request.args.get('badges', '').split(',') if request.args.get('badges') else []
        
        # Base query
        query = MarketplaceListing.query.filter_by(status='active')
        
        # Apply filters
        if item_type != 'all':
            query = query.filter_by(item_type=item_type)
        
        if min_price:
            query = query.filter(MarketplaceListing.price >= min_price)
        
        if max_price:
            query = query.filter(MarketplaceListing.price <= max_price)
        
        if badges:
            for badge in badges:
                query = query.filter(MarketplaceListing.badges.like(f'%{badge}%'))
        
        # Apply sorting
        if sort_by == 'price_low':
            query = query.order_by(MarketplaceListing.price.asc())
        elif sort_by == 'price_high':
            query = query.order_by(MarketplaceListing.price.desc())
        elif sort_by == 'hashrate_low':
            query = query.join(SmartContract, MarketplaceListing.item_id == SmartContract.id).order_by(SmartContract.hashrate.asc())
        elif sort_by == 'hashrate_high':
            query = query.join(SmartContract, MarketplaceListing.item_id == SmartContract.id).order_by(SmartContract.hashrate.desc())
        elif sort_by == 'newest':
            query = query.order_by(MarketplaceListing.listed_at.desc())
        else:
            # Default: by discount/popularity
            query = query.order_by(MarketplaceListing.views.desc())
        
        # Paginate
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True,
            'data': {
                'items': [listing.to_dict() for listing in pagination.items],
                'total': pagination.total,
                'page': page,
                'perPage': per_page,
                'totalPages': pagination.pages
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@marketplace_bp.route('/listings/<listing_id>', methods=['GET'])
def get_listing(listing_id):
    """Получить конкретное объявление"""
    try:
        listing = MarketplaceListing.query.get(listing_id)
        
        if not listing:
            return jsonify({
                'success': False,
                'error': 'Listing not found'
            }), 404
        
        # Increment views
        listing.views += 1
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': listing.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@marketplace_bp.route('/list', methods=['POST'])
def list_item():
    """Выставить предмет на продажу"""
    try:
        data = request.get_json()
        
        item_type = data.get('itemType')
        item_id = data.get('itemId')
        price = data.get('price')
        seller_id = data.get('sellerId')  # TODO: Get from auth
        
        if not all([item_type, item_id, price, seller_id]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        # Verify contract exists and belongs to seller
        contract = SmartContract.query.get(item_id)
        if not contract:
            return jsonify({
                'success': False,
                'error': 'Contract not found'
            }), 404
        
        if contract.owner != seller_id:
            return jsonify({
                'success': False,
                'error': 'You do not own this contract'
            }), 403
        
        if contract.listed_on_marketplace:
            return jsonify({
                'success': False,
                'error': 'Contract already listed'
            }), 400
        
        # Determine badges
        badges = []
        discount = contract.calculate_discount()
        if discount >= 25:
            badges.append('hot')
        if contract.hashrate >= 100:
            badges.append('premium')
        
        # Create listing
        listing = MarketplaceListing(
            id=str(uuid.uuid4()),
            item_type=item_type,
            item_id=item_id,
            price=price,
            seller=seller_id,
            badges=','.join(badges)
        )
        
        # Update contract
        contract.listed_on_marketplace = True
        contract.status = 'on_sale'
        contract.current_price = price
        
        db.session.add(listing)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': listing.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@marketplace_bp.route('/buy/<listing_id>', methods=['POST'])
def buy_item(listing_id):
    """Купить предмет"""
    try:
        buyer_id = request.json.get('buyerId')  # TODO: Get from auth
        
        if not buyer_id:
            return jsonify({
                'success': False,
                'error': 'Buyer ID required'
            }), 400
        
        listing = MarketplaceListing.query.get(listing_id)
        
        if not listing:
            return jsonify({
                'success': False,
                'error': 'Listing not found'
            }), 404
        
        if listing.status != 'active':
            return jsonify({
                'success': False,
                'error': 'Listing is not active'
            }), 400
        
        # Get contract
        contract = SmartContract.query.get(listing.item_id)
        
        # Create transaction
        transaction = Transaction(
            id=str(uuid.uuid4()),
            type='buy',
            amount=listing.price,
            from_address=buyer_id,  # Simplified
            to_address=listing.seller,
            item_id=listing.item_id,
            user_id=buyer_id,
            status='confirmed',  # Simplified for demo
            tx_hash=str(uuid.uuid4())
        )
        
        # Update listing
        listing.status = 'sold'
        listing.sold_at = db.func.now()
        
        # Update contract
        contract.owner = buyer_id
        contract.status = 'available'
        contract.listed_on_marketplace = False
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': transaction.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@marketplace_bp.route('/listings/<listing_id>', methods=['DELETE'])
def remove_listing(listing_id):
    """Снять предмет с продажи"""
    try:
        seller_id = request.args.get('seller_id')  # TODO: Get from auth
        
        listing = MarketplaceListing.query.get(listing_id)
        
        if not listing:
            return jsonify({
                'success': False,
                'error': 'Listing not found'
            }), 404
        
        if listing.seller != seller_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized'
            }), 403
        
        # Update contract
        contract = SmartContract.query.get(listing.item_id)
        contract.listed_on_marketplace = False
        contract.status = 'available'
        
        # Remove listing
        listing.status = 'cancelled'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Listing removed'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
