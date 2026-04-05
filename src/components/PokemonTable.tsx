import { useNavigate } from "@tanstack/react-router";
import type { Pokemon } from "../../shared/types";

interface PokemonTableProps {
  pokemon: Pokemon[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

const COLUMNS: Column[] = [
  { key: "dex_number", label: "Dex #", sortable: true },
  { key: "species", label: "Species", sortable: true },
  { key: "form", label: "Form", sortable: false },
  { key: "nickname", label: "Nickname", sortable: true },
  { key: "gender", label: "Gender", sortable: false },
  { key: "level", label: "Level", sortable: true },
  { key: "nature", label: "Nature", sortable: true },
  { key: "ability", label: "Ability", sortable: true },
  { key: "poke_ball", label: "Ball", sortable: true },
  { key: "is_shiny", label: "Shiny", sortable: false },
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
}: PokemonTableProps) {
  const navigate = useNavigate({ from: "/collection" });

  const handleSort = (columnKey: string) => {
    if (columnKey === sortBy) {
      // Toggle direction
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
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">Loading collection...</p>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">
          No Pokemon found
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  col.sortable
                    ? "cursor-pointer select-none hover:text-gray-700"
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
        <tbody className="divide-y divide-gray-200">
          {pokemon.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() =>
                navigate({ to: `/collection/${p.id}` as string })
              }
            >
              <td className="px-4 py-3 text-sm text-gray-900">
                {p.dex_number}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                {p.species}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.form ?? "-"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.nickname ?? "-"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.gender ?? "-"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.level ?? "-"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.nature ?? "-"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.ability ?? "-"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.poke_ball ?? "-"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.is_shiny ? "Yes" : "No"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.ot_name ?? "-"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.game_of_origin ?? "-"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.current_location ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
