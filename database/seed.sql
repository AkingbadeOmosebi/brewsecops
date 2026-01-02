-- ============================================
-- Aking's Coffee - Sample Data
-- ============================================

-- ============================================
-- Products - Coffee Drinks
-- ============================================
INSERT INTO products (name, description, price, category, image_url) VALUES
-- Espresso-based drinks
('Classic Espresso', 'Rich and bold single shot of pure Italian espresso', 2.95, 'espresso', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400'),
('Double Espresso', 'Double shot for those who need an extra kick', 3.95, 'espresso', 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=400'),
('Americano', 'Espresso diluted with hot water for a smooth coffee experience', 3.50, 'espresso', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'),
('Cappuccino', 'Perfect balance of espresso, steamed milk, and foam', 4.50, 'espresso', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'),
('Latte', 'Smooth espresso with steamed milk and a touch of foam', 4.75, 'espresso', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'),
('Flat White', 'Velvety microfoam over a double shot of espresso', 4.95, 'espresso', 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=400'),
('Macchiato', 'Espresso "marked" with a dollop of foamed milk', 3.75, 'espresso', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'),

-- Specialty drinks
('Caramel Macchiato', 'Vanilla-flavored latte with caramel drizzle', 5.50, 'specialty', 'https://images.unsplash.com/photo-1599826064848-80c8f2f6122b?w=400'),
('Mocha', 'Rich chocolate blended with espresso and steamed milk', 5.25, 'specialty', 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400'),
('White Mocha', 'Sweet white chocolate mocha with whipped cream', 5.50, 'specialty', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400'),
('Vanilla Latte', 'Classic latte infused with smooth vanilla', 5.00, 'specialty', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400'),
('Hazelnut Latte', 'Nutty hazelnut flavor meets creamy latte', 5.00, 'specialty', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400'),

-- Cold drinks
('Iced Coffee', 'Smooth cold brew served over ice', 4.25, 'cold', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'),
('Iced Latte', 'Chilled espresso with cold milk over ice', 4.95, 'cold', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400'),
('Cold Brew', 'Slow-steeped for 20 hours, smooth and bold', 4.50, 'cold', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'),
('Nitro Cold Brew', 'Cold brew infused with nitrogen for a creamy texture', 5.50, 'cold', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'),
('Iced Mocha', 'Chocolate and espresso over ice with whipped cream', 5.50, 'cold', 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400'),
('Frappuccino', 'Blended ice coffee drink with whipped cream', 5.95, 'cold', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400'),

-- Pastries
('Croissant', 'Buttery, flaky French pastry', 3.50, 'pastry', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'),
('Chocolate Croissant', 'Croissant filled with rich chocolate', 4.00, 'pastry', 'https://images.unsplash.com/photo-1584536928149-b7e2feac4ee1?w=400'),
('Blueberry Muffin', 'Fresh baked muffin bursting with blueberries', 3.75, 'pastry', 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400'),
('Cinnamon Roll', 'Warm cinnamon roll with cream cheese frosting', 4.50, 'pastry', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'),
('Almond Biscotti', 'Crunchy Italian cookie perfect for dipping', 2.95, 'pastry', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400');

-- ============================================
-- Sample Orders (to demonstrate stateful data)
-- ============================================
DO $$
DECLARE
    order_id_1 UUID;
    order_id_2 UUID;
    product_latte UUID;
    product_croissant UUID;
    product_mocha UUID;
    product_muffin UUID;
BEGIN
    -- Get product IDs
    SELECT id INTO product_latte FROM products WHERE name = 'Latte' LIMIT 1;
    SELECT id INTO product_croissant FROM products WHERE name = 'Croissant' LIMIT 1;
    SELECT id INTO product_mocha FROM products WHERE name = 'Mocha' LIMIT 1;
    SELECT id INTO product_muffin FROM products WHERE name = 'Blueberry Muffin' LIMIT 1;
    
    -- Order 1
    INSERT INTO orders (customer_name, customer_email, total, status)
    VALUES ('Aking (Founder)', 'akingbadeo_ceo@brewcoffee.com', 8.25, 'completed')
    RETURNING id INTO order_id_1;
    
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES 
        (order_id_1, product_latte, 1, 4.75),
        (order_id_1, product_croissant, 1, 3.50);
    
    -- Order 2
    INSERT INTO orders (customer_name, customer_email, total, status)
    VALUES ('Sarah Johnson', 'sarah@example.com', 9.00, 'pending')
    RETURNING id INTO order_id_2;
    
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES 
        (order_id_2, product_mocha, 1, 5.25),
        (order_id_2, product_muffin, 1, 3.75);
        
    RAISE NOTICE '✓ Created sample orders';
END $$;

-- ============================================
-- Sample Reservations
-- ============================================
INSERT INTO reservations (name, email, phone, date, time, guests, notes, status) VALUES
('Aking', 'aking@example.com', '+49 123 456 7890', CURRENT_DATE + 1, '10:00 AM', 2, 'Window seat preferred', 'confirmed'),
('Michael Schmidt', 'michael@example.com', '+49 987 654 3210', CURRENT_DATE + 2, '2:00 PM', 4, 'Birthday celebration', 'confirmed'),
('Emma Mueller', 'emma@example.com', NULL, CURRENT_DATE + 3, '6:00 PM', 6, NULL, 'confirmed');

-- ============================================
-- Sample Contact Messages
-- ============================================
INSERT INTO contact_messages (name, email, subject, message, status) VALUES
('John Doe', 'john@example.com', 'Catering Inquiry', 'I would like to inquire about catering services for a corporate event with 50 people.', 'new'),
('Lisa Brown', 'lisa@example.com', 'Product Question', 'Do you offer oat milk as a dairy alternative?', 'new');

-- ============================================
-- Success message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✓ Database seeded successfully!';
    RAISE NOTICE '✓ Inserted: 23 products, 2 orders, 3 reservations, 2 contact messages';
    RAISE NOTICE '✓ Ready to test the application!';
END $$;
