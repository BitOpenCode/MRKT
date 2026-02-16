from .user import user_bp
from .marketplace import marketplace_bp
from .mining import mining_bp
from .lottery import lottery_bp
from .wallet import wallet_bp
from .activity import activity_bp
from .auth import auth_bp
from .contract import contract_bp

__all__ = [
    'user_bp',
    'marketplace_bp',
    'mining_bp',
    'lottery_bp',
    'wallet_bp',
    'activity_bp',
    'auth_bp',
    'contract_bp',
]
