from datetime import datetime
from database import db

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.String(36), primary_key=True)
    type = db.Column(db.String(50), nullable=False)  # buy, sell, transfer, mining_payout
    amount = db.Column(db.Float, nullable=False)
    from_address = db.Column(db.String(255), nullable=False)
    to_address = db.Column(db.String(255), nullable=False)
    item_id = db.Column(db.String(36))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), index=True)
    status = db.Column(db.String(50), default='pending')  # pending, confirmed, failed
    tx_hash = db.Column(db.String(255), unique=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    confirmed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'amount': self.amount,
            'from': self.from_address,
            'to': self.to_address,
            'itemId': self.item_id,
            'status': self.status,
            'txHash': self.tx_hash,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<Transaction {self.id}>'
