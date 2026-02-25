import React, { useState } from 'react';
import { getAiAnalysis } from '../services/api';
import './MatchAnalysis.css';

const MatchAnalysis = ({ matchId, partnerName }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAiAnalysis(matchId);
            setAnalysis(response.data);
        } catch (err) {
            setError("Failed to get AI insights. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-analysis-container">
            {!analysis ? (
                <button
                    onClick={handleAnalyze}
                    className="btn-ai-sparkle"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="loading-dots">Analyzing match...</span>
                    ) : (
                        <>
                            <span className="icon">🪄</span>
                            <span>Analyze Compatibility with {partnerName}</span>
                        </>
                    )}
                </button>
            ) : (
                <div className="analysis-result glass-card animate-fade-in">
                    <div className="analysis-header">
                        <h3>AI Compatibility Insights</h3>
                        <div className="match-score">
                            <span className="score">{analysis.matchPercentage}%</span>
                            <span className="label">Match</span>
                        </div>
                    </div>

                    <div className="analysis-section">
                        <p className="summary">{analysis.compatibilitySummary}</p>
                    </div>

                    <div className="analysis-section">
                        <h4>Conversation Starters</h4>
                        <ul className="starters-list">
                            {analysis.conversationStarters.map((starter, i) => (
                                <li key={i} className="starter-item">"{starter}"</li>
                            ))}
                        </ul>
                    </div>

                    <div className="analysis-section advice-box">
                        <h4>Pro Advice</h4>
                        <p>{analysis.advice}</p>
                    </div>

                    <button onClick={() => setAnalysis(null)} className="btn-text">
                        Hide Analysis
                    </button>
                </div>
            )}
            {error && <p className="error-text">{error}</p>}
        </div>
    );
};

export default MatchAnalysis;
