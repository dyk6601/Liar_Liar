// src/components/FeedbackAnalytics.jsx
// Optional analytics component to view word combination feedback data
import React, { useState, useEffect } from 'react';
import gameService from '../utils/gameService.js';

const FeedbackAnalytics = ({ selectedCategory = null }) => {
  const [feedbackStats, setFeedbackStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeedbackStats();
  }, [selectedCategory]);

  const loadFeedbackStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await gameService.getWordFeedbackStats(selectedCategory, 20);
      setFeedbackStats(stats || []);
      
    } catch (err) {
      console.error('Error loading feedback stats:', err);
      setError('Failed to load feedback statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 border-4 border-gray-800 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Word Combination Analytics</h3>
        <p className="text-gray-600">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-4 border-4 border-gray-800 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Word Combination Analytics</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadFeedbackStats}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!feedbackStats.length) {
    return (
      <div className="bg-white rounded-2xl p-4 border-4 border-gray-800 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Word Combination Analytics</h3>
        <p className="text-gray-600">No feedback data available yet. Start playing to see statistics!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 border-4 border-gray-800 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        📊 Word Combination Analytics
        {selectedCategory && ` - ${selectedCategory.replace(/_/g, ' ')}`}
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {feedbackStats.map((stat, index) => (
          <div 
            key={`${stat.category}-${stat.majority_word}-${stat.minority_word}`}
            className="bg-gray-50 rounded-lg p-3 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-sm text-gray-800">
                  {stat.majority_word} vs {stat.minority_word}
                </p>
                <p className="text-xs text-gray-600">{stat.category}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{stat.total_feedback} votes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-green-600 text-sm">👍</span>
                <span className="text-sm font-medium">{stat.upvotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-red-600 text-sm">👎</span>
                <span className="text-sm font-medium">{stat.downvotes}</span>
              </div>
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stat.upvote_percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">
                {stat.upvote_percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {feedbackStats.length === 20 && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          Showing top 20 combinations. More data available in database.
        </p>
      )}
    </div>
  );
};

export default FeedbackAnalytics;
