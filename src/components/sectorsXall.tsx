import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, Select } from "antd";
import {
  API_URL,
  fetchSectors,
  fetchTopics,
  toSearchParams,
} from "../utils/util";
import BarPlot from "../charts/BarPlot";

type Data = {
  sector: string;
  avgIntensity: number;
  avgRelevance: number;
  avgLikelihood: number;
};

type DataQuery = {
  topics?: string[];
  sectors?: string[];
};

async function fetchData(dataQuery: DataQuery): Promise<Data[]> {
  return fetch(
    API_URL +
      "/api/v1/sectors/all?" +
      toSearchParams(dataQuery).toString()
  ).then((res) => res.json());
}

const SectorsXall = () => {
  const [dataQuery, setDataQuery] = useState<DataQuery>({});
  const query = useQuery({
    queryKey: ["sectorsXall", dataQuery],
    queryFn: () => fetchData(dataQuery),
  });

  const queryTopics = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });

  const querySectors = useQuery({
    queryKey: ["sectors"],
    queryFn: fetchSectors,
  });

  const handleTopicsChange = (value: string[]) => {
    if (value.length !== 0) {
      setDataQuery({ ...dataQuery, topics: value });
    } else {
      setDataQuery({ ...dataQuery, topics: undefined });
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

  const labels = data.map((_, i) => data[i].sector);
  const avgIntensity = data.map((_, i) => data[i].avgIntensity);
  const avgRelevance = data.map((_, i) => data[i].avgRelevance);
  const avgLikelihood = data.map((_, i) => data[i].avgLikelihood);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Intensity",
        data: avgIntensity,
        backgroundColor: "rgba(255, 99, 132, 0.8)",
      },
      {
        label: "Relevance",
        data: avgRelevance,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
      {
        label: "Likelihood",
        data: avgLikelihood,
        backgroundColor: "rgba(255, 206, 86, 0.8)",
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
          placeholder="Please select Topics"
          onChange={handleTopicsChange}
          loading={queryTopics.isFetching}
          options={queryTopics.data?.map((topic: string) => ({
            label: topic,
            value: topic,
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
        <BarPlot
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

export default SectorsXall;
