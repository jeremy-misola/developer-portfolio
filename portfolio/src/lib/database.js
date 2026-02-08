import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✓ Database connection successful');
    client.release();
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}

// Initialize the database
async function initializeDatabase() {
  try {
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database');
      return false;
    }

    // Create tables if they don't exist
    await createTables();
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Create database tables
async function createTables() {
  try {
    // Experience table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        description TEXT,
        technologies JSONB,
        achievements JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        technologies JSONB,
        github_url VARCHAR(255),
        demo_url VARCHAR(255),
        status VARCHAR(50) DEFAULT 'in-progress',
        priority INTEGER DEFAULT 1,
        images JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Testimonials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        position VARCHAR(255),
        content TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✓ Database tables created/checked successfully');
  } catch (error) {
    console.error('✗ Error creating tables:', error);
    throw error;
  }
}

// Data access methods
const db = {
  // Experience methods
  async getExperience() {
    const result = await pool.query('SELECT * FROM experience ORDER BY start_date DESC');
    return result.rows.map(row => ({
      id: row.id.toString(),
      company: row.company,
      position: row.position,
      startDate: row.start_date.toISOString().split('T')[0],
      endDate: row.end_date ? row.end_date.toISOString().split('T')[0] : null,
      description: row.description,
      technologies: row.technologies,
      achievements: row.achievements,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
  },

  async getExperienceById(id) {
    const result = await pool.query('SELECT * FROM experience WHERE id = $1', [parseInt(id)]);
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id.toString(),
      company: row.company,
      position: row.position,
      startDate: row.start_date.toISOString().split('T')[0],
      endDate: row.end_date ? row.end_date.toISOString().split('T')[0] : null,
      description: row.description,
      technologies: row.technologies,
      achievements: row.achievements,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  },

  async createExperience(data) {
    const result = await pool.query(`
      INSERT INTO experience (
        company, position, start_date, end_date, description, 
        technologies, achievements, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      data.company,
      data.position,
      data.startDate,
      data.endDate,
      data.description,
      JSON.stringify(data.technologies || []),
      JSON.stringify(data.achievements || []),
      new Date().toISOString(),
      new Date().toISOString()
    ]);
    
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      company: row.company,
      position: row.position,
      startDate: row.start_date.toISOString().split('T')[0],
      endDate: row.end_date ? row.end_date.toISOString().split('T')[0] : null,
      description: row.description,
      technologies: row.technologies,
      achievements: row.achievements,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  },

  async updateExperience(id, data) {
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (data.company !== undefined) {
      updateFields.push(`company = $${paramCount++}`);
      updateValues.push(data.company);
    }
    if (data.position !== undefined) {
      updateFields.push(`position = $${paramCount++}`);
      updateValues.push(data.position);
    }
    if (data.startDate !== undefined) {
      updateFields.push(`start_date = $${paramCount++}`);
      updateValues.push(data.startDate);
    }
    if (data.endDate !== undefined) {
      updateFields.push(`end_date = $${paramCount++}`);
      updateValues.push(data.endDate);
    }
    if (data.description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      updateValues.push(data.description);
    }
    if (data.technologies !== undefined) {
      updateFields.push(`technologies = $${paramCount++}`);
      updateValues.push(JSON.stringify(data.technologies));
    }
    if (data.achievements !== undefined) {
      updateFields.push(`achievements = $${paramCount++}`);
      updateValues.push(JSON.stringify(data.achievements));
    }

    updateFields.push(`updated_at = $${paramCount++}`);
    updateValues.push(new Date().toISOString());
    updateValues.push(parseInt(id));

    const result = await pool.query(`
      UPDATE experience 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `, updateValues);

    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id.toString(),
      company: row.company,
      position: row.position,
      startDate: row.start_date.toISOString().split('T')[0],
      endDate: row.end_date ? row.end_date.toISOString().split('T')[0] : null,
      description: row.description,
      technologies: row.technologies,
      achievements: row.achievements,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  },

  async deleteExperience(id) {
    const result = await pool.query(
      'DELETE FROM experience WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );
    return result.rowCount > 0;
  },

  // Projects methods
  async getProjects() {
    const result = await pool.query('SELECT * FROM projects ORDER BY priority ASC, created_at DESC');
    return result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      technologies: row.technologies,
      githubUrl: row.github_url,
      demoUrl: row.demo_url,
      status: row.status,
      priority: row.priority,
      images: row.images,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
  },

  async getProjectById(id) {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [parseInt(id)]);
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      technologies: row.technologies,
      githubUrl: row.github_url,
      demoUrl: row.demo_url,
      status: row.status,
      priority: row.priority,
      images: row.images,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  },

  async createProject(data) {
    const result = await pool.query(`
      INSERT INTO projects (
        title, description, technologies, github_url, demo_url, 
        status, priority, images, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      data.title,
      data.description,
      JSON.stringify(data.technologies || []),
      data.githubUrl,
      data.demoUrl,
      data.status || 'in-progress',
      data.priority || 1,
      JSON.stringify(data.images || []),
      new Date().toISOString(),
      new Date().toISOString()
    ]);
    
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      technologies: row.technologies,
      githubUrl: row.github_url,
      demoUrl: row.demo_url,
      status: row.status,
      priority: row.priority,
      images: row.images,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  },

  async updateProject(id, data) {
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      updateFields.push(`title = $${paramCount++}`);
      updateValues.push(data.title);
    }
    if (data.description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      updateValues.push(data.description);
    }
    if (data.technologies !== undefined) {
      updateFields.push(`technologies = $${paramCount++}`);
      updateValues.push(JSON.stringify(data.technologies));
    }
    if (data.githubUrl !== undefined) {
      updateFields.push(`github_url = $${paramCount++}`);
      updateValues.push(data.githubUrl);
    }
    if (data.demoUrl !== undefined) {
      updateFields.push(`demo_url = $${paramCount++}`);
      updateValues.push(data.demoUrl);
    }
    if (data.status !== undefined) {
      updateFields.push(`status = $${paramCount++}`);
      updateValues.push(data.status);
    }
    if (data.priority !== undefined) {
      updateFields.push(`priority = $${paramCount++}`);
      updateValues.push(data.priority);
    }
    if (data.images !== undefined) {
      updateFields.push(`images = $${paramCount++}`);
      updateValues.push(JSON.stringify(data.images));
    }

    updateFields.push(`updated_at = $${paramCount++}`);
    updateValues.push(new Date().toISOString());
    updateValues.push(parseInt(id));

    const result = await pool.query(`
      UPDATE projects 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `, updateValues);

    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      technologies: row.technologies,
      githubUrl: row.github_url,
      demoUrl: row.demo_url,
      status: row.status,
      priority: row.priority,
      images: row.images,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  },

  async deleteProject(id) {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );
    return result.rowCount > 0;
  },

  // Testimonials methods
  async getTestimonials(status = 'approved') {
    let result;
    if (status === 'all') {
      result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    } else {
      result = await pool.query(
        'SELECT * FROM testimonials WHERE status = $1 ORDER BY created_at DESC',
        [status]
      );
    }
    return result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      company: row.company,
      position: row.position,
      content: row.content,
      rating: row.rating,
      status: row.status,
      createdAt: row.created_at.toISOString(),
      approvedAt: row.approved_at ? row.approved_at.toISOString() : null,
      updatedAt: row.updated_at.toISOString()
    }));
  },

  async getTestimonialById(id) {
    const result = await pool.query('SELECT * FROM testimonials WHERE id = $1', [parseInt(id)]);
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id.toString(),
      name: row.name,
      company: row.company,
      position: row.position,
      content: row.content,
      rating: row.rating,
      status: row.status,
      createdAt: row.created_at.toISOString(),
      approvedAt: row.approved_at ? row.approved_at.toISOString() : null,
      updatedAt: row.updated_at.toISOString()
    };
  },

  async createTestimonial(data) {
    const result = await pool.query(`
      INSERT INTO testimonials (
        name, company, position, content, rating, status, 
        created_at, approved_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      data.name,
      data.company,
      data.position,
      data.content,
      data.rating || 5,
      data.status || 'pending',
      new Date().toISOString(),
      data.status === 'approved' ? new Date().toISOString() : null,
      new Date().toISOString()
    ]);
    
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      name: row.name,
      company: row.company,
      position: row.position,
      content: row.content,
      rating: row.rating,
      status: row.status,
      createdAt: row.created_at.toISOString(),
      approvedAt: row.approved_at ? row.approved_at.toISOString() : null,
      updatedAt: row.updated_at.toISOString()
    };
  },

  async updateTestimonial(id, data) {
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      updateFields.push(`name = $${paramCount++}`);
      updateValues.push(data.name);
    }
    if (data.company !== undefined) {
      updateFields.push(`company = $${paramCount++}`);
      updateValues.push(data.company);
    }
    if (data.position !== undefined) {
      updateFields.push(`position = $${paramCount++}`);
      updateValues.push(data.position);
    }
    if (data.content !== undefined) {
      updateFields.push(`content = $${paramCount++}`);
      updateValues.push(data.content);
    }
    if (data.rating !== undefined) {
      updateFields.push(`rating = $${paramCount++}`);
      updateValues.push(data.rating);
    }
    if (data.status !== undefined) {
      updateFields.push(`status = $${paramCount++}`);
      updateValues.push(data.status);
      if (data.status === 'approved') {
        updateFields.push(`approved_at = $${paramCount++}`);
        updateValues.push(new Date().toISOString());
      }
    }

    updateFields.push(`updated_at = $${paramCount++}`);
    updateValues.push(new Date().toISOString());
    updateValues.push(parseInt(id));

    const result = await pool.query(`
      UPDATE testimonials 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `, updateValues);

    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id.toString(),
      name: row.name,
      company: row.company,
      position: row.position,
      content: row.content,
      rating: row.rating,
      status: row.status,
      createdAt: row.created_at.toISOString(),
      approvedAt: row.approved_at ? row.approved_at.toISOString() : null,
      updatedAt: row.updated_at.toISOString()
    };
  },

  async deleteTestimonial(id) {
    const result = await pool.query(
      'DELETE FROM testimonials WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );
    return result.rowCount > 0;
  }
};

export { pool, testConnection, initializeDatabase, createTables, db };