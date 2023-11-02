from flask import Blueprint, request, jsonify

from ..extensions import db
from ..models.ingredient import ingredients
from ..models.recipe import recipes
from ..models.dish import dishes
from ..extensions import socketio
from ..services.admin.inventoryManagement import calculate_qty_database


ingredient_inventory = Blueprint('ingredient_inventory', __name__)
# socketio = SocketIO(cors_allowed_origins="*")

#### Get all Ingredients 
@ingredient_inventory.route('/api/ingredient/getAllIngredients', methods=['GET'])
def get_all_ingredients():
    all_ingredients = ingredients.query.all()

    # Convert ingredients to JSON
    ingredients_list = [{'ingredients_id': ingredient.ingredients_id,
                         'ingredients_name': ingredient.ingredients_name,
                         'ingredients_type': ingredient.ingredients_type,
                         'ingredients_qty': ingredient.ingredients_qty} 
                        for ingredient in all_ingredients]
    

    return jsonify(ingredients_list)


#### Insert ingredient with validatation on existing ingredients_name
@ingredient_inventory.route('/api/ingredient/addIngredients', methods=['POST'])
def add_ingredient():
    data = request.get_json()

    # Extract data for the ingredient
    ingredients_name = data.get('ingredients_name')
    ingredients_type = data.get('ingredients_type')
    ingredients_qty = data.get('ingredients_qty')

    # Check if an ingredient with the same name already exists
    existing_ingredient = ingredients.query.filter_by(ingredients_name=ingredients_name).first()
    if existing_ingredient:
        return jsonify({'result': 'Ingredient with this name already exists'}), 400

    new_ingredient = ingredients(ingredients_name=ingredients_name, ingredients_type=ingredients_type, ingredients_qty=ingredients_qty)
    db.session.add(new_ingredient)

    try:
        db.session.commit()
        return jsonify({'result': 'Ingredient added successfully'})
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while adding the ingredient: ' + str(e)}), 500
    

#### Update all ingredient attribute
@ingredient_inventory.route('/api/ingredient/updateIngredient/<int:ingredient_id>', methods=['PUT'])
def update_ingredient(ingredient_id):
    data = request.get_json()

    # Extract data for the ingredient
    ingredients_name = data.get('ingredients_name')
    ingredients_type = data.get('ingredients_type')
    ingredients_qty = data.get('ingredients_qty')

    # Fetch the ingredient to update
    updateIngredient = ingredients.query.get(ingredient_id)
    if not updateIngredient:
        return jsonify({'result': 'No ingredient found with this ID'}), 404

    # Update the ingredient
    updateIngredient.ingredients_name = ingredients_name
    updateIngredient.ingredients_type = ingredients_type
    updateIngredient.ingredients_qty = ingredients_qty

    update_dish_qty = calculate_qty_database(ingredient_id)
    if update_dish_qty == "successful":
        pass
    else:
        return jsonify({'result': 'An error occurred in updating update_dish_qty '}), 500
    try:
        db.session.commit()
        return jsonify({'result': 'Ingredient updated successfully'})
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while updating the ingredient: ' + str(e)}), 500
    

#### Delete ingredient with validation on checking it exsit on recipe connectinf to dishes table
@ingredient_inventory.route('/api/ingredient/deleteIngredient/<int:ingredient_id>', methods=['DELETE'])
def delete_ingredient(ingredient_id):

    # Fetch the ingredient
    ingredientToDelete = ingredients.query.get(ingredient_id)
    if not ingredientToDelete:
        return jsonify({'result': 'No ingredient found with this ID'}), 404

    # Check if ingredient exists in any recipes
    related_recipes = recipes.query.filter_by(ingredients_id=ingredient_id).all()

    # Now fetch dishes from orders table related to those recipes
    dish_ids = [recipe.dish_id for recipe in related_recipes]
    dishes_in_orders = dishes.query.filter(dishes.dish_id.in_(dish_ids)).all()
    
    dish_names = [order.dish_name for order in dishes_in_orders]

    if dish_names:
        return jsonify({
            'result': 'Cannot delete ingredient as it exists in the following dishes',
            'dishes': dish_names
        }), 400

    # If ingredient is not part of any recipe, delete it
    try:
        db.session.delete(ingredientToDelete)
        db.session.commit()
        return jsonify({'result': 'Ingredient deleted successfully'})
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while deleting the ingredient: ' + str(e)}), 500
    


