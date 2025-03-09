import { Chart } from "@/components/ui/charts";

const ChartCircle = () => {
  const salesData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 6000 },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sales Report</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Chart
          data={salesData}
          type="bar"
          colors={["#82ca9d"]}
        />
        <Chart
          type="area"
          data={[
            { name: "Jan", value: 4000 },
            { name: "Feb", value: 3000 },
            { name: "Mar", value: 6000 }
          ]}
          colors={["#82ca9d"]}
        /></div>
    </div>
  );
};

export default ChartCircle;