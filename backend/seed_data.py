"""
Seed Data для тестирования
Запустить: python seed_data.py
"""

from app import app
from database import db
from models.user import User
from models.contract import SmartContract
from models.marketplace import MarketplaceListing
from models.lottery import LotteryDraw, LotteryTicket
from datetime import datetime, timedelta
import uuid
import json
import random
from werkzeug.security import generate_password_hash

def hash_password(password):
    """Password hashing using werkzeug with pbkdf2"""
    return generate_password_hash(password, method='pbkdf2:sha256')

def seed_database():
    with app.app_context():
        # Очистить базу данных
        print("Clearing database...")
        db.drop_all()
        db.create_all()
        
        # Создать пользователей
        print("Creating users...")
        users = []
        
        # Test users with login/password
        # Password for ALL users: password123
        test_users_data = [
            {"username": "alice", "first_name": "Alice", "last_name": "Johnson", "ecosPoints": 1000, "level": 3, "usdt": 25.50},
            {"username": "bob", "first_name": "Bob", "last_name": "Smith", "ecosPoints": 1500, "level": 4, "usdt": 45.00},
            {"username": "charlie", "first_name": "Charlie", "last_name": "Brown", "ecosPoints": 2000, "level": 5, "usdt": 100.00},
            {"username": "david", "first_name": "David", "last_name": "Wilson", "ecosPoints": 1000, "level": 1, "usdt": 10.00},
            {"username": "emma", "first_name": "Emma", "last_name": "Davis", "ecosPoints": 1200, "level": 2, "usdt": 15.75},
            {"username": "frank", "first_name": "Frank", "last_name": "Miller", "ecosPoints": 1800, "level": 4, "usdt": 50.00},
            {"username": "grace", "first_name": "Grace", "last_name": "Taylor", "ecosPoints": 1100, "level": 2, "usdt": 12.50},
            {"username": "henry", "first_name": "Henry", "last_name": "Anderson", "ecosPoints": 1300, "level": 3, "usdt": 30.00},
            {"username": "iris", "first_name": "Iris", "last_name": "Thomas", "ecosPoints": 2500, "level": 5, "usdt": 75.00},
            {"username": "jack", "first_name": "Jack", "last_name": "Martinez", "ecosPoints": 1000, "level": 1, "usdt": 8.50},
        ]
        
        print("\n📝 Test Users (password for all: password123):")
        print("-" * 60)
        for user_data in test_users_data:
            print(f"  Username: {user_data['username']:10} | Level: {user_data['level']} | ECOS: {user_data['ecosPoints']:5}⭐ | USDT: ${user_data['usdt']}")
        print("-" * 60)
        
        for i, user_data in enumerate(test_users_data):
            user = User(
                id=str(uuid.uuid4()),
                telegram_id=1000000 + i,
                username=user_data["username"],
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                wallet_address=f"EQ{'A' * 40}{i}" if i > 0 else None,
                usdt_balance=user_data["usdt"],  # Internal USDT balance
                btc_balance=0.0,  # Internal BTC balance (from mining)
                ecos_points=user_data["ecosPoints"],
                level=user_data["level"],
                total_volume=0.0,  # Total trading volume
                cashback_bonus=user_data["level"] * 0.5,
                referral_code=f"ECOS{1000 + i}",
                friends_invited=random.randint(0, 10),
                password_hash=hash_password("password123")  # All test users have password: password123
            )
            users.append(user)
            db.session.add(user)
        
        # Создать контракты
        print("Creating contracts...")
        contracts = []
        hashrates = [50, 75, 100, 125, 150, 200, 250, 300]
        
        for i in range(20):
            hashrate = random.choice(hashrates)
            fair_price = hashrate * 25
            discount = random.randint(10, 35)
            current_price = fair_price * (100 - discount) / 100
            
            expiration = datetime.utcnow() + timedelta(days=random.randint(90, 365))
            
            metadata = {
                "name": f"Mining Contract #{1000 + i}",
                "description": f"Bitcoin mining contract with {hashrate} TH/s hashrate",
                "image": f"https://via.placeholder.com/400?text=Contract+{hashrate}TH",
                "attributes": [
                    {"trait_type": "Hashrate", "value": f"{hashrate} TH/s"},
                    {"trait_type": "Manufacturer", "value": random.choice(["Bitmain", "MicroBT", "Canaan"])},
                    {"trait_type": "Efficiency", "value": random.choice(["High", "Medium", "Ultra"])},
                    {"trait_type": "Location", "value": random.choice(["USA", "Iceland", "Canada", "Kazakhstan"])},
                ]
            }
            
            # 20% контрактов имеют измененную цену
            initial_price = current_price if random.random() < 0.8 else current_price * random.uniform(1.05, 1.3)
            
            contract = SmartContract(
                id=str(uuid.uuid4()),
                token_id=f"TON-NFT-{1000 + i}",
                contract_number=f"MC-{1000 + i}",
                hashrate=hashrate,
                expiration_date=expiration,
                fair_price=fair_price,
                current_price=current_price,
                initial_price=initial_price,
                owner=random.choice(users).id,
                status='available',
                listed_on_marketplace=False,
                daily_income=hashrate * 0.00000042,  # 1 TH/day = 0.00000042 BTC
                total_earned=0.0,
                roi=random.randint(25, 45),
                cart_add_count=random.randint(0, 25),  # Random cart adds
                metadata_json=json.dumps(metadata)
            )
            contracts.append(contract)
            db.session.add(contract)
        
        db.session.commit()
        
        # Создать персональные контракты для Alice (2 unlisted + 1 listed)
        print("Creating personal contracts for alice...")
        alice_user = User.query.filter_by(username='alice').first()
        if alice_user:
            # 2 unlisted contracts
            for i in range(2):
                hashrate = random.choice([75, 100])
                months = random.choice([6, 9])
                expiration = datetime.utcnow() + timedelta(days=months * 30)
                fair_price = hashrate * random.uniform(20, 25)
                current_price = fair_price * random.uniform(0.85, 0.95)
                
                metadata = {
                    "name": f"BTC Mining Contract #PA{3000 + i}",
                    "description": "Personal Bitcoin mining contract owned by Alice",
                    "image": f"/contract-images/contract-{3000 + i}.png",
                    "attributes": [
                        {"trait_type": "Hashrate", "value": f"{hashrate} TH/s"},
                        {"trait_type": "Owner", "value": "alice"},
                        {"trait_type": "Status", "value": "owned"},
                    ]
                }
                
                alice_contract = SmartContract(
                    id=str(uuid.uuid4()),
                    token_id=f"TON-NFT-PA{3000 + i}",
                    contract_number=f"MC-PA{3000 + i}",
                    hashrate=hashrate,
                    expiration_date=expiration,
                    fair_price=fair_price,
                    current_price=current_price,
                    initial_price=current_price,
                    owner=alice_user.id,
                    status='owned',
                    listed_on_marketplace=False,
                    daily_income=hashrate * 0.00000042,
                    total_earned=0.0,
                    roi=random.randint(30, 45),
                    metadata_json=json.dumps(metadata)
                )
                contracts.append(alice_contract)
                db.session.add(alice_contract)
            
            # 1 listed contract
            hashrate = 150
            months = 12
            expiration = datetime.utcnow() + timedelta(days=months * 30)
            fair_price = hashrate * 22.5
            current_price = fair_price * 0.90
            
            metadata = {
                "name": f"BTC Mining Contract #PA3002",
                "description": "Bitcoin mining contract listed on marketplace",
                "image": f"/contract-images/contract-3002.png",
                "attributes": [
                    {"trait_type": "Hashrate", "value": f"{hashrate} TH/s"},
                    {"trait_type": "Owner", "value": "alice"},
                    {"trait_type": "Status", "value": "on_sale"},
                ]
            }
            
            listed_contract = SmartContract(
                id=str(uuid.uuid4()),
                token_id=f"TON-NFT-PA3002",
                contract_number=f"MC-PA3002",
                hashrate=hashrate,
                expiration_date=expiration,
                fair_price=fair_price,
                current_price=current_price,
                initial_price=current_price,
                owner=alice_user.id,
                status='on_sale',
                listed_on_marketplace=True,
                daily_income=hashrate * 0.00000042,
                total_earned=0.0,
                roi=35,
                metadata_json=json.dumps(metadata)
            )
            contracts.append(listed_contract)
            db.session.add(listed_contract)
        
        # Создать персональные контракты для charlie (для тестирования Portfolio)
        print("Creating personal contracts for charlie...")
        charlie_user = User.query.filter_by(username='charlie').first()
        if charlie_user:
            for i in range(4):
                hashrate = random.choice([50, 75, 100, 150])
                months = random.choice([3, 6, 9, 12])
                expiration = datetime.utcnow() + timedelta(days=months * 30)
                fair_price = hashrate * random.uniform(20, 25)
                current_price = fair_price * random.uniform(0.8, 0.95)
                
                metadata = {
                    "name": f"BTC Mining Contract #PC{2000 + i}",
                    "description": "Personal Bitcoin mining contract owned by user",
                    "image": f"/contract-images/contract-{2000 + i}.png",
                    "attributes": [
                        {"trait_type": "Hashrate", "value": f"{hashrate} TH/s"},
                        {"trait_type": "Owner", "value": "charlie"},
                        {"trait_type": "Status", "value": "owned"},
                    ]
                }
                
                # Личные контракты обычно не меняли цену
                initial_price = current_price
                
                personal_contract = SmartContract(
                    id=str(uuid.uuid4()),
                    token_id=f"TON-NFT-PC{2000 + i}",
                    contract_number=f"MC-PC{2000 + i}",
                    hashrate=hashrate,
                    expiration_date=expiration,
                    fair_price=fair_price,
                    current_price=current_price,
                    initial_price=initial_price,
                    owner=charlie_user.id,
                    status='owned',  # owned, not available
                    listed_on_marketplace=False,
                    daily_income=hashrate * 0.00000042,
                    total_earned=0.0,
                    roi=random.randint(30, 45),
                    metadata_json=json.dumps(metadata)
                )
                contracts.append(personal_contract)
                db.session.add(personal_contract)
        
        db.session.commit()
        
        # Создать объявления на маркетплейсе
        print("Creating marketplace listings...")
        for i in range(15):
            contract = contracts[i]
            contract.listed_on_marketplace = True
            contract.status = 'on_sale'
            
            # Определить badges
            badges = []
            discount = contract.calculate_discount()
            if discount >= 25:
                badges.append('hot')
            if contract.hashrate >= 100:
                badges.append('premium')
            if i < 3:
                badges.append('new')
            if random.random() > 0.7:
                badges.append('trending')
            
            listing = MarketplaceListing(
                id=str(uuid.uuid4()),
                item_type='contract',
                item_id=contract.id,
                price=contract.current_price,
                seller=contract.owner,
                seller_rating=random.uniform(4.0, 5.0),
                views=random.randint(50, 500),
                watchlist_count=random.randint(5, 50),
                badges=','.join(badges),
                status='active',
                listed_at=datetime.utcnow() - timedelta(hours=random.randint(1, 48))
            )
            db.session.add(listing)
        
        # Создать лотерейные билеты для прошлого розыгрыша
        print("Creating lottery tickets for past draw...")
        ticket_numbers = [666, 77, 123, 1, 6, 1234, 34567, 789, 42, 999]
        for i, ticket_num in enumerate(ticket_numbers):
            ticket = LotteryTicket(
                id=str(uuid.uuid4()),
                ticket_number=ticket_num,
                user_id=users[i % len(users)].id,
                status='pending'
            )
            db.session.add(ticket)
        
        # Создать пример розыгрыша лотереи
        print("Creating sample lottery draw...")
        draw = LotteryDraw(
            id=str(uuid.uuid4()),
            draw_number=1,
            seed_hex="a1b2c3d4e5f6" + "0" * 52,
            block_hashes=json.dumps([
                "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054",
                "00000000000000000008c76a9b4c33b38d6e0e6c9c1f9b8c5e4f3a2b1c0d9e8f",
                "00000000000000000003f5e4d3c2b1a0f9e8d7c6b5a4938271605f4e3d2c1b0a"
            ]),
            block_heights=json.dumps([800000, 799999, 799998]),
            tickets=json.dumps(ticket_numbers),
            winner=123,
            prize_contract_id=contracts[0].id,
            draw_date=datetime.utcnow() - timedelta(days=1),
            verified=True,
            proof_json=json.dumps({
                "seed": "a1b2c3d4e5f6" + "0" * 52,
                "winner": 123,
                "winnerScore": 123456789,
                "method": "direct",
                "tieBreaker": False
            })
        )
        db.session.add(draw)
        
        # Обновить статус билетов только для прошлого розыгрыша
        for ticket_num in ticket_numbers:
            ticket = LotteryTicket.query.filter_by(ticket_number=ticket_num).first()
            if ticket:
                ticket.draw_id = draw.id
                ticket.status = 'won' if ticket_num == 123 else 'lost'
        
        # Добавить АКТИВНЫЕ тикеты для alice (не участвовали в розыгрыше)
        print("Creating active tickets for Alice...")
        alice_user = next((u for u in users if u.username == 'alice'), None)
        if alice_user:
            alice_tickets = [555, 888, 2024, 777, 111]
            for ticket_num in alice_tickets:
                ticket = LotteryTicket(
                    id=str(uuid.uuid4()),
                    ticket_number=ticket_num,
                    user_id=alice_user.id,
                    status='active'  # Активные, не участвовали в розыгрыше
                )
                db.session.add(ticket)
        
        db.session.commit()
        
        print("\n✅ Database seeded successfully!")
        print(f"Created {len(users)} users")
        print(f"Created {len(contracts)} contracts")
        print(f"Created 15 marketplace listings")
        print(f"Created {len(ticket_numbers)} lottery tickets")
        print(f"Created 1 lottery draw")
        
        print("\n🎮 Test Users:")
        for user in users[:3]:
            print(f"  - telegram_id: {user.telegram_id}, username: {user.username}")
        
        print("\n🔥 Hot Deals:")
        hot_listings = MarketplaceListing.query.filter(
            MarketplaceListing.badges.like('%hot%')
        ).limit(3).all()
        for listing in hot_listings:
            contract = SmartContract.query.get(listing.item_id)
            print(f"  - {contract.contract_number}: {contract.hashrate} TH/s @ ${listing.price:.2f} ({contract.calculate_discount()}% off)")

if __name__ == '__main__':
    seed_database()
