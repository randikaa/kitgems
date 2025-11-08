-- Seed data for KIT GEMS

-- Insert sample gems
INSERT INTO gems (name, type, description, price, carat, color, origin, cut, clarity, images, certification, in_stock, featured) VALUES
('Ceylon Blue Sapphire', 'sapphire', 'A stunning royal blue sapphire from Sri Lanka with exceptional clarity and color saturation.', 12500.00, 3.2, 'Royal Blue', 'Sri Lanka', 'Oval', 'VVS1', ARRAY['/gems/sapphire-1.jpg'], 'GIA Certified', true, true),
('Burmese Pigeon Blood Ruby', 'ruby', 'Rare pigeon blood ruby with vivid red color and excellent transparency.', 28000.00, 2.8, 'Pigeon Blood Red', 'Myanmar', 'Cushion', 'VS1', ARRAY['/gems/ruby-1.jpg'], 'GIA Certified', true, true),
('Colombian Emerald', 'emerald', 'Vivid green emerald from the legendary Muzo mines of Colombia.', 18500.00, 4.1, 'Vivid Green', 'Colombia', 'Emerald Cut', 'VS2', ARRAY['/gems/emerald-1.jpg'], 'GIA Certified', true, true),
('Flawless White Diamond', 'diamond', 'Internally flawless diamond with exceptional brilliance and fire.', 45000.00, 2.5, 'D (Colorless)', 'Botswana', 'Round Brilliant', 'IF', ARRAY['/gems/diamond-1.jpg'], 'GIA Certified', true, false),
('Pink Sapphire', 'sapphire', 'Delicate pink sapphire with excellent color and clarity.', 8500.00, 2.1, 'Pink', 'Madagascar', 'Oval', 'VVS2', ARRAY['/gems/sapphire-2.jpg'], NULL, true, false),
('Smoky Quartz', 'quartz', 'Large smoky quartz with beautiful transparency and natural color.', 850.00, 12.5, 'Smoky Brown', 'Brazil', 'Cushion', 'VS1', ARRAY['/gems/quartz-1.jpg'], NULL, true, false);

-- Insert auction gems
INSERT INTO gems (name, type, description, price, carat, color, origin, cut, clarity, images, certification, in_stock, featured) VALUES
('Kashmir Sapphire', 'sapphire', 'Extremely rare Kashmir sapphire with the legendary velvety blue color.', 0, 5.2, 'Cornflower Blue', 'Kashmir', 'Cushion', 'VVS1', ARRAY['/gems/kashmir-sapphire.jpg'], 'GIA & Gübelin Certified', false, false),
('Paraíba Tourmaline', 'other', 'Vivid neon blue Paraíba tourmaline, one of the rarest gemstones in the world.', 0, 3.8, 'Neon Blue', 'Brazil', 'Oval', 'VS1', ARRAY['/gems/paraiba.jpg'], 'GIA Certified', false, false),
('Star Ruby', 'ruby', 'Rare star ruby exhibiting perfect six-ray asterism.', 0, 6.5, 'Deep Red', 'Myanmar', 'Cabochon', 'Translucent', ARRAY['/gems/star-ruby.jpg'], 'GIA Certified', false, false);

-- Insert auctions (using the gem IDs from above)
INSERT INTO auctions (gem_id, starting_bid, current_bid, bid_count, start_time, end_time, status)
SELECT id, 50000.00, 87500.00, 23, NOW() - INTERVAL '2 days', NOW() + INTERVAL '4 hours', 'live'
FROM gems WHERE name = 'Kashmir Sapphire';

INSERT INTO auctions (gem_id, starting_bid, current_bid, bid_count, start_time, end_time, status)
SELECT id, 35000.00, 62000.00, 18, NOW() - INTERVAL '1 day', NOW() + INTERVAL '8 hours', 'live'
FROM gems WHERE name = 'Paraíba Tourmaline';

INSERT INTO auctions (gem_id, starting_bid, current_bid, bid_count, start_time, end_time, status)
SELECT id, 15000.00, 28500.00, 12, NOW() - INTERVAL '12 hours', NOW() + INTERVAL '2 hours', 'live'
FROM gems WHERE name = 'Star Ruby';
