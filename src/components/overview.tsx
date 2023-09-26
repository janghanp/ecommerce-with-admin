"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

interface Props {
  graphRevenue: { name: string; total: number }[];
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Overview = ({ graphRevenue }: Props) => {
  const labels: string[] = [];
  const values: number[] = [];

  graphRevenue.forEach((revenue) => {
    labels.push(revenue.name);
    values.push(revenue.total);
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: values,
        backgroundColor: "#BEF853",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ position: "relative", height: "400px", width: "100%" }}>
      <Bar data={data} options={options}></Bar>
    </div>
  );
};

export default Overview;
