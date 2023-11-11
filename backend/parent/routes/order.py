from flask import Blueprint, request, jsonify

from ..extensions import db
from ..models.dish import dishes
from ..models.recipe import recipes
from ..models.ingredient import ingredients
from ..models.special_comments import special_comments
from ..models.discount import Discount
from ..models.transaction import Transactions
from ..models.transaction_special_comments import TransactionSpecialComments

from ..services.admin.inventoryManagement import calculate_qty
from ..services.admin.inventoryManagement import calculate_qty_database
from dotenv import load_dotenv
import os
import boto3
from werkzeug.utils import secure_filename

# from ..models.video import Video

order = Blueprint('order', __name__)

####################################### Dishes Table ##############################################################

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

def upload_file(file_name, bucket):
    object_name = file_name
    s3_client = boto3.client('s3')
    response = s3_client.upload_file(file_name, bucket, object_name)
    return response

def show_image(bucket):
    s3_client = boto3.client('s3')
    public_urls = []
    try:
        for item in s3_client.list_objects(Bucket=bucket)['Contents']:
            presigned_url = s3_client.generate_presigned_url('get_object', Params = {'Bucket': bucket, 'Key': item['Key']}, ExpiresIn = 100)
            public_urls.append(presigned_url)
    except Exception as e:
        pass
    # print("[INFO] : The contents inside show_image = ", public_urls)
    return public_urls



#### Get all dishes
@order.route('/api/order/getAllDishes', methods=['GET'])
def get_all_dishes():
    try:
        all_dishes = dishes.query.all()
        dishes_list = []

        for dish in all_dishes:
            Listrecipes = recipes.query.filter_by(dish_id=dish.dish_id).all()
            
            # Getting the ingredients associated with the dish
            ingredients_list = []
            for recipe in Listrecipes:
                ingredient = ingredients.query.get(recipe.ingredients_id)
                ingredients_list.append({
                    "ingredients_name": ingredient.ingredients_name,
                    "dish_id": recipe.dish_id,
                    "ingredients_id": recipe.ingredients_id,
                    "ingredient_qty_needed": recipe.ingredient_qty_needed
                })

            dish_data = {
                "dish_id": dish.dish_id,
                "dish_name": dish.dish_name,
                "price": dish.price,
                "image_url": dish.image_url,
                "small_desc": dish.small_desc,
                "description": dish.description,
                "dish_type": dish.dish_type, 
                "tag": dish.tag,
                "qty": dish.qty,
                "placement": dish.placement,
                "ingredients": ingredients_list
            }
            dishes_list.append(dish_data)

        return jsonify(dishes_list)

    except Exception as e:
        return jsonify({'result': 'An error occurred while fetching the dishes: ' + str(e)}), 500
    

#### Get all dishes placement by SMU Student for SMU Student discount menu
@order.route('/api/order/getStudentDishes', methods=['GET'])
def get_student_dishes():
    try:
        student_dishes = dishes.query.filter_by(placement='SMU Student').all()

        dishes_list = [{"dish_id": dish.dish_id, "dish_name": dish.dish_name, "price": dish.price, "image_url": dish.image_url,
                        "small_desc": dish.small_desc, "description": dish.description, "dish_type": dish.dish_type, 
                        "tag": dish.tag, "qty": dish.qty, "placement": dish.placement} for dish in student_dishes]
        return jsonify(dishes_list)
    except Exception as e:
        return jsonify({'result': 'An error occurred while fetching the student dishes: ' + str(e)}), 500
    

#### Get all dishes placement by Public for Public menu
@order.route('/api/order/getPublicDishes', methods=['GET'])
def get_public_dishes():
    try:
        student_dishes = dishes.query.filter_by(placement='Public').all()

        dishes_list = [{"dish_id": dish.dish_id, "dish_name": dish.dish_name, "price": dish.price, "image_url": dish.image_url,
                        "small_desc": dish.small_desc, "description": dish.description, "dish_type": dish.dish_type, 
                        "tag": dish.tag, "qty": dish.qty, "placement": dish.placement} for dish in student_dishes]
        return jsonify(dishes_list)
    except Exception as e:
        return jsonify({'result': 'An error occurred while fetching the student dishes: ' + str(e)}), 500


from flask import request


