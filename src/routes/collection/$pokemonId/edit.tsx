import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { usePokemon } from '../../../api/queries';
import { PokemonForm } from '../../../components/PokemonForm';
import { LoadingSpinner, NotFound, PageHeader } from '../../../components/layout';
import { Button } from '../../../components/ui/Button';

export const Route = createFileRoute('/collection/$pokemonId/edit')({
  component: PokemonEditPage,
});

function PokemonEditPage() {
  const { pokemonId } = Route.useParams();
  const navigate = useNavigate();
  const id = Number(pokemonId);
  const isInvalidId = Number.isNaN(id);
  const { data: pokemon, isLoading, isError } = usePokemon(id, { enabled: !isInvalidId });

  function handleCancel() {
    navigate({ to: '/collection/$pokemonId', params: { pokemonId } });
  }

  function handleSuccess() {
    navigate({ to: '/collection/$pokemonId', params: { pokemonId } });
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isInvalidId || isError || !pokemon) {
    return <NotFound />;
  }

  return (
    <div>
      <PageHeader>
        <div className="flex items-center justify-between min-h-[38px]">
          <h1 className="text-lg font-bold text-gray-900">
            Edit {pokemon.nickname ?? pokemon.species}
          </h1>
          <div className="flex items-center gap-2">
            <Button type="button" rank="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" form="edit-pokemon-form">
              Save
            </Button>
          </div>
        </div>
      </PageHeader>
      <PokemonForm
        formId="edit-pokemon-form"
        pokemon={pokemon}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
