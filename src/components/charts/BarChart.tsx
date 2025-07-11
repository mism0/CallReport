import React from 'react';
import Svg, { Rect, Text } from 'react-native-svg';

type BarChartData = { label: string; value: number, color: string };
type BarChartProps = {
  data: BarChartData[];
  width?: number;
  height?: number;
  barColor?: string;
};

const BarChart: React.FC<BarChartProps> = ({ data, width = 300, height = 200, barColor = 'tomato' }) => {
   const maxY = Math.max(...data.map(d => d.value));
  const barWidth = width / data.length;

  return (
    <Svg width={width} height={height}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxY) * height;
        const x = index * barWidth;
        const y = height - barHeight;

        return (
          <React.Fragment key={index}>
            <Rect
              x={x + 5}
              y={y}
              width={barWidth - 10}
              height={barHeight}
              fill={item.color || barColor}
              rx={6}
            />
            <Text
              x={x + barWidth / 2}
              y={height - 5}
              fontSize="10"
              fill="black"
              textAnchor="middle"
            >
              {item.label}
            </Text>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

export default BarChart

// const styles = StyleSheet.create({})