#### Update all dishes and ingredients QTY for admin
@order.route('/api/order/updateDish/<int:dish_id>', methods=['PUT'])
def update_dish(dish_id):
    try:
        # Retrieve the dish you want to update
        dish_to_update = dishes.query.get_or_404(dish_id)
        
        # Update dish fields
        dish_data = request.json
        dish_to_update.dish_name = dish_data.get('dish_name', dish_to_update.dish_name)
        dish_to_update.price = dish_data.get('price', dish_to_update.price)
        dish_to_update.image_url = dish_data.get('image_url', dish_to_update.image_url)
        dish_to_update.small_desc = dish_data.get('small_desc', dish_to_update.small_desc)
        dish_to_update.description = dish_data.get('description', dish_to_update.description)
        dish_to_update.dish_type = dish_data.get('dish_type', dish_to_update.dish_type)
        dish_to_update.tag = dish_data.get('tag', dish_to_update.tag)
        dish_to_update.qty = dish_data.get('qty', dish_to_update.qty)
        dish_to_update.placement = dish_data.get('placement', dish_to_update.placement)
        
        # Update associated recipes
        for ingredient_data in dish_data.get('ingredients', []):
            # Check if recipe exists
            recipe = recipes.query.filter_by(dish_id=dish_id, ingredients_id=ingredient_data['ingredients_id']).first()
            if recipe:
                recipe.ingredient_qty_needed = ingredient_data.get('ingredient_qty_needed', recipe.ingredient_qty_needed)
            else:
                # If recipe doesn't exist, create a new one
                new_recipe = recipes(
                    dish_id=dish_id,
                    ingredients_id=ingredient_data['ingredients_id'],
                    ingredient_qty_needed=ingredient_data['ingredient_qty_needed']
                )
                db.session.add(new_recipe)
        
        # Commit changes
        db.session.commit()
        for ingredient_data in dish_data.get('ingredients', []):
            calculate_qty_database(ingredient_data['ingredients_id'])
        
        return jsonify({'result': 'Dish and its recipes updated successfully'}), 200

    except Exception as e:
        return jsonify({'result': 'An error occurred while updating the dish: ' + str(e)}), 500



#### Insert dishes from admin site and service to calculate Qty and image_URL
@order.route('/api/order/addDish', methods=['POST'])
def add_dish():
    dish_name = request.form.get('dish_name')
    price = float(request.form.get('price'))
    small_desc = request.form.get('small_desc')
    description = request.form.get('description')
    dish_type = request.form.get('dish_type')
    tag = request.form.get('tag')
    qty = 0  # or request.form.get('qty') if you want to get qty from form-data
    placement = request.form.get('placement')
    img =  request.files['image']
   
    filename = secure_filename(img.filename)
    img.save(filename)
    s3.upload_file(
        Bucket=os.getenv('AWS_BUCKET_NAME'),
        Filename=filename,
        Key=filename
    )
    # Construct the URL for the uploaded image
    region_name = os.getenv('AWS_REGION_NAME', 'us-east-1')  # default to 'us-west-1' if not set
    s3_url = f"https://{os.getenv('AWS_BUCKET_NAME')}.s3.{region_name}.amazonaws.com/{filename}"

    new_dish = dishes(dish_name=dish_name, price=price,image_url=s3_url , small_desc=small_desc, description=description, dish_type=dish_type, tag=tag, qty=qty, placement=placement)
    db.session.add(new_dish)

    try:
        # db.session.commit()
        
        recipe_list = []
        # Assuming you pass recipes as separate fields like 'recipe_0_ingredients_id', 'recipe_0_ingredient_qty_needed', 'recipe_1_ingredients_id', etc.
        i = 0
        while True:
            ingredients_id = request.form.get(f'recipe[{i}][ingredients_id]')
            ingredient_qty_needed = request.form.get(f'recipe[{i}][ingredient_qty_needed]')
            print(ingredient_qty_needed)

            if ingredients_id and ingredient_qty_needed:
                recipe_list.append({
                    'ingredients_id': int(ingredients_id),
                    'ingredient_qty_needed': float(ingredient_qty_needed)
                })
                i += 1
            else:
                break

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
        
        return jsonify({'result': 'Dish added successfully', 'dish_id': new_dish.dish_id})
    
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while adding the dish: ' + str(e)}), 500


