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
        KEY idx_hostel (hostel),
        KEY idx_referredBy (referredBy),
        KEY idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Safe migration: Add serviceSpeed column to existing tables if missing
    try {
      const [columns] = await connection.query("SHOW COLUMNS FROM students LIKE 'serviceSpeed'");
      if ((columns as any[]).length === 0) {
        console.log("Adding 'serviceSpeed' column to students table...");
        await connection.query("ALTER TABLE students ADD COLUMN serviceSpeed VARCHAR(50) NOT NULL DEFAULT 'Standard'");
      }
    } catch (migrationError) {
      console.error("Migration check for serviceSpeed failed:", migrationError);
    }

    connection.release();
    console.log("Cloud database tables verified/initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Clever Cloud MySQL database:", error);
  }
}
