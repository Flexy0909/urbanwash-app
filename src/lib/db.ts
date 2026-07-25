let poolInstance: any = null;
let mysql: any = null;

// Static loader for connection pool
export async function getPool() {
  if (typeof window !== "undefined") {
    throw new Error("Database pool cannot be initialized on the client side.");
  }
  
  if (!mysql) {
    if (import.meta.env.SSR) {
      const mysqlModule = await import("./mysql2-bundle.cjs");
      mysql = mysqlModule.default || mysqlModule;
    }
  }
  
  if (!poolInstance) {
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      throw new Error("Missing required database environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME");
    }
    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 3306,
      waitForConnections: true,
      connectionLimit: 3,
      queueLimit: 0,
    };
    poolInstance = mysql.createPool(dbConfig);
  }
  return poolInstance;
}

// Initialize database tables
export async function initDb() {
  try {
    const pool = await getPool();
    const connection = await pool.getConnection();
    console.log("Successfully connected to Clever Cloud MySQL cloud database.");

    // Create students table
    await connection.query(`
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
        pickupTimeSlot VARCHAR(100) NULL,
        pinCode VARCHAR(10) NULL,
        KEY idx_hostel (hostel),
        KEY idx_referredBy (referredBy),
        KEY idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create student_orders table for multi-order support
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_orders (
        orderId VARCHAR(50) PRIMARY KEY,
        customerId VARCHAR(50) NOT NULL,
        services TEXT NOT NULL,
        offer VARCHAR(255) NOT NULL,
        serviceSpeed VARCHAR(50) NOT NULL DEFAULT 'Standard',
        pickupDate VARCHAR(50) NULL,
        pickupTimeSlot VARCHAR(100) NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Lead Registered',
        paymentMethod VARCHAR(50) NULL,
        paymentStatus VARCHAR(50) NOT NULL DEFAULT 'Pending',
        transactionCode VARCHAR(100) NULL,
        paymentDenialReason TEXT NULL,
        orderItems TEXT NULL,
        estimatedTotal INT NULL,
        adminConfirmedTotal INT NULL,
        rating INT NULL,
        ratingComment TEXT NULL,
        createdAt VARCHAR(50) NOT NULL,
        KEY idx_orders_customerId (customerId),
        KEY idx_orders_status (status),
        FOREIGN KEY (customerId) REFERENCES students(customerId) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Safe migration: Add missing columns if upgrading existing database
    const columnsToEnsure = [
      { name: "serviceSpeed", type: "VARCHAR(50) NOT NULL DEFAULT 'Standard'" },
      { name: "leavingCampus", type: "VARCHAR(50) NULL" },
      { name: "pickupDate", type: "VARCHAR(50) NULL" },
      { name: "pickupTimeSlot", type: "VARCHAR(100) NULL" },
      { name: "pinCode", type: "VARCHAR(10) NULL" },
      { name: "paymentMethod", type: "VARCHAR(50) NULL" },
      { name: "paymentStatus", type: "VARCHAR(50) NOT NULL DEFAULT 'Pending'" },
      { name: "transactionCode", type: "VARCHAR(100) NULL" },
      { name: "rating", type: "INT NULL" },
      { name: "ratingComment", type: "TEXT NULL" },
      { name: "isTempPin", type: "TINYINT(1) NOT NULL DEFAULT 0" },
    ];

    for (const col of columnsToEnsure) {
      try {
        const [existing] = await connection.query(`SHOW COLUMNS FROM students LIKE '${col.name}'`);
        if ((existing as any[]).length === 0) {
          console.log(`Adding missing column '${col.name}' to students table...`);
          await connection.query(`ALTER TABLE students ADD COLUMN ${col.name} ${col.type}`);
        }
      } catch (colErr) {
        console.error(`Migration check for column ${col.name} failed:`, colErr);
      }
    }

    connection.release();
    console.log("Cloud database tables verified/initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Clever Cloud MySQL database:", error);
  }
}

