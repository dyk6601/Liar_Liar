-- ====================================
-- FEEDBACK SYSTEM DATABASE SCHEMA
-- ====================================
-- This file contains the SQL needed to add word combination feedback functionality
-- to your existing Supabase database.

-- ====================================
-- 1. CREATE WORD_FEEDBACK TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS word_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Game context
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  
  -- Word combination details
  category VARCHAR(50) NOT NULL,
  majority_word VARCHAR(100) NOT NULL,
  minority_word VARCHAR(100) NOT NULL,
  player_word VARCHAR(100) NOT NULL, -- The actual word the player received
  
  -- Feedback data
  feedback_type VARCHAR(10) NOT NULL CHECK (feedback_type IN ('upvote', 'downvote')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate feedback from same player for same word combination in same game
  UNIQUE(player_id, game_session_id, majority_word, minority_word)
);

-- ====================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ====================================
CREATE INDEX IF NOT EXISTS idx_word_feedback_category ON word_feedback(category);
CREATE INDEX IF NOT EXISTS idx_word_feedback_combination ON word_feedback(majority_word, minority_word);
CREATE INDEX IF NOT EXISTS idx_word_feedback_type ON word_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_word_feedback_created_at ON word_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_word_feedback_room ON word_feedback(room_id);

-- ====================================
-- 3. CREATE VIEW FOR ANALYTICS
-- ====================================
CREATE OR REPLACE VIEW word_feedback_analytics AS
SELECT 
  category,
  majority_word,
  minority_word,
  COUNT(*) as total_feedback,
  COUNT(CASE WHEN feedback_type = 'upvote' THEN 1 END) as upvotes,
  COUNT(CASE WHEN feedback_type = 'downvote' THEN 1 END) as downvotes,
  ROUND(
    COUNT(CASE WHEN feedback_type = 'upvote' THEN 1 END)::NUMERIC / 
    COUNT(*)::NUMERIC * 100, 
    2
  ) as upvote_percentage,
  ROUND(
    AVG(CASE 
      WHEN feedback_type = 'upvote' THEN 1 
      WHEN feedback_type = 'downvote' THEN -1 
      ELSE 0 
    END), 
    2
  ) as rating_score
FROM word_feedback
GROUP BY category, majority_word, minority_word
ORDER BY total_feedback DESC, upvote_percentage DESC;

-- ====================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ====================================
ALTER TABLE word_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Players can insert their own feedback
CREATE POLICY "Players can insert their own feedback" ON word_feedback
  FOR INSERT WITH CHECK (true); -- Allow all inserts since we're using UUID-based players

-- Policy: Players can read all feedback (for analytics)
CREATE POLICY "Anyone can read feedback" ON word_feedback
  FOR SELECT USING (true);

-- Policy: Players cannot update or delete feedback (maintain data integrity)
CREATE POLICY "No updates or deletes on feedback" ON word_feedback
  FOR UPDATE USING (false);

CREATE POLICY "No deletes on feedback" ON word_feedback
  FOR DELETE USING (false);

-- ====================================
-- 5. CREATE FUNCTION TO GET FEEDBACK STATS
-- ====================================
CREATE OR REPLACE FUNCTION get_word_combination_stats(
  p_category TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  category TEXT,
  majority_word TEXT,
  minority_word TEXT,
  total_feedback BIGINT,
  upvotes BIGINT,
  downvotes BIGINT,
  upvote_percentage NUMERIC,
  rating_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wfa.category::TEXT,
    wfa.majority_word::TEXT,
    wfa.minority_word::TEXT,
    wfa.total_feedback,
    wfa.upvotes,
    wfa.downvotes,
    wfa.upvote_percentage,
    wfa.rating_score
  FROM word_feedback_analytics wfa
  WHERE (p_category IS NULL OR wfa.category = p_category)
  ORDER BY wfa.total_feedback DESC, wfa.upvote_percentage DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- 6. SAMPLE QUERIES FOR TESTING
-- ====================================

-- Get feedback stats for a specific category
-- SELECT * FROM get_word_combination_stats('Food', 10);

-- Get overall feedback stats
-- SELECT * FROM get_word_combination_stats();

-- Get most popular word combinations
-- SELECT category, majority_word, minority_word, total_feedback, upvote_percentage
-- FROM word_feedback_analytics
-- WHERE total_feedback >= 5
-- ORDER BY upvote_percentage DESC, total_feedback DESC
-- LIMIT 20;

-- Get categories ranked by player satisfaction
-- SELECT 
--   category,
--   COUNT(*) as total_feedback,
--   AVG(upvote_percentage) as avg_satisfaction,
--   COUNT(DISTINCT majority_word || '-' || minority_word) as unique_combinations
-- FROM word_feedback_analytics
-- GROUP BY category
-- ORDER BY avg_satisfaction DESC;
