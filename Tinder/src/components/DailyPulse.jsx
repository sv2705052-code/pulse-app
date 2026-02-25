import React from 'react';
import './DailyPulse.css';

const DailyPulse = ({ user, onAction }) => {
    if (!user) return null;

    return (
        <div className="daily-pulse-container animate-slide-up">
            <div className="pulse-card glass-card">
                <div className="pulse-header">
                    <span className="pulse-badge">🔥 DAILY PULSE</span>
                    <h3>Your Ideal Match Today</h3>
                </div>

                <div className="pulse-body">
                    <div className="pulse-avatar-wrapper">
                        {user.profilePictureUrl ? (
                            <img src={user.profilePictureUrl} alt={user.name} className="pulse-avatar" />
                        ) : (
                            <div className="pulse-avatar-placeholder">{user.name[0]}</div>
                        )}
                        <div className="pulse-overlay-ring"></div>
                    </div>

                    <div className="pulse-info">
                        <h4>{user.name}, {user.age}</h4>
                        <p className="pulse-reason">Based on your interests in <strong>{user.interests?.[0] || 'Life'}</strong></p>
                    </div>
                </div>

                <div className="pulse-footer">
                    <button onClick={() => onAction('pass')} className="pulse-btn pass">Skip</button>
                    <button onClick={() => onAction('like')} className="pulse-btn like">Connect Now</button>
                </div>
            </div>
        </div>
    );
};

export default DailyPulse;
