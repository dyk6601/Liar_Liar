// src/components/Tips.jsx
import React, { useEffect, useState, useRef } from 'react';
import TIPS from '../data/tips';

// Tips component that shows a single helpful tip. When the `trigger` prop
// changes (for example, the user's assigned word changes) the component will
// pick a new random tip. Controls were intentionally removed for a simpler UX.
// Props:
//  - trigger: any value; when it changes a new random tip is selected
//  - className: extra classes for layout
const Tips = ({ trigger, className = '' }) => {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    if (!TIPS || TIPS.length === 0) return;
    const i = Math.floor(Math.random() * TIPS.length);
    setCurrent(TIPS[i]);
  }, [trigger]);

  return (
    <div className={`rounded-lg p-4 ${className}`}>
      <div className="text-sm mb-2 text-muted">Tips & tricks</div>
      <div className="text-base font-medium">{current}</div>
    </div>
  );
};

export default Tips;
