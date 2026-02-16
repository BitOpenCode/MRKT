from datetime import datetime
from database import db
import json

class SmartContract(db.Model):
    __tablename__ = 'smart_contracts'
    
    id = db.Column(db.String(36), primary_key=True)
    token_id = db.Column(db.String(255), unique=True, nullable=False, index=True)
    contract_number = db.Column(db.String(100), unique=True, nullable=False, index=True)
    hashrate = db.Column(db.Float, nullable=False)  # TH/s
    expiration_date = db.Column(db.DateTime, nullable=False)
    fair_price = db.Column(db.Float)
    current_price = db.Column(db.Float, nullable=False)
    initial_price = db.Column(db.Float)  # Цена при первом выставлении
    owner = db.Column(db.String(36), db.ForeignKey('users.id'), index=True)
    status = db.Column(db.String(50), default='available')  # available, mining, on_sale, sold
    listed_on_marketplace = db.Column(db.Boolean, default=False)
    daily_income = db.Column(db.Float, default=0.0)
    total_earned = db.Column(db.Float, default=0.0)
    roi = db.Column(db.Float)
    metadata_json = db.Column(db.Text)  # JSON string with metadata
    mining_started_at = db.Column(db.DateTime)  # When mining started
    mining_locked_until = db.Column(db.DateTime)  # Mining lock period (7 days minimum)
    cart_add_count = db.Column(db.Integer, default=0)  # How many times added to cart
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    marketplace_listing = db.relationship('MarketplaceListing', backref='contract_item', uselist=False)
    mining_session = db.relationship('MiningSession', backref='contract', uselist=False)
    
    def to_dict(self):
        metadata = json.loads(self.metadata_json) if self.metadata_json else {}
        
        return {
            'id': self.id,
            'tokenId': self.token_id,
            'contractNumber': self.contract_number,
            'hashrate': self.hashrate,
            'expirationDate': self.expiration_date.isoformat() if self.expiration_date else None,
            'fairPrice': self.fair_price,
            'currentPrice': self.current_price,
            'initialPrice': self.initial_price,
            'discount': self.calculate_discount(),
            'owner': self.owner,
            'status': self.status,
            'listedOnMarketplace': self.listed_on_marketplace,
            'dailyIncome': self.daily_income,
            'totalEarned': self.total_earned,
            'roi': self.roi,
            'cartAddCount': self.cart_add_count or 0,
            'metadata': metadata,
        }
    
    def calculate_discount(self):
        if self.fair_price and self.current_price and self.fair_price > 0:
            return round(((self.fair_price - self.current_price) / self.fair_price) * 100, 1)
        return 0
    
    def __repr__(self):
        return f'<SmartContract {self.contract_number}>'
