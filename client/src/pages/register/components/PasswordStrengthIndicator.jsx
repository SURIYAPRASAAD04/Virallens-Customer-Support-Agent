import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password, className = '' }) => {
  const calculateStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password?.length >= 8,
      lowercase: /[a-z]/?.test(password),
      uppercase: /[A-Z]/?.test(password),
      numbers: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };
    
    Object.values(checks)?.forEach(check => {
      if (check) score++;
    });
    
    const strengthLevels = {
      0: { label: '', color: '', bgColor: '' },
      1: { label: 'Very Weak', color: 'text-red-500', bgColor: 'bg-red-500' },
      2: { label: 'Weak', color: 'text-orange-500', bgColor: 'bg-orange-500' },
      3: { label: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
      4: { label: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-500' },
      5: { label: 'Strong', color: 'text-green-500', bgColor: 'bg-green-500' }
    };
    
    return { 
      score, 
      label: strengthLevels?.[score]?.label,
      color: strengthLevels?.[score]?.color,
      bgColor: strengthLevels?.[score]?.bgColor,
      checks
    };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Strength Bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5]?.map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              level <= strength?.score 
                ? strength?.bgColor 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      {/* Strength Label */}
      {strength?.label && (
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium ${strength?.color}`}>
            {strength?.label}
          </span>
        </div>
      )}
      {/* Requirements Checklist */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Icon 
            name={strength?.checks?.length ? "Check" : "X"} 
            size={12} 
            className={strength?.checks?.length ? "text-green-500" : "text-gray-400"} 
          />
          <span className={`text-xs ${strength?.checks?.length ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
            At least 8 characters
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon 
            name={strength?.checks?.lowercase && strength?.checks?.uppercase ? "Check" : "X"} 
            size={12} 
            className={strength?.checks?.lowercase && strength?.checks?.uppercase ? "text-green-500" : "text-gray-400"} 
          />
          <span className={`text-xs ${strength?.checks?.lowercase && strength?.checks?.uppercase ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
            Upper & lowercase letters
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon 
            name={strength?.checks?.numbers ? "Check" : "X"} 
            size={12} 
            className={strength?.checks?.numbers ? "text-green-500" : "text-gray-400"} 
          />
          <span className={`text-xs ${strength?.checks?.numbers ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
            At least one number
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon 
            name={strength?.checks?.special ? "Check" : "X"} 
            size={12} 
            className={strength?.checks?.special ? "text-green-500" : "text-gray-400"} 
          />
          <span className={`text-xs ${strength?.checks?.special ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
            Special character (!@#$%^&*)
          </span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;