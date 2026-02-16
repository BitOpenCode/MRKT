from datetime import datetime
from database import db

class MarketplaceListing(db.Model):
    __tablename__ = 'marketplace_listings'
    
    id = db.Column(db.String(36), primary_key=True)
    item_type = db.Column(db.String(50), nullable=False)  # contract, asic
    item_id = db.Column(db.String(36), db.ForeignKey('smart_contracts.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    seller = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    seller_rating = db.Column(db.Float, default=5.0)
    views = db.Column(db.Integer, default=0)
    watchlist_count = db.Column(db.Integer, default=0)
    badges = db.Column(db.String(255))  # Comma-separated: hot,premium,new,trending
    status = db.Column(db.String(50), default='active')  # active, sold, cancelled
    listed_at = db.Column(db.DateTime, default=datetime.utcnow)
    sold_at = db.Column(db.DateTime)
    
    def to_dict(self):
        from models.contract import SmartContract
        
        # Get the contract item
        contract = SmartContract.query.get(self.item_id)
        
        badges_list = self.badges.split(',') if self.badges else []
        
        return {
            'id': self.id,
            'itemType': self.item_type,
            'itemId': self.item_id,
            'item': contract.to_dict() if contract else None,
            'price': self.price,
            'seller': self.seller,
            'sellerRating': self.seller_rating,
            'views': self.views,
            'watchlist': self.watchlist_count,
            'badges': badges_list,
            'listedAt': self.listed_at.isoformat() if self.listed_at else None,
            'status': self.status,
        }
    
    def __repr__(self):
        return f'<MarketplaceListing {self.id}>'
