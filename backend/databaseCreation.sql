DROP TABLE IF EXISTS admin_user;
CREATE TABLE IF NOT EXISTS admin_user (
    admin_id SERIAL PRIMARY KEY,
    password VARCHAR(50),
    name VARCHAR(50),
    role VARCHAR(50)
);

DROP TABLE IF EXISTS dishes;
CREATE TABLE IF NOT EXISTS dishes (
    dish_id SERIAL PRIMARY KEY,
    dish_name VARCHAR(50),
    price FLOAT,
    small_desc VARCHAR(50),
    description VARCHAR(500),
    dish_type VARCHAR(50),
    tag VARCHAR(50),
    qty INT,
    placement VARCHAR(50)
);

DROP TABLE IF EXISTS ingredients;
CREATE TABLE IF NOT EXISTS ingredients (
    ingredients_id SERIAL PRIMARY KEY,
    ingredients_name VARCHAR(50),
    ingredients_type VARCHAR(50),
    ingredients_qty FLOAT
);

DROP TABLE IF EXISTS receipe;
CREATE TABLE IF NOT EXISTS receipe(
    dish_id INT,
    ingredients_id INT,
    ingredient_qty_needed INT,
    PRIMARY KEY (dish_id, ingredients_id),
    FOREIGN KEY (dish_id) REFERENCES dishes (dish_id),
    FOREIGN KEY (ingredients_id) REFERENCES ingredients (ingredients_id)
);