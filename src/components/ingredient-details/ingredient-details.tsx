import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredientData = useSelector((state) =>
    state.ingredients.items.find((item) => item._id === id)
  );
  const { loading, error } = useSelector((state) => state.ingredients);

  if (!ingredientData) {
    return loading ? (
      <Preloader />
    ) : (
      <p className="text text_type_main-default">{error ?? 'Ингредиент не найден'}</p>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
