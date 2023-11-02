from ...extensions import db
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

def calculate_qty_database(ingredients_id):
    # Find the recipes that make up the dish
    dish_recipes = recipes.query.filter_by(ingredients_id=ingredients_id).all()

    for recipe in dish_recipes:
        # Get the ingredient for this recipe
        ingredient = ingredients.query.get(recipe.ingredients_id)
        dish = dishes.query.get(recipe.dish_id)
        qty = calculate_qty(recipe.dish_id)
        dish.qty = qty
        print(qty)
        db.session.commit()
        
        # if dish is None:
        #     return "unsuccessful"

        # if ingredient is not None:
        #     # Calculate the quantity of the dish that can be made from this ingredient
        #     qty = ingredient.ingredients_qty // recipe.ingredient_qty_needed
        #     qty_list.append(qty)
        #     if qty <= 0:
        #         dish.qty = 0
        #         db.session.commit()
        #     total_qty = min(qty_list) if qty_list else 0
        #     dish.qty = total_qty
        #     print(qty)
        #     db.session.commit()

    return "successful"


def deductIngredients(dish_id, quantity):
    # Find the recipes for the dish
    dish_recipes = recipes.query.filter_by(dish_id=dish_id).all()

    if not dish_recipes:
        return "No recipes found for this dish."

    # Loop through each recipe and deduct the ingredient quantity
    for recipe in dish_recipes:
        # Get the ingredient for this recipe
        ingredient = ingredients.query.get(recipe.ingredients_id)

        if ingredient is not None:
            # Calculate the total quantity of the ingredient needed for this dish
            total_ingredient_needed = recipe.ingredient_qty_needed * quantity

            if ingredient.ingredients_qty >= total_ingredient_needed:
                # Update the quantity of the ingredient in the database
                ingredient.ingredients_qty -= total_ingredient_needed
                print(ingredient.ingredients_qty)
                dish = dishes.query.get(dish_id)
                dish.qty = calculate_qty(dish_id)
                db.session.commit()
            else:
                # Not enough of this ingredient
                return f"Not enough of ingredient ID {ingredient.ingredients_id} in stock."

    return "Ingredients deducted successfully."
