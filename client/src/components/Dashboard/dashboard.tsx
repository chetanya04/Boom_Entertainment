import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase.ts';
import { useNavigate, Link } from 'react-router-dom';
import './boomFeed.css';
import Popup from '../popup/PlayerPopup.tsx';

interface Video {
  _id: string;
  title: string;
  creatorId: string;
  type: 'short' | 'long';
  videoUrl?: string;
  price: number;
  createdAt?: string;
  purchased?: boolean;
}

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  dbId?: string;
}

const BoomFeed: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [walletBalance, setWalletBalance] = useState(500);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'auth' | 'user' | 'videos' | 'done' | 'error'>('auth');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/');
        return;
      }

      const { uid, displayName, email } = user;
      setCurrentUser({ uid, displayName, email });

      try {
        await fetch('http://localhost:5000/api/user/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firebaseId: uid, name: displayName || 'User', email: email || '' }),
        });

        const res = await fetch(`http://localhost:5000/api/user/${uid}`);
        const userData = await res.json();
        if (!res.ok) throw new Error('User fetch failed');

        setWalletBalance(userData.walletBalance || 0);
        setCurrentUser((prev) => prev ? { ...prev, dbId: userData._id } : null);
        setStatus('user');
      } catch {
        setStatus('error');
        setError('Failed to load user data.');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/feed');
        const data: Video[] = await res.json();
        setVideos(data);
        setStatus('done');
      } catch {
        setStatus('error');
        setError('Failed to load videos.');
      }
    };
    if (status === 'user') loadVideos();
  }, [status]);

  const handlePurchase = async (video: Video) => {
    if (!currentUser?.dbId) return alert('User not ready');

    try {
      const res = await fetch('http://localhost:5000/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.dbId, videoId: video._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Purchase failed');

      setWalletBalance(data.newBalance);
      setVideos((prev) => prev.map((v) => (v._id === video._id ? { ...v, purchased: true } : v)));
      alert('Purchase successful!');
    } catch (err: any) {
      alert(`Purchase failed: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch {
      setError('Error signing out.');
    }
  };

  return (
    <div className="boom-feed">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Boom Feed</h1>
          <nav className="navigation">
            <Link to="/home" className="nav-link">🏠 Home</Link>
            <Link to="/upload" className="nav-link">⬆️ Upload</Link>
          </nav>
          <div className="user-section">
            <span className="user-name">{currentUser?.displayName || 'User'}</span>
            <span className="wallet-balance">₹{walletBalance}</span>
            <button onClick={handleLogout} className="logout-button">🚪 Logout</button>
          </div>
        </div>
      </header>

      <div className="video-grid">
        {videos.map((video) => (
          <div key={video._id} className={`video-card ${video.type}-video`}>
            <div className="video-container">
              {video.type === 'short' ? (
                <video src={video.videoUrl} className="video-player" muted autoPlay loop controls />
              ) : (
                <img src="/thumbnail-placeholder.jpg" alt="Thumbnail" className="video-thumbnail" />
              )}
              <span className="video-type-badge">{video.type}</span>
            </div>
            <div className="video-info">
              <h2>{video.title}</h2>
              <p>{video.creatorId}</p>
              {video.createdAt && <p>Uploaded: {new Date(video.createdAt).toLocaleDateString()}</p>}
              <div className="video-actions">
                {video.price > 0 && !video.purchased ? (
                  <button onClick={() => handlePurchase(video)} className="btn btn-buy">
                    Buy for ₹{video.price}
                  </button>
                ) : (
                  <button onClick={() => { setSelectedVideo(video); setPopupVisible(true); }} className="btn btn-watch">
                    Watch
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isPopupVisible && selectedVideo && (
        <Popup
          video={selectedVideo}
          onClose={() => setPopupVisible(false)}
          userBalance={walletBalance}
          onBalanceUpdate={setWalletBalance}
        />
      )}
    </div>
  );
};

export default BoomFeed;
