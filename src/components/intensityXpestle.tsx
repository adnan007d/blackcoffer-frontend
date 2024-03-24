import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, Select } from "antd";
import {
  API_URL,
  fetchPestle,
  fetchSectors,
  toSearchParams,
} from "../utils/util";
import RadarPlot from "../charts/RadarPlot";

type Data = {
  pestle: string;
  intensity: number;
};

type DataQuery = {
  pestles?: string[];
  sectors?: string[];
};

async function fetchData(dataQuery: DataQuery): Promise<Data[]> {
  return fetch(
    API_URL + "/api/v1/intensity/pestle?" + toSearchParams(dataQuery).toString()
  ).then((res) => res.json());
}
const IntensityxPestle = () => {
  const [dataQuery, setDataQuery] = useState<DataQuery>({});
  const query = useQuery({
    queryKey: ["intensityXpestle", dataQuery],
    queryFn: () => fetchData(dataQuery),
  });

  const queryPestle = useQuery({
    queryKey: ["pestles"],
    queryFn: fetchPestle,
  });

  const querySectors = useQuery({
    queryKey: ["sectors"],
    queryFn: fetchSectors,
  });

  const handlePestleChange = (value: string[]) => {
    if (value.length !== 0) {
      setDataQuery({ ...dataQuery, pestles: value });
    } else {
      setDataQuery({ ...dataQuery, pestles: undefined });
    }
  };

  const handleSectorsChange = (value: string[]) => {
    if (value.length !== 0) {
      setDataQuery({ ...dataQuery, sectors: value });
    } else {
      setDataQuery({ ...dataQuery, sectors: undefined });
    }
  };

  const data = query.data ?? [];

  const labels = data.map((d) => d.pestle);
  const values = data.map((d) => d.intensity);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Intensity",
        data: values,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid lg:grid-cols-4 place-items-center w-full">
      <Card
        className="w-full lg:col-start-4 h-full"
        classNames={{ body: "w-full gap-20 space-y-5" }}
        title="Filters"
      >
        <Select
          mode="multiple"
          allowClear={true}
          style={{ width: "100%" }}
          placeholder="Please select Pestle"
          onChange={handlePestleChange}
          loading={queryPestle.isFetching}
          options={queryPestle.data?.map((pestle: string) => ({
            label: pestle,
            value: pestle,
          }))}
          virtual={true}
        />

        <Select
          mode="multiple"
          allowClear={true}
          style={{ width: "100%" }}
          placeholder="Please select Sectors"
          onChange={handleSectorsChange}
          loading={querySectors.isFetching}
          options={querySectors.data?.map((sector: string) => ({
            label: sector,
            value: sector,
          }))}
          virtual={true}
        />
      </Card>
      <div className="w-full lg:col-span-3 lg:col-start-1 lg:row-start-1 aspect-video">
        <RadarPlot
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};

export default IntensityxPestle;
