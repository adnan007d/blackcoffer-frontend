import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, Select } from "antd";
import LinePlot from "../charts/LinePlot";
import {
  API_URL,
  fetchCountries,
  fetchRegions,
  fetchSectors,
  fetchSources,
  fetchTopics,
  toSearchParams,
} from "../utils/util";

type Data = {
  topic: string;
  likelihood: number;
};

type DataQuery = {
  sectors?: string[];
  regions?: string[];
  sources?: string[];
  countries?: string[];
  cities?: string[];
  topics?: string[];
};

async function fetchData(dataQuery: DataQuery): Promise<Data[]> {
  return fetch(
    API_URL +
      "/api/v1/likelihood/topics?" +
      toSearchParams(dataQuery).toString()
  ).then((res) => res.json());
}

const LikelihoodxTopics = () => {
  const [dataQuery, setDataQuery] = useState<DataQuery>({});
  const query = useQuery({
    queryKey: ["likelihoodXtopics", dataQuery],
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

  const queryRegions = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const querySources = useQuery({
    queryKey: ["sources"],
    queryFn: fetchSources,
  });

  const queryCountries = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const handleChange = (key: string) => (value: string[]) => {
    if (value.length !== 0) {
      setDataQuery({ ...dataQuery, [key]: value });
    } else {
      setDataQuery({ ...dataQuery, [key]: undefined });
    }
  };

  // const handleTopicsChange = (value: string[]) => {
  //   if (value.length !== 0) {
  //     setDataQuery({ ...dataQuery, topics: value });
  //   } else {
  //     setDataQuery({ ...dataQuery, topics: undefined });
  //   }
  // };
  //
  // const handleSectorsChange = (value: string[]) => {
  //   if (value.length !== 0) {
  //     setDataQuery({ ...dataQuery, sectors: value });
  //   } else {
  //     setDataQuery({ ...dataQuery, sectors: undefined });
  //   }
  // };

  const data = query.data ?? [];

  const labels = data.map((d) => d.topic);
  const values = data.map((d) => d.likelihood);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Likelihood",
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
          placeholder="Please select Topics"
          onChange={handleChange("topics")}
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
          onChange={handleChange("sectors")}
          loading={querySectors.isFetching}
          options={querySectors.data?.map((sector: string) => ({
            label: sector,
            value: sector,
          }))}
          virtual={true}
        />

        <Select
          mode="multiple"
          allowClear={true}
          style={{ width: "100%" }}
          placeholder="Please select Regions"
          onChange={handleChange("regions")}
          loading={queryRegions.isFetching}
          options={queryRegions.data?.map((region: string) => ({
            label: region,
            value: region,
          }))}
          virtual={true}
        />

        <Select
          mode="multiple"
          allowClear={true}
          style={{ width: "100%" }}
          placeholder="Please select Sources"
          onChange={handleChange("sources")}
          loading={querySources.isFetching}
          options={querySources.data?.map((source: string) => ({
            label: source,
            value: source,
          }))}
          virtual={true}
        />

        <Select
          mode="multiple"
          allowClear={true}
          style={{ width: "100%" }}
          placeholder="Please select Countries"
          onChange={handleChange("countries")}
          loading={queryCountries.isFetching}
          options={queryCountries.data?.map((country: string) => ({
            label: country,
            value: country,
          }))}
          virtual={true}
        />

      </Card>
      <div className="w-full lg:col-span-3 lg:col-start-1 lg:row-start-1 aspect-video">
        <LinePlot
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

export default LikelihoodxTopics;
