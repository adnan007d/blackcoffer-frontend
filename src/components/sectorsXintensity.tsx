import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, Select } from "antd";
import {
  API_URL,
  fetchPestle,
  fetchSectors,
  toSearchParams,
} from "../utils/util";
import PieChart from "../charts/PieChart";

type Data = {
  sector: string;
  intensity: number;
};

type DataQuery = {
  pestles?: string[];
  sectors?: string[];
};

async function fetchData(dataQuery: DataQuery): Promise<Data[]> {
  return fetch(
    API_URL +
      "/api/v1/sectors/intensity?" +
      toSearchParams(dataQuery).toString()
  ).then((res) => res.json());
}

const SectorsxIntensity = () => {
  const [dataQuery, setDataQuery] = useState<DataQuery>({});
  const query = useQuery({
    queryKey: ["sectorXintensity", dataQuery],
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
      setDataQuery({ ...dataQuery, sectors: value });
    } else {
      setDataQuery({ ...dataQuery, sectors: undefined });
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

  const labels = data.map((d) => d.sector);
  const colours = data.map(
    () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Intensity",
        data: data.map((d) => d.intensity),
        backgroundColor: colours,
        borderColor: colours,
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
          options={queryPestle.data?.map((sector: string) => ({
            label: sector,
            value: sector,
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
        <PieChart
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

export default SectorsxIntensity;
