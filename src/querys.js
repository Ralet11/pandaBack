import { getShops } from "./controllers/shops.controller"

OWNERS

INSERT INTO public.owner(
    name,
    "lastName",
    email,
    birthdate,
    latitude,
    longitude,
    address,
    password,
    "resetToken",
    "resetTokenExpiration",
    "createdAt",
    "updatedAt"
)
VALUES
(
  'Luis', 
  'Pérez', 
  'luis.perez@example.com', 
  '1982-11-05', 
  -34.6037, 
  -58.3816, 
  'Av. de Mayo 123, CABA, Argentina', 
  -- bcrypt hash for “password123”
  '$2a$10$KIXaB1e5Nvq2r4fX0YpO1eEjF8ZQyH8/NjXjMvz/sEy7UVrI9aCdfu', 
  NULL, 
  NULL, 
  NOW(), 
  NOW()
),
(
  'Ana', 
  'Martínez', 
  'ana.martinez@example.com', 
  '1994-07-19', 
  40.4168, 
  -3.7038, 
  'Calle Mayor 45, Madrid, España', 
  -- bcrypt hash for “secret456”
  '$2a$10$Wz3YhQ4RlHtJ9N8yB7vM1uSz5HeKjY2VxF/0rLq9YbC0ZtP1sU4uK', 
  NULL, 
  NULL, 
  NOW(), 
  NOW()
);

//

SHOP QUERY

INSERT INTO public.shop(
    name,
    description,
    logo,
    "placeImage",
    "deliveryImage",
    latitude,
    longitude,
    owner_id,
    "createdAt",
    "updatedAt"
)
VALUES
(
  'Bamboo Market',
  'Supermercado de productos frescos y orgánicos en tu barrio',
  'https://example.com/logos/bamboo-market.png',
  'https://example.com/images/bamboo-market-place.jpg',
  'https://example.com/images/bamboo-market-delivery.jpg',
  -34.6037,
  -58.3816,
  1,
  NOW(),
  NOW()
),
(
  'Panda Express',
  'Restaurante de comida rápida china con servicio a domicilio',
  'https://example.com/logos/panda-express.png',
  'https://example.com/images/panda-express-place.jpg',
  'https://example.com/images/panda-express-delivery.jpg',
  40.4168,
  -3.7038,
  2,
  NOW(),
  NOW()
),
(
  'Green Leaf Pharmacy',
  'Farmacia con los mejores productos y entrega rápida',
  'https://example.com/logos/green-leaf-pharmacy.png',
  'https://example.com/images/green-leaf-place.jpg',
  'https://example.com/images/green-leaf-delivery.jpg',
  34.0522,
  -118.2437,
  1,
  NOW(),
  NOW()
),
(
  'Bamboo Electronics',
  'Tienda de electrónica con gadgets de última generación',
  'https://example.com/logos/bamboo-electronics.png',
  'https://example.com/images/bamboo-electronics-place.jpg',
  'https://example.com/images/bamboo-electronics-delivery.jpg',
  51.5074,
  -0.1278,
  2,
  NOW(),
  NOW()
),
(
  'Panda Clothing',
  'Moda y accesorios con envío express',
  'https://example.com/logos/panda-clothing.png',
  'https://example.com/images/panda-clothing-place.jpg',
  'https://example.com/images/panda-clothing-delivery.jpg',
  48.8566,
  2.3522,
  1,
  NOW(),
  NOW()
);

//

CATEGORIES 

