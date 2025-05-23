-- MySQL Schema for Subscription Manager
-- Drop DB if it exists and create a new one
DROP DATABASE IF EXISTS subscription_manager;
CREATE DATABASE subscription_manager;
USE subscription_manager;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cost DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  billing_frequency ENUM('Monthly', 'Quarterly', 'Biannual', 'Yearly', 'Custom') NOT NULL,
  next_payment_date DATE NOT NULL,
  category VARCHAR(100),
  status ENUM('Active', 'PaymentDueSoon', 'PaymentOverdue', 'Paused', 'Canceled') DEFAULT 'Active',
  notes TEXT,
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_next_payment_date (next_payment_date),
  INDEX idx_status (status)
);

-- Payment History table
CREATE TABLE payment_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscription_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_date TIMESTAMP NOT NULL,
  status ENUM('Scheduled', 'Paid', 'Failed') NOT NULL,
  notes TEXT,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  INDEX idx_subscription_id (subscription_id),
  INDEX idx_payment_date (payment_date)
);

-- Notification Settings table
CREATE TABLE notification_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT FALSE,
  reminder_days INT DEFAULT 7,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subscription_id INT,
  type ENUM('PaymentReminder', 'PriceChange', 'SystemNotification') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_subscription_id (subscription_id),
  INDEX idx_is_read (is_read)
);

-- Password Reset Tokens table
CREATE TABLE password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_email (email),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at)
);

-- Insert sample data for testing (optional)
-- Uncomment if you want sample data

-- Sample user (password: password123)
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
('user@example.com', '$2a$10$1Hqt4OhCSIs9G1T.U6V3I.jLpqzaUWKwXh7lKgNUlgJ3Z.LqEx66q', 'John', 'Doe');

SET @user_id = LAST_INSERT_ID();

-- Sample notification settings
INSERT INTO notification_settings (user_id, email_notifications, push_notifications, reminder_days) VALUES
(@user_id, TRUE, FALSE, 7);

-- Sample subscriptions
INSERT INTO subscriptions (user_id, name, description, cost, currency, billing_frequency, next_payment_date, category, status) VALUES
(@user_id, 'Netflix', 'Streaming service', 14.99, 'USD', 'Monthly', DATE_ADD(CURRENT_DATE(), INTERVAL 15 DAY), 'Entertainment', 'Active'),
(@user_id, 'Spotify', 'Music streaming', 9.99, 'USD', 'Monthly', DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY), 'Entertainment', 'Active'),
(@user_id, 'Adobe Creative Cloud', 'Design software', 52.99, 'USD', 'Monthly', DATE_ADD(CURRENT_DATE(), INTERVAL 20 DAY), 'Productivity', 'Active'),
(@user_id, 'Amazon Prime', 'Shopping and streaming', 119.00, 'USD', 'Yearly', DATE_ADD(CURRENT_DATE(), INTERVAL 90 DAY), 'Shopping', 'Active');

-- Sample payment history
INSERT INTO payment_history (subscription_id, amount, currency, payment_date, status) VALUES
(1, 14.99, 'USD', DATE_SUB(CURRENT_DATE(), INTERVAL 15 DAY), 'Paid'),
(2, 9.99, 'USD', DATE_SUB(CURRENT_DATE(), INTERVAL 25 DAY), 'Paid'),
(3, 52.99, 'USD', DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY), 'Paid'),
(1, 14.99, 'USD', DATE_ADD(CURRENT_DATE(), INTERVAL 15 DAY), 'Scheduled');

-- Sample notifications
INSERT INTO notifications (user_id, subscription_id, type, title, message, is_read) VALUES
(@user_id, 2, 'PaymentReminder', 'Payment due soon', 'Your Spotify subscription payment is due in 5 days', FALSE),
(@user_id, NULL, 'SystemNotification', 'Welcome to Subscription Manager', 'Thank you for joining!', TRUE);
