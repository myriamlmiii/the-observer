import type { Metadata } from "next";
import ObservationField from "@/components/ObservationField";

export const metadata: Metadata = {
  title: "Observe · The Observer",
  description: "Interactive observation field: regimes, dynamics, and observer readouts.",
};

export default function ObservePage() {
  return <ObservationField />;
}
