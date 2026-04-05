import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import { pokemonKeys } from "./queryKeys";
import type { Pokemon, PokemonFilters } from "../../shared/types";

export function usePokemonList(filters: Partial<PokemonFilters> = {}) {
  const queryString = buildQueryString(filters);
  const path = queryString ? `/pokemon?${queryString}` : "/pokemon";

  return useQuery({
    queryKey: pokemonKeys.list(filters as Record<string, unknown>),
    queryFn: () => apiFetch<Pokemon[]>(path),
    staleTime: 60_000,
  });
}

export function usePokemon(id: number) {
  return useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: () => apiFetch<Pokemon>(`/pokemon/${id}`),
    staleTime: 60_000,
  });
}

export function usePokemonFilters() {
  return useQuery({
    queryKey: pokemonKeys.filters(),
    queryFn: () =>
      apiFetch<Record<string, string[]>>("/pokemon/filters"),
    staleTime: 60_000,
  });
}

function buildQueryString(filters: Partial<PokemonFilters>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  return params.toString();
}
