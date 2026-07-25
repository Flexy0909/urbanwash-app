let poolInstance: any = null;

// Dynamic loader for connection pool to prevent client bundling issues
export async function getPool() {
  if (typeof window !== "undefined") {
    throw new Error("Database pool cannot be initialized on the client side.");
  }
  
  if (!poolInstance) {
    const pkgName = "mysql" + "2/promise";
    const mysql = await import(pkgName);
    const dbConfig = {
      host: process.env.DB_HOST || "bbwp8hcm4a8w5gwlsorr-mysql.services.clever-cloud.com",
      user: process.env.DB_USER || "uepb7ihviybjs41r",
      password: process.env.DB_PASSWORD || "6O1jt7V0ISS1fLviUgo6",
      database: process.env.DB_NAME || "bbwp8hcm4a8w5gwlsorr",
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

