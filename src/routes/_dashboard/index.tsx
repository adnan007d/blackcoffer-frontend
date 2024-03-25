import { Outlet, createFileRoute } from "@tanstack/react-router";
import IntensityxTopics from "../../components/intensityxtopics";
import IntensityxPestle from "../../components/intensityXpestle";
import SectorsXall from "../../components/sectorsXall";
import SectorsxIntensity from "../../components/sectorsXintensity";
import { Card } from "antd";
import LikelihoodxTopics from "../../components/likelihoodXtopics";

export const Route = createFileRoute("/_dashboard/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2 space-y-20 lg:w-10/12 mx-auto">
      <Card title="Likehood X Topics">
        <LikelihoodxTopics />
      </Card>

      <Card title="Intensity X Pestle">
        <IntensityxPestle />
      </Card>

      <Card title="Intensity|Likelihood|Relevance X Sectors">
        <SectorsXall />
      </Card>

      <Card title="Sectors X Intensity">
        <SectorsxIntensity />
      </Card>

      <Card title="Intensity X Topics">
        <IntensityxTopics />
      </Card>

      <Outlet />
    </div>
  );
}
