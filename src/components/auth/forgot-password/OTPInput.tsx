import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false
}) => {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Update input references
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Focus the first input on mount
  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const target = e.target;
    let targetValue = target.value;

    // Keep only the last char if more than one is pasted/entered
    if (targetValue.length > 1) {
      targetValue = targetValue[targetValue.length - 1];
    }

    // Only allow numbers
    if (targetValue && !targetValue.match(/^[0-9]$/)) {
      return;
    }

    // Update the code
    const newValue = value.substring(0, index) + targetValue + value.substring(index + 1);
    onChange(newValue);

    // Move to next input if a value was entered
    if (targetValue && index < length - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (value[index]) {
        // Clear the current field
        const newValue = value.substring(0, index) + '' + value.substring(index + 1);
        onChange(newValue);
      } else if (index > 0) {
        // Move to previous field
        setActiveInput(index - 1);
        inputRefs.current[index - 1].focus();
      }
    }

    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle pasting the OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only allow digits
    const digits = pastedData.replace(/\D/g, '');
    
    // Only use the first 'length' digits
    const pastedOtp = digits.substring(0, length);
    
    if (pastedOtp) {
      onChange(pastedOtp.padEnd(length, ''));
      
      // Focus last field or the field after the pasted content
      const focusIndex = Math.min(pastedOtp.length, length - 1);
      if (inputRefs.current[focusIndex]) {
        setActiveInput(focusIndex);
        inputRefs.current[focusIndex].focus();
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(input) => {
            if (input) inputRefs.current[index] = input;
          }}
          disabled={disabled}
          className={cn(
            'w-12 h-12 text-center text-lg',
            activeInput === index ? 'border-indian-blue' : ''
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
