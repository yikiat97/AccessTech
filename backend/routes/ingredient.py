from flask import Blueprint, request, jsonify

from ..extensions import db
from ..models.ingredient import ingredients
# from ..models.video import Video

ingredient_inventory = Blueprint('ingredient_inventory', __name__)

# @order.route('/order/<name>')
# def create_user(name):
#     user = admin_user(name=name)
#     db.session.add(user)
#     db.session.commit()

@ingredient_inventory.route('/ingredient/getAllIngredients', methods=['GET'])
def get_all_ingredients():
    # Fetch all ingredients
    all_ingredients = ingredients.query.all()

    # Convert ingredients to JSON
    ingredients_list = [{'ingredients_id': ingredient.ingredients_id,
                         'ingredients_name': ingredient.ingredients_name,
                         'ingredients_type': ingredient.ingredients_type,
                         'ingredients_qty': ingredient.ingredients_qty} 
                        for ingredient in all_ingredients]
    
    return jsonify(ingredients_list)


@ingredient_inventory.route('/ingredient/addIngredients', methods=['POST'])
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
    

@ingredient_inventory.route('/ingredient/updateIngredient/<int:ingredient_id>', methods=['PUT'])
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

    try:
        db.session.commit()
        return jsonify({'result': 'Ingredient updated successfully'})
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while updating the ingredient: ' + str(e)}), 500