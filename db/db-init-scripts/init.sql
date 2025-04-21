-- We're using this because Docker env vars already created DB & user
USE db_name;

-- Define schema
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional seed
-- INSERT INTO users (name) VALUES ('Ethan');



