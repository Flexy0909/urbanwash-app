-- MySQL Schema for URBAN WASH Student Registration Campaign
-- Run this in your Clever Cloud MySQL Database SQL Editor

CREATE TABLE IF NOT EXISTS students (
    customerId VARCHAR(50) PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    hostel VARCHAR(50) NOT NULL,
    room VARCHAR(50) NOT NULL,
    services TEXT NOT NULL,
    offer VARCHAR(255) NOT NULL,
    referralStatus VARCHAR(10) NOT NULL,
    referredBy VARCHAR(50) NULL,
    consent TINYINT(1) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Lead Registered',
    createdAt VARCHAR(50) NOT NULL,
    serviceSpeed VARCHAR(50) NOT NULL DEFAULT 'Standard',
    leavingCampus VARCHAR(50) NULL,
    pickupDate VARCHAR(50) NULL,
    pinCode VARCHAR(10) NULL,
    paymentMethod VARCHAR(50) NULL,
    paymentStatus VARCHAR(50) NOT NULL DEFAULT 'Pending',
    transactionCode VARCHAR(100) NULL,
    rating INT NULL,
    ratingComment TEXT NULL,
    isTempPin TINYINT(1) NOT NULL DEFAULT 0,
    KEY idx_hostel (hostel),
    KEY idx_referredBy (referredBy),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

