import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/hell")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome hell!</h3>
      <Outlet />
    </div>
  );
}
