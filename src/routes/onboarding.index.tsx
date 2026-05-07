import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/")({
  component: () => <Navigate to="/onboarding/$step" params={{ step: "1" }} replace />,
});
