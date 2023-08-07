from flask import Blueprint, request, jsonify

from ..extensions import db
from ..models.dish import dishes
from ..models.recipe import recipes
from ..models.ingredient import ingredients
from ..services.admin.inventoryManagement import calculate_qty

# from ..models.video import Video

order = Blueprint('order', __name__)


@order.route('/order/getAllDishes', methods=['GET'])
def get_all_dishes():
    try:
        # Query the database for all dishes
        all_dishes = dishes.query.all()

        # Format the dishes as a list of dictionaries for easy conversion to JSON
        dishes_list = [{"dish_id": dish.dish_id, "dish_name": dish.dish_name, "price": dish.price, 
                        "small_desc": dish.small_desc, "description": dish.description, "dish_type": dish.dish_type, 
                        "tag": dish.tag, "qty": dish.qty, "placement": dish.placement} for dish in all_dishes]
        return jsonify(dishes_list)
    except Exception as e:
        return jsonify({'result': 'An error occurred while fetching the dishes: ' + str(e)}), 500
    

@order.route('/order/addDish', methods=['POST'])
def add_dish():
    data = request.get_json() 
    recipe_list = data.get('recipe')

    # Extract data for the dish
    dish_name = data.get('dish_name')
    price = data.get('price')
    small_desc = data.get('small_desc')
    description = data.get('description')
    dish_type = data.get('dish_type')
    tag = data.get('tag')
    qty = 0 #data.get('qty')
    placement = data.get('placement')

    # Check if a dish with the same name already exists
    existing_dish = dishes.query.filter_by(dish_name=dish_name).first()
    if existing_dish:
        return jsonify({'result': 'Dish with this name already exists'}), 400

    new_dish = dishes(dish_name=dish_name, price=price, small_desc=small_desc, description=description, dish_type=dish_type, tag=tag, qty=qty, placement=placement)
    db.session.add(new_dish)

    try:
        db.session.commit()
        for recipe_data in recipe_list:
        # Check if a recipe with the same dish_id and ingredients_id exists
            existing_recipe = recipes.query.filter_by(dish_id=new_dish.dish_id,
                                                  ingredients_id=recipe_data['ingredients_id']).first()
            if existing_recipe:
                db.session.rollback() 
                return jsonify({'message' : f'Recipe for dish_id {recipe_data["dish_id"]} and ingredients_id {recipe_data["ingredients_id"]} already exists!'}), 400

            new_recipe = recipes(dish_id=new_dish.dish_id, 
                                ingredients_id=recipe_data['ingredients_id'], 
                                ingredient_qty_needed=recipe_data['ingredient_qty_needed'])

            db.session.add(new_recipe)

        db.session.commit()
        new_dish.qty = calculate_qty(new_dish.dish_id)
        db.session.commit()
        
        return jsonify({'result': 'Dish added successfully'})
    
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while adding the dish: ' + str(e)}), 500
    

@order.route('/order/get_all_recipes', methods=['GET'])
def get_all_recipes():
    recipe = recipes.query.all()
    output = []
    
    for recipeIndex in recipe:
        recipe_data = {}
        recipe_data['dish_id'] = recipeIndex.dish_id
        recipe_data['ingredients_id'] = recipeIndex.ingredients_id
        recipe_data['ingredient_qty_needed'] = recipeIndex.ingredient_qty_needed
        output.append(recipe_data)
        
    return jsonify({'recipes' : output})


@order.route('/order/deleteDish/<int:dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    # Find the dish
    dish = dishes.query.get(dish_id)

    if dish is None:
        return jsonify({'message' : 'Dish not found'}), 404

    try:
        # Delete the recipes associated with the dish
        recipes.query.filter_by(dish_id=dish_id).delete()

        # Delete the dish from the database
        db.session.delete(dish)
        
        db.session.commit()

        return jsonify({'message' : 'Dish and associated recipes deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while deleting the dish: ' + str(e)}), 500




@order.route('/order/InsertRecipes', methods=['POST'])
def add_recipes():
    data = request.get_json()  # get data from POST request

    for recipe_data in data:
        # Check if a recipe with the same dish_id and ingredients_id exists
        existing_recipe = recipes.query.filter_by(dish_id=recipe_data['dish_id'],
                                                  ingredients_id=recipe_data['ingredients_id']).first()
        if existing_recipe:
            return jsonify({'message' : f'Recipe for dish_id {recipe_data["dish_id"]} and ingredients_id {recipe_data["ingredients_id"]} already exists!'}), 400

        new_recipe = recipes(dish_id=recipe_data['dish_id'], 
                            ingredients_id=recipe_data['ingredients_id'], 
                            ingredient_qty_needed=recipe_data['ingredient_qty_needed'])

        db.session.add(new_recipe)
    
    db.session.commit()

    return jsonify({'message' : 'New recipes added!'})