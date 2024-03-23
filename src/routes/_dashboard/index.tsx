import { Outlet, createFileRoute } from "@tanstack/react-router";
import IntensityxTopics from "../../components/intensityxtopics";
import IntensityxPestle from "../../components/intensityXpestle";

export const Route = createFileRoute("/_dashboard/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <IntensityxTopics />
      <IntensityxPestle />
      <Outlet />
    </div>
  );
}
