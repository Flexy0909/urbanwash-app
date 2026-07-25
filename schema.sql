-- ============================================================
-- URBAN WASH — Complete Production MySQL Database Schema & Seed
-- Target: Clever Cloud MySQL, Vercel Postgres/MySQL, Railway, Aiven, or cPanel
-- ============================================================

CREATE TABLE IF NOT EXISTS students (
    customerId VARCHAR(50) PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    hostel VARCHAR(50) NOT NULL,
    room VARCHAR(50) NOT NULL,
    services TEXT NOT NULL,
    offer VARCHAR(255) NOT NULL,
    referralStatus VARCHAR(10) NOT NULL DEFAULT 'No',
    referredBy VARCHAR(50) NULL,
    consent TINYINT(1) NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'Lead Registered',
    createdAt VARCHAR(50) NOT NULL,
    serviceSpeed VARCHAR(50) NOT NULL DEFAULT 'Standard',
    leavingCampus VARCHAR(50) NULL,
    pickupDate VARCHAR(50) NULL,
    pickupTimeSlot VARCHAR(100) NULL,
    pinCode VARCHAR(10) NULL,
    paymentMethod VARCHAR(50) NULL,
    paymentStatus VARCHAR(50) NOT NULL DEFAULT 'Pending',
    transactionCode VARCHAR(100) NULL,
    rating INT NULL,
    ratingComment TEXT NULL,
    isTempPin TINYINT(1) NOT NULL DEFAULT 0,
    orderItems TEXT NULL,
    estimatedTotal INT NULL DEFAULT 0,
    adminConfirmedTotal INT NULL DEFAULT 0,
    KEY idx_hostel (hostel),
    KEY idx_referredBy (referredBy),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Initial Seed Data for URBAN WASH
INSERT INTO students 
(customerId, fullName, phone, whatsapp, hostel, room, services, offer, referralStatus, referredBy, consent, status, createdAt, serviceSpeed, pickupDate, pickupTimeSlot, pinCode, paymentMethod, paymentStatus, transactionCode, rating, ratingComment, estimatedTotal)
VALUES 
('UW-2026-0001', 'Juma Rashid', '0712345678', '0712345678', 'Hostel 1', '102', '["Wash & Iron"]', 'Standard Student Wash', 'Yes', NULL, 1, 'Picked Up & Verified', '2026-07-24T08:00:00.000Z', 'Standard', '2026-07-24', 'Morning (8AM - 11AM)', '1234', 'M-Pesa', 'Paid', 'DG4681NW4K', 5, 'Great service and quick turnaround!', 4500),
('UW-2026-0002', 'Neema Kilonzo', '0655123456', '0655123456', 'Hostel 2', '205', '["Washing", "Ironing"]', 'Express Wash', 'No', 'UW-2026-0001', 1, 'Washing & Drying', '2026-07-24T09:30:00.000Z', 'Express', '2026-07-24', 'Afternoon (1PM - 4PM)', '5678', 'Airtel Money', 'Verification Submitted', 'TID:MP260728.2242.Z52912', NULL, NULL, 6000),
('UW-2026-0003', 'Baraka Mwangi', '0788990011', '0788990011', 'Hostel 3', '310', '["Wash & Iron"]', 'Standard Student Wash', 'Yes', 'UW-2026-0001', 1, 'Ready for Delivery', '2026-07-24T10:15:00.000Z', 'Standard', '2026-07-25', 'Evening (7PM - 10PM)', '9999', 'M-Pesa', 'Paid', 'DG998877XX', 5, 'Clean clothes, neatly folded!', 3500)
ON DUPLICATE KEY UPDATE customerId = customerId;
