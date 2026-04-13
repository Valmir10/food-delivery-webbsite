DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  rating REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO products (name, description, price, image_url, category, rating)
VALUES
(
  'Margherita Pizza',
  'Classic Italian delight with fresh basil and mozzarella',
  7,
  '/images/margherita-pizza.png',
  'Pizza',
  4
),
(
  'Pepperoni Pizza',
  'Spicy pepperoni and gooey cheese perfection',
  8,
  '/images/pepperoni-pizza.png',
  'Pizza',
  5
),
(
  'BBQ Chicken Pizza',
  'Sweet and smoky chicken with a tangy BBQ twist',
  9,
  '/images/bbq-pizza.png',
  'Pizza',
  5
),
(
  'Four Cheese Pizza',
  'Rich, melty blend of four irresistible cheeses',
  8,
  '/images/four-cheese-pizza.png',
  'Pizza',
  4.5
),
(
  'Spaghetti Carbonara',
  'Creamy pasta with crispy pancetta and parmesan',
  9,
  '/images/spaghetti-carbonara.png',
  'Pasta',
  5
),
(
  'Penne Arrabbiata',
  'Fiery tomato sauce with a kick of garlic and chili',
  7,
  '/images/penne-arrabbiata.png',
  'Pasta',
  5
),
(
  'Fettuccine Alfredo',
  'Silky, buttery sauce with a touch of parmesan',
  8,
  '/images/fettuccine-alfredo.png',
  'Pasta',
  5
),
(
  'Pasta Bolognese',
  'Layers of pasta, hearty meat sauce, and cheese',
  10,
  '/images/pasta-bolognese.png',
  'Pasta',
  4.5
),
(
  'Chicken Pad Thai',
  'Savory noodles with chicken, peanuts, and lime',
  8,
  '/images/chicken-pad-thai.png',
  'Asian food',
  5
),
(
  'Beef Teriyaki',
  'Tender beef in a sweet and savory teriyaki glaze',
  9,
  '/images/beef-teriyaki.png',
  'Asian food',
  4.5
),
(
  'Sushi',
  'Fresh rolls with rice, fish, avocado, and wasabi',
  7,
  '/images/sushi.png',
  'Asian food',
  4.5
),
(
  'Shrimp Fried Rice',
  'Fragrant rice with shrimp, veggies, and soy',
  8,
  '/images/shrimp-fried-rice.png',
  'Asian food',
  4
),
(
  'Carnitas Burrito',
  'Slow-cooked pork, beans, rice, and guacamole',
  8,
  '/images/carnitas-burrito.png',
  'Mexican food',
  4.5
),
(
  'Beef Tacos',
  'Juicy beef, fresh toppings, and a tasty crunch',
  7,
  '/images/beef-tacos.png',
  'Mexican food',
  4.5
),
(
  'Chili Con Carne',
  'Spiced minced beef with beans and chili heat',
  9,
  '/images/chili-con-carne.png',
  'Mexican food',
  5
),
(
  'Chicken Enchiladas',
  'Cheesy, saucy enchiladas bursting with chicken',
  8,
  '/images/chicken-enchiladas.png',
  'Mexican food',
  5
),
(
  'Cheeseburger',
  'Juicy beef patty with melty cheddar cheese',
  6,
  '/images/cheeseburger.png',
  'Burgers',
  4
),
(
  'Bacon BBQ Burger',
  'Savory bacon, cheddar, and tangy BBQ sauce',
  8,
  '/images/bacon-bbq-burger.png',
  'Burgers',
  5
),
(
  'Swiss Burger',
  'Earthy mushrooms and melted Swiss cheese',
  7,
  '/images/swiss-burger.png',
  'Burgers',
  4.5
),
(
  'Jalapeño Burger',
  'Pepper jack cheese and fiery jalapeños',
  7,
  '/images/jalapeno-burger.png',
  'Burgers',
  5
),
(
  'Chicken Caesar Wrap',
  'Grilled chicken, crisp lettuce, and Caesar dressing',
  7,
  '/images/chicken-caesar-wrap.png',
  'Wraps',
  5
),
(
  'Buffalo Chicken Wrap',
  'Spicy chicken, blue cheese, and fresh veggies',
  7,
  '/images/buffalo-chicken-wrap.png',
  'Wraps',
  5
),
(
  'Club Sandwich Wrap',
  'Turkey, bacon, lettuce, and tomato goodness',
  6,
  '/images/club-sandwich-wrap.png',
  'Wraps',
  4
),
(
  'Mushroom Risotto',
  'Creamy rice with earthy mushrooms and herbs',
  7,
  '/images/mushroom-risotto.png',
  'Vegan food',
  5
),
(
  'Vegetable Stir-Fry',
  'Colorful veggies and tofu in a savory sauce',
  8,
  '/images/vegetable-stir-fry.png',
  'Vegan food',
  4
),
(
  'Falafel Bowl',
  'Crispy falafel with fresh veggies and creamy hummus',
  9,
  '/images/falafel-bowl.png',
  'Vegan food',
  5
),
(
  'Lentil Dahl',
  'Comforting lentils in a fragrant, spiced curry',
  8,
  '/images/lentil-dahl.png',
  'Vegan food',
  4.5
),
(
  'Chicken Souvlaki',
  'Grilled chicken, pita, and fresh Greek flavors',
  9,
  '/images/chicken-souvlaki.png',
  'Mediterranean food',
  5
),
(
  'Lebanese Mixed Grill',
  'A feast of grilled meats and fresh sides',
  10,
  '/images/lebanese-mixed-grill.png',
  'Mediterranean food',
  5
),
(
  'Lamb Tagine',
  'Tender lamb with aromatic spices and fruits',
  10,
  '/images/lamb-tagine.png',
  'Mediterranean food',
  4.5
),
(
  'Seafood Paella',
  'Saffron-infused rice with seafood medley',
  9,
  '/images/seafood-paella.png',
  'Mediterranean food',
  5
),
(
  'Greek Gyro Wrap',
  'Tender meat, tzatziki, and a medley of fresh veggies',
  8,
  '/images/greek-gyro-wrap.png',
  'Wraps',
  4.5
);