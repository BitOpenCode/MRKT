from datetime import datetime
from database import db
import json

class LotteryDraw(db.Model):
    __tablename__ = 'lottery_draws'
    
    id = db.Column(db.String(36), primary_key=True)
    draw_number = db.Column(db.Integer, unique=True, nullable=False, index=True)
    seed_hex = db.Column(db.String(128), nullable=False)
    block_hashes = db.Column(db.Text, nullable=False)  # JSON array
    block_heights = db.Column(db.Text, nullable=False)  # JSON array
    tickets = db.Column(db.Text, nullable=False)  # JSON array
    winner = db.Column(db.Integer, nullable=False)
    prize_contract_id = db.Column(db.String(36), db.ForeignKey('smart_contracts.id'))
    draw_date = db.Column(db.DateTime, default=datetime.utcnow)
    verified = db.Column(db.Boolean, default=True)
    proof_json = db.Column(db.Text)  # JSON with full proof
    
    # Relationships
    prize = db.relationship('SmartContract', backref='lottery_prize', foreign_keys=[prize_contract_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'drawNumber': self.draw_number,
            'seedHex': self.seed_hex,
            'blockHashes': json.loads(self.block_hashes) if self.block_hashes else [],
            'blockHeights': json.loads(self.block_heights) if self.block_heights else [],
            'tickets': json.loads(self.tickets) if self.tickets else [],
            'winner': self.winner,
            'prize': self.prize.to_dict() if self.prize else None,
            'drawDate': self.draw_date.isoformat() if self.draw_date else None,
            'verified': self.verified,
        }
    
    def __repr__(self):
        return f'<LotteryDraw #{self.draw_number}>'

class LotteryTicket(db.Model):
    __tablename__ = 'lottery_tickets'
    
    id = db.Column(db.String(36), primary_key=True)
    ticket_number = db.Column(db.Integer, nullable=False, index=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    draw_id = db.Column(db.String(36), db.ForeignKey('lottery_draws.id'), index=True)
    status = db.Column(db.String(50), default='pending')  # pending, won, lost, active
    claimed = db.Column(db.Boolean, default=False)  # Prize claimed flag
    prize_contract_id = db.Column(db.String(36), db.ForeignKey('smart_contracts.id'))  # Claimed prize contract
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        from models.lottery import LotteryDraw
        prize_contract = None
        if self.draw_id and self.status == 'won':
            draw = LotteryDraw.query.filter_by(id=self.draw_id).first()
            if draw and draw.prize_contract_id:
                prize_contract = draw.prize_contract_id
        
        return {
            'id': self.id,
            'ticketNumber': self.ticket_number,
            'userId': self.user_id,
            'drawId': self.draw_id,
            'status': self.status,
            'claimed': self.claimed,
            'prizeContractId': prize_contract,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<LotteryTicket #{self.ticket_number}>'
