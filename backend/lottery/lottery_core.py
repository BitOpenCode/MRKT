"""
Lottery Core - ported from lottery-BTC-v1
Честная лотерея на основе хешей блоков Bitcoin
"""

import hashlib
from typing import List, Dict, Tuple, Any

def get_seed_from_blocks(block_hashes: List[str]) -> bytes:
    """
    Генерирует seed из списка хешей блоков
    
    Args:
        block_hashes: Список хешей блоков Bitcoin (hex строки)
    
    Returns:
        bytes: SHA256 хеш от конкатенации всех блоков
    """
    # Конкатенируем все хеши
    combined = ''.join(block_hashes)
    
    # Вычисляем SHA256
    seed = hashlib.sha256(combined.encode()).digest()
    
    return seed

def calculate_score(seed_hex: str, ticket_number: int) -> int:
    """
    Вычисляет score для билета
    
    Args:
        seed_hex: Seed в hex формате
        ticket_number: Номер билета
    
    Returns:
        int: Score билета (integer representation of hash)
    """
    # Формируем строку для хеширования: seed:ticket_number
    input_str = f"{seed_hex}:{ticket_number}"
    
    # Вычисляем SHA256
    hash_bytes = hashlib.sha256(input_str.encode()).digest()
    
    # Конвертируем в integer
    score = int.from_bytes(hash_bytes, byteorder='big')
    
    return score

def pick_winner(
    seed_hex: str, 
    tickets: List[int],
    tie_breaker_rounds: int = 3
) -> Tuple[int, Dict[int, int], Dict[str, Any]]:
    """
    Определяет победителя лотереи
    
    Args:
        seed_hex: Seed в hex формате
        tickets: Список номеров билетов
        tie_breaker_rounds: Количество раундов tie-breaker при коллизии
    
    Returns:
        Tuple[int, Dict[int, int], Dict]: (winner, all_scores, proof)
    """
    if not tickets:
        raise ValueError("No tickets provided")
    
    # Удаляем дубликаты и сортируем
    unique_tickets = sorted(set(tickets))
    
    # Вычисляем scores для всех билетов
    scores: Dict[int, int] = {}
    for ticket in unique_tickets:
        scores[ticket] = calculate_score(seed_hex, ticket)
    
    # Находим минимальный score
    min_score = min(scores.values())
    
    # Проверяем на коллизии
    winners = [ticket for ticket, score in scores.items() if score == min_score]
    
    # Если один победитель - возвращаем
    if len(winners) == 1:
        winner = winners[0]
        proof = {
            'seed': seed_hex,
            'winner': winner,
            'winnerScore': min_score,
            'method': 'direct',
            'tieBreaker': False
        }
        return winner, scores, proof
    
    # Tie-breaker
    print(f"Tie detected between tickets: {winners}")
    
    for round_num in range(1, tie_breaker_rounds + 1):
        print(f"Tie-breaker round {round_num}")
        
        tie_scores: Dict[int, int] = {}
        for ticket in winners:
            # Добавляем суффикс для tie-breaker
            tb_seed = f"{seed_hex}:{ticket}:tb{round_num}"
            tie_scores[ticket] = calculate_score(tb_seed, ticket)
        
        # Находим минимальный score в tie-breaker
        min_tie_score = min(tie_scores.values())
        winners = [ticket for ticket, score in tie_scores.items() if score == min_tie_score]
        
        if len(winners) == 1:
            winner = winners[0]
            proof = {
                'seed': seed_hex,
                'winner': winner,
                'winnerScore': min_score,
                'method': 'tie-breaker',
                'tieBreaker': True,
                'tieBreakerRound': round_num,
                'tieBreakerScore': min_tie_score
            }
            return winner, scores, proof
    
    # Если после всех раундов tie-breaker все еще несколько победителей,
    # выбираем билет с минимальным номером
    winner = min(winners)
    proof = {
        'seed': seed_hex,
        'winner': winner,
        'winnerScore': min_score,
        'method': 'fallback',
        'tieBreaker': True,
        'tieBreakerRounds': tie_breaker_rounds,
        'fallbackReason': 'min_ticket_number'
    }
    
    return winner, scores, proof

def get_lottery_result(
    block_hashes: List[str],
    tickets: List[int]
) -> Dict[str, Any]:
    """
    Проводит розыгрыш лотереи
    
    Args:
        block_hashes: Список хешей блоков Bitcoin
        tickets: Список номеров билетов
    
    Returns:
        Dict: Полный результат лотереи с доказательством
    """
    # Генерируем seed
    seed_bytes = get_seed_from_blocks(block_hashes)
    seed_hex = seed_bytes.hex()
    
    # Определяем победителя
    winner, all_scores, proof = pick_winner(seed_hex, tickets)
    
    # Формируем результат
    result = {
        'winner': winner,
        'seedHex': seed_hex,
        'blockHashes': block_hashes,
        'tickets': tickets,
        'allScores': {str(k): str(v) for k, v in all_scores.items()},  # Convert to strings for JSON
        'proof': proof
    }
    
    return result

def verify_lottery_result(
    seed_hex: str,
    tickets: List[int],
    claimed_winner: int
) -> Tuple[bool, str]:
    """
    Проверяет результат лотереи
    
    Args:
        seed_hex: Seed использованный в розыгрыше
        tickets: Список билетов
        claimed_winner: Заявленный победитель
    
    Returns:
        Tuple[bool, str]: (valid, message)
    """
    try:
        winner, scores, proof = pick_winner(seed_hex, tickets)
        
        if winner == claimed_winner:
            return True, f"✓ Verified! Winner is ticket #{winner}"
        else:
            return False, f"✗ Invalid! Expected winner: #{winner}, claimed: #{claimed_winner}"
    
    except Exception as e:
        return False, f"✗ Verification error: {str(e)}"
