-- =====================================================
-- Blood War to the End - Database Schema
-- =====================================================

-- Users table: wallet-based identification
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    avatar_url VARCHAR(500),
    language VARCHAR(10) DEFAULT 'en',
    currency_unit VARCHAR(10) DEFAULT 'USD',
    invite_code VARCHAR(20) UNIQUE,
    invited_by INT REFERENCES users(id),
    computing_power_bonus DECIMAL(10,4) DEFAULT 0,
    total_wins INT DEFAULT 0,
    total_losses INT DEFAULT 0,
    total_bets_placed DECIMAL(30,18) DEFAULT 0,
    total_profit DECIMAL(30,18) DEFAULT 0,
    has_dawn_medal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_wallet (wallet_address),
    INDEX idx_invite_code (invite_code)
);

-- Rooms table: match room records
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id_onchain INT UNIQUE,
    contract_address VARCHAR(42) UNIQUE,
    creator_wallet VARCHAR(42) NOT NULL,
    room_name VARCHAR(200) NOT NULL,
    max_teams TINYINT NOT NULL DEFAULT 2,
    status ENUM('waiting', 'active', 'settled', 'cancelled') DEFAULT 'waiting',
    bet_token_address VARCHAR(42) NOT NULL,
    initial_bet_limit DECIMAL(30,18) NOT NULL,
    current_bet_limit DECIMAL(30,18) NOT NULL,
    bet_limit_step_pct TINYINT DEFAULT 50,
    duration_seconds INT NOT NULL,
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    winning_team TINYINT NULL,
    total_prize_pool DECIMAL(30,18) DEFAULT 0,
    total_fees DECIMAL(30,18) DEFAULT 0,
    total_participants INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP NULL,
    INDEX idx_status (status),
    INDEX idx_creator (creator_wallet),
    INDEX idx_created (created_at DESC)
);

-- Team data per room
CREATE TABLE IF NOT EXISTS room_teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL REFERENCES rooms(id),
    team_index TINYINT NOT NULL,
    team_name VARCHAR(100),
    name_set_by VARCHAR(42) NULL,
    total_bets DECIMAL(30,18) DEFAULT 0,
    supporter_count INT DEFAULT 0,
    is_winner BOOLEAN DEFAULT FALSE,
    UNIQUE KEY uk_room_team (room_id, team_index)
);

-- Individual bets
CREATE TABLE IF NOT EXISTS bets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL REFERENCES rooms(id),
    user_wallet VARCHAR(42) NOT NULL,
    team_index TINYINT NOT NULL,
    amount DECIMAL(30,18) NOT NULL,
    contribution_degree DECIMAL(20,18) DEFAULT 0,
    tx_hash VARCHAR(66) NOT NULL,
    block_number BIGINT NOT NULL,
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_room (room_id),
    INDEX idx_user (user_wallet),
    INDEX idx_tx (tx_hash)
);

-- Reward claims
CREATE TABLE IF NOT EXISTS rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL REFERENCES rooms(id),
    user_wallet VARCHAR(42) NOT NULL,
    reward_amount DECIMAL(30,18) NOT NULL,
    bet_amount DECIMAL(30,18) NOT NULL,
    profit DECIMAL(30,18) NOT NULL,
    contribution_degree DECIMAL(20,18) NOT NULL,
    tx_hash VARCHAR(66),
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_reward (user_wallet),
    INDEX idx_room_reward (room_id)
);

-- Dawn Protocol check-ins
CREATE TABLE IF NOT EXISTS dawn_checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_wallet VARCHAR(42) NOT NULL,
    day_id INT NOT NULL,
    is_on_time BOOLEAN NOT NULL,
    deposit_amount DECIMAL(30,18) NOT NULL,
    reward_amount DECIMAL(30,18) DEFAULT 0,
    check_in_order INT DEFAULT 0,
    tx_hash VARCHAR(66),
    checked_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_day (user_wallet, day_id),
    INDEX idx_day (day_id)
);

-- Invitation tracking
CREATE TABLE IF NOT EXISTS invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inviter_wallet VARCHAR(42) NOT NULL,
    invitee_wallet VARCHAR(42) NOT NULL,
    invite_code VARCHAR(20) NOT NULL,
    completed_first_checkin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_invitee (invitee_wallet),
    INDEX idx_inviter (inviter_wallet)
);

-- Leaderboard snapshots (daily/weekly/monthly)
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    period_type ENUM('daily', 'weekly', 'monthly', 'alltime') NOT NULL,
    category ENUM('profit', 'rooms', 'volume') NOT NULL,
    user_wallet VARCHAR(42) NOT NULL,
    rank_position INT NOT NULL,
    metric_value DECIMAL(30,18) NOT NULL,
    snapshot_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_period_cat (period_type, category, snapshot_date)
);

-- Platform fee records
CREATE TABLE IF NOT EXISTS platform_fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL REFERENCES rooms(id),
    fee_amount DECIMAL(30,18) NOT NULL,
    creator_reward DECIMAL(30,18) NOT NULL,
    platform_amount DECIMAL(30,18) NOT NULL,
    tx_hash VARCHAR(66),
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- On-chain event sync tracker
CREATE TABLE IF NOT EXISTS sync_state (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_address VARCHAR(42) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    last_block BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_contract_event (contract_address, event_name)
);
