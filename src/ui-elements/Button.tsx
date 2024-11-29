import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  const baseClass = 'px-4 py-2 rounded-md text-white font-bold focus:outline-none';
  const variantClass =
    variant === 'primary' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600';

  return (
    <button className={`${baseClass} ${variantClass}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
