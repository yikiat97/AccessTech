from ...models.dish import dishes
from ...models.recipe import recipes
from ...models.ingredient import ingredients

def calculate_qty(dish_id):
    # Find the dish
    dish = dishes.query.get(dish_id)

    if dish is None:
        return None

    # Find the recipes that make up the dish
    dish_recipes = recipes.query.filter_by(dish_id=dish_id).all()

    qty_list = []
    for recipe in dish_recipes:
        # Get the ingredient for this recipe
        ingredient = ingredients.query.get(recipe.ingredients_id)

        if ingredient is not None:
            # Calculate the quantity of the dish that can be made from this ingredient
            qty = ingredient.ingredients_qty // recipe.ingredient_qty_needed
            qty_list.append(qty)
            if qty <= 0:
                return 0

    # The total quantity that can be made is determined by the ingredient in shortest supply
    total_qty = min(qty_list) if qty_list else 0

    return total_qty
