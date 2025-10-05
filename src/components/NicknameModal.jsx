// components/NicknameModal.jsx
// Purpose: Collect the player's display name and (for joiners) a room code.
// Key notes:
//  - This component sanitizes the room code to uppercase alphanumeric and
//    enforces a 6-character length. Keep UI validation here for fast feedback,
//    but enforce server-side in a real app.
import React, { useState, useEffect } from 'react';
import Modal from './modal.jsx';
import Input from './input.jsx';
import Button from './button.jsx';

const NicknameModal = ({ isOpen, onClose, isHost, onSubmit }) => {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }
    if (!isHost) {
      if (!roomCode.trim()) {
        setError('Please enter the 6-character room code');
        return;
      }
      if (roomCode.trim().length !== 6) {
        setError('Room code must be 6 characters');
        return;
      }
    }
    
    onSubmit({ nickname, roomCode: roomCode.toUpperCase() });
    setNickname('');
    setRoomCode('');
  };

  useEffect(() => {
    if (isOpen) {
      setError('');
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enter Your Nickname">
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Your nickname"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              if (error) setError('');
            }}
            aria-invalid={!!error}
          />
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
        {!isHost && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Enter room code</label>
            <Input
              placeholder="6 characters"
              value={roomCode}
              onChange={(e) => {
                // allow only alphanumeric and limit to 6
                const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0,6);
                setRoomCode(sanitized);
                if (error) setError('');
              }}
              maxLength={6}
              aria-describedby="roomcode-help"
              className="tracking-widest text-left"
            />
            <div className="text-xs text-gray-600">{roomCode.length}/6</div>
          </div>
        )}
        <Button
          onClick={handleSubmit}
          variant="success"
          className="w-full"
          disabled={!nickname.trim() || (!isHost && roomCode.trim().length !== 6)}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};
export default NicknameModal;