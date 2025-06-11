import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} style={{backgroundColor:'#28a745'}}>
      ← Back
    </button>
  );
};

export default BackButton;
