-- ====================================
-- STEP-BY-STEP MIGRATION INSTRUCTIONS
-- ====================================
-- Run these commands in your Supabase SQL Editor in order.
-- You can run them all at once or one section at a time.

-- STEP 1: Create the word_feedback table
CREATE TABLE IF NOT EXISTS word_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  majority_word VARCHAR(100) NOT NULL,
  minority_word VARCHAR(100) NOT NULL,
  upvotes INTEGER DEFAULT 0 NOT NULL,
  downvotes INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, category, majority_word, minority_word)
);

-- STEP 2: Create performance indexes
CREATE INDEX IF NOT EXISTS idx_word_feedback_room ON word_feedback(room_id);
CREATE INDEX IF NOT EXISTS idx_word_feedback_category ON word_feedback(category);
CREATE INDEX IF NOT EXISTS idx_word_feedback_combination ON word_feedback(majority_word, minority_word);
CREATE INDEX IF NOT EXISTS idx_word_feedback_created_at ON word_feedback(created_at);

-- STEP 3: Enable Row Level Security
ALTER TABLE word_feedback ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create RLS policies
CREATE POLICY "Anyone can read word feedback" ON word_feedback
  FOR SELECT USING (true);

CREATE POLICY "System can manage word feedback" ON word_feedback
  FOR ALL USING (true);

-- STEP 5: Create analytics view
CREATE OR REPLACE VIEW word_feedback_analytics AS
SELECT 
  category,
  majority_word,
  minority_word,
  upvotes,
  downvotes,
  (upvotes + downvotes) as total_feedback,
  CASE 
    WHEN (upvotes + downvotes) > 0 
    THEN ROUND((upvotes::NUMERIC / (upvotes + downvotes)::NUMERIC) * 100, 2)
    ELSE 0 
  END as upvote_percentage,
  (upvotes - downvotes) as net_score,
  created_at,
  updated_at
FROM word_feedback
ORDER BY (upvotes + downvotes) DESC, upvote_percentage DESC;

-- STEP 6: Create helper functions
CREATE OR REPLACE FUNCTION increment_word_feedback(
  p_room_id UUID,
  p_category TEXT,
  p_majority_word TEXT,
  p_minority_word TEXT,
  p_feedback_type TEXT
)
RETURNS void AS $$
BEGIN
  IF p_feedback_type = 'upvote' THEN
    INSERT INTO word_feedback (room_id, category, majority_word, minority_word, upvotes, downvotes)
    VALUES (p_room_id, p_category, p_majority_word, p_minority_word, 1, 0)
    ON CONFLICT (room_id, category, majority_word, minority_word)
    DO UPDATE SET 
      upvotes = word_feedback.upvotes + 1,
      updated_at = NOW();
  ELSIF p_feedback_type = 'downvote' THEN
    INSERT INTO word_feedback (room_id, category, majority_word, minority_word, upvotes, downvotes)
    VALUES (p_room_id, p_category, p_majority_word, p_minority_word, 0, 1)
    ON CONFLICT (room_id, category, majority_word, minority_word)
    DO UPDATE SET 
      downvotes = word_feedback.downvotes + 1,
      updated_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_word_combination_stats(
  p_category TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  category TEXT,
  majority_word TEXT,
  minority_word TEXT,
  upvotes INTEGER,
  downvotes INTEGER,
  total_feedback INTEGER,
  upvote_percentage NUMERIC,
  net_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wfa.category::TEXT,
    wfa.majority_word::TEXT,
    wfa.minority_word::TEXT,
    wfa.upvotes,
    wfa.downvotes,
    wfa.total_feedback,
    wfa.upvote_percentage,
    wfa.net_score
  FROM word_feedback_analytics wfa
  WHERE (p_category IS NULL OR wfa.category = p_category)
  ORDER BY wfa.total_feedback DESC, wfa.upvote_percentage DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
