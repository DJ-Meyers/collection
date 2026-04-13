import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

const collectionSearchSchema = z.object({
  search: z.string().optional(),
  species: z.string().optional(),

  ball: z.string().optional(),
  originMark: z.string().optional(),
  currentLocation: z.string().optional(),
  isShiny: z.boolean().optional(),
  isEvent: z.boolean().optional(),
  isAlpha: z.boolean().optional(),
  isAvailableForTrade: z.boolean().optional(),
  isHiddenAbility: z.boolean().optional(),
  tag: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type CollectionSearch = z.infer<typeof collectionSearchSchema>;

export const Route = createFileRoute("/collection")({
  component: CollectionLayout,
  validateSearch: collectionSearchSchema,
});

function CollectionLayout() {
  return <Outlet />;
}
