import { useState } from 'react';
import { Star } from 'lucide-react';

// interactive=true -> clickable input (for submitting a rating)
// interactive=false -> read-only display (for showing overall rating)
export default function StarRating({ value = 0, onChange, interactive = false, size = 20 }) {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = interactive ? star <= (hover || value) : star <= Math.round(value);
        return (
          <Star
            key={star}
            size={size}
            className={`${filled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} ${
              interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''
            }`}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => interactive && onChange && onChange(star)}
          />
        );
      })}
    </div>
  );
}