#### Delete dish
@order.route('/api/order/deleteDish/<int:dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    dish = dishes.query.get(dish_id)

    if dish is None:
        return jsonify({'message' : 'Dish not found'}), 404

    try:
        # Find all transactions related to the dish
        related_transactions = Transactions.query.filter_by(dish_id=dish_id).all()

        for transaction in related_transactions:
            # Delete related entries in transaction_special_comments
            TransactionSpecialComments.query.filter_by(transaction_id=transaction.transaction_id).delete()

            # Delete the transaction itself
            db.session.delete(transaction)

        # Delete related entries in special_comments
        special_comments.query.filter_by(dish_id=dish_id).delete()

        # Delete the recipes associated with the dish
        recipes.query.filter_by(dish_id=dish_id).delete()

        # Delete the dish from the database
        db.session.delete(dish)
        db.session.delete(dish)
        
        db.session.commit()

        return jsonify({'message' : 'Dish and associated recipes deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while deleting the dish: ' + str(e)}), 500



####################################### Recipes Table ##############################################################

#### Get all the recipe
@order.route('/api/order/get_all_recipes', methods=['GET'])
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


#### Insert recipes if they are unique
@order.route('/api/order/InsertRecipes', methods=['POST'])
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


####################################### special_comments Table ##############################################################

#### Insert special_comment 
@order.route('/api/admin/add_special_comment', methods=['POST'])
def add_special_comment():
    try:
        data = request.json
        
        # Fetch required data from the request
        comment_text = data['special_comments']
        special_comments_price = data['special_comments_price']
        dish_id = data['dish_id']
        
        # Create a new SpecialComment instance
        special_comment = special_comments(special_comments=comment_text, special_comments_price=special_comments_price, dish_id=dish_id)
        
        # Add to the session and commit
        db.session.add(special_comment)
        db.session.commit()
        
        return jsonify({"message": "Special comment added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

#### Fetch all special_comment for a dish_id
@order.route('/api/order/get_special_comments/<int:dish_id>', methods=['GET'])
def get_special_comments(dish_id):
    try:
        # Query for all special comments associated with the provided dish_id
        comments = special_comments.query.filter_by(dish_id=dish_id).all()
        
        # Convert the results to a list of dictionaries for JSON serialization
        comments_list = [{"special_comments_id": comment.special_comments_id, 
                          "special_comments": comment.special_comments,
                          "special_comments_price": comment.special_comments_price,
                          "dish_id": comment.dish_id} for comment in comments]
        
        return jsonify(comments_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    



@order.route('/api/order/get_all_special_comments', methods=['GET'])
def get_all_special_comments():
    try:
        # Query for all special comments
        comments = special_comments.query.all()
        
        # Convert the results to a list of dictionaries for JSON serialization
        comments_list = [{"special_comments_id": comment.special_comments_id, 
                          "special_comments": comment.special_comments,
                          "special_comments_price": comment.special_comments_price,
                          "dish_id": comment.dish_id} for comment in comments]
        
        return jsonify(comments_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@order.route('/api/order/delete_special_comment/<int:comment_id>', methods=['DELETE'])
def delete_special_comment(comment_id):
    try:
        # Find the special comment by its ID
        comment = special_comments.query.get(comment_id)
        
        # If the comment doesn't exist, return an error
        if not comment:
            return jsonify({"error": "Special comment not found"}), 404
        
        # Delete the comment from the database
        db.session.delete(comment)
        db.session.commit()
        
        return jsonify({"message": "Special comment deleted successfully!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


####################################### Discount Table ##############################################################

@order.route('/api/admin/get_all_discounts', methods=['GET'])
def get_all_discounts():
    try:
        # Query for all discounts
        discounts = Discount.query.all()

        # Convert the results to a list of dictionaries for JSON serialization
        discounts_list = [{
            "discount_id": discount.discount_id, 
            "discount_name": discount.discount_name,
            "code": discount.code,
            "discount_status": discount.discount_status,
            "discount_percent": discount.discount_percent,
            "start_date": discount.start_date,
            "end_date": discount.end_date
        } for discount in discounts]
        
        return jsonify(discounts_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 400





@order.route('/api/admin/add_discount', methods=['POST'])
def add_discount():
    try:
        # Extract data from the request
        data = request.json
        discount_name = data.get('discount_name')
        code = data.get('code')
        discount_status = data.get('discount_status')
        discount_percent = data.get('discount_percent')
        
        # Create a new Discount instance
        new_discount = Discount(
            discount_name=discount_name,
            code=code,
            discount_status=discount_status,
            discount_percent=discount_percent
        )
        
        # Add to the session and commit
        db.session.add(new_discount)
        db.session.commit()

        # Return a success message along with the ID of the created discount
        return jsonify({"message": "Discount added successfully!", "discount_id": new_discount.discount_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    


@order.route('/api/admin/delete_discount/<int:discount_id>', methods=['DELETE'])
def delete_discount(discount_id):
    try:
        # Fetch the discount by its ID
        discount = Discount.query.get(discount_id)

        # Check if the discount exists
        if not discount:
            return jsonify({"error": "Discount not found!"}), 404

        # Delete the discount and commit the changes
        db.session.delete(discount)
        db.session.commit()

        return jsonify({"message": f"Discount with ID {discount_id} deleted successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400









