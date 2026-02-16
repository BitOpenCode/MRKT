from datetime import datetime
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True)
    telegram_id = db.Column(db.BigInteger, unique=True, index=True)
    username = db.Column(db.String(255), unique=True, index=True)
    password_hash = db.Column(db.String(255))  # For login/password auth
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    wallet_address = db.Column(db.String(255), unique=True, index=True)
    
    # Wallet Balances
    usdt_balance = db.Column(db.Float, default=0.0)  # Internal USDT balance
    btc_balance = db.Column(db.Float, default=0.0)   # Internal BTC balance (from mining)
    
    # ECOS Points & Levels
    ecos_points = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    total_volume = db.Column(db.Float, default=0.0)  # Total trading volume in USDT
    cashback_bonus = db.Column(db.Float, default=0.0)
    
    # Referral System
    referral_code = db.Column(db.String(50), unique=True, index=True)
    referred_by = db.Column(db.String(36), db.ForeignKey('users.id'))
    friends_invited = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    contracts = db.relationship('SmartContract', backref='owner_user', lazy='dynamic', foreign_keys='SmartContract.owner')
    listings = db.relationship('MarketplaceListing', backref='seller_user', lazy='dynamic')
    mining_sessions = db.relationship('MiningSession', backref='user', lazy='dynamic')
    tickets = db.relationship('LotteryTicket', backref='user', lazy='dynamic')
    transactions = db.relationship('Transaction', backref='user', lazy='dynamic', foreign_keys='Transaction.user_id')
    
    def set_password(self, password):
        """Set password hash using werkzeug"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check password against hash using werkzeug"""
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'telegramId': self.telegram_id,
            'username': self.username,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'walletAddress': self.wallet_address,
            'usdtBalance': self.usdt_balance or 0.0,
            'btcBalance': self.btc_balance or 0.0,
            'ecosPoints': self.ecos_points or 0,
            'level': self.level or 1,
            'totalVolume': self.total_volume or 0.0,
            'cashbackBonus': self.cashback_bonus or 0.0,
            'referralCode': self.referral_code,
            'referredBy': self.referred_by,
            'friendsInvited': self.friends_invited or 0,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<User {self.username}>'
