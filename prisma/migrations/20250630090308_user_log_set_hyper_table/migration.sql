-- This is an empty migration.

CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

SELECT create_hypertable('"user_logs"', 'created_at');