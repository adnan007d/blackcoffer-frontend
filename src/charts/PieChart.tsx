import { ComponentProps } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart(props: ComponentProps<typeof Pie>) {
  return <Pie {...props} />;
}

export default PieChart;
