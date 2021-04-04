import { Doughnut, Pie, Bar, Line } from "react-chartjs-2";
interface DoughnutChartProps {
  headers: Array<String>;
  data: Array<Number>;
  color?: Array<String>;
}
interface BarChartProps {
  label?: String;
  headers: Array<String>;
  data: Array<Object>;
  color?: Array<String>;
}

interface LineChartProps {
  headers: Array<String>;
  data: Array<Number>;
  color?: Array<String>;
}

const colors: Array<string> = [];

function random(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

for (var i = 0; i < 15; i++) {
  colors.push(
    "rgba(" + random(255) + ", " + random(255) + ", " + random(255) + ", "+ Math.random() +")"
  );
}

export const PieChart: React.FC<LineChartProps> = ({
  headers,
  data,
  color,
}) => {
  var graphData;
  if (color === undefined) {
    graphData = {
      labels: headers,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
          minBarLength: 2,
        },
      ],
    };
  } else {
    graphData = {
      labels: headers,
      datasets: [
        {
          data: data,
          backgroundColor: color,
          borderWidth: 0,
          minBarLength: 2,
        },
      ],
    };
  }
  return <Pie data={graphData} height={450} />;
};

export const LineChart: React.FC<LineChartProps> = ({
  headers,
  data,
  color,
}) => {
  var graphData;
  if (color === undefined) {
    graphData = {
      labels: headers,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
          minBarLength: 2,
        },
      ],
    };
  } else {
    graphData = {
      labels: headers,
      datasets: [
        {
          data: data,
          backgroundColor: color,
          borderWidth: 0,
          minBarLength: 2,
        },
      ],
    };
  }
  return <Line data={graphData} height={450} />;
};

export const BarChart: React.FC<BarChartProps> = ({
  headers,
  data,
  color,
  label,
}) => {
  var graphData;
  if (color === undefined) {
    graphData = {
      label: null,
      labels: headers,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
          minBarLength: 2,
        },
      ],
    };
  } else {
    graphData = {
      label: label,
      labels: headers,
      datasets: [
        {
          data: data,
          backgroundColor: color,
          borderWidth: 0,
          minBarLength: 2,
        },
      ],
    };
  }

  var legend = {
    labels: {
      enable: false,
      labels: headers,
    },
  };
  return <Bar data={graphData} height={450} />;
};

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  headers,
  data,
  color,
}) => {
  var graphData;
  if (color === undefined) {
    graphData = {
      labels: headers,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    };
  } else {
    graphData = {
      labels: headers,
      datasets: [
        {
          data: data,
          backgroundColor: color,
          borderWidth: 0,
        },
      ],
    };
  }
  return <Doughnut data={graphData} height={450} />;
};
