-- BMPOA Booklet Database Schema
-- Single source of truth for all booklet content

-- Pages table - stores metadata about each page
CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_number INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    component_name TEXT NOT NULL,
    section TEXT,
    is_finalized BOOLEAN DEFAULT 0,
    finalized_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sections table - defines major sections of the booklet
CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    order_index INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content blocks - stores the actual text content
CREATE TABLE IF NOT EXISTS content_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id INTEGER NOT NULL,
    block_type TEXT NOT NULL, -- 'heading', 'paragraph', 'list', 'quote', 'sidebar'
    order_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    metadata JSON, -- Additional data like list style, heading level, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id)
);

-- Contact information
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL, -- 'emergency', 'board', 'community', 'service'
    name TEXT NOT NULL,
    title TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    notes TEXT,
    is_emergency BOOLEAN DEFAULT 0,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community resources
CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL, -- 'winery', 'hiking', 'service', 'attraction'
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    phone TEXT,
    website TEXT,
    hours TEXT,
    notes TEXT,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Images and assets
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL UNIQUE,
    alt_text TEXT NOT NULL,
    caption TEXT,
    category TEXT, -- 'emblem', 'scenic', 'facility', 'nature', 'service'
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    used_on_pages TEXT, -- JSON array of page IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cross-references between pages
CREATE TABLE IF NOT EXISTS cross_references (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_page_id INTEGER NOT NULL,
    to_page_id INTEGER NOT NULL,
    reference_text TEXT NOT NULL, -- e.g., "see page XX"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_page_id) REFERENCES pages(id),
    FOREIGN KEY (to_page_id) REFERENCES pages(id)
);

-- Regulations and rules
CREATE TABLE IF NOT EXISTS regulations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL, -- 'construction', 'fire_safety', 'community', 'environmental'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    full_text TEXT,
    effective_date DATE,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Version tracking for content changes
CREATE TABLE IF NOT EXISTS content_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by TEXT,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_pages_section ON pages(section);
CREATE INDEX idx_content_blocks_page ON content_blocks(page_id);
CREATE INDEX idx_content_blocks_type ON content_blocks(block_type);
CREATE INDEX idx_contacts_category ON contacts(category);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_cross_references_from ON cross_references(from_page_id);
CREATE INDEX idx_cross_references_to ON cross_references(to_page_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_pages_timestamp 
AFTER UPDATE ON pages
BEGIN
    UPDATE pages SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_content_blocks_timestamp 
AFTER UPDATE ON content_blocks
BEGIN
    UPDATE content_blocks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_contacts_timestamp 
AFTER UPDATE ON contacts
BEGIN
    UPDATE contacts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_resources_timestamp 
AFTER UPDATE ON resources
BEGIN
    UPDATE resources SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;