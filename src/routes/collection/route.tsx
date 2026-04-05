import { createFileRoute } from "@tanstack/react-router";
import { usePokemonList } from "../../api/queries";
import { PokemonTable } from "../../components/PokemonTable";

export const Route = createFileRoute("/collection")({
  component: CollectionPage,
});

function CollectionPage() {
  const { data: pokemon = [], isLoading } = usePokemonList();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Collection</h1>
      <PokemonTable pokemon={pokemon} isLoading={isLoading} />
    </div>
  );
}
