import React, { useState, useEffect } from 'react';
import { auth } from '../../services/firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';
import './PlayerPopup.css';

interface Video {
  _id: string;
  title: string;
  type: 'short' | 'long';
  videoUrl?: string;
  creatorId: string;
}

interface PopupProps {
  video: Video | null;
  onClose: () => void;
  userBalance?: number;
  onBalanceUpdate?: (newBalance: number) => void;
}

const PlayerPopup: React.FC<PopupProps> = ({ video, onClose, userBalance = 500, onBalanceUpdate }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [giftAmount, setGiftAmount] = useState(10);
  const [showGiftInput, setShowGiftInput] = useState(false);
  const [balance, setBalance] = useState(userBalance);
  const [giftSuccess, setGiftSuccess] = useState(false);

  useEffect(() => {
    setBalance(userBalance);
  }, [userBalance]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser({ uid: user.uid, displayName: user.displayName || 'Anonymous' });
      } else {
        setCurrentUser(null);
      }
    });
    return unsub;
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser || !video) return;
    const comment = {
      id: Date.now().toString(),
      videoId: video._id,
      username: currentUser.displayName,
      text: newComment.trim(),
      createdAt: new Date(),
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleGift = () => {
    if (!currentUser || !video) return alert('Login to gift the creator');
    if (giftAmount <= 0 || balance < giftAmount) return alert('Invalid gift amount or insufficient balance');

    const updatedBalance = balance - giftAmount;
    setBalance(updatedBalance);
    onBalanceUpdate?.(updatedBalance);
    setGiftSuccess(true);
    setShowGiftInput(false);

    setTimeout(() => setGiftSuccess(false), 3000);
    console.log(`${currentUser.displayName} gifted ₹${giftAmount} to ${video.creatorId}`);
  };

  const renderVideo = () => {
    if (video?.videoUrl) {
      return video.type === 'short' ? (
        <video src={video.videoUrl} controls autoPlay style={{ width: '100%' }} />
      ) : (
        <iframe src={video.videoUrl} title={video.title} allowFullScreen style={{ width: '100%', height: 400 }} />
      );
    }
    return <p>Video not available</p>;
  };

  if (!video) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>{video.title}</h2>
        {renderVideo()}
        <p className="creator-info">Creator: {video.creatorId}</p>

        {/* Gifting Section */}
        <div className="gift-section">
          <div className="gift-header">
            <button 
              onClick={() => setShowGiftInput(!showGiftInput)} 
              disabled={!currentUser} 
              className="send-gift-btn"
            >
              🎁 Gift
            </button>
            <span>Balance: ₹{balance}</span>
          </div>

          {giftSuccess && (
            <div className="gift-success-message">
              🎉 Successfully gifted ₹{giftAmount} to {video.creatorId}!
            </div>
          )}

          {showGiftInput && (
            <div className="gift-input-section">
              <div className="gift-options">
                <button 
                  className={`gift-option ${giftAmount === 10 ? 'active' : ''}`}
                  onClick={() => setGiftAmount(10)}
                >
                  ₹10
                </button>
                <button 
                  className={`gift-option ${giftAmount === 50 ? 'active' : ''}`}
                  onClick={() => setGiftAmount(50)}
                >
                  ₹50
                </button>
                <button 
                  className={`gift-option ${giftAmount === 100 ? 'active' : ''}`}
                  onClick={() => setGiftAmount(100)}
                >
                  ₹100
                </button>
              </div>
              <div className="custom-gift">
                <input
                  type="number"
                  min="1"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                  className="gift-input"
                />
                <button 
                  onClick={handleGift}
                  disabled={giftAmount <= 0}
                  className="send-gift-btn"
                >
                  Send ₹{giftAmount}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>Comments</h3>

          {/* Add Comment */}
          {currentUser && (
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
                rows={3}
              />
              <button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="submit-comment-btn"
              >
                Post Comment
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-username">{comment.username}</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPopup;
