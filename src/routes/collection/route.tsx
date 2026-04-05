import { createFileRoute, Outlet, useMatch } from "@tanstack/react-router";
import { z } from "zod";
import { usePokemonList } from "../../api/queries";
import { PokemonTable } from "../../components/PokemonTable";
import { FilterBar } from "../../components/FilterBar";
import type { PokemonFilters } from "../../../shared/types";

const collectionSearchSchema = z.object({
  search: z.string().optional(),
  species: z.string().optional(),
  generation: z.coerce.number().optional(),
  ball: z.string().optional(),
  gameOfOrigin: z.string().optional(),
  currentLocation: z.string().optional(),
  languageTag: z.string().optional(),
  nature: z.string().optional(),
  isShiny: z.boolean().optional(),
  isEvent: z.boolean().optional(),
  isAlpha: z.boolean().optional(),
  isHiddenAbility: z.boolean().optional(),
  sortBy: z.string().default("dex_number"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  groupBy: z.string().optional(),
});

export type CollectionSearch = z.infer<typeof collectionSearchSchema>;

export const Route = createFileRoute("/collection")({
  component: CollectionLayout,
  validateSearch: collectionSearchSchema,
});

function CollectionLayout() {
  const childMatch = useMatch({
    from: '/collection/$pokemonId',
    shouldThrow: false,
  });

  if (childMatch) {
    return <Outlet />;
  }

  return <CollectionPage />;
}

function toApiFilters(search: CollectionSearch): Partial<PokemonFilters> {
  const filters: Partial<PokemonFilters> = {};
  if (search.search) filters.search = search.search;
  if (search.species) filters.species = search.species;
  if (search.generation !== undefined)
    filters.generation = String(search.generation);
  if (search.ball) filters.ball = search.ball;
  if (search.gameOfOrigin) filters.game_of_origin = search.gameOfOrigin;
  if (search.currentLocation)
    filters.current_location = search.currentLocation;
  if (search.languageTag) filters.language_tag = search.languageTag;
  if (search.nature) filters.nature = search.nature;
  if (search.isShiny !== undefined) filters.is_shiny = search.isShiny;
  if (search.isEvent !== undefined) filters.is_event = search.isEvent;
  if (search.isAlpha !== undefined) filters.is_alpha = search.isAlpha;
  if (search.isHiddenAbility !== undefined)
    filters.is_hidden_ability = search.isHiddenAbility;
  filters.sort_by = search.sortBy;
  filters.sort_order = search.sortOrder;
  if (search.groupBy) filters.group_by = search.groupBy;
  return filters;
}

function CollectionPage() {
  const search = Route.useSearch();
  const apiFilters = toApiFilters(search);
  const { data: pokemon = [], isLoading } = usePokemonList(apiFilters);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Collection</h1>
      <FilterBar />
      <PokemonTable
        pokemon={pokemon}
        isLoading={isLoading}
        sortBy={search.sortBy}
        sortOrder={search.sortOrder}
      />
    </div>
  );
}
