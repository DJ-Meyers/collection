import { useNavigate } from "@tanstack/react-router";
import type { Pokemon } from "../../shared/types";
import { Badge } from "./ui/Badge";
import { Sprite } from "./ui/Sprite";

interface PokemonTableProps {
  pokemon: Pokemon[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

const COLUMNS: Column[] = [
  { key: "sprite", label: "", sortable: false },
  { key: "dex_number", label: "Dex #", sortable: true },
  { key: "species", label: "Species", sortable: true },
  { key: "form", label: "Form", sortable: false },
  { key: "nickname", label: "Nickname", sortable: true },
  { key: "gender", label: "Gender", sortable: false },
  { key: "level", label: "Level", sortable: true },
  { key: "nature", label: "Nature", sortable: true },
  { key: "ability", label: "Ability", sortable: true },
  { key: "poke_ball", label: "Ball", sortable: true },
  { key: "ot_name", label: "OT", sortable: true },
  { key: "game_of_origin", label: "Game of Origin", sortable: true },
  { key: "current_location", label: "Current Location", sortable: true },
];

function SortArrow({ direction }: { direction: "asc" | "desc" }) {
  return (
    <span className="ml-1 inline-block text-blue-600">
      {direction === "asc" ? "\u2191" : "\u2193"}
    </span>
  );
}

export function PokemonTable({
  pokemon,
  isLoading,
  sortBy,
  sortOrder,
  hasFilters,
  onClearFilters,
}: PokemonTableProps) {
  const navigate = useNavigate({ from: "/collection" });

  const handleSort = (columnKey: string) => {
    if (columnKey === sortBy) {
      navigate({
        search: (prev) => ({
          ...prev,
          sortOrder: sortOrder === "asc" ? "desc" : "asc",
        }),
      });
    } else {
      navigate({
        search: (prev) => ({
          ...prev,
          sortBy: columnKey,
          sortOrder: "asc",
        }),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mb-3" />
        <p className="text-gray-500 text-sm">Loading collection...</p>
      </div>
    );
  }

  if (pokemon.length === 0) {
    if (hasFilters) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500 text-lg mb-2">
            No Pokemon match your filters
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-400 text-4xl mb-3">&#x1F4E6;</p>
        <p className="text-gray-600 text-lg font-medium mb-1">
          No Pokemon in your collection yet
        </p>
        <p className="text-gray-400 text-sm">
          Add your first Pokemon to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`sticky top-0 z-10 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 ${
                  col.sortable
                    ? "cursor-pointer select-none hover:text-gray-700 hover:bg-gray-100"
                    : ""
                }`}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                {col.label}
                {col.sortable && sortBy === col.key && (
                  <SortArrow direction={sortOrder} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {pokemon.map((p) => (
            <tr
              key={p.id}
              className={`transition-colors cursor-pointer ${
                p.is_shiny
                  ? "bg-yellow-50/50 hover:bg-yellow-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() =>
                navigate({ to: `/collection/${p.id}` as string })
              }
            >
              <td className="px-3 py-1 w-10">
                <Sprite dexNumber={p.dex_number} shiny={p.is_shiny} size={32} />
              </td>
              <td className="px-3 py-1 text-sm text-gray-900">
                {p.dex_number}
              </td>
              <td className="px-3 py-1 text-sm text-gray-900 font-medium whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5">
                  {p.species}
                  {p.is_shiny && <span title="Shiny">&#x2728;</span>}
                  {p.is_event && <Badge variant="event">Event</Badge>}
                  {p.is_alpha && <Badge variant="alpha">A</Badge>}
                </span>
              </td>
              <td className="px-3 py-1 text-sm text-gray-600">
                {p.form ?? "-"}
              </td>
              <td className="px-3 py-1 text-sm text-gray-600">
                {p.nickname ?? "-"}
              </td>
              <td className="px-3 py-1 text-sm text-gray-600">
                {p.gender ?? "-"}
              </td>
              <td className="px-3 py-1 text-sm text-gray-600">
                {p.level ?? "-"}
              </td>
              <td className="px-3 py-1 text-sm text-gray-600">
                {p.nature ?? "-"}
              </td>
              <td className="px-3 py-1 text-sm text-gray-600 whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  {p.ability ?? "-"}
                  {p.is_hidden_ability && p.ability && (
                    <Badge variant="ha">HA</Badge>
                  )}
                </span>
              </td>
              <td className="px-3 py-1 text-sm text-gray-600">
                {p.poke_ball ?? "-"}
              </td>
              <td className="px-3 py-1 text-sm text-gray-600">
                {p.ot_name ?? "-"}
              </td>
              <td className="px-3 py-1 text-sm text-gray-600">
                {p.game_of_origin ?? "-"}
              </td>
              <td className="px-3 py-1 text-sm text-gray-600">
                {p.current_location ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
