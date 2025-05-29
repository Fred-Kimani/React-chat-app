import React, { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const AutoGrowingTextarea: React.FC<Props> = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange} // exactly like <input />
      placeholder={placeholder}
      rows={1}
      style={{
        overflow: 'hidden',
        resize: 'none',
        width: '100%',
        fontSize: '16px',
        padding: '8px',
        lineHeight: '1.5',
        borderRadius: '8px',
        border: '1px solid #ccc',
      }}
    />
  );
};

export default AutoGrowingTextarea;
