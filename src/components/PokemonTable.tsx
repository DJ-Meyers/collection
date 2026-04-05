import { useNavigate } from "@tanstack/react-router";
import type { Pokemon } from "../../shared/types";

interface PokemonTableProps {
  pokemon: Pokemon[];
  isLoading: boolean;
}

export function PokemonTable({ pokemon, isLoading }: PokemonTableProps) {
  const navigate = useNavigate();
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
          No Pokemon in your collection yet
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dex #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Species
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Form
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nickname
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gender
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Level
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nature
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ability
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ball
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Shiny
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              OT
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Game of Origin
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Location
            </th>
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
