import { useState } from "react";
import { createFileRoute, Outlet, useMatch, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { usePokemonList } from "../../api/queries";
import { PokemonTable } from "../../components/PokemonTable";
import { FilterBar } from "../../components/FilterBar";
import { PokemonForm } from "../../components/PokemonForm";
import type { PokemonFilters } from "../../../shared/types";

const collectionSearchSchema = z.object({
  search: z.string().optional(),
  species: z.string().optional(),

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

function hasActiveFilters(search: CollectionSearch): boolean {
  return !!(
    search.search ||
    search.species ||
    search.ball ||
    search.gameOfOrigin ||
    search.currentLocation ||
    search.languageTag ||
    search.nature ||
    search.isShiny !== undefined ||
    search.isEvent !== undefined ||
    search.isAlpha !== undefined ||
    search.isHiddenAbility !== undefined
  );
}

function CollectionPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/collection" });
  const apiFilters = toApiFilters(search);
  const { data: pokemon = [], isLoading } = usePokemonList(apiFilters);
  const [showAddForm, setShowAddForm] = useState(false);

  const filtersActive = hasActiveFilters(search);

  const clearAllFilters = () => {
    navigate({
      search: { sortBy: "dex_number", sortOrder: "asc" },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Collection</h1>
        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
            showAddForm
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {showAddForm ? "Cancel" : "+ Add Pokemon"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Add New Pokemon
          </h2>
          <PokemonForm
            onSuccess={() => setShowAddForm(false)}
          />
        </div>
      )}

      <FilterBar />
      <PokemonTable
        pokemon={pokemon}
        isLoading={isLoading}
        sortBy={search.sortBy}
        sortOrder={search.sortOrder}
        hasFilters={filtersActive}
        onClearFilters={clearAllFilters}
      />
    </div>
  );
}
