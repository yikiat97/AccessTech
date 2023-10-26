DROP TABLE IF EXISTS admin_user;
CREATE TABLE IF NOT EXISTS admin_user (
    admin_id SERIAL PRIMARY KEY,
    password VARCHAR(50),
    name VARCHAR(50),
    role VARCHAR(50)
);

DROP TABLE IF EXISTS dishes CASCADE;
CREATE TABLE IF NOT EXISTS dishes (
    dish_id SERIAL PRIMARY KEY,
    dish_name VARCHAR(50),
    price FLOAT,
    image_url VARCHAR(100),
    small_desc VARCHAR(50),
    description VARCHAR(500),
    dish_type VARCHAR(50),
    tag VARCHAR(50),
    qty INT,
    placement VARCHAR(50)
);

DROP TABLE IF EXISTS ingredients CASCADE;
CREATE TABLE IF NOT EXISTS ingredients (
    ingredients_id SERIAL PRIMARY KEY,
    ingredients_name VARCHAR(50),
    ingredients_type VARCHAR(50),
    ingredients_qty FLOAT
);

DROP TABLE IF EXISTS recipes;
CREATE TABLE IF NOT EXISTS recipes(
    dish_id INT,
    ingredients_id INT,
    ingredient_qty_needed FLOAT,
    PRIMARY KEY (dish_id, ingredients_id),
    FOREIGN KEY (dish_id) REFERENCES dishes (dish_id),
    FOREIGN KEY (ingredients_id) REFERENCES ingredients (ingredients_id)
);

DROP TABLE IF EXISTS special_comments CASCADE;
CREATE TABLE IF NOT EXISTS special_comments (
    special_comments_id SERIAL PRIMARY KEY,
    special_comments VARCHAR(500),
    special_comments_price FLOAT,
    dish_id INT,
    FOREIGN KEY (dish_id) REFERENCES dishes (dish_id)
);

DROP TABLE IF EXISTS discount CASCADE;
CREATE TABLE IF NOT EXISTS discount (
    discount_id SERIAL PRIMARY KEY,
    discount_name VARCHAR(50),
    code VARCHAR(50),
    discount_status VARCHAR(50),
    discount_percent FLOAT,
    start_date timestamp,
    end_date timestamp
);

DROP TABLE IF EXISTS invoice CASCADE;
CREATE TABLE IF NOT EXISTS invoice (
    invoice_id SERIAL PRIMARY KEY,
    date_time timestamp,
    total_price FLOAT,
    queue_num INT,
    invoice_status VARCHAR(50),
    color VARCHAR(50),
	order_number INT
);

DROP TABLE IF EXISTS discount_invoice CASCADE;;
CREATE TABLE IF NOT EXISTS discount_invoice (
    discount_id INT,
    invoice_id INT,
    PRIMARY KEY (discount_id, invoice_id),
    FOREIGN KEY (invoice_id) REFERENCES invoice(invoice_id),
    FOREIGN KEY (discount_id) REFERENCES discount (discount_id)
);

DROP TABLE IF EXISTS transactions CASCADE;
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id SERIAL PRIMARY KEY,
    dish_id INT,
    invoice_id INT,
    with_special_comments boolean,
    quantity INT,
    FOREIGN KEY (dish_id) REFERENCES dishes (dish_id),
    FOREIGN KEY (invoice_id) REFERENCES invoice (invoice_id),
    UNIQUE(dish_id, invoice_id)  -- Add a unique constraint on the combination of dish_id and invoice_id
);

DROP TABLE IF EXISTS transaction_special_comments CASCADE;
CREATE TABLE IF NOT EXISTS transaction_special_comments (
    transaction_id INT NOT NULL REFERENCES transactions(transaction_id),
    dish_id INT NOT NULL,
    invoice_id INT NOT NULL,
    special_comments_id INT,
    PRIMARY KEY (transaction_id, dish_id, invoice_id, special_comments_id),
    FOREIGN KEY (dish_id, invoice_id) REFERENCES transactions (dish_id, invoice_id),
    FOREIGN KEY (special_comments_id) REFERENCES special_comments (special_comments_id)
);

DROP TABLE IF EXISTS order_number_store CASCADE;
CREATE TABLE IF NOT EXISTS order_number_store (
    id INT PRIMARY KEY,
    current_order_number INT
);

INSERT INTO order_number_store (id, current_order_number) VALUES (1, 0);

