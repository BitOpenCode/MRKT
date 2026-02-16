from flask import Blueprint, request, jsonify
from database import db
from models.lottery import LotteryDraw, LotteryTicket
from models.contract import SmartContract
from lottery.lottery_core import get_lottery_result, verify_lottery_result, pick_winner
from lottery.bitcoin_api import get_block_hashes_for_draw
import uuid
import json

lottery_bp = Blueprint('lottery', __name__)

@lottery_bp.route('/current', methods=['GET'])
def get_current_draw():
    """Получить текущий розыгрыш"""
    try:
        # Получаем последний розыгрыш
        draw = LotteryDraw.query.order_by(LotteryDraw.draw_number.desc()).first()
        
        if not draw:
            return jsonify({
                'success': False,
                'message': 'No draws yet'
            }), 404
        
        return jsonify({
            'success': True,
            'data': draw.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@lottery_bp.route('/history', methods=['GET'])
def get_history():
    """Получить историю розыгрышей"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('perPage', 10, type=int)
        
        pagination = LotteryDraw.query.order_by(
            LotteryDraw.draw_number.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True,
            'data': {
                'items': [draw.to_dict() for draw in pagination.items],
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

@lottery_bp.route('/draw', methods=['POST'])
def conduct_draw():
    """Провести розыгрыш лотереи"""
    try:
        data = request.get_json()
        block_count = data.get('blockCount', 3)
        
        # Получаем хеши блоков Bitcoin
        blocks = get_block_hashes_for_draw(count=block_count)
        
        if not blocks:
            return jsonify({
                'success': False,
                'error': 'Failed to get Bitcoin block hashes'
            }), 500
        
        block_hashes = [b['hash'] for b in blocks]
        block_heights = [b['height'] for b in blocks]
        
        # Получаем список билетов (в реальном приложении они должны быть в БД)
        # Для демо используем тестовые билеты
        tickets = [666, 77, 123, 1, 6, 1234, 34567, 789, 42, 999]
        
        # Проводим розыгрыш
        result = get_lottery_result(block_hashes, tickets)
        
        # Получаем номер следующего розыгрыша
        last_draw = LotteryDraw.query.order_by(LotteryDraw.draw_number.desc()).first()
        next_draw_number = (last_draw.draw_number + 1) if last_draw else 1
        
        # Создаем prize contract (в реальности это должен быть существующий контракт)
        prize_contract = SmartContract.query.first()
        
        # Сохраняем розыгрыш в БД
        draw = LotteryDraw(
            id=str(uuid.uuid4()),
            draw_number=next_draw_number,
            seed_hex=result['seedHex'],
            block_hashes=json.dumps(block_hashes),
            block_heights=json.dumps(block_heights),
            tickets=json.dumps(tickets),
            winner=result['winner'],
            prize_contract_id=prize_contract.id if prize_contract else None,
            verified=True,
            proof_json=json.dumps(result['proof'])
        )
        
        db.session.add(draw)
        
        # Обновляем статус билетов
        for ticket_number in tickets:
            ticket = LotteryTicket.query.filter_by(
                ticket_number=ticket_number,
                status='pending'
            ).first()
            
            if ticket:
                ticket.draw_id = draw.id
                ticket.status = 'won' if ticket_number == result['winner'] else 'lost'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': result,
            'draw': draw.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@lottery_bp.route('/verify', methods=['POST'])
def verify_draw():
    """Проверить результат розыгрыша"""
    try:
        data = request.get_json()
        seed_hex = data.get('seedHex')
        tickets = data.get('tickets', [])
        claimed_winner = data.get('claimedWinner')
        
        if not seed_hex or not tickets or claimed_winner is None:
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        valid, message = verify_lottery_result(seed_hex, tickets, claimed_winner)
        
        return jsonify({
            'success': True,
            'data': {
                'valid': valid,
                'message': message
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@lottery_bp.route('/tickets/user', methods=['GET'])
def get_user_tickets():
    """Получить билеты пользователя"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        if not user_id:
            # Return empty array if not authenticated
            return jsonify({
                'success': True,
                'data': []
            })
        
        tickets = LotteryTicket.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'success': True,
            'data': [ticket.to_dict() for ticket in tickets]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@lottery_bp.route('/test-draw', methods=['POST'])
def create_test_draw():
    """Создать тестовый розыгрыш с 10 билетами для проверки логики"""
    try:
        data = request.get_json() or {}
        ticket_count = data.get('ticketCount', 10)
        prize = data.get('prize', '100 TH Mining Contract')
        
        # Генерируем 10 тестовых билетов
        test_tickets = []
        from models.user import User
        users = User.query.limit(10).all()
        
        if len(users) < 10:
            return jsonify({
                'success': False,
                'error': 'Need at least 10 users in database'
            }), 400
        
        # Создаем билеты для каждого из 10 пользователей
        for i, user in enumerate(users):
            ticket_number = 1000 + i * 111  # 1000, 1111, 1222, etc.
            
            # Проверяем не существует ли уже такой билет
            existing = LotteryTicket.query.filter_by(
                ticket_number=ticket_number,
                status='pending'
            ).first()
            
            if not existing:
                ticket = LotteryTicket(
                    id=str(uuid.uuid4()),
                    ticket_number=ticket_number,
                    user_id=user.id,
                    status='pending'
                )
                db.session.add(ticket)
                test_tickets.append(ticket_number)
            else:
                test_tickets.append(ticket_number)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'ticketCount': len(test_tickets),
                'tickets': test_tickets,
                'prize': prize,
                'message': f'Created {len(test_tickets)} test tickets. Now click "Conduct Draw" to test lottery logic!'
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@lottery_bp.route('/claim-prize/<ticket_id>', methods=['POST'])
def claim_prize(ticket_id):
    """Claim prize for a winning lottery ticket"""
    try:
        from flask import session
        from models.contract import SmartContract
        
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized'
            }), 401
        
        # Find the ticket
        ticket = LotteryTicket.query.filter_by(id=ticket_id, user_id=user_id).first()
        if not ticket:
            return jsonify({
                'success': False,
                'error': 'Ticket not found'
            }), 404
        
        # Check if ticket won
        if ticket.status != 'won':
            return jsonify({
                'success': False,
                'error': 'This ticket did not win'
            }), 400
        
        # Check if already claimed
        if ticket.claimed:
            return jsonify({
                'success': False,
                'error': 'Prize already claimed'
            }), 400
        
        # Get the draw and prize contract
        draw = LotteryDraw.query.filter_by(id=ticket.draw_id).first()
        if not draw or not draw.prize_contract_id:
            return jsonify({
                'success': False,
                'error': 'No prize available'
            }), 404
        
        # Transfer contract to winner
        contract = SmartContract.query.filter_by(id=draw.prize_contract_id).first()
        if not contract:
            return jsonify({
                'success': False,
                'error': 'Prize contract not found'
            }), 404
        
        # Assign contract to winner
        contract.owner = user_id
        contract.status = 'owned'
        
        # Mark ticket as claimed
        ticket.claimed = True
        ticket.prize_contract_id = contract.id
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'ticket': ticket.to_dict(),
                'contract': contract.to_dict(),
                'message': f'🎉 Congratulations! You claimed {contract.hashrate} TH/s mining contract!'
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
