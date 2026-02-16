"""
Bitcoin API Integration - ported from lottery-BTC-v1
Получение хешей блоков Bitcoin для лотереи
"""

import requests
from typing import List, Optional
import os

BITCOIN_API_URL = os.getenv('BITCOIN_API_URL', 'https://blockstream.info/api')

def get_latest_block_height() -> Optional[int]:
    """
    Получает высоту последнего блока Bitcoin
    
    Returns:
        Optional[int]: Высота блока или None при ошибке
    """
    try:
        url = f"{BITCOIN_API_URL}/blocks/tip/height"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return int(response.text.strip())
    except Exception as e:
        print(f"Error getting latest block height: {e}")
        return None

def get_block_hash(height: int) -> Optional[str]:
    """
    Получает хеш блока по его высоте
    
    Args:
        height: Высота блока
    
    Returns:
        Optional[str]: Хеш блока или None при ошибке
    """
    try:
        url = f"{BITCOIN_API_URL}/block-height/{height}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.text.strip()
    except Exception as e:
        print(f"Error getting block hash for height {height}: {e}")
        return None

def get_block_hashes_for_draw(
    count: int = 3,
    offset: int = 6
) -> Optional[List[dict]]:
    """
    Получает хеши блоков для проведения розыгрыша
    
    Args:
        count: Количество блоков для использования
        offset: Смещение от последнего блока (для подтверждения)
    
    Returns:
        Optional[List[dict]]: Список словарей с height и hash или None при ошибке
    """
    # Получаем высоту последнего блока
    latest_height = get_latest_block_height()
    if latest_height is None:
        print("Failed to get latest block height")
        return None
    
    # Вычисляем высоту блока для розыгрыша (с учетом offset для подтверждений)
    draw_height = latest_height - offset
    
    print(f"Latest block height: {latest_height}")
    print(f"Using block height: {draw_height} (offset: {offset})")
    
    # Получаем хеши нескольких блоков
    blocks = []
    for i in range(count):
        height = draw_height - i
        block_hash = get_block_hash(height)
        
        if block_hash is None:
            print(f"Failed to get block hash for height {height}")
            return None
        
        blocks.append({
            'height': height,
            'hash': block_hash
        })
        
        print(f"Block {i+1}/{count}: height={height}, hash={block_hash[:16]}...")
    
    return blocks

def get_block_info(block_hash: str) -> Optional[dict]:
    """
    Получает полную информацию о блоке
    
    Args:
        block_hash: Хеш блока
    
    Returns:
        Optional[dict]: Информация о блоке или None при ошибке
    """
    try:
        url = f"{BITCOIN_API_URL}/block/{block_hash}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error getting block info for {block_hash}: {e}")
        return None

def verify_block_exists(height: int, expected_hash: str) -> bool:
    """
    Проверяет существование блока и соответствие хеша
    
    Args:
        height: Высота блока
        expected_hash: Ожидаемый хеш
    
    Returns:
        bool: True если блок существует и хеш совпадает
    """
    try:
        actual_hash = get_block_hash(height)
        return actual_hash == expected_hash
    except Exception as e:
        print(f"Error verifying block: {e}")
        return False
