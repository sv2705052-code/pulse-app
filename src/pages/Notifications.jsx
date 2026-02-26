import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, deleteNotification } from '../services/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="center">Loading alerts...</div>;

    return (
        <div className="page" style={{ padding: '20px 20px 100px' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }} className="grad-text">Alerts</h1>

            {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: 100, color: 'var(--muted)' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
                    <p>No new notifications yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {notifications.map(n => (
                        <div
                            key={n._id}
                            className="glass"
                            style={{
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 16,
                                borderLeft: n.isRead ? 'none' : '4px solid var(--primary)',
                                opacity: n.isRead ? 0.7 : 1
                            }}
                            onClick={() => !n.isRead && handleRead(n._id)}
                        >
                            <div style={{ position: 'relative' }}>
                                {n.sender?.profilePictureUrl ? (
                                    <img src={n.sender.profilePictureUrl} alt="" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👤</div>
                                )}
                                {n.type === 'like' && <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 16 }}>❤️</span>}
                                {n.type === 'match' && <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 16 }}>💘</span>}
                            </div>

                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 14, fontWeight: n.isRead ? 400 : 700, marginBottom: 4 }}>
                                    {n.message}
                                </p>
                                <p style={{ fontSize: 11, color: 'var(--muted)' }}>
                                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(n._id); }}
                                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 18 }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
