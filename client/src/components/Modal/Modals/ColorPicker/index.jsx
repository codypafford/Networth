import { useState } from 'react';
import ColorWheel from '@uiw/react-color-wheel';
import PropTypes from 'prop-types';
import './style.scss';

export default function ColorPicker({ initialColor = '#FF0000', onColorChange }) {
  const [color, setColor] = useState(initialColor);

  const handleChange = (newColor) => {
    setColor(newColor.hex);
    if (onColorChange) {
      onColorChange(newColor.hex);
    }
  };

  return (
    <div className="color-picker">
      <ColorWheel
        color={color}
        onChange={handleChange}
        style={{ width: 250, height: 250 }}
      />

      <div className="color-picker__display">
        <span className="color-picker__label">Selected Color:</span>
        <span
          className="color-picker__swatch"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

ColorPicker.propTypes = {
  initialColor: PropTypes.string.isRequired,
  onColorChange: PropTypes.func.isRequired
}
