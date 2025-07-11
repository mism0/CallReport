import React from 'react';
import Svg, { Path } from 'react-native-svg';

type PieChartDataItem = {
  value: number;
  color: string;
};

interface PieChartProps {
  data: PieChartDataItem[];
  radius?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, radius = 100 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let startAngle = 0;

  const paths = data.map((item, index) => {
    const angle = (item.value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;

    // Convert polar to Cartesian
    const x1 = radius + radius * Math.sin(startAngle);
    const y1 = radius - radius * Math.cos(startAngle);
    const x2 = radius + radius * Math.sin(endAngle);
    const y2 = radius - radius * Math.cos(endAngle);

    const largeArc = angle > Math.PI ? 1 : 0;

    const path = `
      M ${radius} ${radius}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;

    startAngle += angle;

    return (
      <Path
        key={index}
        d={path}
        fill={item.color}
        stroke="#fff"
        strokeWidth={1}
      />
    );
  });

  return (
    <Svg height={radius * 2} width={radius * 2}>
      {paths}
    </Svg>
  );
};


export default PieChart
