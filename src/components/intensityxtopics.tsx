import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card, Select } from "antd";
import BarPlot from "../charts/BarPlot";
import { API_URL, toSearchParams } from "../utils/util";

type Data = {
  topic: string;
  intensity: number;
};

type DataQuery = {
  topics?: string[];
  sectors?: string[];
};


async function fetchData(dataQuery: DataQuery): Promise<Data[]> {
  return fetch(
    API_URL + "/api/v1/intensity/topics?" +
      toSearchParams(dataQuery).toString()
  ).then((res) => res.json());
}

async function fetchTopics(): Promise<string[]> {
  return fetch(API_URL + "/api/v1/topics").then((res) => res.json());
}

async function fetchSectors(): Promise<string[]> {
  return fetch(API_URL + "/api/v1/sectors").then((res) =>
    res.json()
  );
}
const IntensityxTopics = () => {
  const [dataQuery, setDataQuery] = useState<DataQuery>({});
  const query = useQuery({
    queryKey: ["intensityXtopics", dataQuery],
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

  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    if (query.data) {
      setData(query.data);
    }
  }, [query.data]);

  const labels = data.map((d) => d.topic);
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
        className="w-full lg:col-start-4"
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
            scales: {
              y: {},
            },
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Topics x Intensity",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default IntensityxTopics;
