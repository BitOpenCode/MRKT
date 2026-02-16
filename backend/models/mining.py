from datetime import datetime
from database import db

class MiningSession(db.Model):
    __tablename__ = 'mining_sessions'
    
    id = db.Column(db.String(36), primary_key=True)
    contract_id = db.Column(db.String(36), db.ForeignKey('smart_contracts.id'), nullable=False, unique=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    stopped_at = db.Column(db.DateTime)
    daily_income = db.Column(db.Float, default=0.0)
    total_earned = db.Column(db.Float, default=0.0)
    last_payout_at = db.Column(db.DateTime)
    status = db.Column(db.String(50), default='active')  # active, paused, stopped
    hashrate = db.Column(db.Float, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'contractId': self.contract_id,
            'contract': self.contract.to_dict() if self.contract else None,
            'startedAt': self.started_at.isoformat() if self.started_at else None,
            'dailyIncome': self.daily_income,
            'totalEarned': self.total_earned,
            'status': self.status,
            'hashrate': self.hashrate,
        }
    
    def __repr__(self):
        return f'<MiningSession {self.id}>'
