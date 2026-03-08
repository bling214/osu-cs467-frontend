import React from 'react';

export default function RangeFilter({ title, minVal, maxVal, setMin, setMax }) {
  
  const handleMinChange = (e) => {
    // Allow empty string if the user clears the box
    if (e.target.value === '') {
      setMin('');
      return;
    }

    let newMin = parseFloat(e.target.value);
    
    // Hard clamp to prevent typing numbers outside 0-5
    if (newMin < 0) newMin = 0;
    if (newMin > 5) newMin = 5;

    setMin(newMin);

    // Validation: If the new Min is greater than the current Max, push Max up
    if (maxVal !== '' && newMin > maxVal) {
      setMax(newMin);
    }
  };

  const handleMaxChange = (e) => {
    if (e.target.value === '') {
      setMax('');
      return;
    }

    let newMax = parseFloat(e.target.value);
    
    if (newMax < 0) newMax = 0;
    if (newMax > 5) newMax = 5;

    setMax(newMax);

    // Validation: If the new Max is less than the current Min, pull Min down
    if (minVal !== '' && newMax < minVal) {
      setMin(newMax);
    }
  };

  return (
    <div className="flex flex-col gap-1 mb-4">
      <h3 className="text-lg font-semibold text-foreground">
        {title} (0 - 5)
      </h3>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="5"
          step="0.1" // Allows decimals since averages like 3.67 exist
          value={minVal}
          onChange={handleMinChange}
          placeholder="Min"
          className="w-24 px-3 py-1.5 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <span className="text-muted-fg font-medium">to</span>
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={maxVal}
          onChange={handleMaxChange}
          placeholder="Max"
          className="w-24 px-3 py-1.5 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
    </div>
  );
}

