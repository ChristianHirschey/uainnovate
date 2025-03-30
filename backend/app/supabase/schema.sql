-- ENUMS
CREATE TYPE request_type as ENUM ('supply', 'maintenance', 'suggestion', 'other');
CREATE TYPE request_status as ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE request_priority as ENUM ('very_low', 'low', 'medium', 'high', 'very_high');
CREATE TYPE event_type AS ENUM (
  'restock',
  'delivery',
  'cleaning',
  'maintenance',
  'meeting',
  'note'
);

-- 
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type event_type NOT NULL,
  start TIMESTAMP NOT NULL,
  end TIMESTAMP NOT NULL,
  estimated_duration INTEGER,
  attendees TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE supplies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    current_stock INTEGER DEFAULT 0,
    max_stock INTEGER NOT NULL,
    threshold INTEGER DEFAULT 1,
    unit TEXT default 'unit',
    purchase_url TEXT,
    purchase_price NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- Optional
    type request_type NOT NULL,
    description TEXT NOT NULL,
    priority request_priority NOT NULL DEFAULT 'medium',
    status request_status NOT NULL DEFAULT 'open',
    supply_id UUID references supplies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE supply_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    supply_id UUID references supplies(id),
    user_id UUID,
    change INTEGER NOT NULL,
    reason TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    supply_id UUID references supplies(id),
    request_id UUID references requests(id),
    seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);