import React from 'react';
import Modal from './modal.jsx';
import Button from './button.jsx';

// components/RulesModal.jsx
const RulesModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Am I the liar?" showClose={false}>
      <div className="space-y-3 text-gray-700">
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li>Everyone gets the <strong>same secret word</strong> except for one person (the "liar"), who gets a different word.</li>
          <li>Example: Everyone gets "cat," but the liar gets "dog."</li>
          <li>Players take turns giving <strong>clues</strong> about their word without saying it directly.</li>
          <li>Listen carefully to spot suspicious clues that don't match!</li>
          <li>After clues, everyone <strong>votes</strong> on who they think the liar is.</li>
          <li>If the liar isn't caught, they win! If caught, they get a <strong>final guess</strong> at the majority word to steal <strong>the win</strong>.</li>
        </ul>
        <Button onClick={onClose} variant="success" className="w-full mt-4">
          Get Started!
        </Button>
      </div>
    </Modal>
  );
};
export default RulesModal;