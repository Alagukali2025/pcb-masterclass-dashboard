import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * EngineeringInput - A refined input component for technical values.
 * Uses a focus-aware local buffer to prevent "Sticky 0" and formatting loops
 * during active typing, while ensuring real-time parent updates.
 */
const EngineeringInput = ({ 
  label, 
  id, 
  unit, 
  value, 
  onChange, 
  step = "0.001", 
  min, 
  max,
  className = "",
  style = {}
}) => {
  // Local string state allows users to clear the input or type partial values (e.g. "1.")
  const [localValue, setLocalValue] = useState(value?.toString() || "");
  const [isFocused, setIsFocused] = useState(false);
  
  // Sync local state with incoming prop value (e.g. when a preset is selected)
  // CRITICAL: We DO NOT sync from props if the user is currently typing (focused).
  // This prevents the parent's "formatted" value from overwriting the user's raw string.
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value?.toString() || "");
    }
  }, [value, isFocused]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    
    // Pass the numeric value back to parent for real-time math, 
    // but the parent's formatting will be ignored by this component until blur.
    if (onChange) {
      onChange(e); 
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setLocalValue("");
    if (onChange) {
      onChange({ target: { value: "", id } });
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`zdiff-input-group ${className}`} style={style}>
      {label && (
        <label htmlFor={id} className="engineering-label">
          {label} {unit && `(${unit})`}
        </label>
      )}
      <div className="input-engineering-wrapper">
        <input
          id={id}
          type="text" // Changed to text for better manual entry control in React
          inputMode="decimal" // Ensures numeric keypad on mobile
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="input-engineering"
          autoComplete="off"
          placeholder="0.000"
        />
        {localValue && (
          <button 
            type="button" 
            className="input-engineering-clear" 
            onMouseDown={(e) => e.preventDefault()} // Prevents loss of focus
            onClick={handleClear}
            title="Clear Input"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default EngineeringInput;
