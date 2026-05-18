import { memo } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { formatNumber } from '../lib/formatters';

function AnimatedNumber({ value, suffix = '', decimals = 0, className = '' }) {
  const animated = useCountUp(value);

  return (
    <span className={className}>
      {formatNumber(animated, decimals)}
      {suffix}
    </span>
  );
}

export default memo(AnimatedNumber);
