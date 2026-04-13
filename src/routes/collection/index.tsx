import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePokemonList } from "../../api/queries";
import { PokemonTable } from "../../components/PokemonTable";
import { FilterBar } from "../../components/FilterBar";
import { PokemonForm } from "../../components/PokemonForm";
import { PageHeader } from "../../components/layout";
import { Button } from "../../components/ui/Button";
import type { PokemonFilters } from "../../data/types";
import type { CollectionSearch } from "./route";

export const Route = createFileRoute("/collection/")({
  component: CollectionPage,
});

function toApiFilters(search: CollectionSearch): Partial<PokemonFilters> {
  const filters: Partial<PokemonFilters> = {};
  if (search.search) filters.search = search.search;
  if (search.species) filters.species = search.species;

  if (search.ball) filters.ball = search.ball;
  if (search.originMark) filters.origin_mark = search.originMark;
  if (search.currentLocation)
    filters.current_location = search.currentLocation;
  if (search.isShiny !== undefined) filters.is_shiny = search.isShiny;
  if (search.isEvent !== undefined) filters.is_event = search.isEvent;
  if (search.isAlpha !== undefined) filters.is_alpha = search.isAlpha;
  if (search.isAvailableForTrade !== undefined)
    filters.is_available_for_trade = search.isAvailableForTrade;
  if (search.isHiddenAbility !== undefined)
    filters.is_hidden_ability = search.isHiddenAbility;
  if (search.tag) filters.tag = search.tag;
  filters.sort_by = search.sortBy ?? "dex_number";
  filters.sort_order = search.sortOrder ?? "asc";
  return filters;
}

function hasActiveFilters(search: CollectionSearch): boolean {
  return !!(
    search.search ||
    search.species ||
    search.ball ||
    search.originMark ||
    search.currentLocation ||
    search.isShiny !== undefined ||
    search.isEvent !== undefined ||
    search.isAlpha !== undefined ||
    search.isAvailableForTrade !== undefined ||
    search.isHiddenAbility !== undefined ||
    search.tag
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
      search: {},
    });
  };

  return (
    <div>
      <PageHeader>
        {showAddForm ? (
          <div className="flex items-center justify-between min-h-[38px]">
            <h1 className="text-lg font-bold text-gray-900">Add New Pokemon</h1>
            <div className="flex items-center gap-2">
              <Button type="button" rank="secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" form="add-pokemon-form">
                Add
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end min-h-[38px]">
            <Button type="button" onClick={() => setShowAddForm(true)}>
              + Add Pokemon
            </Button>
          </div>
        )}
        <FilterBar />
      </PageHeader>

      {showAddForm && (
        <div className="mb-6">
          <PokemonForm
            formId="add-pokemon-form"
            onSuccess={() => setShowAddForm(false)}
          />
        </div>
      )}

      <PokemonTable
        pokemon={pokemon}
        isLoading={isLoading}
        sortBy={search.sortBy ?? "dex_number"}
        sortOrder={search.sortOrder ?? "asc"}
        hasFilters={filtersActive}
        onClearFilters={clearAllFilters}
      />
    </div>
  );
}
