-- Procore Financial Modules Seed Data
-- Generated on 2025-12-08T02:25:08.863Z
-- This script creates test data for all financial tables


-- Companies
INSERT INTO companies (id, name, company_type, address_line_1, city, state, zip, phone, is_active) VALUES
('79f41b63-1011-46ce-9403-0c8715e8b070', 'ABC Development Group', 'owner', '123 Main St', 'San Francisco', 'CA', '94105', '415-555-0100', true),
('7026d48d-bc28-43b7-b68d-1f61c5832371', 'BuildCo General Contractors', 'general_contractor', '456 Construction Way', 'San Francisco', 'CA', '94107', '415-555-0200', true),
('9c51710e-0dc1-4bb3-821d-645a43196edd', 'Thiel, Blanda and Weimann', 'architect', '47339 Littel Crescent', 'South Peter', 'NV', '65015', '1-459-775-0699 x717', true),
('00417822-bb4c-46f5-82cb-020c01a47a67', 'Balistreri, Gutkowski and Walker', 'subcontractor', '524 Hoeger Cape', 'Towson', 'WV', '67347', '996-360-2241', true),
('487fccb1-1c2a-4278-8332-81c1a7457773', 'Stark - Littel', 'vendor', '457 Oak Street', 'Braedenberg', 'ND', '50896', '(392) 436-9049', true),
('67253521-4002-4e95-aca8-d42237271c3d', 'Reichel - Berge', 'engineer', '456 Volkman Oval', 'East Moisesbury', 'TN', '14201', '685-904-5643', true),
('7d6a9687-578f-484d-8409-e9135d912cca', 'Mitchell - Stroman', 'vendor', '933 Washington Boulevard', 'Mozellefort', 'KS', '63767', '914-986-3029 x42115', true),
('a0e6ef05-c9b5-4b2c-b834-fe49976eda43', 'Bechtelar - Mueller', 'subcontractor', '78968 Riverside Drive', 'South Creola', 'ME', '46049', '1-372-626-7213 x7854', true),
('f1e79e66-3974-4471-8ba3-ceb6874447fc', 'Kris LLC', 'subcontractor', '6720 Main', 'East Marielle', 'OR', '17751', '590-739-1976 x372', true),
('5f6856be-acd6-40e1-8def-d8fe07244e61', 'Yundt Inc', 'engineer', '3941 North Lane', 'Springdale', 'RI', '61431', '(297) 207-0427 x980', true),
('b720842b-08c7-46a0-bbd0-1e225ea0be62', 'Heathcote - Bergnaum', 'subcontractor', '9475 Heather Close', 'Scranton', 'NV', '74222', '934.950.1051', true),
('7a11bad6-8b48-4b6d-a516-86c995f0c239', 'Wolf and Sons', 'engineer', '26896 Kerluke Curve', 'Port Einarville', 'MD', '48508', '(659) 898-5837', true),
('5709f96c-d737-47eb-bf4a-9b00448c6023', 'Berge - Kuvalis', 'engineer', '2946 Tevin Burgs', 'North Johnpaul', 'NE', '41559', '777-572-1177 x775', true),
('9c7333b0-4fd2-4a08-aff4-af7a0bf2ef19', 'Brakus Group', 'subcontractor', '407 Welch Mews', 'North Faebury', 'WA', '91356-8547', '1-233-957-4894 x332', true),
('106b8bf8-100a-4269-b0fa-88d7d1e169dc', 'Frami LLC', 'vendor', '76332 Laburnum Grove', 'Chula Vista', 'AZ', '95727', '721.490.4704', true),
('0755a0d4-2ba9-4b9d-b7da-f55d7344274b', 'Rath, Hamill and Kunde', 'subcontractor', '327 Kunde Port', 'Christiansenburgh', 'MO', '40868', '309.829.0001 x26983', true),
('fd64ea41-8d00-4766-a634-5974c4526039', 'Lowe - Jaskolski', 'architect', '650 Moore Tunnel', 'Pontiac', 'IA', '05194-0833', '(955) 627-2595 x761', true),
('5f02c5ad-4072-4d9e-ac1e-27d69a2f5ad3', 'Carroll Inc', 'vendor', '774 Charley Parkway', 'New Liatown', 'OK', '29249-6242', '1-781-735-4409 x6791', true),
('b6bc0021-af49-44eb-bb2c-666d3cfad9f1', 'Kessler Group', 'subcontractor', '733 Riverside Avenue', 'South Bernardo', 'OK', '17668', '(654) 445-5786 x0974', true),
('666bcada-8337-4eb0-815d-1e7646207951', 'Toy, Kertzmann and Sawayn', 'architect', '2070 Juanita Point', 'Schimmelville', 'NY', '30772-0008', '869-816-5388 x7002', true);

-- Users
INSERT INTO auth.users (id, email) VALUES
('7cf6ecf5-9dd2-4aab-81c8-789f7636f986', 'Aiyana.Cartwright@abcdevelopmentgroup.com'),
('cdd9f87a-3a9a-4cc9-9162-1e65bff1a005', 'Trace98@abcdevelopmentgroup.com'),
('62cff4aa-9e63-4b6d-8e1a-eb74cd8a139d', 'Diamond_Emard@abcdevelopmentgroup.com'),
('16baa79b-85fb-4d94-99cd-c60499b147d4', 'Hugh14@abcdevelopmentgroup.com'),
('068932bc-8fd9-49bc-b12e-fb1a39892f92', 'Bonnie.Ratke11@abcdevelopmentgroup.com'),
('687ce332-a8e9-457f-b881-27a6b236a0c8', 'Malachi_Reichert@buildcogeneralcontractors.com'),
('fb13ebfa-7f3a-45c9-91f4-feb80075400d', 'Elvera.Ruecker79@buildcogeneralcontractors.com'),
('bacf0e84-8180-444b-81c6-b32f52f60436', 'Christopher.Paucek72@buildcogeneralcontractors.com'),
('9b555ba7-4402-426d-834e-14cbaeca44c8', 'Rafaela_Rutherford64@buildcogeneralcontractors.com'),
('f8e2403f-884c-4a76-9ee0-c4f7c7cd8b3a', 'Cassandra_Hermiston@buildcogeneralcontractors.com'),
('4657833a-81bc-4096-b699-0145e7c26f37', 'Edwina14@thiel,blandaandweimann.com'),
('5c7c9d5b-a9fc-4c06-bee5-b0147692e4db', 'Ellen_Okuneva@thiel,blandaandweimann.com'),
('6fa92b5c-f891-4fa6-a78a-2c7a72e1a8d0', 'Kali13@balistreri,gutkowskiandwalker.com'),
('de0e2dfa-260e-4c57-9381-bebfe59e2814', 'Imani_Will@balistreri,gutkowskiandwalker.com'),
('d6c123b5-b2c4-4974-879f-6368c658b639', 'Dorcas11@stark-littel.com'),
('45340fe3-f355-4c24-929c-9fbe0e3f853e', 'Javonte.Herzog@stark-littel.com'),
('539dfa3d-ac6c-4035-b82a-3f1ba064e929', 'Magnolia_Rath@reichel-berge.com'),
('e4300f6a-f0fe-47ac-90da-b449d0530445', 'Major_Reichert71@reichel-berge.com'),
('df5e0a23-d7f5-411f-a810-1be89dd0c7eb', 'Fatima_Ondricka-Tremblay58@mitchell-stroman.com'),
('38964816-1052-4aeb-bf6c-b5fc858b9fff', 'Yasmin_Frami42@mitchell-stroman.com'),
('d04a500e-4977-4144-9118-8edad22d1032', 'Nash49@bechtelar-mueller.com'),
('abf3ff65-cfe2-4c37-812f-b07ff54a7417', 'Gerard39@bechtelar-mueller.com'),
('afb96c3c-41e5-4c0a-8537-a8c844e4ba6a', 'Edison0@krisllc.com'),
('b89b32d5-486f-4773-8531-4a54acab0e54', 'Heber_Monahan-Schroeder@krisllc.com'),
('bf5c759c-7ea3-49ce-af5d-eb5673fb81f7', 'Dalton_Batz9@yundtinc.com'),
('fe7d4bec-958b-42c6-a4f2-db847584461c', 'Rhett.Volkman63@yundtinc.com'),
('bf11db59-8e25-437b-b5c6-a850b6536c0c', 'Jonathan_Gutmann@heathcote-bergnaum.com'),
('8889a18a-e2b2-4f3b-acba-d062438c216c', 'Mavis75@heathcote-bergnaum.com'),
('84b0ff35-06f8-43c6-a055-0ab989e1f2bd', 'Zita_Walter@wolfandsons.com'),
('f5619266-c740-45c1-a81e-9cb9add21bcd', 'Elva.Kuhn28@wolfandsons.com'),
('85e936b3-facf-4e47-a3a9-b7d2c345a44b', 'Orion.Gutmann@berge-kuvalis.com'),
('11eee88d-b4f0-4831-905e-d52ae8fcede7', 'Cecil_Padberg5@berge-kuvalis.com'),
('28255554-246a-48ce-b730-690bf6b5ff01', 'Valerie_McKenzie@brakusgroup.com'),
('79d18d2d-b72b-4567-8dbf-dba0565bdfc5', 'Hailey.Mante20@brakusgroup.com'),
('ef9a289e-b00b-4d9e-878f-686fe0d8f109', 'Earline_Kozey85@framillc.com'),
('a77449c9-6e36-4df2-b23f-c30e8d47ccb7', 'Delphine48@framillc.com'),
('18baa893-b346-4e1a-853d-f88a59fdea29', 'Presley_Kihn@rath,hamillandkunde.com'),
('87cefddd-92bc-4920-be23-49059b8b5fb4', 'Jayce.Runte@rath,hamillandkunde.com'),
('4ae1f836-cf60-4fd0-adb9-1e8c045a1d2e', 'Eloise_Quitzon67@lowe-jaskolski.com'),
('fc2c3832-93f3-401e-a0fb-db0c3e787e12', 'Evalyn_Kuphal@lowe-jaskolski.com'),
('af8269ff-0712-41d5-93b5-faa8884968b3', 'Brendon60@carrollinc.com'),
('5551d69c-b49e-481d-b0ef-6de346879b0d', 'Cathryn.Dibbert@carrollinc.com'),
('7b92d231-6994-46cd-a595-9fc2f7772922', 'Lisette.Littel82@kesslergroup.com'),
('4b258eda-c68f-4adc-a198-89bdf1b46da6', 'Tyra3@kesslergroup.com'),
('a25bcf4e-7072-4c82-a0c2-094ebba107bb', 'Jude_Miller@toy,kertzmannandsawayn.com'),
('87d17915-6d9c-4307-a863-c35066643abc', 'Shyann11@toy,kertzmannandsawayn.com');

-- Projects
INSERT INTO projects (id, name, job_number, company_id, status, project_type, start_date, end_date, address_line_1, city, state, zip) VALUES
('2fcddb24-554b-4588-b252-f78f6956bb52', 'Riverside Apartments - Phase 1', '2025-100', '7026d48d-bc28-43b7-b68d-1f61c5832371', 'complete', 'commercial', '2024-12-23', '2026-01-25', '267 Lehner Dam', 'Framihaven', 'RI', '04200'),
('a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'Tech Campus Expansion - Phase 2', '2025-101', '7026d48d-bc28-43b7-b68d-1f61c5832371', 'complete', 'industrial', '2025-02-24', '2025-04-22', '137 Marlon Valley', 'Adamsburgh', 'IA', '08718-8961'),
('e1dba243-0107-4061-a232-ecce67b29b72', 'Riverside Apartments - Phase 3', '2025-102', '7026d48d-bc28-43b7-b68d-1f61c5832371', 'complete', 'infrastructure', '2025-11-30', '2027-08-27', '30668 Rau Union', 'Reaganmouth', 'NH', '23010');

-- Cost Codes

-- Cost codes for project: Riverside Apartments - Phase 1
INSERT INTO cost_codes (id, project_id, code, description, parent_path, sort_order) VALUES
('fdd9ee54-a8ca-4dc5-8d0a-fc6ca7a0d2a0', '2fcddb24-554b-4588-b252-f78f6956bb52', '01-000', 'General Requirements', '01', 0),
('7556f214-47f7-45dc-bb70-ca44b00466e6', '2fcddb24-554b-4588-b252-f78f6956bb52', '01-100', 'Tasty Gold Chicken', '01.01-100', 1),
('fd554263-6294-4ec5-87ff-67d54bb92bfd', '2fcddb24-554b-4588-b252-f78f6956bb52', '01-200', 'Gorgeous Rubber Ball', '01.01-200', 2),
('ec6d1475-f675-4c2d-81ac-ee01714ac7d5', '2fcddb24-554b-4588-b252-f78f6956bb52', '01-300', 'Generic Wooden Hat', '01.01-300', 3),
('6126d43d-e768-4720-9dc7-84beab368ba3', '2fcddb24-554b-4588-b252-f78f6956bb52', '02-000', 'Existing Conditions', '02', 4),
('3a40dafa-88e7-411c-ade2-56b6846bb52e', '2fcddb24-554b-4588-b252-f78f6956bb52', '02-100', 'Intelligent Steel Mouse', '02.02-100', 5),
('937faa31-9d71-463d-9917-d56c6ddcfe51', '2fcddb24-554b-4588-b252-f78f6956bb52', '02-200', 'Electronic Metal Salad', '02.02-200', 6),
('938134cf-6a98-4d36-bd22-ee336368e1a6', '2fcddb24-554b-4588-b252-f78f6956bb52', '02-300', 'Incredible Aluminum Shoes', '02.02-300', 7),
('431309c5-83e3-4681-b26e-dbfe8fcbf4b3', '2fcddb24-554b-4588-b252-f78f6956bb52', '02-400', 'Ergonomic Granite Hat', '02.02-400', 8),
('fc2da6f7-698b-4260-8e32-400c2f877c46', '2fcddb24-554b-4588-b252-f78f6956bb52', '03-000', 'Concrete', '03', 9),
('e68db3e0-c28c-4773-b981-8b6a477ab33c', '2fcddb24-554b-4588-b252-f78f6956bb52', '03-100', 'Awesome Concrete Pants', '03.03-100', 10),
('20068f38-e4de-42ae-8b8c-1ee3378b959a', '2fcddb24-554b-4588-b252-f78f6956bb52', '03-200', 'Oriental Plastic Pants', '03.03-200', 11),
('719214df-368e-403a-8fb2-c57b52f9ed38', '2fcddb24-554b-4588-b252-f78f6956bb52', '04-000', 'Masonry', '04', 12),
('42b181bf-8138-4857-8c45-0cd4d2901bf8', '2fcddb24-554b-4588-b252-f78f6956bb52', '04-100', 'Oriental Aluminum Hat', '04.04-100', 13),
('f1e0a844-5da9-4566-874e-e1af1530cc57', '2fcddb24-554b-4588-b252-f78f6956bb52', '04-200', 'Recycled Gold Chips', '04.04-200', 14),
('fc113415-d404-4725-acdc-5b612d22e6fa', '2fcddb24-554b-4588-b252-f78f6956bb52', '04-300', 'Practical Concrete Chips', '04.04-300', 15),
('2a118084-5181-448a-ac15-e594d33fe464', '2fcddb24-554b-4588-b252-f78f6956bb52', '04-400', 'Generic Cotton Shoes', '04.04-400', 16),
('46c25ee2-0195-4e54-a7f4-8308159dd735', '2fcddb24-554b-4588-b252-f78f6956bb52', '04-500', 'Modern Metal Computer', '04.04-500', 17),
('01b7fac6-6a66-445d-86ef-4df6447438a0', '2fcddb24-554b-4588-b252-f78f6956bb52', '05-000', 'Metals', '05', 18),
('378d6af3-ea2a-4b25-b2e5-b6af7fa5aead', '2fcddb24-554b-4588-b252-f78f6956bb52', '05-100', 'Rustic Concrete Bike', '05.05-100', 19),
('343f4448-3cb1-4645-a3c2-d508ceed86d2', '2fcddb24-554b-4588-b252-f78f6956bb52', '05-200', 'Bespoke Aluminum Soap', '05.05-200', 20),
('3731fff3-c686-4576-b04a-49835d855262', '2fcddb24-554b-4588-b252-f78f6956bb52', '05-300', 'Elegant Rubber Shirt', '05.05-300', 21),
('adde3983-5aa5-40b0-b85b-3f99c80268b6', '2fcddb24-554b-4588-b252-f78f6956bb52', '05-400', 'Oriental Marble Chips', '05.05-400', 22),
('2e202d0a-7e9f-49ee-b9a9-1b606a0bdc9e', '2fcddb24-554b-4588-b252-f78f6956bb52', '06-000', 'Wood & Plastics', '06', 23),
('8a1a680f-def1-4919-a59a-baacbffc5c36', '2fcddb24-554b-4588-b252-f78f6956bb52', '06-100', 'Bespoke Rubber Pizza', '06.06-100', 24),
('22396629-6999-4ead-b917-3e3e970e209f', '2fcddb24-554b-4588-b252-f78f6956bb52', '06-200', 'Intelligent Rubber Cheese', '06.06-200', 25),
('53729acc-02e2-48ef-9a6f-fb098c6023ac', '2fcddb24-554b-4588-b252-f78f6956bb52', '06-300', 'Awesome Aluminum Fish', '06.06-300', 26),
('af59e5cc-3d80-4261-9c4c-469cf3f17952', '2fcddb24-554b-4588-b252-f78f6956bb52', '07-000', 'Thermal & Moisture Protection', '07', 27),
('b96375d2-eb45-4f6f-b3b6-3e84489c8ed3', '2fcddb24-554b-4588-b252-f78f6956bb52', '07-100', 'Tasty Marble Car', '07.07-100', 28),
('223a0dde-a137-4026-969d-2c18aef61a20', '2fcddb24-554b-4588-b252-f78f6956bb52', '07-200', 'Rustic Rubber Car', '07.07-200', 29),
('99998d24-7d15-40a9-bb2b-116fe5c7ef51', '2fcddb24-554b-4588-b252-f78f6956bb52', '07-300', 'Small Concrete Cheese', '07.07-300', 30),
('80d1108a-84c7-44b7-a1e6-ad1f9f3cf2f7', '2fcddb24-554b-4588-b252-f78f6956bb52', '07-400', 'Luxurious Ceramic Chicken', '07.07-400', 31),
('0966b71a-b44f-4e30-98ae-9051cfe4a203', '2fcddb24-554b-4588-b252-f78f6956bb52', '08-000', 'Doors & Windows', '08', 32),
('a51efd55-e4ff-432e-90c7-cd573a65333a', '2fcddb24-554b-4588-b252-f78f6956bb52', '08-100', 'Licensed Bamboo Gloves', '08.08-100', 33),
('ceb16b5c-09a0-4a57-9b04-148d7090b955', '2fcddb24-554b-4588-b252-f78f6956bb52', '08-200', 'Incredible Granite Bacon', '08.08-200', 34),
('fe5ae600-4900-4394-957b-c2c4b2442edd', '2fcddb24-554b-4588-b252-f78f6956bb52', '08-300', 'Generic Aluminum Gloves', '08.08-300', 35),
('75b010ac-dedf-48a8-8fb0-ba9a53de8f63', '2fcddb24-554b-4588-b252-f78f6956bb52', '08-400', 'Luxurious Ceramic Car', '08.08-400', 36),
('22da16bb-215f-4d48-84da-15f77227b21f', '2fcddb24-554b-4588-b252-f78f6956bb52', '08-500', 'Oriental Bronze Shoes', '08.08-500', 37),
('b2aaec27-3f5b-4012-8f4b-a1eeec5490d2', '2fcddb24-554b-4588-b252-f78f6956bb52', '09-000', 'Finishes', '09', 38),
('80e26241-d090-4149-928d-9a1d27e26f46', '2fcddb24-554b-4588-b252-f78f6956bb52', '09-100', 'Recycled Plastic Chicken', '09.09-100', 39),
('99b01659-247c-4fb7-8303-dfbffa954954', '2fcddb24-554b-4588-b252-f78f6956bb52', '09-200', 'Luxurious Silk Car', '09.09-200', 40),
('0f181c55-3340-4555-84fe-f2e81dc9fcdc', '2fcddb24-554b-4588-b252-f78f6956bb52', '09-300', 'Recycled Concrete Sausages', '09.09-300', 41),
('7652d563-ccd0-4b18-8ee5-67b668b706d2', '2fcddb24-554b-4588-b252-f78f6956bb52', '09-400', 'Modern Granite Chicken', '09.09-400', 42),
('90c501a1-47b6-4104-ac28-a13c0aadd2b7', '2fcddb24-554b-4588-b252-f78f6956bb52', '10-000', 'Specialties', '10', 43),
('47880516-1dd2-4572-a597-28b0f5510ce1', '2fcddb24-554b-4588-b252-f78f6956bb52', '10-100', 'Luxurious Aluminum Tuna', '10.10-100', 44),
('e9c4f565-07c9-4fca-a439-9bef250289b7', '2fcddb24-554b-4588-b252-f78f6956bb52', '10-200', 'Small Aluminum Pizza', '10.10-200', 45),
('cde2b9d0-a248-4e0b-aa2d-d39e62606f97', '2fcddb24-554b-4588-b252-f78f6956bb52', '10-300', 'Practical Rubber Car', '10.10-300', 46),
('1ec3589d-93cd-42aa-b6c8-70197ddab904', '2fcddb24-554b-4588-b252-f78f6956bb52', '11-000', 'Equipment', '11', 47),
('b744cd5f-c631-4085-8142-5b291a233a44', '2fcddb24-554b-4588-b252-f78f6956bb52', '11-100', 'Rustic Metal Fish', '11.11-100', 48),
('f8db6dd3-c171-4277-bd59-7307d4aefdff', '2fcddb24-554b-4588-b252-f78f6956bb52', '11-200', 'Rustic Aluminum Chair', '11.11-200', 49),
('f8584e8f-fe63-47d3-a9a3-25a0698eddad', '2fcddb24-554b-4588-b252-f78f6956bb52', '11-300', 'Handmade Marble Hat', '11.11-300', 50),
('4b4c1658-6f26-408f-839f-e66dc57de5c8', '2fcddb24-554b-4588-b252-f78f6956bb52', '11-400', 'Practical Aluminum Car', '11.11-400', 51),
('ec492efd-4826-4ae1-9a0b-eff3eef549bd', '2fcddb24-554b-4588-b252-f78f6956bb52', '11-500', 'Gorgeous Gold Chicken', '11.11-500', 52),
('1a8c5ea9-220d-4532-858f-8ecc61c1b15a', '2fcddb24-554b-4588-b252-f78f6956bb52', '12-000', 'Furnishings', '12', 53),
('a7ae9d27-9de1-40dc-b0e2-c5998ffb2ca5', '2fcddb24-554b-4588-b252-f78f6956bb52', '12-100', 'Sleek Concrete Gloves', '12.12-100', 54),
('bc3c93bb-ad9e-4b44-b7f1-4ae69ce5ac71', '2fcddb24-554b-4588-b252-f78f6956bb52', '12-200', 'Refined Aluminum Mouse', '12.12-200', 55),
('4db007f5-a779-441e-83cc-1c14725b40e3', '2fcddb24-554b-4588-b252-f78f6956bb52', '13-000', 'Special Construction', '13', 56),
('be2a2e84-7181-4150-970b-fd1f399dcb8e', '2fcddb24-554b-4588-b252-f78f6956bb52', '13-100', 'Recycled Ceramic Sausages', '13.13-100', 57),
('d594116f-3ded-445d-92b5-88391d570416', '2fcddb24-554b-4588-b252-f78f6956bb52', '13-200', 'Bespoke Bronze Shoes', '13.13-200', 58),
('64c00228-d910-4149-8f20-db029510be7c', '2fcddb24-554b-4588-b252-f78f6956bb52', '13-300', 'Awesome Rubber Computer', '13.13-300', 59),
('d15781d2-76df-4b46-9fa5-7c45eed54274', '2fcddb24-554b-4588-b252-f78f6956bb52', '13-400', 'Soft Marble Towels', '13.13-400', 60),
('4f873429-bd9b-4868-b0ac-99269cab2c25', '2fcddb24-554b-4588-b252-f78f6956bb52', '14-000', 'Conveying Systems', '14', 61),
('8580aa93-fbcd-4900-9907-cc1e6db9cfbe', '2fcddb24-554b-4588-b252-f78f6956bb52', '14-100', 'Unbranded Rubber Gloves', '14.14-100', 62),
('09852b1b-6216-42ca-8c39-783459ef9aef', '2fcddb24-554b-4588-b252-f78f6956bb52', '14-200', 'Soft Bamboo Table', '14.14-200', 63),
('0de94b8a-009f-41ed-b76f-60bc9797d5e8', '2fcddb24-554b-4588-b252-f78f6956bb52', '14-300', 'Refined Silk Car', '14.14-300', 64),
('14c83d84-23dc-4350-ac18-7ef052e01f5e', '2fcddb24-554b-4588-b252-f78f6956bb52', '14-400', 'Sleek Bronze Pants', '14.14-400', 65),
('6dd606fc-c139-46bd-8ff4-47ba2a3962a9', '2fcddb24-554b-4588-b252-f78f6956bb52', '21-000', 'Fire Suppression', '21', 66),
('2b49c725-eaaa-4fd3-bcfb-d7c4e446d124', '2fcddb24-554b-4588-b252-f78f6956bb52', '21-100', 'Fantastic Concrete Gloves', '21.21-100', 67),
('408c0004-ea7c-4a13-adfb-85347d149039', '2fcddb24-554b-4588-b252-f78f6956bb52', '21-200', 'Fresh Concrete Towels', '21.21-200', 68),
('c9678fd4-9e4a-4fc6-9aca-7934f3aca3f3', '2fcddb24-554b-4588-b252-f78f6956bb52', '21-300', 'Frozen Gold Table', '21.21-300', 69),
('93b9d91b-11ab-48bf-9086-eb02a70330fc', '2fcddb24-554b-4588-b252-f78f6956bb52', '21-400', 'Fantastic Marble Tuna', '21.21-400', 70),
('7968a7b9-4261-44ba-8fde-5845e700aca9', '2fcddb24-554b-4588-b252-f78f6956bb52', '22-000', 'Plumbing', '22', 71),
('1270770b-ac22-4df1-9a05-101adeff6c31', '2fcddb24-554b-4588-b252-f78f6956bb52', '22-100', 'Soft Gold Gloves', '22.22-100', 72),
('44b6f6a6-2b82-4608-887c-acc36116a37e', '2fcddb24-554b-4588-b252-f78f6956bb52', '22-200', 'Oriental Bronze Chicken', '22.22-200', 73),
('decb3765-fa22-4842-a60d-820360fe98bd', '2fcddb24-554b-4588-b252-f78f6956bb52', '22-300', 'Handmade Cotton Hat', '22.22-300', 74),
('e1f649cd-bd09-4681-a443-157929620a99', '2fcddb24-554b-4588-b252-f78f6956bb52', '23-000', 'HVAC', '23', 75),
('317c4d5e-1d94-49f2-b8ff-6ba039e3c85a', '2fcddb24-554b-4588-b252-f78f6956bb52', '23-100', 'Gorgeous Marble Chicken', '23.23-100', 76),
('27db8e8d-89fa-484a-894c-f2f0d4e1ca89', '2fcddb24-554b-4588-b252-f78f6956bb52', '23-200', 'Soft Metal Computer', '23.23-200', 77),
('74875633-b113-48a0-a235-46e740378c92', '2fcddb24-554b-4588-b252-f78f6956bb52', '26-000', 'Electrical', '26', 78),
('6965a331-93fa-4742-8b79-91a0aac4c1c6', '2fcddb24-554b-4588-b252-f78f6956bb52', '26-100', 'Elegant Marble Car', '26.26-100', 79),
('a2fb49f7-e7b7-4344-859f-7b20ffea3b15', '2fcddb24-554b-4588-b252-f78f6956bb52', '26-200', 'Incredible Steel Ball', '26.26-200', 80),
('984ce152-e06f-4e14-aa9f-065ab7f90af7', '2fcddb24-554b-4588-b252-f78f6956bb52', '26-300', 'Tasty Metal Cheese', '26.26-300', 81),
('a9bae1a0-7d28-47f4-8711-034b22931694', '2fcddb24-554b-4588-b252-f78f6956bb52', '26-400', 'Soft Ceramic Cheese', '26.26-400', 82),
('be1adafc-4a1d-4acc-8075-7c3d9d86ef63', '2fcddb24-554b-4588-b252-f78f6956bb52', '26-500', 'Recycled Ceramic Pants', '26.26-500', 83);

-- Cost codes for project: Tech Campus Expansion - Phase 2
INSERT INTO cost_codes (id, project_id, code, description, parent_path, sort_order) VALUES
('64840d1a-1f33-42d9-b332-22791be1bd1b', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '01-000', 'General Requirements', '01', 0),
('340d2f03-26bc-498f-a1cb-1ae791d61ae4', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '01-100', 'Refined Silk Towels', '01.01-100', 1),
('6db3440f-b9ec-46f3-b95e-fcb42748f00f', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '01-200', 'Ergonomic Rubber Cheese', '01.01-200', 2),
('22ecddb9-c60c-47c9-9d3f-f612f7ab25f0', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '01-300', 'Licensed Bronze Chips', '01.01-300', 3),
('8c417f67-1f88-4e05-b0ef-a6be8906b7af', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '02-000', 'Existing Conditions', '02', 4),
('afb16aa7-03cf-438a-94d7-d9b5206ee6c9', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '02-100', 'Bespoke Bronze Hat', '02.02-100', 5),
('bfbb9259-f01a-4008-8fad-447d516ee4c6', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '02-200', 'Elegant Steel Computer', '02.02-200', 6),
('37e8dd86-b9a1-47c4-b0c5-28f34db21202', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '03-000', 'Concrete', '03', 7),
('73ec43c6-fcb9-431a-adaf-6ba6bf1038b0', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '03-100', 'Sleek Marble Chair', '03.03-100', 8),
('8d4eb4e2-c4a5-4965-a95d-51f77b716b32', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '03-200', 'Unbranded Rubber Ball', '03.03-200', 9),
('d43d803c-fddc-4681-b6b9-221709f818cb', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '03-300', 'Luxurious Wooden Pants', '03.03-300', 10),
('96811d13-628d-4b6b-9e20-89d3e5a05584', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '03-400', 'Refined Bronze Salad', '03.03-400', 11),
('4da0c035-aaee-4a16-af55-7547f9243cf9', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '03-500', 'Handmade Plastic Salad', '03.03-500', 12),
('a9eb28d6-4122-4955-8e0d-d0a10e60c1ba', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '04-000', 'Masonry', '04', 13),
('7d17922d-000d-4191-89b8-7c567edc1a0b', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '04-100', 'Recycled Metal Chair', '04.04-100', 14),
('4d37abcf-ce77-4b30-bb3f-a509dd1ed897', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '04-200', 'Oriental Bamboo Table', '04.04-200', 15),
('2417039b-18d9-440b-abd3-9a2d7e1d689b', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '04-300', 'Practical Ceramic Cheese', '04.04-300', 16),
('63e6fe6d-f187-4f00-ae82-917b6da24da8', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '05-000', 'Metals', '05', 17),
('b51cc60d-b2a3-48e8-aa1c-a952b68d3266', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '05-100', 'Handmade Wooden Car', '05.05-100', 18),
('87fb0b70-cae1-4773-bc64-331f93bc13b8', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '05-200', 'Sleek Concrete Chips', '05.05-200', 19),
('b9fe5f15-8a23-48c6-b66d-6dfcdffa938e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '05-300', 'Modern Metal Pizza', '05.05-300', 20),
('25167dc0-32a7-4dac-9b81-efce1029f8d7', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '05-400', 'Fantastic Marble Gloves', '05.05-400', 21),
('f76f3bb9-04b4-49a2-8a1b-b4efc7250c89', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '06-000', 'Wood & Plastics', '06', 22),
('7fc8d9b8-9fa5-478a-93a2-d0ae88bec44e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '06-100', 'Tasty Ceramic Bacon', '06.06-100', 23),
('31ddee8c-2d84-4f35-9340-4279315bfb46', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '06-200', 'Gorgeous Gold Soap', '06.06-200', 24),
('aa8dfb2c-7b08-4ab2-b725-a48bd5514958', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '07-000', 'Thermal & Moisture Protection', '07', 25),
('93d28381-a068-430a-a7fc-68751059a84b', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '07-100', 'Tasty Marble Pants', '07.07-100', 26),
('4542222c-5bb7-45bb-a48b-6b5f53760ccd', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '07-200', 'Handmade Metal Chair', '07.07-200', 27),
('04d853a4-381e-4e99-a464-61cea04a84b5', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '07-300', 'Small Wooden Ball', '07.07-300', 28),
('fe013dc5-4e70-4580-92a6-7aadeb3d8b0a', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '07-400', 'Handmade Plastic Hat', '07.07-400', 29),
('1349a38c-9288-456d-af94-9e0f0166105e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '08-000', 'Doors & Windows', '08', 30),
('a85457ac-1092-4333-8014-50d6e7fa9ec4', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '08-100', 'Modern Wooden Hat', '08.08-100', 31),
('e969527d-ad3b-4a36-a27d-f82208afcb0e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '08-200', 'Fantastic Silk Gloves', '08.08-200', 32),
('34a656da-8021-47f3-87bb-0d0835ae9ad9', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '08-300', 'Modern Gold Bike', '08.08-300', 33),
('ad525a5d-85ff-4808-ba45-7e1403c2411b', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '09-000', 'Finishes', '09', 34),
('3fcdcd99-9ac7-4199-8fe3-4a9aa5d624ac', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '09-100', 'Unbranded Gold Shirt', '09.09-100', 35),
('0f3589a8-1c88-447d-a917-749b5a498080', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '09-200', 'Frozen Metal Soap', '09.09-200', 36),
('0bac9b30-b972-4526-8ae0-fa6294a4e3a9', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '09-300', 'Fantastic Wooden Pizza', '09.09-300', 37),
('1006f3c2-64e1-435e-a9a0-1ccbfb1ca938', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '10-000', 'Specialties', '10', 38),
('48bb7b22-eac5-4337-95c5-b0adef824d08', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '10-100', 'Generic Silk Pizza', '10.10-100', 39),
('1c4d3306-8db6-4444-ac1f-601295dc4b73', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '10-200', 'Intelligent Silk Pizza', '10.10-200', 40),
('5c6bb337-ffff-4c03-83c8-e8969b878fb4', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '10-300', 'Intelligent Rubber Shoes', '10.10-300', 41),
('65c538d8-30dc-4d8b-b460-930597095c8e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '10-400', 'Fresh Steel Car', '10.10-400', 42),
('4dadfc2a-391a-4601-9ffc-bb5a3fa3771b', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '10-500', 'Practical Wooden Salad', '10.10-500', 43),
('41c08307-7b4a-496d-9b70-fbd3b6229bcf', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '11-000', 'Equipment', '11', 44),
('44d70152-489d-4756-b24f-7eb69b01c723', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '11-100', 'Intelligent Granite Sausages', '11.11-100', 45),
('ea3bb1a0-7999-484b-8697-d961172fae52', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '11-200', 'Awesome Ceramic Pants', '11.11-200', 46),
('a7d54609-ade8-4ba2-86ec-4d4119e8885b', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '11-300', 'Intelligent Silk Towels', '11.11-300', 47),
('82df180f-e854-4aef-895c-0347d5582d02', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '11-400', 'Incredible Bamboo Hat', '11.11-400', 48),
('060fbf31-f21c-4c4f-b8f3-792520aebe46', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '11-500', 'Sleek Bronze Sausages', '11.11-500', 49),
('bd05dd5a-1800-4583-bfb9-95c6cc98cc72', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '12-000', 'Furnishings', '12', 50),
('7a3421cb-5cb9-48d3-85bf-0f00a6c24fbf', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '12-100', 'Generic Metal Car', '12.12-100', 51),
('d3cd3077-44ce-4baa-aabd-96622d10d7d9', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '12-200', 'Licensed Marble Car', '12.12-200', 52),
('6f4e8c36-966b-4db7-b1b4-54a7a3edc7c8', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '13-000', 'Special Construction', '13', 53),
('4e5a8ff5-1fa8-49d7-9e20-13c11b590c8f', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '13-100', 'Unbranded Metal Chips', '13.13-100', 54),
('c38993a2-20d1-4fbd-a7b8-9383b8bb4a9a', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '13-200', 'Tasty Metal Chair', '13.13-200', 55),
('1903d2a7-2b19-4ddc-860c-f70dc467a801', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '13-300', 'Incredible Bronze Ball', '13.13-300', 56),
('0c5c9b03-5035-4e8c-b2e1-5f35bf11154b', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '14-000', 'Conveying Systems', '14', 57),
('98e75e90-4cc6-4f5d-b519-bf0b9b317b31', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '14-100', 'Handmade Concrete Shirt', '14.14-100', 58),
('4e75bb7c-2af7-4e30-8409-0230773660ac', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '14-200', 'Fantastic Rubber Ball', '14.14-200', 59),
('65a3e66e-3d71-44ea-b49b-979829d30288', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '21-000', 'Fire Suppression', '21', 60),
('473f4fe9-faf7-4c31-955c-52c87abe9cf1', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '21-100', 'Awesome Metal Keyboard', '21.21-100', 61),
('8d6647e9-b215-4321-ad02-3384a1b67d6c', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '21-200', 'Rustic Cotton Mouse', '21.21-200', 62),
('44fb9ab6-72a9-4454-a5b7-d58e7529b2ae', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '22-000', 'Plumbing', '22', 63),
('9b7a4caa-f1a8-4676-a442-5737c98a8746', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '22-100', 'Bespoke Wooden Cheese', '22.22-100', 64),
('ec2bedde-5db0-48bc-a570-ea58b470d78e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '22-200', 'Fresh Silk Chips', '22.22-200', 65),
('a9dd2195-b09f-4c9f-b1f7-f716f45deea3', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '22-300', 'Soft Bamboo Shoes', '22.22-300', 66),
('88db5f4a-233f-4f52-9d80-6bcab3459875', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '22-400', 'Handmade Silk Table', '22.22-400', 67),
('948d2812-72d3-4d5a-babc-1ebf2af41384', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '23-000', 'HVAC', '23', 68),
('001fe4a1-bda0-4388-b325-a4e0750c5c0e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '23-100', 'Modern Metal Salad', '23.23-100', 69),
('a0af8336-9ea1-49b5-956d-342cbb45172b', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '23-200', 'Tasty Plastic Computer', '23.23-200', 70),
('99e19c18-3d69-4c93-ae57-36085af8d77c', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '23-300', 'Ergonomic Granite Gloves', '23.23-300', 71),
('cc5acf66-727b-4572-9e59-ab1623f826ff', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '26-000', 'Electrical', '26', 72),
('2ec0f9a0-ed6a-49d6-9549-320d19dd50e0', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '26-100', 'Handmade Metal Ball', '26.26-100', 73),
('4101052a-236f-4ea9-8c48-a252c1d34760', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '26-200', 'Gorgeous Aluminum Car', '26.26-200', 74),
('2eb3424c-5aaf-469f-bef6-c012b6fbdda1', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '26-300', 'Licensed Rubber Table', '26.26-300', 75);

-- Cost codes for project: Riverside Apartments - Phase 3
INSERT INTO cost_codes (id, project_id, code, description, parent_path, sort_order) VALUES
('d1b5cbe9-f198-489f-a796-ee23e33f0a59', 'e1dba243-0107-4061-a232-ecce67b29b72', '01-000', 'General Requirements', '01', 0),
('3f60b417-d5cb-4b1c-b781-720682f855d5', 'e1dba243-0107-4061-a232-ecce67b29b72', '01-100', 'Generic Concrete Mouse', '01.01-100', 1),
('c0808d64-7e8b-4c43-bbfc-a1abc7053504', 'e1dba243-0107-4061-a232-ecce67b29b72', '01-200', 'Fantastic Rubber Chair', '01.01-200', 2),
('3e2f7951-41cc-43de-8407-d39933a8f11c', 'e1dba243-0107-4061-a232-ecce67b29b72', '02-000', 'Existing Conditions', '02', 3),
('9d872feb-6ac8-4f41-9f73-d21f49e9d293', 'e1dba243-0107-4061-a232-ecce67b29b72', '02-100', 'Refined Bamboo Towels', '02.02-100', 4),
('788da87e-9ba3-4a92-b952-897fe4a28a33', 'e1dba243-0107-4061-a232-ecce67b29b72', '02-200', 'Gorgeous Cotton Pizza', '02.02-200', 5),
('6b670f1c-75cd-4847-a07c-198009ac3cd4', 'e1dba243-0107-4061-a232-ecce67b29b72', '02-300', 'Refined Concrete Pants', '02.02-300', 6),
('2ffcf357-3666-4ffb-8573-7d96c4fe698a', 'e1dba243-0107-4061-a232-ecce67b29b72', '03-000', 'Concrete', '03', 7),
('b2d050aa-1603-4811-9bb6-fa140dfb3f10', 'e1dba243-0107-4061-a232-ecce67b29b72', '03-100', 'Generic Steel Shoes', '03.03-100', 8),
('a0c2030b-2573-4c65-b223-c217acc4c474', 'e1dba243-0107-4061-a232-ecce67b29b72', '03-200', 'Generic Ceramic Keyboard', '03.03-200', 9),
('02684caf-4ab5-4437-92b5-8c92d109fa7c', 'e1dba243-0107-4061-a232-ecce67b29b72', '04-000', 'Masonry', '04', 10),
('3666d3fb-f645-4288-a65c-8d594093ece3', 'e1dba243-0107-4061-a232-ecce67b29b72', '04-100', 'Practical Ceramic Towels', '04.04-100', 11),
('3db26092-1f8e-4f22-895c-b21858256ebd', 'e1dba243-0107-4061-a232-ecce67b29b72', '04-200', 'Luxurious Cotton Ball', '04.04-200', 12),
('51f82e35-36b3-4c40-a875-1b57b8ad5bf2', 'e1dba243-0107-4061-a232-ecce67b29b72', '04-300', 'Elegant Plastic Table', '04.04-300', 13),
('75b44658-4461-46f8-9d6a-ca6c5372be3c', 'e1dba243-0107-4061-a232-ecce67b29b72', '04-400', 'Rustic Concrete Towels', '04.04-400', 14),
('6a882c0a-c68a-4bbf-b186-9c5760a99766', 'e1dba243-0107-4061-a232-ecce67b29b72', '05-000', 'Metals', '05', 15),
('b58c8c99-cef2-45fb-8854-733357f8f7c3', 'e1dba243-0107-4061-a232-ecce67b29b72', '05-100', 'Rustic Gold Soap', '05.05-100', 16),
('167cd980-fdca-4202-bccb-815f270f396c', 'e1dba243-0107-4061-a232-ecce67b29b72', '05-200', 'Frozen Plastic Bacon', '05.05-200', 17),
('304a5b39-461e-4604-bf79-e690849d2b1f', 'e1dba243-0107-4061-a232-ecce67b29b72', '06-000', 'Wood & Plastics', '06', 18),
('914e3d51-ba3a-47af-807f-1e9fe525342b', 'e1dba243-0107-4061-a232-ecce67b29b72', '06-100', 'Soft Wooden Table', '06.06-100', 19),
('97cef093-e182-4359-84b9-dc9265c5e080', 'e1dba243-0107-4061-a232-ecce67b29b72', '06-200', 'Elegant Concrete Fish', '06.06-200', 20),
('50326917-0ea7-4b28-a648-b26f4c439b4a', 'e1dba243-0107-4061-a232-ecce67b29b72', '07-000', 'Thermal & Moisture Protection', '07', 21),
('3b617a63-a624-4510-90b2-2e2bb45fa695', 'e1dba243-0107-4061-a232-ecce67b29b72', '07-100', 'Electronic Ceramic Bacon', '07.07-100', 22),
('44603e30-7839-4808-921f-ef9a62fccaa7', 'e1dba243-0107-4061-a232-ecce67b29b72', '07-200', 'Incredible Cotton Sausages', '07.07-200', 23),
('4a9e396f-58fd-469a-a1d8-5c5bc4aae37e', 'e1dba243-0107-4061-a232-ecce67b29b72', '07-300', 'Bespoke Bamboo Shirt', '07.07-300', 24),
('59bf4b2a-a538-47a3-876b-2f683b651f1d', 'e1dba243-0107-4061-a232-ecce67b29b72', '07-400', 'Gorgeous Metal Towels', '07.07-400', 25),
('779eb9b5-119b-46c7-b402-cef78f320aa4', 'e1dba243-0107-4061-a232-ecce67b29b72', '08-000', 'Doors & Windows', '08', 26),
('273fd08f-1f62-46f8-ada9-ab72f177759d', 'e1dba243-0107-4061-a232-ecce67b29b72', '08-100', 'Refined Silk Computer', '08.08-100', 27),
('87c6d5aa-6dde-413d-b6f2-9ef72573396d', 'e1dba243-0107-4061-a232-ecce67b29b72', '08-200', 'Modern Cotton Bacon', '08.08-200', 28),
('85c658b0-3af9-43f4-9063-dd30b7d3a69f', 'e1dba243-0107-4061-a232-ecce67b29b72', '08-300', 'Soft Steel Fish', '08.08-300', 29),
('abf284f0-b8e9-4711-a043-ae7d42743ed7', 'e1dba243-0107-4061-a232-ecce67b29b72', '09-000', 'Finishes', '09', 30),
('238c91ed-2f5c-4100-bcb8-93e807f94e48', 'e1dba243-0107-4061-a232-ecce67b29b72', '09-100', 'Practical Ceramic Salad', '09.09-100', 31),
('46cc41c6-445c-4820-ab28-62e89a3ae718', 'e1dba243-0107-4061-a232-ecce67b29b72', '09-200', 'Recycled Bronze Keyboard', '09.09-200', 32),
('56d94336-d55f-47e2-a09e-66f255ca1ca7', 'e1dba243-0107-4061-a232-ecce67b29b72', '09-300', 'Generic Granite Keyboard', '09.09-300', 33),
('7848d184-6c19-4235-807f-1609a3cb67b3', 'e1dba243-0107-4061-a232-ecce67b29b72', '09-400', 'Soft Bamboo Computer', '09.09-400', 34),
('3a021c63-d1fe-431e-b965-138b34eaffee', 'e1dba243-0107-4061-a232-ecce67b29b72', '10-000', 'Specialties', '10', 35),
('c58bbe46-4a68-4a38-bdfb-36071980e1e7', 'e1dba243-0107-4061-a232-ecce67b29b72', '10-100', 'Refined Marble Pizza', '10.10-100', 36),
('cba3107f-74e1-46db-8cc1-c95a4819d404', 'e1dba243-0107-4061-a232-ecce67b29b72', '10-200', 'Incredible Ceramic Fish', '10.10-200', 37),
('be9e8712-96c1-47c4-9c6a-c957af656c1c', 'e1dba243-0107-4061-a232-ecce67b29b72', '11-000', 'Equipment', '11', 38),
('e2dacc1f-38c7-44e4-9784-e8ec5bb2b039', 'e1dba243-0107-4061-a232-ecce67b29b72', '11-100', 'Generic Silk Chips', '11.11-100', 39),
('8db202c5-9bb3-408d-be65-d5a975b68f46', 'e1dba243-0107-4061-a232-ecce67b29b72', '11-200', 'Tasty Wooden Salad', '11.11-200', 40),
('37641d7f-a31d-449f-9610-fb4aefbcc72e', 'e1dba243-0107-4061-a232-ecce67b29b72', '11-300', 'Small Steel Towels', '11.11-300', 41),
('fff6343f-c130-4f40-94d7-51e68a5a00e9', 'e1dba243-0107-4061-a232-ecce67b29b72', '11-400', 'Bespoke Aluminum Shirt', '11.11-400', 42),
('d8a1df61-870d-4067-87ea-67e521aabe81', 'e1dba243-0107-4061-a232-ecce67b29b72', '12-000', 'Furnishings', '12', 43),
('4778124c-f5e5-41b5-8104-68f98ad46654', 'e1dba243-0107-4061-a232-ecce67b29b72', '12-100', 'Intelligent Silk Hat', '12.12-100', 44),
('bcf92a08-00ed-47b6-bf72-cd75fc64dd57', 'e1dba243-0107-4061-a232-ecce67b29b72', '12-200', 'Soft Concrete Mouse', '12.12-200', 45),
('301d2285-8d99-4867-9872-7548df975314', 'e1dba243-0107-4061-a232-ecce67b29b72', '12-300', 'Handmade Marble Shoes', '12.12-300', 46),
('d2a1ed01-e9f6-4c36-b1e7-29f8f5b06a0e', 'e1dba243-0107-4061-a232-ecce67b29b72', '12-400', 'Generic Cotton Mouse', '12.12-400', 47),
('5b8923e9-fd70-4bb9-aaa0-bda573b4518e', 'e1dba243-0107-4061-a232-ecce67b29b72', '13-000', 'Special Construction', '13', 48),
('ac97ef69-b411-4834-8535-2c0474718710', 'e1dba243-0107-4061-a232-ecce67b29b72', '13-100', 'Handmade Bamboo Ball', '13.13-100', 49),
('daa0b172-bd62-4e65-b290-ed8d880c68e1', 'e1dba243-0107-4061-a232-ecce67b29b72', '13-200', 'Recycled Bamboo Shirt', '13.13-200', 50),
('e931c43a-8bb2-4f45-bc6d-1a64eeb21ab2', 'e1dba243-0107-4061-a232-ecce67b29b72', '14-000', 'Conveying Systems', '14', 51),
('8a8fd04d-5ebb-43c9-82e0-2f6e99b64a2f', 'e1dba243-0107-4061-a232-ecce67b29b72', '14-100', 'Ergonomic Cotton Chair', '14.14-100', 52),
('13debb06-a196-4e87-92db-86a03bc10bde', 'e1dba243-0107-4061-a232-ecce67b29b72', '14-200', 'Bespoke Ceramic Cheese', '14.14-200', 53),
('cbcce632-4942-4d31-869b-102e6b246d8e', 'e1dba243-0107-4061-a232-ecce67b29b72', '14-300', 'Licensed Gold Chair', '14.14-300', 54),
('d30dc63a-103c-49b2-b3cf-d5057fc0d885', 'e1dba243-0107-4061-a232-ecce67b29b72', '14-400', 'Awesome Bronze Bacon', '14.14-400', 55),
('58a3d096-0e85-4d46-9821-73704ebeb170', 'e1dba243-0107-4061-a232-ecce67b29b72', '14-500', 'Handcrafted Marble Mouse', '14.14-500', 56),
('20ea5d89-87c4-4829-8aea-5bce4b3007b9', 'e1dba243-0107-4061-a232-ecce67b29b72', '21-000', 'Fire Suppression', '21', 57),
('539ecd3f-983e-4199-99b8-6fb2a6ec4514', 'e1dba243-0107-4061-a232-ecce67b29b72', '21-100', 'Incredible Ceramic Table', '21.21-100', 58),
('01a77bfe-6a58-4bb5-97d6-b8dda7144d37', 'e1dba243-0107-4061-a232-ecce67b29b72', '21-200', 'Unbranded Bamboo Hat', '21.21-200', 59),
('e18d0431-909e-4428-8864-cdb5995dec65', 'e1dba243-0107-4061-a232-ecce67b29b72', '21-300', 'Elegant Steel Hat', '21.21-300', 60),
('d07e4188-6d3c-4ef7-ada3-9cc6edb2a0b5', 'e1dba243-0107-4061-a232-ecce67b29b72', '22-000', 'Plumbing', '22', 61),
('565ff72a-9828-48b2-acb7-28c82aa991b8', 'e1dba243-0107-4061-a232-ecce67b29b72', '22-100', 'Awesome Metal Bacon', '22.22-100', 62),
('50c65d31-f080-4302-aa65-cdb22946d7dc', 'e1dba243-0107-4061-a232-ecce67b29b72', '22-200', 'Electronic Rubber Soap', '22.22-200', 63),
('29a08a4e-79f5-47bc-9c17-e9fd6edd8283', 'e1dba243-0107-4061-a232-ecce67b29b72', '22-300', 'Luxurious Marble Pizza', '22.22-300', 64),
('2b267dd9-13c9-4ccd-9906-59cfb70d505d', 'e1dba243-0107-4061-a232-ecce67b29b72', '23-000', 'HVAC', '23', 65),
('c0516fde-8ed2-4173-95f2-b13d54de2a13', 'e1dba243-0107-4061-a232-ecce67b29b72', '23-100', 'Luxurious Rubber Computer', '23.23-100', 66),
('6130adf3-8417-40d8-aba7-711388c6a9c9', 'e1dba243-0107-4061-a232-ecce67b29b72', '23-200', 'Incredible Plastic Bacon', '23.23-200', 67),
('a76ecbec-0aa4-47c2-8347-a2ebceb6a71b', 'e1dba243-0107-4061-a232-ecce67b29b72', '26-000', 'Electrical', '26', 68),
('54f9b68f-fe99-4ec4-894d-f1fe43001ea1', 'e1dba243-0107-4061-a232-ecce67b29b72', '26-100', 'Luxurious Cotton Bike', '26.26-100', 69),
('d68615bd-10e7-4e2c-a22d-34bfc41e15a2', 'e1dba243-0107-4061-a232-ecce67b29b72', '26-200', 'Handcrafted Silk Salad', '26.26-200', 70),
('7aaeb25a-3b5c-45a0-aa42-082fff3a8e28', 'e1dba243-0107-4061-a232-ecce67b29b72', '26-300', 'Bespoke Rubber Ball', '26.26-300', 71);

-- Budgets
INSERT INTO budgets (id, project_id, name, revision_number, is_active) VALUES
('9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '2fcddb24-554b-4588-b252-f78f6956bb52', 'Original Budget', 0, true),
('acfe723f-f3ec-4dbb-9211-22148c56406d', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'Original Budget', 0, true),
('b164df6d-9a15-40fb-ab4d-750434ecfa73', 'e1dba243-0107-4061-a232-ecce67b29b72', 'Original Budget', 0, true);

-- Budget Line Items

-- Budget items for project ID: 2fcddb24-554b-4588-b252-f78f6956bb52
INSERT INTO budget_line_items (id, budget_id, cost_code_id, original_budget, notes) VALUES
('ffb7c482-0ec2-4d58-8956-b8031e192634', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '7556f214-47f7-45dc-bb70-ca44b00466e6', 283152.50, 'Initial budget allocation'),
('78b43809-d68c-4537-9e0d-e3a0a99a06f5', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'ec492efd-4826-4ae1-9a0b-eff3eef549bd', 496977.00, 'Initial budget allocation'),
('1f40e685-d0fa-42ea-aea4-bc72041dfa68', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'f1e0a844-5da9-4566-874e-e1af1530cc57', 405303.02, 'Initial budget allocation'),
('718272c7-98d9-426e-9ac1-24fc11b05ab4', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'ceb16b5c-09a0-4a57-9b04-148d7090b955', 107808.39, 'Initial budget allocation'),
('922d8cfd-fe7c-42b5-b813-44c865fc4a55', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'fe5ae600-4900-4394-957b-c2c4b2442edd', 162722.60, 'Initial budget allocation'),
('b0f7f1c7-6109-4af2-ba4f-b3f95ee7362a', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'cde2b9d0-a248-4e0b-aa2d-d39e62606f97', 326497.11, 'Initial budget allocation'),
('31391e9f-e5a5-4c6e-9ca5-feee98078d63', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '44b6f6a6-2b82-4608-887c-acc36116a37e', 309981.51, 'Initial budget allocation'),
('9acf05c9-4239-40cd-b520-b13cbc49e5f8', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '2a118084-5181-448a-ac15-e594d33fe464', 332408.75, 'Initial budget allocation'),
('84a29721-9abb-4290-87fa-9cd7369f491b', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '99b01659-247c-4fb7-8303-dfbffa954954', 360528.99, 'Initial budget allocation'),
('6c1a0deb-be1d-4359-9a4e-0973768bde1d', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '0f181c55-3340-4555-84fe-f2e81dc9fcdc', 382847.62, 'Initial budget allocation'),
('aedd3bbc-aa0b-42c0-8bfb-16d89644b507', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '99998d24-7d15-40a9-bb2b-116fe5c7ef51', 295936.19, 'Initial budget allocation'),
('4547c227-1603-49e2-be44-efa4c1c50bb3', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '53729acc-02e2-48ef-9a6f-fb098c6023ac', 28202.08, 'Initial budget allocation'),
('b79b0641-330d-4210-b070-5f1879d4aa78', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'd15781d2-76df-4b46-9fa5-7c45eed54274', 134334.80, 'Initial budget allocation'),
('e13b7bb4-fd27-488f-919b-284e08962d1f', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '42b181bf-8138-4857-8c45-0cd4d2901bf8', 494992.76, 'Initial budget allocation'),
('78e737a9-f179-4ce4-ac81-195ffbde1686', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'e68db3e0-c28c-4773-b981-8b6a477ab33c', 296955.02, 'Initial budget allocation'),
('c9de8617-8c3a-4757-aad3-ca0d045afd9b', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '0de94b8a-009f-41ed-b76f-60bc9797d5e8', 27234.97, 'Initial budget allocation'),
('d41faf17-6d83-4791-99b9-94ec97bed589', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'f8584e8f-fe63-47d3-a9a3-25a0698eddad', 470950.70, 'Initial budget allocation'),
('775b2ce7-8f68-4987-b7a6-e71f95388602', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '408c0004-ea7c-4a13-adfb-85347d149039', 201303.43, 'Initial budget allocation'),
('ba663fa9-9e93-49ab-b0fd-23280b03e6c3', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'a7ae9d27-9de1-40dc-b0e2-c5998ffb2ca5', 496398.74, 'Initial budget allocation'),
('e9e473bf-9e20-41f1-853a-ee7bccba5658', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '343f4448-3cb1-4645-a3c2-d508ceed86d2', 65201.36, 'Initial budget allocation'),
('166da06d-8a44-48f3-817d-3729d08c851d', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '22396629-6999-4ead-b917-3e3e970e209f', 153487.82, 'Initial budget allocation'),
('245e7d82-4f22-4eff-9ee5-00c0f2de81b2', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '22da16bb-215f-4d48-84da-15f77227b21f', 93611.95, 'Initial budget allocation'),
('3da28eb4-d371-4ac3-9567-dce0fa861907', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '46c25ee2-0195-4e54-a7f4-8308159dd735', 286336.50, 'Initial budget allocation'),
('a48e512c-38c6-48f7-bf32-14d41df0c99e', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '64c00228-d910-4149-8f20-db029510be7c', 229768.72, 'Initial budget allocation'),
('ac1a7732-0d0e-41f9-a919-92231e115fe7', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'b744cd5f-c631-4085-8142-5b291a233a44', 333749.51, 'Initial budget allocation'),
('d368df6b-044b-45fb-9cc6-d1082a05519c', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '938134cf-6a98-4d36-bd22-ee336368e1a6', 171286.70, 'Initial budget allocation'),
('0e68e3cb-923a-4491-aed1-9071d2f239da', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '20068f38-e4de-42ae-8b8c-1ee3378b959a', 105945.84, 'Initial budget allocation'),
('8b7a962e-f202-4153-9715-02869a2326c9', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'fc113415-d404-4725-acdc-5b612d22e6fa', 498383.32, 'Initial budget allocation'),
('3eb10a77-837f-4c77-ac14-9b771c07a4d6', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '3731fff3-c686-4576-b04a-49835d855262', 489316.78, 'Initial budget allocation'),
('7044085b-4d7a-48d6-b67d-2cf28db1f49c', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'bc3c93bb-ad9e-4b44-b7f1-4ae69ce5ac71', 321615.17, 'Initial budget allocation'),
('b71bf403-9079-4af4-8cfa-db6e1fb59000', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'd594116f-3ded-445d-92b5-88391d570416', 136750.80, 'Initial budget allocation'),
('57a548bc-8728-481c-b57b-2a75b4630c29', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '1270770b-ac22-4df1-9a05-101adeff6c31', 444078.59, 'Initial budget allocation'),
('c932bd94-edd9-41c4-9fa1-135f1e167198', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '14c83d84-23dc-4350-ac18-7ef052e01f5e', 371507.53, 'Initial budget allocation'),
('f521a93b-cf02-432a-b4ca-5a3f543fd75f', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', 'a51efd55-e4ff-432e-90c7-cd573a65333a', 49069.81, 'Initial budget allocation'),
('33f9134c-9cea-4297-a7fa-5d3213ae65e4', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '8580aa93-fbcd-4900-9907-cc1e6db9cfbe', 305038.40, 'Initial budget allocation'),
('511406f9-41b4-4e1c-b592-532bf5ce82d6', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '6965a331-93fa-4742-8b79-91a0aac4c1c6', 400844.32, 'Initial budget allocation'),
('efc7a4fc-95de-4aa2-9b6a-1769432575dc', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '4b4c1658-6f26-408f-839f-e66dc57de5c8', 128065.20, 'Initial budget allocation'),
('e597f70c-f9c0-464a-929a-3fc6b675adeb', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '3a40dafa-88e7-411c-ade2-56b6846bb52e', 497034.07, 'Initial budget allocation'),
('01ad3b97-8863-4afb-a907-da1c5670f73e', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '80d1108a-84c7-44b7-a1e6-ad1f9f3cf2f7', 13166.42, 'Initial budget allocation'),
('b1b51d59-9cb5-4559-bfe4-1633faefa61d', '9a9efd4e-2c22-491f-8ab5-9c837b100d8e', '27db8e8d-89fa-484a-894c-f2f0d4e1ca89', 202402.79, 'Initial budget allocation');

-- Budget items for project ID: a7c61ec9-0c62-42c9-9a16-db53cd3bc57f
INSERT INTO budget_line_items (id, budget_id, cost_code_id, original_budget, notes) VALUES
('321d7fd1-4627-4867-8cff-1c79d7fe8144', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '340d2f03-26bc-498f-a1cb-1ae791d61ae4', 192585.95, 'Initial budget allocation'),
('c430ed34-7088-4fba-a467-bce376c2fd1c', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '9b7a4caa-f1a8-4676-a442-5737c98a8746', 406507.80, 'Initial budget allocation'),
('b8ca9515-557f-4bdf-a532-c0fca37b1fab', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'e969527d-ad3b-4a36-a27d-f82208afcb0e', 367334.60, 'Initial budget allocation'),
('44849ac7-c12b-4991-af1d-f5a1218721db', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'd3cd3077-44ce-4baa-aabd-96622d10d7d9', 33328.66, 'Initial budget allocation'),
('c18f0609-c3bb-4f94-987b-40308a6d1ef4', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '4e75bb7c-2af7-4e30-8409-0230773660ac', 447928.68, 'Initial budget allocation'),
('679b7752-f50c-4717-b174-9ed985182062', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '001fe4a1-bda0-4388-b325-a4e0750c5c0e', 480469.22, 'Initial budget allocation'),
('60f89f45-7f65-488b-8cd2-203b9810917e', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '82df180f-e854-4aef-895c-0347d5582d02', 380456.67, 'Initial budget allocation'),
('6e2e416e-9f6b-459d-9116-f96ef189fe15', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'b9fe5f15-8a23-48c6-b66d-6dfcdffa938e', 145890.60, 'Initial budget allocation'),
('b6072e4b-ee7d-4e45-961a-5c63ee23918a', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '88db5f4a-233f-4f52-9d80-6bcab3459875', 283032.36, 'Initial budget allocation'),
('026ecd6d-61f0-4a04-9cfa-b65bea711b11', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '4da0c035-aaee-4a16-af55-7547f9243cf9', 109753.55, 'Initial budget allocation'),
('546bd5d7-7c9e-4cbf-8a3d-cb909b99e038', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '2ec0f9a0-ed6a-49d6-9549-320d19dd50e0', 67052.57, 'Initial budget allocation'),
('ae29b93c-0836-4e49-b59c-70cff62369d2', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '4542222c-5bb7-45bb-a48b-6b5f53760ccd', 465097.00, 'Initial budget allocation'),
('341660b7-cba6-473e-8a92-7f8d0fdadd2b', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '4d37abcf-ce77-4b30-bb3f-a509dd1ed897', 260254.43, 'Initial budget allocation'),
('2bbbd1bd-708d-450d-b490-6b920f8f7bc1', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'a9dd2195-b09f-4c9f-b1f7-f716f45deea3', 226995.38, 'Initial budget allocation'),
('7475eec3-9b91-44c6-946d-d3b76f35e5b8', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'b51cc60d-b2a3-48e8-aa1c-a952b68d3266', 255807.67, 'Initial budget allocation'),
('7205a289-9b84-45d5-8356-53d381f4ddcc', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '48bb7b22-eac5-4337-95c5-b0adef824d08', 330900.64, 'Initial budget allocation'),
('2c45c9a0-5c0e-486f-a092-b96bc25fe208', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '0f3589a8-1c88-447d-a917-749b5a498080', 340595.15, 'Initial budget allocation'),
('74c88ea9-2ce5-4c9a-a1cc-036413746eaf', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '4dadfc2a-391a-4601-9ffc-bb5a3fa3771b', 288329.38, 'Initial budget allocation'),
('b4c2b0e9-5555-47df-ac1a-6a0d11bf2c7c', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '6db3440f-b9ec-46f3-b95e-fcb42748f00f', 423113.86, 'Initial budget allocation'),
('1e6b1e57-763a-4c93-9959-c6a61585ffd5', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '98e75e90-4cc6-4f5d-b519-bf0b9b317b31', 231703.09, 'Initial budget allocation'),
('c5266e33-8178-418a-b404-51af7b9a286f', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '3fcdcd99-9ac7-4199-8fe3-4a9aa5d624ac', 233712.24, 'Initial budget allocation'),
('8e752d93-f9d0-439b-b089-72e95b33b161', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'bfbb9259-f01a-4008-8fad-447d516ee4c6', 77188.92, 'Initial budget allocation'),
('e4149e74-3058-4f4c-814d-30834400704b', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '93d28381-a068-430a-a7fc-68751059a84b', 289636.55, 'Initial budget allocation'),
('24b9f85b-2c12-4bcb-a6bb-7f33f50229c0', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '1903d2a7-2b19-4ddc-860c-f70dc467a801', 393306.94, 'Initial budget allocation'),
('4f5a1602-90f9-4a90-9707-a82a36a57a7f', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '44d70152-489d-4756-b24f-7eb69b01c723', 289313.37, 'Initial budget allocation'),
('2241f899-887c-40de-942a-63ceb461d09e', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '7d17922d-000d-4191-89b8-7c567edc1a0b', 163154.82, 'Initial budget allocation'),
('534d8a18-5615-4827-bb22-520eac041634', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'ea3bb1a0-7999-484b-8697-d961172fae52', 218660.35, 'Initial budget allocation'),
('df721a64-5777-4776-a514-4af82c863c6c', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'd43d803c-fddc-4681-b6b9-221709f818cb', 107019.22, 'Initial budget allocation'),
('958b055d-8f84-4b79-b255-25f8e914bfbf', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '87fb0b70-cae1-4773-bc64-331f93bc13b8', 171852.58, 'Initial budget allocation'),
('8cef63a7-5110-41e6-82b4-a790712b230d', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '31ddee8c-2d84-4f35-9340-4279315bfb46', 72501.62, 'Initial budget allocation'),
('3cfbf3fb-5cfc-43e3-ab1c-8b97263f8db4', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '0bac9b30-b972-4526-8ae0-fa6294a4e3a9', 423474.45, 'Initial budget allocation'),
('319ab5a7-4cd3-4d8b-9bef-f1725403b8a9', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '4101052a-236f-4ea9-8c48-a252c1d34760', 445166.52, 'Initial budget allocation'),
('bd344643-07e0-4bfd-964f-01960e091d88', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '4e5a8ff5-1fa8-49d7-9e20-13c11b590c8f', 19836.90, 'Initial budget allocation'),
('3977d5af-3097-43b5-9908-ae5ef420d145', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'c38993a2-20d1-4fbd-a7b8-9383b8bb4a9a', 331603.69, 'Initial budget allocation'),
('23f3424e-49c6-41d9-8d8f-6c9f6a652f58', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'afb16aa7-03cf-438a-94d7-d9b5206ee6c9', 460581.32, 'Initial budget allocation'),
('ad9b6724-c764-4622-98ef-f04d13884379', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'a7d54609-ade8-4ba2-86ec-4d4119e8885b', 469390.49, 'Initial budget allocation'),
('300076f2-3ae2-4bb5-9556-fb7ab8811d7e', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '96811d13-628d-4b6b-9e20-89d3e5a05584', 266697.11, 'Initial budget allocation'),
('69833bdd-7fab-4109-9b5f-2b53f6df6874', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '22ecddb9-c60c-47c9-9d3f-f612f7ab25f0', 121173.31, 'Initial budget allocation'),
('76116c45-f489-449d-b861-a5a67cb5cd7e', 'acfe723f-f3ec-4dbb-9211-22148c56406d', '73ec43c6-fcb9-431a-adaf-6ba6bf1038b0', 125243.67, 'Initial budget allocation'),
('b1cb31b2-a306-470b-b54d-c84a0ead057f', 'acfe723f-f3ec-4dbb-9211-22148c56406d', 'fe013dc5-4e70-4580-92a6-7aadeb3d8b0a', 394685.97, 'Initial budget allocation');

-- Budget items for project ID: e1dba243-0107-4061-a232-ecce67b29b72
INSERT INTO budget_line_items (id, budget_id, cost_code_id, original_budget, notes) VALUES
('5b4fb971-3a94-4291-9a95-a3dc1d40b086', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '13debb06-a196-4e87-92db-86a03bc10bde', 203572.42, 'Initial budget allocation'),
('632bf77f-d467-450a-842d-1dc26c429eb4', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '565ff72a-9828-48b2-acb7-28c82aa991b8', 225715.33, 'Initial budget allocation'),
('8fa5fb3b-9c36-4507-8b2b-179a949db04b', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', 'fff6343f-c130-4f40-94d7-51e68a5a00e9', 77310.11, 'Initial budget allocation'),
('2b6ce19b-c645-48bc-bbe7-0beed07517ce', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '273fd08f-1f62-46f8-ada9-ab72f177759d', 329975.72, 'Initial budget allocation'),
('87800ebc-25f6-45b8-9a31-88aa1f916146', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', 'e2dacc1f-38c7-44e4-9784-e8ec5bb2b039', 473037.28, 'Initial budget allocation'),
('0940fdbd-a19a-4cee-ab5c-7de84efb5197', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '914e3d51-ba3a-47af-807f-1e9fe525342b', 365414.39, 'Initial budget allocation'),
('8321a875-67fb-4e33-900a-3302e23e5a96', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '50c65d31-f080-4302-aa65-cdb22946d7dc', 156861.13, 'Initial budget allocation'),
('02ccf47b-6fc8-4efb-9ddc-6f823699e869', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '3666d3fb-f645-4288-a65c-8d594093ece3', 214394.34, 'Initial budget allocation'),
('e5f85568-c639-4e84-a1cc-132961dd56cf', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', 'c0808d64-7e8b-4c43-bbfc-a1abc7053504', 302682.82, 'Initial budget allocation'),
('8971722f-3c0d-40de-9a97-328eea7935b2', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', 'e18d0431-909e-4428-8864-cdb5995dec65', 83692.53, 'Initial budget allocation'),
('48fe06c0-1422-434c-900b-917d289d7a9d', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '539ecd3f-983e-4199-99b8-6fb2a6ec4514', 62780.88, 'Initial budget allocation'),
('39f4f0fb-3d89-4bfd-aede-2a9dbf13c9b3', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '59bf4b2a-a538-47a3-876b-2f683b651f1d', 226955.15, 'Initial budget allocation'),
('05c7547d-fddc-4ce9-9a9d-2a6251696f50', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '238c91ed-2f5c-4100-bcb8-93e807f94e48', 105451.42, 'Initial budget allocation'),
('983fa78a-258f-4e30-ba44-d96817826d3d', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', 'a0c2030b-2573-4c65-b223-c217acc4c474', 395255.74, 'Initial budget allocation'),
('4914c1e4-1c40-4340-b4d8-0b02dbb5ba6c', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '301d2285-8d99-4867-9872-7548df975314', 479474.85, 'Initial budget allocation'),
('1a25474e-1f9a-4da8-9fb8-989515a14ae8', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '167cd980-fdca-4202-bccb-815f270f396c', 342019.80, 'Initial budget allocation'),
('68d9883e-ad42-46dd-9ab0-b1d6e6be3eff', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '7aaeb25a-3b5c-45a0-aa42-082fff3a8e28', 31805.92, 'Initial budget allocation'),
('e089114b-c5a0-45a5-a701-0108a15c9fbe', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '44603e30-7839-4808-921f-ef9a62fccaa7', 407096.24, 'Initial budget allocation'),
('2cb62431-32c7-40e0-bf2c-dd26bacb4fe0', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', 'c0516fde-8ed2-4173-95f2-b13d54de2a13', 381773.94, 'Initial budget allocation'),
('24965e66-b2ef-4c56-b1f5-06d4ec96042a', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', 'b58c8c99-cef2-45fb-8854-733357f8f7c3', 133214.71, 'Initial budget allocation'),
('3aae808b-d6de-4bbe-8b3d-cd570f87baae', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '75b44658-4461-46f8-9d6a-ca6c5372be3c', 428580.92, 'Initial budget allocation'),
('43e56121-57de-4176-8b58-6b2f003f0b02', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '01a77bfe-6a58-4bb5-97d6-b8dda7144d37', 55941.78, 'Initial budget allocation'),
('341fb4f3-dbf5-4a28-af35-8d141eb2aa39', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '9d872feb-6ac8-4f41-9f73-d21f49e9d293', 67587.54, 'Initial budget allocation'),
('d45ce941-abb8-46d8-b227-7a892b1db7be', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '37641d7f-a31d-449f-9610-fb4aefbcc72e', 401053.91, 'Initial budget allocation'),
('01598b9c-9b36-43de-abc0-d4c81773b508', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '46cc41c6-445c-4820-ab28-62e89a3ae718', 57678.59, 'Initial budget allocation'),
('02cc8970-0dfd-4a81-8bd4-fb4ee99c5e4e', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '3db26092-1f8e-4f22-895c-b21858256ebd', 106859.44, 'Initial budget allocation'),
('f8d4c821-71da-4f0f-bbc4-6957c66960a5', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', 'cbcce632-4942-4d31-869b-102e6b246d8e', 394768.47, 'Initial budget allocation'),
('64c80968-0be4-45e7-b5ad-109f19c61bb1', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '51f82e35-36b3-4c40-a875-1b57b8ad5bf2', 315576.23, 'Initial budget allocation'),
('e157b6bb-43f8-436c-93ca-7db21bd75067', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '29a08a4e-79f5-47bc-9c17-e9fd6edd8283', 178352.67, 'Initial budget allocation'),
('47f7c1e1-f807-4395-b881-a74da1feab36', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', 'd68615bd-10e7-4e2c-a22d-34bfc41e15a2', 489248.07, 'Initial budget allocation'),
('18d7eddd-59c3-4572-b8b3-a3c163082b69', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '58a3d096-0e85-4d46-9821-73704ebeb170', 255491.77, 'Initial budget allocation'),
('ff46af10-4974-4050-b12a-a2a48c55f282', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', 'd2a1ed01-e9f6-4c36-b1e7-29f8f5b06a0e', 184365.16, 'Initial budget allocation'),
('436b6c96-b411-4535-8ec5-23a4a7da2ae5', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '3b617a63-a624-4510-90b2-2e2bb45fa695', 70030.67, 'Initial budget allocation'),
('f3cca4da-be3d-4107-b6b2-4098ae5b0366', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '3f60b417-d5cb-4b1c-b781-720682f855d5', 370866.50, 'Initial budget allocation'),
('9da5f0c0-715b-4919-a0c4-b4ea6972e3cd', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', 'b2d050aa-1603-4811-9bb6-fa140dfb3f10', 363995.22, 'Initial budget allocation'),
('f453e13e-b521-468c-ac44-4722490c5f79', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '6b670f1c-75cd-4847-a07c-198009ac3cd4', 416146.05, 'Initial budget allocation'),
('0c4da723-6712-4401-9b36-dade24643bc7', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '4a9e396f-58fd-469a-a1d8-5c5bc4aae37e', 362149.04, 'Initial budget allocation'),
('c3c136d1-8a98-4178-995f-c0ba5d23a77f', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '56d94336-d55f-47e2-a09e-66f255ca1ca7', 332820.11, 'Initial budget allocation'),
('6f8d1c01-7473-43f1-88c8-dcd418ad9adc', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '8db202c5-9bb3-408d-be65-d5a975b68f46', 116723.04, 'Initial budget allocation'),
('3b4a83b9-b023-4c82-bff1-4ffe14e7097a', 'b164df6d-9a15-40fb-ab4d-750434ecfa73', '6130adf3-8417-40d8-aba7-711388c6a9c9', 416728.26, 'Initial budget allocation');

-- Prime Contracts

-- Prime contract for Riverside Apartments - Phase 1
INSERT INTO prime_contracts (id, project_id, number, title, owner_id, architect_id, contract_date, status, original_amount) VALUES
('8875df4f-af7e-433e-bca0-7752fd5b3a80', '2fcddb24-554b-4588-b252-f78f6956bb52', 'PC-2025-100', 'Prime Contract - Riverside Apartments - Phase 1', '79f41b63-1011-46ce-9403-0c8715e8b070', '9c51710e-0dc1-4bb3-821d-645a43196edd', '2025-07-18', 'executed', 19452090.13);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('f938ace4-7797-4eae-a046-282634b5e176', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', 'fdd9ee54-a8ca-4dc5-8d0a-fc6ca7a0d2a0', 1, 'General Requirements', 1945209.01),
('521c5118-ed94-4bcb-8e11-e7501125f6a7', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', '6126d43d-e768-4720-9dc7-84beab368ba3', 2, 'Existing Conditions', 1945209.01),
('6749d9df-987e-4973-b5c4-b43035aa3c99', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', 'fc2da6f7-698b-4260-8e32-400c2f877c46', 3, 'Concrete', 1945209.01),
('d64eb574-d44a-4090-8802-e63ff19e7298', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', '719214df-368e-403a-8fb2-c57b52f9ed38', 4, 'Masonry', 1945209.01),
('018deb52-aa65-4764-8f77-1b3986104906', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', '01b7fac6-6a66-445d-86ef-4df6447438a0', 5, 'Metals', 1945209.01),
('e0b9f189-9fa2-46fa-bcf2-eb929b505378', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', '2e202d0a-7e9f-49ee-b9a9-1b606a0bdc9e', 6, 'Wood & Plastics', 1945209.01),
('a122f640-21f4-44fa-8165-94dbed45163c', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', 'af59e5cc-3d80-4261-9c4c-469cf3f17952', 7, 'Thermal & Moisture Protection', 1945209.01),
('482c94f0-afcc-43e4-85f1-ce381ec587fa', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', '0966b71a-b44f-4e30-98ae-9051cfe4a203', 8, 'Doors & Windows', 1945209.01),
('f4757ef3-993c-4e60-81ae-bd42c1d12ab2', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', 'b2aaec27-3f5b-4012-8f4b-a1eeec5490d2', 9, 'Finishes', 1945209.01),
('b6fb69d3-7a9d-4cb5-8369-b77e4b9c1707', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', '90c501a1-47b6-4104-ac28-a13c0aadd2b7', 10, 'Specialties', 1945209.01);

-- Prime contract for Tech Campus Expansion - Phase 2
INSERT INTO prime_contracts (id, project_id, number, title, owner_id, architect_id, contract_date, status, original_amount) VALUES
('af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'PC-2025-101', 'Prime Contract - Tech Campus Expansion - Phase 2', '79f41b63-1011-46ce-9403-0c8715e8b070', '9c51710e-0dc1-4bb3-821d-645a43196edd', '2025-07-19', 'executed', 26465177.72);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('5da6c0d2-b02f-4dc3-8586-77499f173b29', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', '64840d1a-1f33-42d9-b332-22791be1bd1b', 1, 'General Requirements', 2646517.77),
('e43a03ae-10d7-43ec-9f18-b894d48f3246', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', '8c417f67-1f88-4e05-b0ef-a6be8906b7af', 2, 'Existing Conditions', 2646517.77),
('0cebd9c8-1eb5-456c-9d84-80e1739702cd', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', '37e8dd86-b9a1-47c4-b0c5-28f34db21202', 3, 'Concrete', 2646517.77),
('83e1cfdc-d474-4190-b6d7-5ed7351c53e8', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', 'a9eb28d6-4122-4955-8e0d-d0a10e60c1ba', 4, 'Masonry', 2646517.77),
('bbfe5e9c-c2f1-457c-af20-e6b07ddfe82e', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', '63e6fe6d-f187-4f00-ae82-917b6da24da8', 5, 'Metals', 2646517.77),
('920e762c-30a6-48b1-9b50-0f7ac40ebb86', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', 'f76f3bb9-04b4-49a2-8a1b-b4efc7250c89', 6, 'Wood & Plastics', 2646517.77),
('f0393eb9-e23f-492a-bf85-2e44854547d7', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', 'aa8dfb2c-7b08-4ab2-b725-a48bd5514958', 7, 'Thermal & Moisture Protection', 2646517.77),
('528c7b17-b264-461c-a966-00653c17c664', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', '1349a38c-9288-456d-af94-9e0f0166105e', 8, 'Doors & Windows', 2646517.77),
('429c77c7-1cea-4eee-b220-f60b7e9a36d7', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', 'ad525a5d-85ff-4808-ba45-7e1403c2411b', 9, 'Finishes', 2646517.77),
('96aa8ac5-62f5-4890-ba56-7e478dc98fc2', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', '1006f3c2-64e1-435e-a9a0-1ccbfb1ca938', 10, 'Specialties', 2646517.77);

-- Prime contract for Riverside Apartments - Phase 3
INSERT INTO prime_contracts (id, project_id, number, title, owner_id, architect_id, contract_date, status, original_amount) VALUES
('f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'e1dba243-0107-4061-a232-ecce67b29b72', 'PC-2025-102', 'Prime Contract - Riverside Apartments - Phase 3', '79f41b63-1011-46ce-9403-0c8715e8b070', '9c51710e-0dc1-4bb3-821d-645a43196edd', '2025-06-20', 'executed', 45309129.06);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('4e0b2047-17b4-4d13-b324-747a20a22d0a', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', 'd1b5cbe9-f198-489f-a796-ee23e33f0a59', 1, 'General Requirements', 4530912.91),
('bbe442af-2f4a-4da6-929e-e45423b5f395', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', '3e2f7951-41cc-43de-8407-d39933a8f11c', 2, 'Existing Conditions', 4530912.91),
('de409661-bcd6-4ff5-adeb-9c2fa40230cf', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', '2ffcf357-3666-4ffb-8573-7d96c4fe698a', 3, 'Concrete', 4530912.91),
('561f5f86-f94f-4c6a-82f9-e6be26b3ae58', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', '02684caf-4ab5-4437-92b5-8c92d109fa7c', 4, 'Masonry', 4530912.91),
('24e22fc5-93ec-4496-ae2d-c7adb39b02e3', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', '6a882c0a-c68a-4bbf-b186-9c5760a99766', 5, 'Metals', 4530912.91),
('9b8275e3-8f02-49e6-b216-c174f69310f3', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', '304a5b39-461e-4604-bf79-e690849d2b1f', 6, 'Wood & Plastics', 4530912.91),
('db1dfdc7-d5d7-41ef-bf6e-d79fa2822467', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', '50326917-0ea7-4b28-a648-b26f4c439b4a', 7, 'Thermal & Moisture Protection', 4530912.91),
('0b7cc51d-e5df-4ea3-a1ff-9f610e66348e', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', '779eb9b5-119b-46c7-b402-cef78f320aa4', 8, 'Doors & Windows', 4530912.91),
('e3c3e130-d322-4b31-b255-61925f746897', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', 'abf284f0-b8e9-4711-a043-ae7d42743ed7', 9, 'Finishes', 4530912.91),
('6e8da0c7-11f5-4f23-a006-9fffe1f8988b', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', '3a021c63-d1fe-431e-b965-138b34eaffee', 10, 'Specialties', 4530912.91);

-- Commitments

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('d6b20550-62d9-488f-b764-c92e11dd5773', '2fcddb24-554b-4588-b252-f78f6956bb52', 'SC-2025-100-001', 'Balistreri, Gutkowski and Walker - Beauty', 'subcontract', '00417822-bb4c-46f5-82cb-020c01a47a67', '2025-10-11', 'executed', 166546.29, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('6ffbd1c8-c3c7-40a1-8d83-e73272d9b0a9', 'd6b20550-62d9-488f-b764-c92e11dd5773', 'commitment', 'e68db3e0-c28c-4773-b981-8b6a477ab33c', 1, 'Awesome Concrete Pants', 166546.29);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('6d658629-1c66-492b-b8f5-b1a512d5599f', '2fcddb24-554b-4588-b252-f78f6956bb52', 'SC-2025-100-002', 'Kris LLC - Books', 'subcontract', 'f1e79e66-3974-4471-8ba3-ceb6874447fc', '2025-09-18', 'executed', 62957.19, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('e41eee8c-9097-4a6f-b3ba-7ecdde3c0fdd', '6d658629-1c66-492b-b8f5-b1a512d5599f', 'commitment', '937faa31-9d71-463d-9917-d56c6ddcfe51', 1, 'Electronic Metal Salad', 20985.73),
('d5633eac-cf2f-4ac4-92af-a773bbb51dbb', '6d658629-1c66-492b-b8f5-b1a512d5599f', 'commitment', '3731fff3-c686-4576-b04a-49835d855262', 2, 'Elegant Rubber Shirt', 20985.73),
('ec8f2605-ebd7-492c-bdc7-957681f2ecea', '6d658629-1c66-492b-b8f5-b1a512d5599f', 'commitment', '80d1108a-84c7-44b7-a1e6-ad1f9f3cf2f7', 3, 'Luxurious Ceramic Chicken', 20985.73);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('14db76b8-a944-40d8-a182-db46b31e2f97', '2fcddb24-554b-4588-b252-f78f6956bb52', 'PO-2025-100-003', 'Carroll Inc - Grocery', 'purchase_order', '5f02c5ad-4072-4d9e-ac1e-27d69a2f5ad3', '2025-10-11', 'executed', 570430.12, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('bd5f6a54-1cbf-4db6-99d7-dbdfbc1b1d74', '14db76b8-a944-40d8-a182-db46b31e2f97', 'commitment', 'decb3765-fa22-4842-a60d-820360fe98bd', 1, 'Handmade Cotton Hat', 570430.12);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('d0871904-5ffa-419f-9428-51b05163b407', '2fcddb24-554b-4588-b252-f78f6956bb52', 'PO-2025-100-004', 'Frami LLC - Industrial', 'purchase_order', '106b8bf8-100a-4269-b0fa-88d7d1e169dc', '2025-10-29', 'executed', 955114.72, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('d153dfaf-b573-4507-9306-ef9741475751', 'd0871904-5ffa-419f-9428-51b05163b407', 'commitment', '7652d563-ccd0-4b18-8ee5-67b668b706d2', 1, 'Modern Granite Chicken', 238778.68),
('431e4ae3-f6ed-4c54-8a4a-1fab21b99b83', 'd0871904-5ffa-419f-9428-51b05163b407', 'commitment', 'ec492efd-4826-4ae1-9a0b-eff3eef549bd', 2, 'Gorgeous Gold Chicken', 238778.68),
('7fa9f7b3-3eb6-49da-87b3-d5e451882a34', 'd0871904-5ffa-419f-9428-51b05163b407', 'commitment', 'a51efd55-e4ff-432e-90c7-cd573a65333a', 3, 'Licensed Bamboo Gloves', 238778.68),
('f498ce47-c00e-4423-91c3-9a56792fc100', 'd0871904-5ffa-419f-9428-51b05163b407', 'commitment', '53729acc-02e2-48ef-9a6f-fb098c6023ac', 4, 'Awesome Aluminum Fish', 238778.68);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('cc5d36b6-e755-434c-9f2f-68184e28fd02', '2fcddb24-554b-4588-b252-f78f6956bb52', 'PO-2025-100-005', 'Stark - Littel - Shoes', 'purchase_order', '487fccb1-1c2a-4278-8332-81c1a7457773', '2025-10-25', 'executed', 1885469.66, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('2cd51b53-b06f-443a-9904-b81c7c46028e', 'cc5d36b6-e755-434c-9f2f-68184e28fd02', 'commitment', '80d1108a-84c7-44b7-a1e6-ad1f9f3cf2f7', 1, 'Luxurious Ceramic Chicken', 942734.83),
('a0c0fd30-4578-4c19-a476-8157fc014df0', 'cc5d36b6-e755-434c-9f2f-68184e28fd02', 'commitment', '937faa31-9d71-463d-9917-d56c6ddcfe51', 2, 'Electronic Metal Salad', 942734.83);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('789766c2-7b45-49c1-9bf9-c00859b97b6c', '2fcddb24-554b-4588-b252-f78f6956bb52', 'SC-2025-100-006', 'Heathcote - Bergnaum - Books', 'subcontract', 'b720842b-08c7-46a0-bbd0-1e225ea0be62', '2025-09-07', 'executed', 1138323.23, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('9a14f761-7248-406e-9e51-d4fe1faed4fc', '789766c2-7b45-49c1-9bf9-c00859b97b6c', 'commitment', '7556f214-47f7-45dc-bb70-ca44b00466e6', 1, 'Tasty Gold Chicken', 569161.62),
('f2377767-239d-4dce-867f-5d239487fa41', '789766c2-7b45-49c1-9bf9-c00859b97b6c', 'commitment', '3a40dafa-88e7-411c-ade2-56b6846bb52e', 2, 'Intelligent Steel Mouse', 569161.62);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('a38ad051-e85b-4042-95a8-b1e774176a8f', '2fcddb24-554b-4588-b252-f78f6956bb52', 'SC-2025-100-007', 'Brakus Group - Clothing', 'subcontract', '9c7333b0-4fd2-4a08-aff4-af7a0bf2ef19', '2025-10-18', 'executed', 943361.85, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('2b97d4d2-8024-424f-9902-d0bc9c89b5e9', 'a38ad051-e85b-4042-95a8-b1e774176a8f', 'commitment', 'b96375d2-eb45-4f6f-b3b6-3e84489c8ed3', 1, 'Tasty Marble Car', 314453.95),
('ea6a7216-bee5-4a0b-9958-a0e2b7e56189', 'a38ad051-e85b-4042-95a8-b1e774176a8f', 'commitment', '937faa31-9d71-463d-9917-d56c6ddcfe51', 2, 'Electronic Metal Salad', 314453.95),
('4c6acc03-e3ec-4683-84c6-bb0b3490f6d3', 'a38ad051-e85b-4042-95a8-b1e774176a8f', 'commitment', '223a0dde-a137-4026-969d-2c18aef61a20', 3, 'Rustic Rubber Car', 314453.95);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875', '2fcddb24-554b-4588-b252-f78f6956bb52', 'SC-2025-100-008', 'Kessler Group - Clothing', 'subcontract', 'b6bc0021-af49-44eb-bb2c-666d3cfad9f1', '2025-10-07', 'executed', 942205.57, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('0ca093a8-dc50-45b7-a75b-1b36c7903b86', '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875', 'commitment', 'be1adafc-4a1d-4acc-8075-7c3d9d86ef63', 1, 'Recycled Ceramic Pants', 188441.11),
('d5997d39-1dbf-47ed-b9f4-2bb0b19ed196', '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875', 'commitment', '7556f214-47f7-45dc-bb70-ca44b00466e6', 2, 'Tasty Gold Chicken', 188441.11),
('d4909743-2923-423f-a905-216a97ac2060', '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875', 'commitment', '937faa31-9d71-463d-9917-d56c6ddcfe51', 3, 'Electronic Metal Salad', 188441.11),
('bb825fb8-aff8-4b70-a1bb-2f3641c0ac51', '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875', 'commitment', '1270770b-ac22-4df1-9a05-101adeff6c31', 4, 'Soft Gold Gloves', 188441.11),
('b554e6ec-add3-4b70-9a9d-330180977b80', '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875', 'commitment', '42b181bf-8138-4857-8c45-0cd4d2901bf8', 5, 'Oriental Aluminum Hat', 188441.11);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('5d10066c-b887-49b2-9465-2afb6a9061d9', '2fcddb24-554b-4588-b252-f78f6956bb52', 'SC-2025-100-009', 'Rath, Hamill and Kunde - Outdoors', 'subcontract', '0755a0d4-2ba9-4b9d-b7da-f55d7344274b', '2025-09-04', 'pending', 403954.62, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('7b70f72d-5ec7-4a6d-8b24-52f4720dd4d5', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', 'be2a2e84-7181-4150-970b-fd1f399dcb8e', 1, 'Recycled Ceramic Sausages', 80790.92),
('1af0605e-8f35-4f77-87ac-9b53fe9274c2', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', 'fd554263-6294-4ec5-87ff-67d54bb92bfd', 2, 'Gorgeous Rubber Ball', 80790.92),
('347d0dfd-a8ee-4950-a44e-6c291bd25a6f', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', '22da16bb-215f-4d48-84da-15f77227b21f', 3, 'Oriental Bronze Shoes', 80790.92),
('17d1df85-1c89-4d65-a980-f6637e990edf', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', '53729acc-02e2-48ef-9a6f-fb098c6023ac', 4, 'Awesome Aluminum Fish', 80790.92),
('ca039d47-b5dc-43a5-8cef-b98ba6567e53', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', '80e26241-d090-4149-928d-9a1d27e26f46', 5, 'Recycled Plastic Chicken', 80790.92);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('42c5c783-5c35-4adb-83c7-7a12e2d0531b', '2fcddb24-554b-4588-b252-f78f6956bb52', 'SC-2025-100-010', 'Bechtelar - Mueller - Clothing', 'subcontract', 'a0e6ef05-c9b5-4b2c-b834-fe49976eda43', '2025-10-16', 'pending', 1456753.77, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('9ec3ca7f-4fd6-46ba-a2be-2c36eb46c0ad', '42c5c783-5c35-4adb-83c7-7a12e2d0531b', 'commitment', 'a2fb49f7-e7b7-4344-859f-7b20ffea3b15', 1, 'Incredible Steel Ball', 364188.44),
('58a22254-cf49-4c2a-9393-6c461d0abfc3', '42c5c783-5c35-4adb-83c7-7a12e2d0531b', 'commitment', 'c9678fd4-9e4a-4fc6-9aca-7934f3aca3f3', 2, 'Frozen Gold Table', 364188.44),
('8908eef2-2f16-4780-8cfb-78932e07ef7f', '42c5c783-5c35-4adb-83c7-7a12e2d0531b', 'commitment', '4b4c1658-6f26-408f-839f-e66dc57de5c8', 3, 'Practical Aluminum Car', 364188.44),
('73c165fb-d8ea-4307-8090-5eeff5c1285a', '42c5c783-5c35-4adb-83c7-7a12e2d0531b', 'commitment', '09852b1b-6216-42ca-8c39-783459ef9aef', 4, 'Soft Bamboo Table', 364188.44);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('418b5d15-4aad-40f4-947b-3f5b0965cfd7', '2fcddb24-554b-4588-b252-f78f6956bb52', 'PO-2025-100-011', 'Mitchell - Stroman - Outdoors', 'purchase_order', '7d6a9687-578f-484d-8409-e9135d912cca', '2025-09-06', 'executed', 626260.26, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('444e19ee-0edb-46a1-81b7-481f81c9ef91', '418b5d15-4aad-40f4-947b-3f5b0965cfd7', 'commitment', '46c25ee2-0195-4e54-a7f4-8308159dd735', 1, 'Modern Metal Computer', 125252.05),
('d66dceff-b6de-4bfc-9364-26ed650cde88', '418b5d15-4aad-40f4-947b-3f5b0965cfd7', 'commitment', 'ec6d1475-f675-4c2d-81ac-ee01714ac7d5', 2, 'Generic Wooden Hat', 125252.05),
('fa3757d8-d6f5-4d0c-bbf6-a238099eff69', '418b5d15-4aad-40f4-947b-3f5b0965cfd7', 'commitment', 'b744cd5f-c631-4085-8142-5b291a233a44', 3, 'Rustic Metal Fish', 125252.05),
('de35f655-b357-4182-a1c4-46178a4816b5', '418b5d15-4aad-40f4-947b-3f5b0965cfd7', 'commitment', '937faa31-9d71-463d-9917-d56c6ddcfe51', 4, 'Electronic Metal Salad', 125252.05),
('8b5ba851-3d06-4d28-b841-b81796ac6ec4', '418b5d15-4aad-40f4-947b-3f5b0965cfd7', 'commitment', '1270770b-ac22-4df1-9a05-101adeff6c31', 5, 'Soft Gold Gloves', 125252.05);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('59cade7d-1da8-4c09-9aac-6ae476c1519e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'PO-2025-101-001', 'Stark - Littel - Books', 'purchase_order', '487fccb1-1c2a-4278-8332-81c1a7457773', '2025-09-04', 'pending', 844915.28, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('1a7e5371-97d7-4398-8252-af042aa17a52', '59cade7d-1da8-4c09-9aac-6ae476c1519e', 'commitment', '7fc8d9b8-9fa5-478a-93a2-d0ae88bec44e', 1, 'Tasty Ceramic Bacon', 422457.64),
('379dd7db-6afa-42fb-895a-e80f29e452cb', '59cade7d-1da8-4c09-9aac-6ae476c1519e', 'commitment', '87fb0b70-cae1-4773-bc64-331f93bc13b8', 2, 'Sleek Concrete Chips', 422457.64);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('527a003b-ea84-45f0-ae37-e71549d35383', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'SC-2025-101-002', 'Rath, Hamill and Kunde - Games', 'subcontract', '0755a0d4-2ba9-4b9d-b7da-f55d7344274b', '2025-09-04', 'executed', 1318390.06, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('33e528f9-d4c2-4b7f-b89b-a91d320b2f07', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', '8d6647e9-b215-4321-ad02-3384a1b67d6c', 1, 'Rustic Cotton Mouse', 263678.01),
('d221080f-79d2-4ec0-bb35-15334fb15c20', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', '7d17922d-000d-4191-89b8-7c567edc1a0b', 2, 'Recycled Metal Chair', 263678.01),
('fd201e48-ce2e-40f5-ab0e-05d46efdfc92', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', '001fe4a1-bda0-4388-b325-a4e0750c5c0e', 3, 'Modern Metal Salad', 263678.01),
('bc880adf-ee44-4648-86ef-c54efb663423', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', '4da0c035-aaee-4a16-af55-7547f9243cf9', 4, 'Handmade Plastic Salad', 263678.01),
('f3aecc2d-e3b1-452f-87d4-f0d511325f34', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', 'afb16aa7-03cf-438a-94d7-d9b5206ee6c9', 5, 'Bespoke Bronze Hat', 263678.01);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('f84d6078-81eb-48d1-8b5b-98441104a67c', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'PO-2025-101-003', 'Mitchell - Stroman - Toys', 'purchase_order', '7d6a9687-578f-484d-8409-e9135d912cca', '2025-08-22', 'pending', 1539268.87, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('87657aff-404b-4e18-81eb-978172820887', 'f84d6078-81eb-48d1-8b5b-98441104a67c', 'commitment', '7d17922d-000d-4191-89b8-7c567edc1a0b', 1, 'Recycled Metal Chair', 769634.44),
('48a19ca4-e82c-4e80-ba29-6f1b3486fbda', 'f84d6078-81eb-48d1-8b5b-98441104a67c', 'commitment', '87fb0b70-cae1-4773-bc64-331f93bc13b8', 2, 'Sleek Concrete Chips', 769634.44);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('6b0f52b4-93ea-4811-9a37-7bed9822a513', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'PO-2025-101-004', 'Frami LLC - Industrial', 'purchase_order', '106b8bf8-100a-4269-b0fa-88d7d1e169dc', '2025-12-01', 'pending', 758861.26, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('dc0720bf-2343-4327-861d-8d0e0f3dd6f7', '6b0f52b4-93ea-4811-9a37-7bed9822a513', 'commitment', '2417039b-18d9-440b-abd3-9a2d7e1d689b', 1, 'Practical Ceramic Cheese', 189715.31),
('7b837a86-e401-4e51-8378-c7bbd20d47ef', '6b0f52b4-93ea-4811-9a37-7bed9822a513', 'commitment', '88db5f4a-233f-4f52-9d80-6bcab3459875', 2, 'Handmade Silk Table', 189715.31),
('f9287274-2a63-4532-809a-0da05803b908', '6b0f52b4-93ea-4811-9a37-7bed9822a513', 'commitment', '44d70152-489d-4756-b24f-7eb69b01c723', 3, 'Intelligent Granite Sausages', 189715.31),
('3b57942d-1be7-49f8-9021-18556c28a9b9', '6b0f52b4-93ea-4811-9a37-7bed9822a513', 'commitment', 'a9dd2195-b09f-4c9f-b1f7-f716f45deea3', 4, 'Soft Bamboo Shoes', 189715.31);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('4192a8c9-06d2-4741-aeba-a84384191caa', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'PO-2025-101-005', 'Carroll Inc - Beauty', 'purchase_order', '5f02c5ad-4072-4d9e-ac1e-27d69a2f5ad3', '2025-11-29', 'pending', 1614533.06, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('f26ab455-cc99-42a7-9870-9599e5d3bc2e', '4192a8c9-06d2-4741-aeba-a84384191caa', 'commitment', 'c38993a2-20d1-4fbd-a7b8-9383b8bb4a9a', 1, 'Tasty Metal Chair', 807266.53),
('6f7ddc5f-e0cb-4b38-854f-07c78db73ce8', '4192a8c9-06d2-4741-aeba-a84384191caa', 'commitment', '82df180f-e854-4aef-895c-0347d5582d02', 2, 'Incredible Bamboo Hat', 807266.53);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('14dad579-10e4-43e0-bd3d-73b12f5b9d88', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'SC-2025-101-006', 'Balistreri, Gutkowski and Walker - Music', 'subcontract', '00417822-bb4c-46f5-82cb-020c01a47a67', '2025-08-10', 'executed', 1057805.70, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('c11ea81f-7aeb-4cb5-bcc8-f8ce82cb59ce', '14dad579-10e4-43e0-bd3d-73b12f5b9d88', 'commitment', 'b9fe5f15-8a23-48c6-b66d-6dfcdffa938e', 1, 'Modern Metal Pizza', 264451.42),
('d66b312c-c165-4e12-8a86-8754726f3abf', '14dad579-10e4-43e0-bd3d-73b12f5b9d88', 'commitment', '8d4eb4e2-c4a5-4965-a95d-51f77b716b32', 2, 'Unbranded Rubber Ball', 264451.42),
('03a997f1-e7bd-4c87-ac00-0654d20cdb05', '14dad579-10e4-43e0-bd3d-73b12f5b9d88', 'commitment', '2ec0f9a0-ed6a-49d6-9549-320d19dd50e0', 3, 'Handmade Metal Ball', 264451.42),
('f123f6b7-ac9a-49ae-875a-8f2068a99ee5', '14dad579-10e4-43e0-bd3d-73b12f5b9d88', 'commitment', '5c6bb337-ffff-4c03-83c8-e8969b878fb4', 4, 'Intelligent Rubber Shoes', 264451.42);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('bb2d5eba-a3ff-434c-9647-35a46b4f0b7e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'SC-2025-101-007', 'Bechtelar - Mueller - Garden', 'subcontract', 'a0e6ef05-c9b5-4b2c-b834-fe49976eda43', '2025-10-16', 'executed', 228236.87, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('edfb2498-319f-4f42-8fff-3f1b80035122', 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e', 'commitment', 'fe013dc5-4e70-4580-92a6-7aadeb3d8b0a', 1, 'Handmade Plastic Hat', 76078.96),
('a9b91c13-a906-4821-bc1f-4f6596b40c09', 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e', 'commitment', '99e19c18-3d69-4c93-ae57-36085af8d77c', 2, 'Ergonomic Granite Gloves', 76078.96),
('899e9c65-cc88-4348-9b5e-cbb4d9d1c816', 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e', 'commitment', '48bb7b22-eac5-4337-95c5-b0adef824d08', 3, 'Generic Silk Pizza', 76078.96);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('d956f88a-9563-4f2a-ae7b-87f2be65edba', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'SC-2025-101-008', 'Kris LLC - Grocery', 'subcontract', 'f1e79e66-3974-4471-8ba3-ceb6874447fc', '2025-08-18', 'pending', 1734896.00, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('b99340ff-7186-46d2-bc74-d54099a67203', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', '060fbf31-f21c-4c4f-b8f3-792520aebe46', 1, 'Sleek Bronze Sausages', 433724.00),
('a6d3dee5-f01d-4f65-a983-a2e48837c1d4', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', 'a7d54609-ade8-4ba2-86ec-4d4119e8885b', 2, 'Intelligent Silk Towels', 433724.00),
('ce383169-a303-4e15-a798-72d8ec8a8708', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', '5c6bb337-ffff-4c03-83c8-e8969b878fb4', 3, 'Intelligent Rubber Shoes', 433724.00),
('3064c5ad-db60-4df1-9cc4-cb1d785e6d02', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', 'a9dd2195-b09f-4c9f-b1f7-f716f45deea3', 4, 'Soft Bamboo Shoes', 433724.00);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('74503d45-09b3-4c30-afd0-82edc68859d4', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'SC-2025-101-009', 'Heathcote - Bergnaum - Home', 'subcontract', 'b720842b-08c7-46a0-bbd0-1e225ea0be62', '2025-10-13', 'pending', 143460.53, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('c755900f-6edf-4282-b61d-e83ed515a9fc', '74503d45-09b3-4c30-afd0-82edc68859d4', 'commitment', '4dadfc2a-391a-4601-9ffc-bb5a3fa3771b', 1, 'Practical Wooden Salad', 28692.11),
('418075da-a44a-48ab-a15f-35f3d57d9849', '74503d45-09b3-4c30-afd0-82edc68859d4', 'commitment', '2417039b-18d9-440b-abd3-9a2d7e1d689b', 2, 'Practical Ceramic Cheese', 28692.11),
('37366192-066f-436e-a36c-fe35fd044b3c', '74503d45-09b3-4c30-afd0-82edc68859d4', 'commitment', '7d17922d-000d-4191-89b8-7c567edc1a0b', 3, 'Recycled Metal Chair', 28692.11),
('195a6dad-f407-44a0-99ad-27f5db070be3', '74503d45-09b3-4c30-afd0-82edc68859d4', 'commitment', 'b51cc60d-b2a3-48e8-aa1c-a952b68d3266', 4, 'Handmade Wooden Car', 28692.11),
('f683c458-4746-4603-817e-131260c862cd', '74503d45-09b3-4c30-afd0-82edc68859d4', 'commitment', '22ecddb9-c60c-47c9-9d3f-f612f7ab25f0', 5, 'Licensed Bronze Chips', 28692.11);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('1c0b8af6-55ad-4dd2-ae0e-059bba9905ee', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'SC-2025-101-010', 'Brakus Group - Automotive', 'subcontract', '9c7333b0-4fd2-4a08-aff4-af7a0bf2ef19', '2025-11-16', 'pending', 508357.66, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('15e4f9f2-0a06-477a-b375-9fa4e40c301e', '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee', 'commitment', '7d17922d-000d-4191-89b8-7c567edc1a0b', 1, 'Recycled Metal Chair', 508357.66);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('d93c9ec9-a24d-478e-a59c-7d2aa44a7128', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'SC-2025-101-011', 'Kessler Group - Beauty', 'subcontract', 'b6bc0021-af49-44eb-bb2c-666d3cfad9f1', '2025-11-17', 'pending', 130548.05, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('09b64b69-a3a2-41cd-bfed-ec86f182f759', 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128', 'commitment', 'fe013dc5-4e70-4580-92a6-7aadeb3d8b0a', 1, 'Handmade Plastic Hat', 130548.05);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('37e3c561-6a72-4e21-9c49-ec1b7b2ef884', 'e1dba243-0107-4061-a232-ecce67b29b72', 'SC-2025-102-001', 'Bechtelar - Mueller - Books', 'subcontract', 'a0e6ef05-c9b5-4b2c-b834-fe49976eda43', '2025-10-26', 'executed', 1852732.41, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('2ff09d4d-1fd6-4aca-aeb8-2387d8d9f946', '37e3c561-6a72-4e21-9c49-ec1b7b2ef884', 'commitment', '8db202c5-9bb3-408d-be65-d5a975b68f46', 1, 'Tasty Wooden Salad', 926366.20),
('b4f6b583-1e42-40e3-ac38-918d87f81c67', '37e3c561-6a72-4e21-9c49-ec1b7b2ef884', 'commitment', '50c65d31-f080-4302-aa65-cdb22946d7dc', 2, 'Electronic Rubber Soap', 926366.20);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('626e1cd6-d553-4cff-a326-affc1a9c1e0b', 'e1dba243-0107-4061-a232-ecce67b29b72', 'PO-2025-102-002', 'Frami LLC - Toys', 'purchase_order', '106b8bf8-100a-4269-b0fa-88d7d1e169dc', '2025-09-29', 'pending', 1839356.72, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('2349b109-3bb6-4022-9e9d-7d5e5eee626f', '626e1cd6-d553-4cff-a326-affc1a9c1e0b', 'commitment', '539ecd3f-983e-4199-99b8-6fb2a6ec4514', 1, 'Incredible Ceramic Table', 1839356.72);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'e1dba243-0107-4061-a232-ecce67b29b72', 'SC-2025-102-003', 'Heathcote - Bergnaum - Music', 'subcontract', 'b720842b-08c7-46a0-bbd0-1e225ea0be62', '2025-09-14', 'executed', 1960801.72, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('792dab8f-1940-471b-9974-ab85b061d28e', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', '58a3d096-0e85-4d46-9821-73704ebeb170', 1, 'Handcrafted Marble Mouse', 490200.43),
('1abedfd0-5777-42db-9dad-0aea659a939e', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', '6130adf3-8417-40d8-aba7-711388c6a9c9', 2, 'Incredible Plastic Bacon', 490200.43),
('b359c576-c1c9-4c40-9749-98be92508e65', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', '46cc41c6-445c-4820-ab28-62e89a3ae718', 3, 'Recycled Bronze Keyboard', 490200.43),
('a4afd2ca-2573-495b-b6c3-9d4041419413', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', '8a8fd04d-5ebb-43c9-82e0-2f6e99b64a2f', 4, 'Ergonomic Cotton Chair', 490200.43);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('ac707aeb-428f-49b6-a6cb-a995c112f5c5', 'e1dba243-0107-4061-a232-ecce67b29b72', 'PO-2025-102-004', 'Mitchell - Stroman - Clothing', 'purchase_order', '7d6a9687-578f-484d-8409-e9135d912cca', '2025-09-25', 'pending', 664432.31, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('8c06bbc8-24ac-48c0-89fa-b856148ab112', 'ac707aeb-428f-49b6-a6cb-a995c112f5c5', 'commitment', 'c0808d64-7e8b-4c43-bbfc-a1abc7053504', 1, 'Fantastic Rubber Chair', 221477.44),
('a1b7fa56-3b06-4227-a0f7-39cbb0610822', 'ac707aeb-428f-49b6-a6cb-a995c112f5c5', 'commitment', 'c0516fde-8ed2-4173-95f2-b13d54de2a13', 2, 'Luxurious Rubber Computer', 221477.44),
('f113ef5a-ff52-45e8-8bbf-0a07f90031ec', 'ac707aeb-428f-49b6-a6cb-a995c112f5c5', 'commitment', '301d2285-8d99-4867-9872-7548df975314', 3, 'Handmade Marble Shoes', 221477.44);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('1df7cc9a-6f5b-4518-bb3c-68a94d4502dc', 'e1dba243-0107-4061-a232-ecce67b29b72', 'PO-2025-102-005', 'Stark - Littel - Outdoors', 'purchase_order', '487fccb1-1c2a-4278-8332-81c1a7457773', '2025-09-30', 'executed', 653940.61, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('c0eb7e7e-d145-403b-bb04-5f4d8fbcdc4c', '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc', 'commitment', '8a8fd04d-5ebb-43c9-82e0-2f6e99b64a2f', 1, 'Ergonomic Cotton Chair', 653940.61);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef', 'e1dba243-0107-4061-a232-ecce67b29b72', 'PO-2025-102-006', 'Carroll Inc - Electronics', 'purchase_order', '5f02c5ad-4072-4d9e-ac1e-27d69a2f5ad3', '2025-11-05', 'pending', 801643.91, 0.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('e45b8140-8c9b-4109-be36-62756b5ca82f', 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef', 'commitment', '167cd980-fdca-4202-bccb-815f270f396c', 1, 'Frozen Plastic Bacon', 267214.64),
('fae54b85-587f-4472-b37b-1d5d9e6e6195', 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef', 'commitment', 'd30dc63a-103c-49b2-b3cf-d5057fc0d885', 2, 'Awesome Bronze Bacon', 267214.64),
('d622c32d-67ad-4f49-a15d-3b32d229bb7a', 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef', 'commitment', 'c0808d64-7e8b-4c43-bbfc-a1abc7053504', 3, 'Fantastic Rubber Chair', 267214.64);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('09abfc08-9779-4926-a6e7-53bad423a4f6', 'e1dba243-0107-4061-a232-ecce67b29b72', 'SC-2025-102-007', 'Brakus Group - Clothing', 'subcontract', '9c7333b0-4fd2-4a08-aff4-af7a0bf2ef19', '2025-08-18', 'executed', 738549.49, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('5b469555-8971-4321-9919-617c28c00739', '09abfc08-9779-4926-a6e7-53bad423a4f6', 'commitment', '56d94336-d55f-47e2-a09e-66f255ca1ca7', 1, 'Generic Granite Keyboard', 738549.49);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('19bc439f-38c5-4667-a2be-7a43eac9a846', 'e1dba243-0107-4061-a232-ecce67b29b72', 'SC-2025-102-008', 'Rath, Hamill and Kunde - Beauty', 'subcontract', '0755a0d4-2ba9-4b9d-b7da-f55d7344274b', '2025-11-16', 'pending', 1561171.52, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('1e2dc2f4-b36a-4923-9747-b071a039531b', '19bc439f-38c5-4667-a2be-7a43eac9a846', 'commitment', 'e18d0431-909e-4428-8864-cdb5995dec65', 1, 'Elegant Steel Hat', 520390.51),
('6c4d7afe-1126-457d-8fc3-0f775f79fe8d', '19bc439f-38c5-4667-a2be-7a43eac9a846', 'commitment', '97cef093-e182-4359-84b9-dc9265c5e080', 2, 'Elegant Concrete Fish', 520390.51),
('d0988cd4-47eb-4169-af94-8a23e8880dfc', '19bc439f-38c5-4667-a2be-7a43eac9a846', 'commitment', '7848d184-6c19-4235-807f-1609a3cb67b3', 3, 'Soft Bamboo Computer', 520390.51);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('06fc3dab-57b5-4baf-81a6-148eb0b985a2', 'e1dba243-0107-4061-a232-ecce67b29b72', 'SC-2025-102-009', 'Balistreri, Gutkowski and Walker - Games', 'subcontract', '00417822-bb4c-46f5-82cb-020c01a47a67', '2025-11-10', 'executed', 51253.81, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('66518f9f-bba2-4ff6-a9a2-98207f1ead99', '06fc3dab-57b5-4baf-81a6-148eb0b985a2', 'commitment', '9d872feb-6ac8-4f41-9f73-d21f49e9d293', 1, 'Refined Bamboo Towels', 25626.90),
('c3658d3c-f464-4b1e-9fb7-5a7dfc4f7af8', '06fc3dab-57b5-4baf-81a6-148eb0b985a2', 'commitment', '59bf4b2a-a538-47a3-876b-2f683b651f1d', 2, 'Gorgeous Metal Towels', 25626.90);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('92382a85-0a85-49eb-8ee4-cf744cca9456', 'e1dba243-0107-4061-a232-ecce67b29b72', 'SC-2025-102-010', 'Kessler Group - Music', 'subcontract', 'b6bc0021-af49-44eb-bb2c-666d3cfad9f1', '2025-08-20', 'pending', 312738.81, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('72e9ca19-1bcb-44b6-acda-1e014968d621', '92382a85-0a85-49eb-8ee4-cf744cca9456', 'commitment', 'a0c2030b-2573-4c65-b223-c217acc4c474', 1, 'Generic Ceramic Keyboard', 104246.27),
('c028ebc4-9e05-492b-a116-f9f5263dbc6b', '92382a85-0a85-49eb-8ee4-cf744cca9456', 'commitment', 'c58bbe46-4a68-4a38-bdfb-36071980e1e7', 2, 'Refined Marble Pizza', 104246.27),
('89586eb6-58f4-42e8-a498-aaf3bf129c7b', '92382a85-0a85-49eb-8ee4-cf744cca9456', 'commitment', '9d872feb-6ac8-4f41-9f73-d21f49e9d293', 3, 'Refined Bamboo Towels', 104246.27);

INSERT INTO commitments (id, project_id, number, title, type, company_id, contract_date, status, original_amount, retention_percentage) VALUES
('5de2dde5-0b6b-4500-82e0-8c4b14d318a9', 'e1dba243-0107-4061-a232-ecce67b29b72', 'SC-2025-102-011', 'Kris LLC - Music', 'subcontract', 'f1e79e66-3974-4471-8ba3-ceb6874447fc', '2025-09-24', 'executed', 1033664.16, 10.00);

INSERT INTO contract_line_items (id, contract_id, contract_type, cost_code_id, line_number, description, scheduled_value) VALUES
('71db5bba-8496-4d8d-96d7-f04f30ec345a', '5de2dde5-0b6b-4500-82e0-8c4b14d318a9', 'commitment', '01a77bfe-6a58-4bb5-97d6-b8dda7144d37', 1, 'Unbranded Bamboo Hat', 258416.04),
('7684bdf5-bc0d-4735-9e5f-8d4df5700a4e', '5de2dde5-0b6b-4500-82e0-8c4b14d318a9', 'commitment', 'ac97ef69-b411-4834-8535-2c0474718710', 2, 'Handmade Bamboo Ball', 258416.04),
('13bbf8d1-d9bb-422d-a4e9-b29ea885376f', '5de2dde5-0b6b-4500-82e0-8c4b14d318a9', 'commitment', '29a08a4e-79f5-47bc-9c17-e9fd6edd8283', 3, 'Luxurious Marble Pizza', 258416.04),
('42bda066-e58c-4773-99c7-aa533f4db8be', '5de2dde5-0b6b-4500-82e0-8c4b14d318a9', 'commitment', 'daa0b172-bd62-4e65-b290-ed8d880c68e1', 4, 'Recycled Bamboo Shirt', 258416.04);

-- Change Events
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('b346b52e-9c83-44ac-b713-7f483693e907', '2fcddb24-554b-4588-b252-f78f6956bb52', 1, 'PCO-001: Intuitive logistical utilisation', 'Adulatio cursus tui tabella brevis.', 'architect', 'owner_request', 'open', 52072.96);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('485fdffa-1fd1-4096-8447-8162e8c8e468', '2fcddb24-554b-4588-b252-f78f6956bb52', 2, 'PCO-002: User-centric analyzing data-warehouse', 'Consectetur coniuratio absconditus minima placeat voluptate subseco degenero.', 'architect', 'site_condition', 'pending', 77269.81);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('d5665d01-18da-4710-a684-f147c9a8f867', '2fcddb24-554b-4588-b252-f78f6956bb52', 3, 'PCO-003: Intuitive resilient instruction set', 'Tui pauper illo patria sub cum.', 'owner', 'design_change', 'open', 98657.78);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('a71cec51-894c-4746-a9ee-725b4735fb44', '2fcddb24-554b-4588-b252-f78f6956bb52', 4, 'PCO-004: Enhanced systemic framework', 'Ullam comis cubitum centum antepono asporto sonitus.', 'unforeseen', 'owner_request', 'open', 20383.20);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('fb74f515-97eb-4784-8011-8e526fad216d', '2fcddb24-554b-4588-b252-f78f6956bb52', 5, 'PCO-005: Cross-platform leading edge database', 'Cado tabgo ab est dicta bene soluta.', 'field', 'owner_request', 'closed', 34291.56);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('3ed555f8-8195-49b4-a1cf-42d842ddc473', '2fcddb24-554b-4588-b252-f78f6956bb52', 6, 'PCO-006: Front-line bottom-line conglomeration', 'Coniecto atrocitas administratio comptus.', 'field', 'site_condition', 'open', 29323.54);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('d9cc350a-7582-4b20-9e7d-72c3e056ba27', '2fcddb24-554b-4588-b252-f78f6956bb52', 7, 'PCO-007: Compatible coherent functionalities', 'Vulgaris vesica vorago.', 'field', 'code_requirement', 'open', 17609.14);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('17eb4e8a-29ed-4744-b281-ae5791d3172a', '2fcddb24-554b-4588-b252-f78f6956bb52', 8, 'PCO-008: Cross-platform sustainable portal', 'In ambitus vomica territo repellendus debitis ipsam ceno bestia trepide.', 'unforeseen', 'site_condition', 'void', 61676.04);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('11d18861-5785-49ea-b22a-b0dcc709a60b', '2fcddb24-554b-4588-b252-f78f6956bb52', 9, 'PCO-009: Ergonomic asynchronous projection', 'Vehemens amitto ad usus cumque claudeo.', 'field', 'design_change', 'open', 17293.97);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('2e162285-db5a-4e1d-ae9f-4b64e8bd4a0d', '2fcddb24-554b-4588-b252-f78f6956bb52', 10, 'PCO-010: Advanced content-based functionalities', 'Somniculosus acies quas sollicito pecus.', 'field', 'design_change', 'pending', 10328.01);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('bb60f976-22a1-4d85-b717-fe4e4bbdd0eb', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 1, 'PCO-001: Stand-alone discrete instruction set', 'Velociter allatus vinculum adflicto appello defleo certus audentia comedo.', 'architect', 'design_change', 'closed', 32578.64);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('7a206aeb-4dc0-44e7-b9a6-80d1bf44815f', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 2, 'PCO-002: Streamlined hybrid matrices', 'Audentia sumptus comitatus patior substantia pariatur harum aveho aro subvenio.', 'field', 'owner_request', 'open', 65995.41);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('3adb0472-5e32-4301-829a-a8eb37e4bf7e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 3, 'PCO-003: Synchronised bifurcated protocol', 'Aufero conqueror desparatus pecto acer tardus conduco.', 'unforeseen', 'design_change', 'pending', 46096.27);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('ca43710e-1467-4919-a6eb-2b1422a57b6e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 4, 'PCO-004: Networked reciprocal time-frame', 'Accommodo turbo casus patior cruciamentum.', 'architect', 'owner_request', 'open', 32018.36);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('17318bb0-ebcd-45b4-9f50-846f687342a7', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 5, 'PCO-005: Exclusive full-range hardware', 'Creptio decerno voluptates.', 'architect', 'site_condition', 'open', 48672.71);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('d6405524-69cb-4811-a0bb-8363b0ce8f51', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 6, 'PCO-006: Fundamental fault-tolerant complexity', 'Turba odio venustas thalassinus molestiae voluptatibus laborum perspiciatis.', 'field', 'design_change', 'closed', 53713.37);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('8724fad4-e54b-4f2f-9fcd-c430af2c68a8', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 7, 'PCO-007: Secured human-resource local area network', 'Atque vix complectus corona calamitas commodi.', 'field', 'site_condition', 'pending', 81486.13);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('cee79c58-163f-494e-bcdd-5f0fc7e0be01', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 8, 'PCO-008: Sustainable uniform protocol', 'Nesciunt triduana deduco deleniti ademptio cometes degero.', 'owner', 'owner_request', 'open', 6060.77);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('ea7f23c5-877f-41bb-a589-ae867aabf2fa', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 9, 'PCO-009: Expanded dedicated forecast', 'Candidus delibero praesentium derelinquo consequatur titulus denuo vester curso.', 'field', 'code_requirement', 'open', 79836.49);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('719ad787-71a7-46e1-908b-0569373a738e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 10, 'PCO-010: Reduced system-worthy task-force', 'Cupressus minima speciosus quos trucido tredecim summa vitiosus tricesimus.', 'owner', 'owner_request', 'pending', 70728.46);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('3155e1dd-f5e7-4ec1-b2de-c5c8ad8c6205', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 11, 'PCO-011: Automated AI-powered instruction set', 'Aiunt itaque usitas absconditus.', 'owner', 'site_condition', 'pending', 77390.83);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('d73c16e0-a9de-4678-a25e-471945e38076', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 12, 'PCO-012: Quality-focused zero tolerance time-frame', 'Articulus quam credo suscipit tum.', 'field', 'code_requirement', 'closed', 68953.58);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('e8c361f4-f57a-42db-aa74-2dafe1befa10', 'e1dba243-0107-4061-a232-ecce67b29b72', 1, 'PCO-001: Versatile encompassing service-desk', 'Adnuo somniculosus adstringo tremo illum tredecim exercitationem appono thesis.', 'unforeseen', 'code_requirement', 'void', 66356.83);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('2e89a716-99a4-4406-8d92-63ebc666ce34', 'e1dba243-0107-4061-a232-ecce67b29b72', 2, 'PCO-002: Open-source mission-critical concept', 'Acies cilicium iusto.', 'architect', 'code_requirement', 'open', 75875.97);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('08571072-9162-4968-9d5d-dca606a0ac00', 'e1dba243-0107-4061-a232-ecce67b29b72', 3, 'PCO-003: Horizontal clear-thinking leverage', 'Nesciunt adsidue succurro considero complectus.', 'owner', 'code_requirement', 'closed', 62898.45);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('05ed85f0-4220-4d9b-9b12-dfb764de48e2', 'e1dba243-0107-4061-a232-ecce67b29b72', 4, 'PCO-004: Monitored reciprocal capacity', 'Aetas tollo tres eum.', 'unforeseen', 'owner_request', 'open', 37734.54);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('7bb11c3f-bd00-4332-811c-8db12f64040e', 'e1dba243-0107-4061-a232-ecce67b29b72', 5, 'PCO-005: Total static algorithm', 'Chirographum adopto carbo adficio arcus cornu vulgaris abundans coniuratio curto.', 'architect', 'owner_request', 'open', 53007.98);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('3f16382d-63cc-4689-97f6-f71bd8436ebd', 'e1dba243-0107-4061-a232-ecce67b29b72', 6, 'PCO-006: Distributed cloud-native migration', 'Tantum caelestis maiores vox utrum adaugeo.', 'owner', 'site_condition', 'closed', 7352.69);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('34e066c2-2303-42e4-91e1-f7b89a3d9f5a', 'e1dba243-0107-4061-a232-ecce67b29b72', 7, 'PCO-007: Face to face intangible flexibility', 'Verto corrumpo corona mollitia ambulo averto.', 'field', 'owner_request', 'open', 9975.61);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('efcba165-d273-4850-b8eb-1917630c020b', 'e1dba243-0107-4061-a232-ecce67b29b72', 8, 'PCO-008: Focused bifurcated internet solution', 'Venio ante amitto suffoco viridis.', 'unforeseen', 'owner_request', 'open', 58798.56);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('8e9aa595-507f-45d4-a72d-6fc93b3dff29', 'e1dba243-0107-4061-a232-ecce67b29b72', 9, 'PCO-009: Customizable executive firmware', 'Ascisco sopor vinum.', 'unforeseen', 'site_condition', 'open', 18088.38);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('20cc40e6-3bea-470a-b662-ecced5c9d4c3', 'e1dba243-0107-4061-a232-ecce67b29b72', 10, 'PCO-010: Fundamental 24 hour emulation', 'Debeo creator avarus ubi admoneo xiphias stultus comitatus porro subseco.', 'architect', 'code_requirement', 'void', 46033.50);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('345f0747-1224-4af0-8376-2ab96344a35a', 'e1dba243-0107-4061-a232-ecce67b29b72', 11, 'PCO-011: Automated neutral matrix', 'Cernuus vero rem arma usus urbs.', 'unforeseen', 'design_change', 'closed', 52561.41);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('0dae7ca8-7601-4878-ae87-962637167e7e', 'e1dba243-0107-4061-a232-ecce67b29b72', 12, 'PCO-012: Cross-platform zero trust throughput', 'Amplexus sit acquiro beatae aegrotatio canonicus.', 'field', 'code_requirement', 'void', 81430.40);
INSERT INTO change_events (id, project_id, number, title, description, origin, reason, status, rough_order_magnitude) VALUES
('e2b10491-34e3-4941-b69a-0452dea27eaa', 'e1dba243-0107-4061-a232-ecce67b29b72', 13, 'PCO-013: Visionary bottom-line projection', 'Copiose taceo calamitas ad victus tutis.', 'unforeseen', 'code_requirement', 'open', 63920.87);

-- Change Orders

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('4714e810-c410-4170-8ec9-905f737267e8', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '719ad787-71a7-46e1-908b-0569373a738e', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', 'CO-001', 'Change Order 1 - optimize enterprise lifetime value', 'approved', 190204.32, 15);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('75d422e4-6219-497e-8fa7-db8bdd7b88a2', '4714e810-c410-4170-8ec9-905f737267e8', 'a0af8336-9ea1-49b5-956d-342cbb45172b', 1, 'New Chips model with 95 GB RAM, 821 GB storage, and messy features', 190204.32);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('3e99cd54-3f37-429e-82f5-6b593b95fc67', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'd73c16e0-a9de-4678-a25e-471945e38076', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', 'CO-002', 'Change Order 2 - streamline collaborative initiatives', 'approved', 16785.54, 17);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('58082397-5af4-4b98-bbab-fe74e1efd81f', '3e99cd54-3f37-429e-82f5-6b593b95fc67', '34a656da-8021-47f3-87bb-0d0835ae9ad9', 1, 'Experience the green brilliance of our Table, perfect for bowed environments', 4196.39),
('11d7af1b-bfd3-49a6-8a8d-9b8cb13863a6', '3e99cd54-3f37-429e-82f5-6b593b95fc67', '8d6647e9-b215-4321-ad02-3384a1b67d6c', 2, 'The sleek and arid Keyboard comes with blue LED lighting for smart functionality', 4196.39),
('ed065b3c-7b7a-4d73-8d28-3ac3e6107163', '3e99cd54-3f37-429e-82f5-6b593b95fc67', '4da0c035-aaee-4a16-af55-7547f9243cf9', 3, 'Experience the grey brilliance of our Salad, perfect for proper environments', 4196.39),
('b247902e-8fb5-4d2f-b2be-b57a2f2ed321', '3e99cd54-3f37-429e-82f5-6b593b95fc67', '5c6bb337-ffff-4c03-83c8-e8969b878fb4', 4, 'The Stephany Keyboard is the latest in a series of fluffy products from Predovic - Bashirian', 4196.39);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('7b370478-b2a7-46cd-9fe5-383db5a5c83a', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd9cc350a-7582-4b20-9e7d-72c3e056ba27', 'd6b20550-62d9-488f-b764-c92e11dd5773', 'commitment', 'CO-001', 'Change Order 1 - aggregate integrated mindshare', 'approved', 10987.20, 11);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('a1439dfb-50ec-43dc-b2fc-6b8d3a6caeb9', '7b370478-b2a7-46cd-9fe5-383db5a5c83a', '343f4448-3cb1-4645-a3c2-d508ceed86d2', 1, 'Our rich-inspired Sausages brings a taste of luxury to your gleaming lifestyle', 2746.80),
('929c6964-bd52-4f08-a40c-d8b17d0f1111', '7b370478-b2a7-46cd-9fe5-383db5a5c83a', '99998d24-7d15-40a9-bb2b-116fe5c7ef51', 2, 'The Grass-roots empowering standardization Bacon offers reliable performance and soft design', 2746.80),
('5829297a-6ea1-4e86-81e7-1f5a787ba493', '7b370478-b2a7-46cd-9fe5-383db5a5c83a', '938134cf-6a98-4d36-bd22-ee336368e1a6', 3, 'Discover the deer-like agility of our Shoes, perfect for jittery users', 2746.80),
('fc4948dd-dfec-46ba-a48c-1ff16df6da63', '7b370478-b2a7-46cd-9fe5-383db5a5c83a', 'c9678fd4-9e4a-4fc6-9aca-7934f3aca3f3', 4, 'Ergonomic Bike made with Cotton for all-day steel support', 2746.80);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('be72c70a-0e28-404d-833f-64abb0195b71', '2fcddb24-554b-4588-b252-f78f6956bb52', '17eb4e8a-29ed-4744-b281-ae5791d3172a', '6d658629-1c66-492b-b8f5-b1a512d5599f', 'commitment', 'CO-001', 'Change Order 1 - deploy holistic partnerships', 'approved', 28756.19, 14);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('30a5de38-4bf3-4819-9a44-5516be41220d', 'be72c70a-0e28-404d-833f-64abb0195b71', 'b96375d2-eb45-4f6f-b3b6-3e84489c8ed3', 1, 'The Team-oriented high-level encoding Car offers reliable performance and silent design', 7189.05),
('dbe757d0-dfea-45f7-a929-6afe32d2ff4f', 'be72c70a-0e28-404d-833f-64abb0195b71', '22396629-6999-4ead-b917-3e3e970e209f', 2, 'Stylish Car designed to make you stand out with writhing looks', 7189.05),
('28768cad-f32e-4854-ac00-40b84b2f8281', 'be72c70a-0e28-404d-833f-64abb0195b71', '7968a7b9-4261-44ba-8fde-5845e700aca9', 3, 'Rustic Chair designed with Rubber for legal performance', 7189.05),
('4610edb1-8312-4702-ba2a-dcdad7512629', 'be72c70a-0e28-404d-833f-64abb0195b71', '8580aa93-fbcd-4900-9907-cc1e6db9cfbe', 4, 'Stylish Computer designed to make you stand out with miserable looks', 7189.05);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('737c5ad4-8273-48b8-a73e-8fae614ee093', '2fcddb24-554b-4588-b252-f78f6956bb52', '11d18861-5785-49ea-b22a-b0dcc709a60b', '6d658629-1c66-492b-b8f5-b1a512d5599f', 'commitment', 'CO-002', 'Change Order 2 - monetize collaborative niches', 'pending', 29352.13, 15);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('5fc1ea75-ac6c-47e9-8e8b-e87461685e54', '737c5ad4-8273-48b8-a73e-8fae614ee093', '4b4c1658-6f26-408f-839f-e66dc57de5c8', 1, 'Our bitter-inspired Chair brings a taste of luxury to your flashy lifestyle', 5870.43),
('b105a832-9b8d-4fd2-8809-fb028b440df2', '737c5ad4-8273-48b8-a73e-8fae614ee093', '7556f214-47f7-45dc-bb70-ca44b00466e6', 2, 'Professional-grade Towels perfect for deadly training and recreational use', 5870.43),
('304a96a1-374f-4cac-87ef-875c4bf0dc3f', '737c5ad4-8273-48b8-a73e-8fae614ee093', '1a8c5ea9-220d-4532-858f-8ecc61c1b15a', 3, 'Ergonomic Chicken made with Bronze for all-day wicked support', 5870.43),
('85198599-023e-4289-b2be-1c4fce9aaeb0', '737c5ad4-8273-48b8-a73e-8fae614ee093', '27db8e8d-89fa-484a-894c-f2f0d4e1ca89', 4, 'Our eagle-friendly Bike ensures frightened comfort for your pets', 5870.43),
('eafd37a7-d50a-4ab7-8384-a792c29ffd64', '737c5ad4-8273-48b8-a73e-8fae614ee093', 'af59e5cc-3d80-4261-9c4c-469cf3f17952', 5, 'The cyan Ball combines Armenia aesthetics with Rhodium-based durability', 5870.43);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('58b0c714-4483-47b6-989e-3a3fee9e0e04', '2fcddb24-554b-4588-b252-f78f6956bb52', '485fdffa-1fd1-4096-8447-8162e8c8e468', '6d658629-1c66-492b-b8f5-b1a512d5599f', 'commitment', 'CO-003', 'Change Order 3 - expedite proactive methodologies', 'approved', 136857.74, 17);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('26264aee-239e-4c18-8677-7d61b520e513', '58b0c714-4483-47b6-989e-3a3fee9e0e04', '27db8e8d-89fa-484a-894c-f2f0d4e1ca89', 1, 'Discover the bee-like agility of our Car, perfect for valuable users', 68428.87),
('7e978be2-d4be-451e-a55a-9f016dd907c5', '58b0c714-4483-47b6-989e-3a3fee9e0e04', '22396629-6999-4ead-b917-3e3e970e209f', 2, 'The sleek and intrepid Bacon comes with silver LED lighting for smart functionality', 68428.87);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('62678a0f-0f4c-49cd-8d93-fc245c80b3f2', '2fcddb24-554b-4588-b252-f78f6956bb52', '3ed555f8-8195-49b4-a1cf-42d842ddc473', 'd0871904-5ffa-419f-9428-51b05163b407', 'commitment', 'CO-001', 'Change Order 1 - innovate rich e-commerce', 'approved', 119978.27, 6);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('a8429719-fe0a-46a3-a53c-62c8bc1c6f24', '62678a0f-0f4c-49cd-8d93-fc245c80b3f2', '20068f38-e4de-42ae-8b8c-1ee3378b959a', 1, 'New maroon Tuna with ergonomic design for impossible comfort', 39992.76),
('63c22cbf-aec0-4978-849e-b7250acc8ec0', '62678a0f-0f4c-49cd-8d93-fc245c80b3f2', 'adde3983-5aa5-40b0-b85b-3f99c80268b6', 2, 'Our delicious-inspired Hat brings a taste of luxury to your astonishing lifestyle', 39992.76),
('8db8970b-b558-450a-9b6e-05371293457a', '62678a0f-0f4c-49cd-8d93-fc245c80b3f2', 'a7ae9d27-9de1-40dc-b0e2-c5998ffb2ca5', 3, 'New Hat model with 81 GB RAM, 188 GB storage, and posh features', 39992.76);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('3d8ebb07-ebf7-41dc-b751-8c69291515e3', '2fcddb24-554b-4588-b252-f78f6956bb52', 'fb74f515-97eb-4784-8011-8e526fad216d', 'd0871904-5ffa-419f-9428-51b05163b407', 'commitment', 'CO-002', 'Change Order 2 - innovate AI-driven functionalities', 'approved', 82906.68, 0);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('7e6977f7-9bf1-45c8-9f2c-7f90c4b2bbb5', '3d8ebb07-ebf7-41dc-b751-8c69291515e3', 'af59e5cc-3d80-4261-9c4c-469cf3f17952', 1, 'The Managed zero administration conglomeration Table offers reliable performance and petty design', 27635.56),
('352eb1b5-d11e-4022-81a9-67d821c507a5', '3d8ebb07-ebf7-41dc-b751-8c69291515e3', '7652d563-ccd0-4b18-8ee5-67b668b706d2', 2, 'The blue Gloves combines Mozambique aesthetics with Carbon-based durability', 27635.56),
('5465091b-1077-476e-9c2c-fdd0951bd9d9', '3d8ebb07-ebf7-41dc-b751-8c69291515e3', '7556f214-47f7-45dc-bb70-ca44b00466e6', 3, 'Stylish Pants designed to make you stand out with junior looks', 27635.56);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('89be2ef9-d7ed-414f-9a72-d70f82eb7375', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd9cc350a-7582-4b20-9e7d-72c3e056ba27', 'cc5d36b6-e755-434c-9f2f-68184e28fd02', 'commitment', 'CO-001', 'Change Order 1 - streamline sticky solutions', 'draft', -39802.66, 14);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('95a9100d-8192-4524-9307-3383b2eb3ae2', '89be2ef9-d7ed-414f-9a72-d70f82eb7375', 'adde3983-5aa5-40b0-b85b-3f99c80268b6', 1, 'Introducing the Malaysia-inspired Bacon, blending crafty style with local craftsmanship', -13267.55),
('df1f82ad-f806-42c9-a71f-c0b7e09b9700', '89be2ef9-d7ed-414f-9a72-d70f82eb7375', '27db8e8d-89fa-484a-894c-f2f0d4e1ca89', 2, 'New orange Mouse with ergonomic design for elegant comfort', -13267.55),
('af260a7e-fcf7-4a34-8326-c4c0f4b20b82', '89be2ef9-d7ed-414f-9a72-d70f82eb7375', '2b49c725-eaaa-4fd3-bcfb-d7c4e446d124', 3, 'Discover the frog-like agility of our Car, perfect for mysterious users', -13267.55);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('c5c21cdc-36eb-4edd-844a-26d290d02440', '2fcddb24-554b-4588-b252-f78f6956bb52', 'b346b52e-9c83-44ac-b713-7f483693e907', '789766c2-7b45-49c1-9bf9-c00859b97b6c', 'commitment', 'CO-001', 'Change Order 1 - iterate front-end web services', 'approved', 199988.30, 11);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('85ceafcd-1f38-4aa2-a36a-1cd9722d213e', 'c5c21cdc-36eb-4edd-844a-26d290d02440', '7556f214-47f7-45dc-bb70-ca44b00466e6', 1, 'Our bird-friendly Shirt ensures hairy comfort for your pets', 66662.77),
('09f8dc8a-453f-4d6f-a72d-8bba70229398', 'c5c21cdc-36eb-4edd-844a-26d290d02440', '0f181c55-3340-4555-84fe-f2e81dc9fcdc', 2, 'Professional-grade Cheese perfect for well-made training and recreational use', 66662.77),
('240b2c22-f0ea-403d-bd38-bd59fad42ac5', 'c5c21cdc-36eb-4edd-844a-26d290d02440', '719214df-368e-403a-8fb2-c57b52f9ed38', 3, 'Our tangy-inspired Towels brings a taste of luxury to your lovable lifestyle', 66662.77);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('c007e0e1-5ca8-4d20-8cda-da04f418c7b0', '2fcddb24-554b-4588-b252-f78f6956bb52', '17eb4e8a-29ed-4744-b281-ae5791d3172a', '789766c2-7b45-49c1-9bf9-c00859b97b6c', 'commitment', 'CO-002', 'Change Order 2 - whiteboard best-of-breed networks', 'approved', 120824.80, 16);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('321407e0-ce85-4e1a-adb6-f0aabac3d508', 'c007e0e1-5ca8-4d20-8cda-da04f418c7b0', '80e26241-d090-4149-928d-9a1d27e26f46', 1, 'Our juicy-inspired Tuna brings a taste of luxury to your splendid lifestyle', 40274.93),
('a5442e2c-fcbc-4bb0-8948-8f78eb5f62a3', 'c007e0e1-5ca8-4d20-8cda-da04f418c7b0', '80d1108a-84c7-44b7-a1e6-ad1f9f3cf2f7', 2, 'Our spicy-inspired Bacon brings a taste of luxury to your massive lifestyle', 40274.93),
('1e6760f4-bf84-4bc6-a07b-3b4aa80eee6c', 'c007e0e1-5ca8-4d20-8cda-da04f418c7b0', '2e202d0a-7e9f-49ee-b9a9-1b606a0bdc9e', 3, 'Goldner - Champlin's most advanced Fish technology increases crooked capabilities', 40274.93);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('f3417a0e-235c-498f-a196-74b92f31ce5d', '2fcddb24-554b-4588-b252-f78f6956bb52', '485fdffa-1fd1-4096-8447-8162e8c8e468', '789766c2-7b45-49c1-9bf9-c00859b97b6c', 'commitment', 'CO-003', 'Change Order 3 - grow cutting-edge applications', 'draft', 49142.17, 19);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('edbf8754-f8c2-4fdb-9bf1-5390d838f28e', 'f3417a0e-235c-498f-a196-74b92f31ce5d', '6965a331-93fa-4742-8b79-91a0aac4c1c6', 1, 'The Public-key neutral complexity Chicken offers reliable performance and tepid design', 49142.17);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('56278ac2-b65b-4a8e-9273-d43200403ce5', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd5665d01-18da-4710-a684-f147c9a8f867', 'a38ad051-e85b-4042-95a8-b1e774176a8f', 'commitment', 'CO-001', 'Change Order 1 - generate interactive content', 'approved', 86452.36, 26);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('810b68c6-071e-475c-883a-f74a6f899fb9', '56278ac2-b65b-4a8e-9273-d43200403ce5', 'fc2da6f7-698b-4260-8e32-400c2f877c46', 1, 'New orange Ball with ergonomic design for sophisticated comfort', 17290.47),
('af03e7ad-d044-47aa-b549-385d2301f143', '56278ac2-b65b-4a8e-9273-d43200403ce5', 'b2aaec27-3f5b-4012-8f4b-a1eeec5490d2', 2, 'Our monkey-friendly Gloves ensures pale comfort for your pets', 17290.47),
('1319a4c1-8b86-4b1e-9542-41d09572d4d3', '56278ac2-b65b-4a8e-9273-d43200403ce5', '93b9d91b-11ab-48bf-9086-eb02a70330fc', 3, 'Von - Botsford's most advanced Salad technology increases soulful capabilities', 17290.47),
('904faf33-bf49-4465-a230-91c27d6ee394', '56278ac2-b65b-4a8e-9273-d43200403ce5', '223a0dde-a137-4026-969d-2c18aef61a20', 4, 'Stylish Table designed to make you stand out with wise looks', 17290.47),
('1b592f75-5453-4277-a198-ae78e1a5f100', '56278ac2-b65b-4a8e-9273-d43200403ce5', '46c25ee2-0195-4e54-a7f4-8308159dd735', 5, 'Our juicy-inspired Computer brings a taste of luxury to your shy lifestyle', 17290.47);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('8ae3b38a-f7e4-45f0-9343-85b0c1e084bf', '2fcddb24-554b-4588-b252-f78f6956bb52', 'a71cec51-894c-4746-a9ee-725b4735fb44', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', 'CO-001', 'Change Order 1 - extend one-to-one schemas', 'draft', 18276.78, 19);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('f7da34b9-4c70-4511-bac6-e82689129e46', '8ae3b38a-f7e4-45f0-9343-85b0c1e084bf', '46c25ee2-0195-4e54-a7f4-8308159dd735', 1, 'Professional-grade Computer perfect for fond training and recreational use', 18276.78);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('36762dfa-4fe9-4aae-a529-22c9b87bc789', '2fcddb24-554b-4588-b252-f78f6956bb52', 'b346b52e-9c83-44ac-b713-7f483693e907', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', 'CO-002', 'Change Order 2 - gamify end-to-end relationships', 'draft', 25304.39, 15);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('d54998b9-78a5-4399-b862-e5ec5629e80c', '36762dfa-4fe9-4aae-a529-22c9b87bc789', '8a1a680f-def1-4919-a59a-baacbffc5c36', 1, 'The Quality-focused cohesive analyzer Mouse offers reliable performance and impressionable design', 25304.39);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('74348692-8c81-4d51-8aa9-07c280a095a4', '2fcddb24-554b-4588-b252-f78f6956bb52', 'b346b52e-9c83-44ac-b713-7f483693e907', '42c5c783-5c35-4adb-83c7-7a12e2d0531b', 'commitment', 'CO-001', 'Change Order 1 - monetize sustainable deliverables', 'pending', -14936.75, 11);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('432623eb-f1f4-4eeb-afe6-8df5e157266c', '74348692-8c81-4d51-8aa9-07c280a095a4', '0966b71a-b44f-4e30-98ae-9051cfe4a203', 1, 'The Roosevelt Car is the latest in a series of marvelous products from Jones, Johnson and Price', -7468.38),
('11ee6108-8560-4e7a-a186-4abbf977f8ec', '74348692-8c81-4d51-8aa9-07c280a095a4', '80d1108a-84c7-44b7-a1e6-ad1f9f3cf2f7', 2, 'Our delicious-inspired Soap brings a taste of luxury to your monthly lifestyle', -7468.38);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('b9708106-0d65-4fb2-90c9-df1cefd3cc44', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '7a206aeb-4dc0-44e7-b9a6-80d1bf44815f', '59cade7d-1da8-4c09-9aac-6ae476c1519e', 'commitment', 'CO-001', 'Change Order 1 - orchestrate intuitive niches', 'pending', 4962.53, 21);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('91db4976-e3e3-401f-a783-d150b3be49af', 'b9708106-0d65-4fb2-90c9-df1cefd3cc44', '5c6bb337-ffff-4c03-83c8-e8969b878fb4', 1, 'The Tate Fish is the latest in a series of irresponsible products from Volkman LLC', 1240.63),
('4c4a32d8-adbb-4011-9655-26ccc2897604', 'b9708106-0d65-4fb2-90c9-df1cefd3cc44', '7fc8d9b8-9fa5-478a-93a2-d0ae88bec44e', 2, 'The Brigitte Mouse is the latest in a series of key products from McCullough - Kuvalis', 1240.63),
('0e6c07df-cd02-4c01-bed1-a441ef95b640', 'b9708106-0d65-4fb2-90c9-df1cefd3cc44', 'f76f3bb9-04b4-49a2-8a1b-b4efc7250c89', 3, 'New Bike model with 38 GB RAM, 881 GB storage, and clueless features', 1240.63),
('b256c515-2c5c-4b54-a58a-7983e5a13c77', 'b9708106-0d65-4fb2-90c9-df1cefd3cc44', '1903d2a7-2b19-4ddc-860c-f70dc467a801', 4, 'Innovative Bike featuring delectable technology and Concrete construction', 1240.63);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('c18c2fe0-7fd8-401a-897d-b1afaa756f89', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3adb0472-5e32-4301-829a-a8eb37e4bf7e', '59cade7d-1da8-4c09-9aac-6ae476c1519e', 'commitment', 'CO-002', 'Change Order 2 - aggregate extensible infrastructures', 'draft', 144893.90, 25);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('4651bb1c-c164-4438-b009-395af15ba460', 'c18c2fe0-7fd8-401a-897d-b1afaa756f89', 'a0af8336-9ea1-49b5-956d-342cbb45172b', 1, 'Stylish Chair designed to make you stand out with instructive looks', 28978.78),
('dd1530c2-a6cf-4041-bd0f-8bdec2b742bc', 'c18c2fe0-7fd8-401a-897d-b1afaa756f89', '0bac9b30-b972-4526-8ae0-fa6294a4e3a9', 2, 'Incredible Shoes designed with Bamboo for fantastic performance', 28978.78),
('5ebf6858-a95d-4921-85b2-238c05799034', 'c18c2fe0-7fd8-401a-897d-b1afaa756f89', '7fc8d9b8-9fa5-478a-93a2-d0ae88bec44e', 3, 'Stylish Pants designed to make you stand out with curly looks', 28978.78),
('c2583eb4-4844-43ba-827d-56a3fb9f614e', 'c18c2fe0-7fd8-401a-897d-b1afaa756f89', 'b51cc60d-b2a3-48e8-aa1c-a952b68d3266', 4, 'Savor the salty essence in our Tuna, designed for burly culinary adventures', 28978.78),
('b174c8c9-9d34-48a6-acb7-098cb1e3026d', 'c18c2fe0-7fd8-401a-897d-b1afaa756f89', '87fb0b70-cae1-4773-bc64-331f93bc13b8', 5, 'Hane - Jones's most advanced Bacon technology increases sugary capabilities', 28978.78);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('50730dca-0efb-485f-b0ca-21edd954ac57', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '8724fad4-e54b-4f2f-9fcd-c430af2c68a8', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', 'CO-001', 'Change Order 1 - architect B2C technologies', 'draft', 23143.15, 19);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('06bb7cde-1689-4e4d-b16e-a9760e7801ed', '50730dca-0efb-485f-b0ca-21edd954ac57', 'ec2bedde-5db0-48bc-a570-ea58b470d78e', 1, 'Professional-grade Table perfect for glass training and recreational use', 23143.15);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('9d26206c-1804-4d33-ad55-190cf66b613a', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '8724fad4-e54b-4f2f-9fcd-c430af2c68a8', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', 'CO-002', 'Change Order 2 - collaborate killer metrics', 'draft', 44037.03, 25);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('8db6e5fa-4490-492f-8ac0-9faad647220a', '9d26206c-1804-4d33-ad55-190cf66b613a', 'ec2bedde-5db0-48bc-a570-ea58b470d78e', 1, 'Experience the maroon brilliance of our Bike, perfect for minor environments', 22018.52),
('65ef62fb-3964-4c39-9644-35257befa502', '9d26206c-1804-4d33-ad55-190cf66b613a', 'a9eb28d6-4122-4955-8e0d-d0a10e60c1ba', 2, 'Experience the cyan brilliance of our Bike, perfect for massive environments', 22018.52);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('75945200-49a8-455c-a1c1-d1e2bad66e83', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '8724fad4-e54b-4f2f-9fcd-c430af2c68a8', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', 'CO-003', 'Change Order 3 - architect B2B users', 'approved', 111632.30, 23);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('ff5e3a66-6fd0-4b95-be8d-ecc5852c678a', '75945200-49a8-455c-a1c1-d1e2bad66e83', '64840d1a-1f33-42d9-b332-22791be1bd1b', 1, 'Rustic Fish designed with Gold for wise performance', 27908.07),
('7dc26258-a4b7-4f04-90e5-0a7d26511512', '75945200-49a8-455c-a1c1-d1e2bad66e83', '8c417f67-1f88-4e05-b0ef-a6be8906b7af', 2, 'Our rich-inspired Bike brings a taste of luxury to your exalted lifestyle', 27908.07),
('012034e9-ea84-4286-a1dd-64f0115a414a', '75945200-49a8-455c-a1c1-d1e2bad66e83', 'ad525a5d-85ff-4808-ba45-7e1403c2411b', 3, 'Ergonomic Sausages made with Rubber for all-day torn support', 27908.07),
('12a09ec8-d84f-450d-a683-8001a4f4d15e', '75945200-49a8-455c-a1c1-d1e2bad66e83', '4dadfc2a-391a-4601-9ffc-bb5a3fa3771b', 4, 'The Dixie Chair is the latest in a series of quarrelsome products from Weimann Group', 27908.07);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('6f8019fa-2c99-4b7b-aa59-6dc8bbed3830', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'd73c16e0-a9de-4678-a25e-471945e38076', 'f84d6078-81eb-48d1-8b5b-98441104a67c', 'commitment', 'CO-001', 'Change Order 1 - transition leading-edge users', 'pending', 36642.53, 0);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('a3e9dd86-d166-4dbf-afbb-eaf96e426b68', '6f8019fa-2c99-4b7b-aa59-6dc8bbed3830', '7fc8d9b8-9fa5-478a-93a2-d0ae88bec44e', 1, 'Featuring Gadolinium-enhanced technology, our Tuna offers unparalleled mediocre performance', 18321.27),
('6853e8e1-b683-4b2d-9a8a-c3580a3f0486', '6f8019fa-2c99-4b7b-aa59-6dc8bbed3830', '6db3440f-b9ec-46f3-b95e-fcb42748f00f', 2, 'Professional-grade Bacon perfect for strict training and recreational use', 18321.27);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('6ccb15e9-5f62-4deb-a95d-87cdb159dd8d', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'd6405524-69cb-4811-a0bb-8363b0ce8f51', 'f84d6078-81eb-48d1-8b5b-98441104a67c', 'commitment', 'CO-002', 'Change Order 2 - utilize user-centric deliverables', 'approved', 108432.69, 7);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('b512e3c0-cabc-4ab0-aa64-2216f612a51e', '6ccb15e9-5f62-4deb-a95d-87cdb159dd8d', '37e8dd86-b9a1-47c4-b0c5-28f34db21202', 1, 'Featuring Holmium-enhanced technology, our Salad offers unparalleled uneven performance', 54216.35),
('b60f7424-c130-4ff6-91eb-b5764656b790', '6ccb15e9-5f62-4deb-a95d-87cdb159dd8d', 'a0af8336-9ea1-49b5-956d-342cbb45172b', 2, 'Professional-grade Chair perfect for unsung training and recreational use', 54216.35);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('2bd6fa04-dba3-49e1-a12e-bd8337fab558', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'cee79c58-163f-494e-bcdd-5f0fc7e0be01', 'f84d6078-81eb-48d1-8b5b-98441104a67c', 'commitment', 'CO-003', 'Change Order 3 - empower integrated convergence', 'approved', 91245.17, 6);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('67711d2d-c9d7-44d9-b0e1-ee1d4c5f6b77', '2bd6fa04-dba3-49e1-a12e-bd8337fab558', 'b51cc60d-b2a3-48e8-aa1c-a952b68d3266', 1, 'Our tender-inspired Shoes brings a taste of luxury to your elderly lifestyle', 18249.03),
('0bc028e7-a92a-4822-b7ba-7b30aa9291e2', '2bd6fa04-dba3-49e1-a12e-bd8337fab558', '87fb0b70-cae1-4773-bc64-331f93bc13b8', 2, 'The sleek and concrete Tuna comes with teal LED lighting for smart functionality', 18249.03),
('5fb60a70-66fd-4cbd-b2bb-5ac00f09d95b', '2bd6fa04-dba3-49e1-a12e-bd8337fab558', '4101052a-236f-4ea9-8c48-a252c1d34760', 3, 'The orchid Computer combines Oman aesthetics with Holmium-based durability', 18249.03),
('5535f31a-ec6f-4813-9ca4-7618531a7126', '2bd6fa04-dba3-49e1-a12e-bd8337fab558', '2417039b-18d9-440b-abd3-9a2d7e1d689b', 4, 'The Triple-buffered eco-centric infrastructure Soap offers reliable performance and nifty design', 18249.03),
('5cbd8a25-fd5b-403a-bc33-6f8512db4f85', '2bd6fa04-dba3-49e1-a12e-bd8337fab558', '1903d2a7-2b19-4ddc-860c-f70dc467a801', 5, 'Our spicy-inspired Pants brings a taste of luxury to your ripe lifestyle', 18249.03);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('51df033c-5031-445b-b300-3647588e4fbe', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'd6405524-69cb-4811-a0bb-8363b0ce8f51', '6b0f52b4-93ea-4811-9a37-7bed9822a513', 'commitment', 'CO-001', 'Change Order 1 - harness out-of-the-box niches', 'approved', 136368.82, 3);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('553d9ff5-6349-4291-a16b-e1f092e025ba', '51df033c-5031-445b-b300-3647588e4fbe', '04d853a4-381e-4e99-a464-61cea04a84b5', 1, 'Savor the delicious essence in our Keyboard, designed for youthful culinary adventures', 136368.82);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('39a4e47e-3658-4321-a8c5-5793621df0b7', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'd6405524-69cb-4811-a0bb-8363b0ce8f51', '4192a8c9-06d2-4741-aeba-a84384191caa', 'commitment', 'CO-001', 'Change Order 1 - whiteboard generative e-commerce', 'approved', 176783.21, 25);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('913ec80f-b8f7-4274-9d4f-196b6298ca6f', '39a4e47e-3658-4321-a8c5-5793621df0b7', '4da0c035-aaee-4a16-af55-7547f9243cf9', 1, 'New Computer model with 26 GB RAM, 394 GB storage, and adolescent features', 88391.60),
('f645ced6-d429-4d26-9559-73d65df9773d', '39a4e47e-3658-4321-a8c5-5793621df0b7', '473f4fe9-faf7-4c31-955c-52c87abe9cf1', 2, 'Introducing the Syrian Arab Republic-inspired Shoes, blending snoopy style with local craftsmanship', 88391.60);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('506fe6b8-4eb1-4b12-9f9e-8c354f2ad3be', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3adb0472-5e32-4301-829a-a8eb37e4bf7e', '4192a8c9-06d2-4741-aeba-a84384191caa', 'commitment', 'CO-002', 'Change Order 2 - whiteboard enterprise architectures', 'pending', 63381.35, 13);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('b3ebade7-d6f5-4b6b-ad78-7fcd827f0636', '506fe6b8-4eb1-4b12-9f9e-8c354f2ad3be', 'bd05dd5a-1800-4583-bfb9-95c6cc98cc72', 1, 'The Organic contextually-based product Bike offers reliable performance and wavy design', 63381.35);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('9b526cf4-df77-4ddf-b88b-b8164092c42f', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'ea7f23c5-877f-41bb-a589-ae867aabf2fa', '4192a8c9-06d2-4741-aeba-a84384191caa', 'commitment', 'CO-003', 'Change Order 3 - transition cross-media technologies', 'approved', 140888.33, 24);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('0e4afb3c-947c-4fa3-bb90-7ffb42ba7a6a', '9b526cf4-df77-4ddf-b88b-b8164092c42f', 'b9fe5f15-8a23-48c6-b66d-6dfcdffa938e', 1, 'Discover the back new Car with an exciting mix of Bronze ingredients', 35222.08),
('c02e3e24-897c-424b-bedb-c47865c457e3', '9b526cf4-df77-4ddf-b88b-b8164092c42f', '65a3e66e-3d71-44ea-b49b-979829d30288', 2, 'New gold Shoes with ergonomic design for worthy comfort', 35222.08),
('672d520c-62e3-4c56-9d0c-4490eca582db', '9b526cf4-df77-4ddf-b88b-b8164092c42f', '44d70152-489d-4756-b24f-7eb69b01c723', 3, 'Introducing the Nigeria-inspired Hat, blending happy style with local craftsmanship', 35222.08),
('df0e945e-fd49-49b8-ba64-3b50807a0d62', '9b526cf4-df77-4ddf-b88b-b8164092c42f', 'd3cd3077-44ce-4baa-aabd-96622d10d7d9', 4, 'Schoen - Bogan's most advanced Tuna technology increases shoddy capabilities', 35222.08);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('f8de252f-4e64-484c-a94b-59a29c5646f5', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '719ad787-71a7-46e1-908b-0569373a738e', '14dad579-10e4-43e0-bd3d-73b12f5b9d88', 'commitment', 'CO-001', 'Change Order 1 - evolve cross-platform interfaces', 'pending', 15148.57, 6);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('e38b013e-581a-4eed-9b2a-327cf4d21c25', 'f8de252f-4e64-484c-a94b-59a29c5646f5', '7a3421cb-5cb9-48d3-85bf-0f00a6c24fbf', 1, 'Weimann, Walker and Wunsch's most advanced Ball technology increases sophisticated capabilities', 5049.52),
('f6bfd7c0-5c27-4f7f-a41f-3f788b7a4074', 'f8de252f-4e64-484c-a94b-59a29c5646f5', '48bb7b22-eac5-4337-95c5-b0adef824d08', 2, 'Savor the savory essence in our Pants, designed for teeming culinary adventures', 5049.52),
('de6c87d6-cc64-462b-8300-bc623d755036', 'f8de252f-4e64-484c-a94b-59a29c5646f5', '96811d13-628d-4b6b-9e20-89d3e5a05584', 3, 'The Business-focused data-driven archive Chicken offers reliable performance and alienated design', 5049.52);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('20627f21-68af-4d47-a4a1-01e3cdfeac49', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '8724fad4-e54b-4f2f-9fcd-c430af2c68a8', 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e', 'commitment', 'CO-001', 'Change Order 1 - deploy scalable interfaces', 'approved', 159621.27, 11);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('24f96451-be71-4640-b69a-68f2bc31c7fd', '20627f21-68af-4d47-a4a1-01e3cdfeac49', '4da0c035-aaee-4a16-af55-7547f9243cf9', 1, 'Ergonomic Salad made with Wooden for all-day haunting support', 31924.25),
('a06786be-967b-4669-a665-29e85507edd3', '20627f21-68af-4d47-a4a1-01e3cdfeac49', '8d6647e9-b215-4321-ad02-3384a1b67d6c', 2, 'Our bear-friendly Cheese ensures noted comfort for your pets', 31924.25),
('87dda3ab-548b-4b3e-bf50-e5eb0d389e8b', '20627f21-68af-4d47-a4a1-01e3cdfeac49', 'd43d803c-fddc-4681-b6b9-221709f818cb', 3, 'The sleek and quick Pants comes with ivory LED lighting for smart functionality', 31924.25),
('abaf1606-383d-457d-92df-83d2099fef3f', '20627f21-68af-4d47-a4a1-01e3cdfeac49', 'b51cc60d-b2a3-48e8-aa1c-a952b68d3266', 4, 'The Vernon Chicken is the latest in a series of primary products from Collier, Kreiger and Monahan', 31924.25),
('19810a0c-cd17-4ca9-9e3f-2c4015f7cd45', '20627f21-68af-4d47-a4a1-01e3cdfeac49', '4dadfc2a-391a-4601-9ffc-bb5a3fa3771b', 5, 'The sleek and insecure Shoes comes with green LED lighting for smart functionality', 31924.25);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('ef556745-3720-4648-8551-7d3d87bea71f', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'ea7f23c5-877f-41bb-a589-ae867aabf2fa', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', 'CO-001', 'Change Order 1 - drive virtual ROI', 'approved', 109441.80, 4);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('4db641e9-bc76-4011-aff4-a519dd196592', 'ef556745-3720-4648-8551-7d3d87bea71f', '7d17922d-000d-4191-89b8-7c567edc1a0b', 1, 'The silver Pizza combines Cambodia aesthetics with Oxygen-based durability', 36480.60),
('6a707c8a-7985-4ce3-9c2a-cffa47572fb1', 'ef556745-3720-4648-8551-7d3d87bea71f', '9b7a4caa-f1a8-4676-a442-5737c98a8746', 2, 'Our squirrel-friendly Chips ensures disloyal comfort for your pets', 36480.60),
('e8ffbb94-6f04-404d-aa9b-49ebe099ae64', 'ef556745-3720-4648-8551-7d3d87bea71f', '0bac9b30-b972-4526-8ae0-fa6294a4e3a9', 3, 'Introducing the Gambia-inspired Chips, blending insidious style with local craftsmanship', 36480.60);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('1654614b-a006-4fcd-9de1-133b0617ca44', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'd73c16e0-a9de-4678-a25e-471945e38076', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', 'CO-002', 'Change Order 2 - repurpose scalable paradigms', 'pending', -45181.87, 2);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('6fd2ab40-fd4e-45c8-86c6-be2de69cb880', '1654614b-a006-4fcd-9de1-133b0617ca44', '6f4e8c36-966b-4db7-b1b4-54a7a3edc7c8', 1, 'Discover the mindless new Car with an exciting mix of Wooden ingredients', -11295.47),
('d9012d2e-5840-4d04-85e3-9daf4bd833b1', '1654614b-a006-4fcd-9de1-133b0617ca44', '8d4eb4e2-c4a5-4965-a95d-51f77b716b32', 2, 'New Keyboard model with 27 GB RAM, 773 GB storage, and sardonic features', -11295.47),
('1d2b44a6-5ab7-4f8e-aad8-a0607864664b', '1654614b-a006-4fcd-9de1-133b0617ca44', '73ec43c6-fcb9-431a-adaf-6ba6bf1038b0', 3, 'The Jerrell Pants is the latest in a series of faint products from Ward, Klocko and Fisher', -11295.47),
('beeb2a45-64d1-4766-8b43-b0afdb140606', '1654614b-a006-4fcd-9de1-133b0617ca44', 'a85457ac-1092-4333-8014-50d6e7fa9ec4', 4, 'The orange Mouse combines Aland Islands aesthetics with Arsenic-based durability', -11295.47);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('12705da0-8af4-456c-9f37-34095a7dc700', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'ca43710e-1467-4919-a6eb-2b1422a57b6e', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', 'CO-003', 'Change Order 3 - deploy magnetic synergies', 'approved', 116272.51, 8);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('36757610-623a-467b-b163-22a3b794448f', '12705da0-8af4-456c-9f37-34095a7dc700', '98e75e90-4cc6-4f5d-b519-bf0b9b317b31', 1, 'The sleek and unrealistic Bacon comes with pink LED lighting for smart functionality', 23254.50),
('83c2263e-1a53-4346-956a-850c3a5ab07d', '12705da0-8af4-456c-9f37-34095a7dc700', 'afb16aa7-03cf-438a-94d7-d9b5206ee6c9', 2, 'Our zebra-friendly Car ensures biodegradable comfort for your pets', 23254.50),
('ee397eff-8ea6-4401-8b94-f7d3026724f7', '12705da0-8af4-456c-9f37-34095a7dc700', '4da0c035-aaee-4a16-af55-7547f9243cf9', 3, 'Our lion-friendly Sausages ensures crazy comfort for your pets', 23254.50),
('f2847156-db62-4bc2-9110-34b789d0a571', '12705da0-8af4-456c-9f37-34095a7dc700', '2ec0f9a0-ed6a-49d6-9549-320d19dd50e0', 4, 'The sleek and rich Bacon comes with purple LED lighting for smart functionality', 23254.50),
('777dc30b-8ab4-4a19-b763-ba3c32a06c80', '12705da0-8af4-456c-9f37-34095a7dc700', '7fc8d9b8-9fa5-478a-93a2-d0ae88bec44e', 5, 'Discover the warm new Pants with an exciting mix of Granite ingredients', 23254.50);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('5170452b-4e2e-4864-b1ab-c49347e9ec0e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3adb0472-5e32-4301-829a-a8eb37e4bf7e', '74503d45-09b3-4c30-afd0-82edc68859d4', 'commitment', 'CO-001', 'Change Order 1 - gamify decentralized large language models', 'approved', 39671.04, 16);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('24f4bcda-770c-41df-9ecf-eb018e221981', '5170452b-4e2e-4864-b1ab-c49347e9ec0e', '9b7a4caa-f1a8-4676-a442-5737c98a8746', 1, 'New Towels model with 6 GB RAM, 856 GB storage, and definitive features', 13223.68),
('e2393eb0-99a1-40c9-bbed-645d19722b55', '5170452b-4e2e-4864-b1ab-c49347e9ec0e', '948d2812-72d3-4d5a-babc-1ebf2af41384', 2, 'Ergonomic Bike made with Cotton for all-day fragrant support', 13223.68),
('58e1d78a-c584-4781-a73e-8a2d53f3f022', '5170452b-4e2e-4864-b1ab-c49347e9ec0e', '4dadfc2a-391a-4601-9ffc-bb5a3fa3771b', 3, 'Our wolf-friendly Pants ensures usable comfort for your pets', 13223.68);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('86fc0047-ea22-4c0f-9b80-edbd1e9ffb3e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'bb60f976-22a1-4d85-b717-fe4e4bbdd0eb', '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee', 'commitment', 'CO-001', 'Change Order 1 - deliver global partnerships', 'draft', -41765.32, 20);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('65dcdecb-2cb4-47cd-9ae4-91e4a345f9a2', '86fc0047-ea22-4c0f-9b80-edbd1e9ffb3e', '8d4eb4e2-c4a5-4965-a95d-51f77b716b32', 1, 'Ergonomic Computer made with Bronze for all-day foolish support', -41765.32);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('328d5c5e-a147-4ead-b984-cbfdd720a606', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'd6405524-69cb-4811-a0bb-8363b0ce8f51', '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee', 'commitment', 'CO-002', 'Change Order 2 - enhance frictionless functionalities', 'approved', 61470.04, 13);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('4d4011bd-571c-44b4-b7e3-dd8529f4320a', '328d5c5e-a147-4ead-b984-cbfdd720a606', '4d37abcf-ce77-4b30-bb3f-a509dd1ed897', 1, 'Stylish Sausages designed to make you stand out with puny looks', 12294.01),
('8f273c82-8e41-44ed-994f-7972a07b2382', '328d5c5e-a147-4ead-b984-cbfdd720a606', '82df180f-e854-4aef-895c-0347d5582d02', 2, 'The Donavon Cheese is the latest in a series of nutritious products from Fisher Inc', 12294.01),
('378dcc4f-907e-4b5c-a22a-368c9ad792ad', '328d5c5e-a147-4ead-b984-cbfdd720a606', '1349a38c-9288-456d-af94-9e0f0166105e', 3, 'Our crunchy-inspired Chicken brings a taste of luxury to your disloyal lifestyle', 12294.01),
('b225e619-5430-4f48-a7b4-609e2dbd860e', '328d5c5e-a147-4ead-b984-cbfdd720a606', '22ecddb9-c60c-47c9-9d3f-f612f7ab25f0', 4, 'Professional-grade Towels perfect for reasonable training and recreational use', 12294.01),
('0eb5631b-23b1-4d8d-a1b5-d46e6ce99126', '328d5c5e-a147-4ead-b984-cbfdd720a606', '2ec0f9a0-ed6a-49d6-9549-320d19dd50e0', 5, 'Professional-grade Computer perfect for biodegradable training and recreational use', 12294.01);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('c35f418b-eb5a-428f-9a2a-8bdcb45b8632', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '7a206aeb-4dc0-44e7-b9a6-80d1bf44815f', '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee', 'commitment', 'CO-003', 'Change Order 3 - utilize quantum convergence', 'approved', 10128.07, 19);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('9b8031a8-0527-40d2-9e1b-354c5cb4e533', 'c35f418b-eb5a-428f-9a2a-8bdcb45b8632', '8d4eb4e2-c4a5-4965-a95d-51f77b716b32', 1, 'New pink Pizza with ergonomic design for responsible comfort', 5064.03),
('8a0f4ba0-db48-47f8-ac27-a86d6c82957a', 'c35f418b-eb5a-428f-9a2a-8bdcb45b8632', '8d6647e9-b215-4321-ad02-3384a1b67d6c', 2, 'Our tangy-inspired Table brings a taste of luxury to your lazy lifestyle', 5064.03);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('3fd9e36b-13cd-4635-8b13-938bbb1d2166', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'd6405524-69cb-4811-a0bb-8363b0ce8f51', 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128', 'commitment', 'CO-001', 'Change Order 1 - drive holistic systems', 'pending', 21806.34, 26);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('f5d50f50-b0da-4a91-a385-cf9fac684443', '3fd9e36b-13cd-4635-8b13-938bbb1d2166', '5c6bb337-ffff-4c03-83c8-e8969b878fb4', 1, 'Discover the unfit new Table with an exciting mix of Wooden ingredients', 5451.59),
('4c995586-52f6-4bfb-98a2-593e4cb8e879', '3fd9e36b-13cd-4635-8b13-938bbb1d2166', 'e969527d-ad3b-4a36-a27d-f82208afcb0e', 2, 'Stylish Sausages designed to make you stand out with primary looks', 5451.59),
('cd9cf36f-933b-44fd-8257-5be3bc8c58a5', '3fd9e36b-13cd-4635-8b13-938bbb1d2166', 'b51cc60d-b2a3-48e8-aa1c-a952b68d3266', 3, 'The Streamlined human-resource service-desk Ball offers reliable performance and sudden design', 5451.59),
('4f19bb20-2f68-4343-8f30-cee79354fa29', '3fd9e36b-13cd-4635-8b13-938bbb1d2166', 'cc5acf66-727b-4572-9e59-ab1623f826ff', 4, 'Savor the crispy essence in our Tuna, designed for bossy culinary adventures', 5451.59);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('5221769b-d4b1-4e28-821e-a2db36ddf843', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '7a206aeb-4dc0-44e7-b9a6-80d1bf44815f', 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128', 'commitment', 'CO-002', 'Change Order 2 - deliver extensible content', 'approved', -17855.61, 18);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('61875e22-9b66-46bd-8a42-626156e6c825', '5221769b-d4b1-4e28-821e-a2db36ddf843', '93d28381-a068-430a-a7fc-68751059a84b', 1, 'Schumm - Volkman's most advanced Gloves technology increases bustling capabilities', -3571.12),
('3a596ea7-bffc-4bd5-b120-a4e0eb1b9ac5', '5221769b-d4b1-4e28-821e-a2db36ddf843', 'd43d803c-fddc-4681-b6b9-221709f818cb', 2, 'Innovative Sausages featuring pessimistic technology and Rubber construction', -3571.12),
('06343a7c-2da2-4083-8f97-2f19d38aa965', '5221769b-d4b1-4e28-821e-a2db36ddf843', 'cc5acf66-727b-4572-9e59-ab1623f826ff', 3, 'Featuring Caesium-enhanced technology, our Chair offers unparalleled friendly performance', -3571.12),
('dcc81e6b-1a04-4391-ba7c-8d8360c1183d', '5221769b-d4b1-4e28-821e-a2db36ddf843', '22ecddb9-c60c-47c9-9d3f-f612f7ab25f0', 4, 'Stylish Computer designed to make you stand out with athletic looks', -3571.12),
('b057a377-0381-4a9b-8091-00e03d38c20e', '5221769b-d4b1-4e28-821e-a2db36ddf843', '2ec0f9a0-ed6a-49d6-9549-320d19dd50e0', 5, 'Professional-grade Mouse perfect for wasteful training and recreational use', -3571.12);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('8707f3de-ad78-409d-b46a-3977ba77f643', 'e1dba243-0107-4061-a232-ecce67b29b72', '05ed85f0-4220-4d9b-9b12-dfb764de48e2', '626e1cd6-d553-4cff-a326-affc1a9c1e0b', 'commitment', 'CO-001', 'Change Order 1 - visualize intuitive systems', 'draft', 8257.55, 2);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('85bf9cf2-2841-49ff-895b-303908d7a3ab', '8707f3de-ad78-409d-b46a-3977ba77f643', '3e2f7951-41cc-43de-8407-d39933a8f11c', 1, 'Ergonomic Bacon made with Aluminum for all-day enlightened support', 8257.55);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('03e45515-fdea-4b94-8e83-83cbaa137927', 'e1dba243-0107-4061-a232-ecce67b29b72', '05ed85f0-4220-4d9b-9b12-dfb764de48e2', '626e1cd6-d553-4cff-a326-affc1a9c1e0b', 'commitment', 'CO-002', 'Change Order 2 - transition leading-edge relationships', 'draft', 54144.48, 9);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('d7c3a24b-900d-4c19-8f2c-51855322bfff', '03e45515-fdea-4b94-8e83-83cbaa137927', '2ffcf357-3666-4ffb-8573-7d96c4fe698a', 1, 'Ergonomic Table made with Concrete for all-day mad support', 54144.48);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('b6db2336-bf90-4ca5-a5e8-5badeb9559fd', 'e1dba243-0107-4061-a232-ecce67b29b72', 'efcba165-d273-4850-b8eb-1917630c020b', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', 'CO-001', 'Change Order 1 - generate next-generation smart contracts', 'approved', 79835.30, 10);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('eee83e0d-3f0d-4377-8d7b-39b4678677be', 'b6db2336-bf90-4ca5-a5e8-5badeb9559fd', '7aaeb25a-3b5c-45a0-aa42-082fff3a8e28', 1, 'Our rich-inspired Shoes brings a taste of luxury to your crafty lifestyle', 79835.30);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('0ec5d209-1757-489f-9c03-3c2945274649', 'e1dba243-0107-4061-a232-ecce67b29b72', 'e8c361f4-f57a-42db-aa74-2dafe1befa10', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', 'CO-002', 'Change Order 2 - simplify cutting-edge experiences', 'draft', 82548.98, 17);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('f03e4903-be06-455b-9628-cf519de2c4dd', '0ec5d209-1757-489f-9c03-3c2945274649', '50326917-0ea7-4b28-a648-b26f4c439b4a', 1, 'The Elinor Chicken is the latest in a series of smug products from Hermann, McLaughlin and White', 41274.49),
('2597a469-c682-47da-b8db-7db2e7f67608', '0ec5d209-1757-489f-9c03-3c2945274649', '85c658b0-3af9-43f4-9063-dd30b7d3a69f', 2, 'Stylish Pants designed to make you stand out with better looks', 41274.49);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('b0432b8b-20d6-4199-ad55-545125f12276', 'e1dba243-0107-4061-a232-ecce67b29b72', '0dae7ca8-7601-4878-ae87-962637167e7e', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', 'CO-003', 'Change Order 3 - grow sticky experiences', 'approved', -39053.61, 19);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('95c27616-58c2-4b80-a27f-985182562df1', 'b0432b8b-20d6-4199-ad55-545125f12276', '87c6d5aa-6dde-413d-b6f2-9ef72573396d', 1, 'The turquoise Gloves combines Ukraine aesthetics with Californium-based durability', -19526.81),
('372501d7-86e7-4d5f-8fbc-940d4bcaa454', 'b0432b8b-20d6-4199-ad55-545125f12276', '01a77bfe-6a58-4bb5-97d6-b8dda7144d37', 2, 'Savor the savory essence in our Keyboard, designed for mysterious culinary adventures', -19526.81);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('97d98e67-8b05-4464-b45e-20251d04599c', 'e1dba243-0107-4061-a232-ecce67b29b72', '3f16382d-63cc-4689-97f6-f71bd8436ebd', 'ac707aeb-428f-49b6-a6cb-a995c112f5c5', 'commitment', 'CO-001', 'Change Order 1 - empower leading-edge channels', 'draft', 68506.62, 20);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('8f95c6cd-8f6f-4607-8c9f-84cb284c08c1', '97d98e67-8b05-4464-b45e-20251d04599c', '3f60b417-d5cb-4b1c-b781-720682f855d5', 1, 'Handcrafted Soap designed with Bronze for outlandish performance', 68506.62);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('a888c4c1-b731-4937-aefd-72ecf6376286', 'e1dba243-0107-4061-a232-ecce67b29b72', '2e89a716-99a4-4406-8d92-63ebc666ce34', '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc', 'commitment', 'CO-001', 'Change Order 1 - disintermediate immersive systems', 'pending', 90832.85, 25);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('a1a7af86-8f86-4512-b3db-6983f30e7949', 'a888c4c1-b731-4937-aefd-72ecf6376286', '3666d3fb-f645-4288-a65c-8d594093ece3', 1, 'Discover the infinite new Shoes with an exciting mix of Granite ingredients', 30277.62),
('886ce3cb-b803-4881-8516-a13be6732553', 'a888c4c1-b731-4937-aefd-72ecf6376286', '6130adf3-8417-40d8-aba7-711388c6a9c9', 2, 'The Deonte Mouse is the latest in a series of important products from Denesik LLC', 30277.62),
('3856f844-7765-4fcd-8076-ae80ed8dd39a', 'a888c4c1-b731-4937-aefd-72ecf6376286', '59bf4b2a-a538-47a3-876b-2f683b651f1d', 3, 'Electronic Shirt designed with Silk for silent performance', 30277.62);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('e025e779-6ec5-4b98-9e59-fd3cc99e6f8f', 'e1dba243-0107-4061-a232-ecce67b29b72', '05ed85f0-4220-4d9b-9b12-dfb764de48e2', '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc', 'commitment', 'CO-002', 'Change Order 2 - orchestrate viral lifetime value', 'approved', 181427.54, 17);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('ca72b510-2ef2-4ee5-ad87-8f678de366ba', 'e025e779-6ec5-4b98-9e59-fd3cc99e6f8f', '29a08a4e-79f5-47bc-9c17-e9fd6edd8283', 1, 'The Universal client-driven implementation Keyboard offers reliable performance and descriptive design', 45356.89),
('1966d312-d743-450f-94c9-e297a5561d86', 'e025e779-6ec5-4b98-9e59-fd3cc99e6f8f', '6130adf3-8417-40d8-aba7-711388c6a9c9', 2, 'Introducing the Gibraltar-inspired Hat, blending lucky style with local craftsmanship', 45356.89),
('0d3b11db-5e9c-4dcb-8384-89fbf0494560', 'e025e779-6ec5-4b98-9e59-fd3cc99e6f8f', '3a021c63-d1fe-431e-b965-138b34eaffee', 3, 'The sleek and liquid Pizza comes with lime LED lighting for smart functionality', 45356.89),
('ee4a184a-f45f-4229-b9b0-fd76437f6737', 'e025e779-6ec5-4b98-9e59-fd3cc99e6f8f', '50c65d31-f080-4302-aa65-cdb22946d7dc', 4, 'Professional-grade Pants perfect for good training and recreational use', 45356.89);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('dd416590-6082-476d-b941-6e04df673af1', 'e1dba243-0107-4061-a232-ecce67b29b72', '3f16382d-63cc-4689-97f6-f71bd8436ebd', 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef', 'commitment', 'CO-001', 'Change Order 1 - revolutionize dynamic e-commerce', 'pending', -20641.18, 5);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('42a2a084-67da-433c-a6cb-f116f3f6e058', 'dd416590-6082-476d-b941-6e04df673af1', 'daa0b172-bd62-4e65-b290-ed8d880c68e1', 1, 'Experience the azure brilliance of our Bacon, perfect for jam-packed environments', -10320.59),
('0349c6f5-e9ef-4a34-92f7-6a005c25450b', 'dd416590-6082-476d-b941-6e04df673af1', '97cef093-e182-4359-84b9-dc9265c5e080', 2, 'Featuring Dysprosium-enhanced technology, our Hat offers unparalleled knowledgeable performance', -10320.59);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('efcde8bf-52cf-48b2-9ff6-1c3a957660f6', 'e1dba243-0107-4061-a232-ecce67b29b72', 'e2b10491-34e3-4941-b69a-0452dea27eaa', '09abfc08-9779-4926-a6e7-53bad423a4f6', 'commitment', 'CO-001', 'Change Order 1 - benchmark intuitive solutions', 'pending', 70022.28, 15);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('ee085807-591a-4f91-9ec5-2a943083a6e4', 'efcde8bf-52cf-48b2-9ff6-1c3a957660f6', '788da87e-9ba3-4a92-b952-897fe4a28a33', 1, 'Innovative Chips featuring nocturnal technology and Gold construction', 35011.14),
('558a781f-da90-40e4-88ac-472192cfa8d8', 'efcde8bf-52cf-48b2-9ff6-1c3a957660f6', '3666d3fb-f645-4288-a65c-8d594093ece3', 2, 'Ergonomic Car made with Bronze for all-day grubby support', 35011.14);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('191f1d4f-a52a-4408-88e5-d27faa8920b0', 'e1dba243-0107-4061-a232-ecce67b29b72', '345f0747-1224-4af0-8376-2ab96344a35a', '09abfc08-9779-4926-a6e7-53bad423a4f6', 'commitment', 'CO-002', 'Change Order 2 - productize user-centric partnerships', 'draft', -40919.36, 27);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('27640304-1818-4e5f-91f1-6d909df69eb6', '191f1d4f-a52a-4408-88e5-d27faa8920b0', '6b670f1c-75cd-4847-a07c-198009ac3cd4', 1, 'Discover the gorilla-like agility of our Mouse, perfect for unfinished users', -20459.68),
('3245097a-f284-47c3-b2a8-3a1e3aae3307', '191f1d4f-a52a-4408-88e5-d27faa8920b0', 'd1b5cbe9-f198-489f-a796-ee23e33f0a59', 2, 'New black Tuna with ergonomic design for glossy comfort', -20459.68);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('9ab6ee7b-fabc-480c-94cc-21ce17b8a48e', 'e1dba243-0107-4061-a232-ecce67b29b72', '8e9aa595-507f-45d4-a72d-6fc93b3dff29', '19bc439f-38c5-4667-a2be-7a43eac9a846', 'commitment', 'CO-001', 'Change Order 1 - orchestrate extensible models', 'pending', 16172.61, 29);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('4bdb47cd-0717-4756-8ea2-1537118142c0', '9ab6ee7b-fabc-480c-94cc-21ce17b8a48e', '44603e30-7839-4808-921f-ef9a62fccaa7', 1, 'Our bee-friendly Bacon ensures unruly comfort for your pets', 16172.61);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('8b7bc348-34de-4f39-bf23-b9aa43807db0', 'e1dba243-0107-4061-a232-ecce67b29b72', '20cc40e6-3bea-470a-b662-ecced5c9d4c3', '19bc439f-38c5-4667-a2be-7a43eac9a846', 'commitment', 'CO-002', 'Change Order 2 - disintermediate synergistic schemas', 'approved', 65013.45, 25);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('aa0c4ab8-93e6-4b2b-a8fc-7341d43b4955', '8b7bc348-34de-4f39-bf23-b9aa43807db0', 'ac97ef69-b411-4834-8535-2c0474718710', 1, 'The Camren Chips is the latest in a series of practical products from Heller, Hintz and Casper', 32506.73),
('0f71212e-7012-4dba-9619-cd5656158638', '8b7bc348-34de-4f39-bf23-b9aa43807db0', '85c658b0-3af9-43f4-9063-dd30b7d3a69f', 2, 'Introducing the Botswana-inspired Computer, blending prickly style with local craftsmanship', 32506.73);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('c180c77a-5a2e-4b36-9f3b-6fb2fbb26f75', 'e1dba243-0107-4061-a232-ecce67b29b72', '3f16382d-63cc-4689-97f6-f71bd8436ebd', '92382a85-0a85-49eb-8ee4-cf744cca9456', 'commitment', 'CO-001', 'Change Order 1 - engage virtual partnerships', 'draft', 67354.57, 28);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('9b6d0ae0-7929-432a-8a83-57c25f6b3cbd', 'c180c77a-5a2e-4b36-9f3b-6fb2fbb26f75', 'fff6343f-c130-4f40-94d7-51e68a5a00e9', 1, 'Discover the snake-like agility of our Computer, perfect for sick users', 13470.91),
('ffea4778-3bc5-46a8-8567-b99d778f59ab', 'c180c77a-5a2e-4b36-9f3b-6fb2fbb26f75', '3e2f7951-41cc-43de-8407-d39933a8f11c', 2, 'The sleek and unused Cheese comes with lavender LED lighting for smart functionality', 13470.91),
('90dbf24f-da00-4c4c-97c1-d04457327283', 'c180c77a-5a2e-4b36-9f3b-6fb2fbb26f75', '13debb06-a196-4e87-92db-86a03bc10bde', 3, 'The sleek and emotional Tuna comes with mint green LED lighting for smart functionality', 13470.91),
('8737b345-61ad-4480-989c-0d64ca22f846', 'c180c77a-5a2e-4b36-9f3b-6fb2fbb26f75', '3a021c63-d1fe-431e-b965-138b34eaffee', 4, 'Ergonomic Bike made with Bamboo for all-day dismal support', 13470.91),
('5e8120c5-a988-4fa7-80a0-a26cef86b2ab', 'c180c77a-5a2e-4b36-9f3b-6fb2fbb26f75', '238c91ed-2f5c-4100-bcb8-93e807f94e48', 5, 'Discover the fox-like agility of our Bacon, perfect for far-off users', 13470.91);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('1a9f6c52-8a9d-4cfb-ac45-d43d92ef0f11', 'e1dba243-0107-4061-a232-ecce67b29b72', '7bb11c3f-bd00-4332-811c-8db12f64040e', '92382a85-0a85-49eb-8ee4-cf744cca9456', 'commitment', 'CO-002', 'Change Order 2 - aggregate global deliverables', 'approved', 13261.22, 13);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('cd51896f-3955-41d3-83d2-22c775c1cae5', '1a9f6c52-8a9d-4cfb-ac45-d43d92ef0f11', 'ac97ef69-b411-4834-8535-2c0474718710', 1, 'Effertz Inc's most advanced Salad technology increases weird capabilities', 6630.61),
('515f82c8-9d08-4756-9e60-aeec31262b00', '1a9f6c52-8a9d-4cfb-ac45-d43d92ef0f11', '02684caf-4ab5-4437-92b5-8c92d109fa7c', 2, 'The Dusty Fish is the latest in a series of quarterly products from Okuneva - Wintheiser', 6630.61);

INSERT INTO change_orders (id, project_id, change_event_id, contract_id, contract_type, number, title, status, total_amount, schedule_impact_days) VALUES
('c8c40095-6c4f-4e30-b8b0-8c15f0627034', 'e1dba243-0107-4061-a232-ecce67b29b72', 'efcba165-d273-4850-b8eb-1917630c020b', '5de2dde5-0b6b-4500-82e0-8c4b14d318a9', 'commitment', 'CO-001', 'Change Order 1 - benchmark next-generation e-commerce', 'approved', 194719.03, 26);

INSERT INTO change_order_line_items (id, change_order_id, cost_code_id, line_number, description, amount) VALUES
('709f5feb-5c31-4d54-af50-f1c226432f27', 'c8c40095-6c4f-4e30-b8b0-8c15f0627034', '2ffcf357-3666-4ffb-8573-7d96c4fe698a', 1, 'Innovative Pants featuring superb technology and Bronze construction', 64906.34),
('ee514a5d-bb33-497c-9784-b5040a4ef5d7', 'c8c40095-6c4f-4e30-b8b0-8c15f0627034', '914e3d51-ba3a-47af-807f-1e9fe525342b', 2, 'Introducing the Oman-inspired Computer, blending lumbering style with local craftsmanship', 64906.34),
('a65397a7-c13c-479d-8ed9-3bbe7ee6684d', 'c8c40095-6c4f-4e30-b8b0-8c15f0627034', '238c91ed-2f5c-4100-bcb8-93e807f94e48', 3, 'Discover the sea lion-like agility of our Shirt, perfect for unsung users', 64906.34);

-- Billing Periods
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('e2f3a789-739b-420d-96df-d88b8cd71ed2', '2fcddb24-554b-4588-b252-f78f6956bb52', 1, 'May 2025', '2025-05-20', '2025-06-19', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('d2f54a38-dd7d-4900-922e-3107131b55ff', '2fcddb24-554b-4588-b252-f78f6956bb52', 2, 'June 2025', '2025-06-20', '2025-07-19', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('3d87df8f-db55-4c12-8a4f-bbbed6a0b068', '2fcddb24-554b-4588-b252-f78f6956bb52', 3, 'July 2025', '2025-07-20', '2025-08-19', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('8629df99-af6f-4f7f-9527-f3365f2f8a59', '2fcddb24-554b-4588-b252-f78f6956bb52', 4, 'August 2025', '2025-08-20', '2025-09-19', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('18e98840-a013-468f-881b-f86cc7f9b363', '2fcddb24-554b-4588-b252-f78f6956bb52', 5, 'September 2025', '2025-09-20', '2025-10-19', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('b6f86877-3770-412f-bbe4-b3ad9c6665e6', '2fcddb24-554b-4588-b252-f78f6956bb52', 6, 'October 2025', '2025-10-20', '2025-11-19', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('fc41712e-8026-4ccc-a294-a75113b72ec3', '2fcddb24-554b-4588-b252-f78f6956bb52', 7, 'November 2025', '2025-11-20', '2025-12-19', 'open');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('a35f8dd6-7da5-4ce8-9344-ca52d3eb1d0e', '2fcddb24-554b-4588-b252-f78f6956bb52', 8, 'December 2025', '2025-12-20', '2026-01-19', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('cc4ac6f4-2377-4021-85b6-b343b796502d', '2fcddb24-554b-4588-b252-f78f6956bb52', 9, 'January 2026', '2026-01-20', '2026-02-19', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('54c9952a-1d67-47c4-b446-667015242c74', '2fcddb24-554b-4588-b252-f78f6956bb52', 10, 'February 2026', '2026-02-20', '2026-03-19', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('8e01943e-2048-4e28-b75e-3b50363fe89c', '2fcddb24-554b-4588-b252-f78f6956bb52', 11, 'March 2026', '2026-03-20', '2026-04-19', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('13a0f2e3-bce9-4575-9286-03dece4645e2', '2fcddb24-554b-4588-b252-f78f6956bb52', 12, 'April 2026', '2026-04-20', '2026-05-19', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('3c653560-dae6-4681-9c3e-c2a08d144162', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 1, 'April 2025', '2025-04-12', '2025-05-11', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('fdf7314e-b948-4b25-b5e7-d242ccf15571', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 2, 'May 2025', '2025-05-12', '2025-06-11', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 3, 'June 2025', '2025-06-12', '2025-07-11', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('187dfc8d-baec-4501-b3c6-915277d08b10', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 4, 'July 2025', '2025-07-12', '2025-08-11', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('e4eb15f4-7060-45cf-9224-3b10acecfb15', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 5, 'August 2025', '2025-08-12', '2025-09-11', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('1d202021-080f-4f42-b289-52c16d7258c5', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 6, 'September 2025', '2025-09-12', '2025-10-11', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('21c2071f-2c49-4c6c-92f7-28cf08437e5f', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 7, 'October 2025', '2025-10-12', '2025-11-11', 'open');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('b6d1b3cb-dae3-4409-bb9b-52f13b2c3309', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 8, 'November 2025', '2025-11-12', '2025-12-11', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('21b447f2-10e5-4d50-aae3-4ca2b879eb0c', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 9, 'December 2025', '2025-12-12', '2026-01-11', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('c7d59068-13dd-4be5-a85f-36d91b261ed6', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 10, 'January 2026', '2026-01-12', '2026-02-11', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('e65bf068-e9cb-48e3-afef-fa7b7ad43f5f', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 11, 'February 2026', '2026-02-12', '2026-03-11', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('52e00d32-32bc-4eb5-9370-81411ac38f04', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 12, 'March 2026', '2026-03-12', '2026-04-11', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', 'e1dba243-0107-4061-a232-ecce67b29b72', 1, 'November 2025', '2025-11-11', '2025-12-10', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('f9ee9800-d929-4123-a95a-50df8e0fde4e', 'e1dba243-0107-4061-a232-ecce67b29b72', 2, 'December 2025', '2025-12-11', '2026-01-10', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', 'e1dba243-0107-4061-a232-ecce67b29b72', 3, 'January 2026', '2026-01-11', '2026-02-10', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', 'e1dba243-0107-4061-a232-ecce67b29b72', 4, 'February 2026', '2026-02-11', '2026-03-10', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('cebce4f4-f8dd-42d1-956c-1074527ad85f', 'e1dba243-0107-4061-a232-ecce67b29b72', 5, 'March 2026', '2026-03-11', '2026-04-10', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('52b3e534-370f-4e56-a4a3-6903e5ff19d6', 'e1dba243-0107-4061-a232-ecce67b29b72', 6, 'April 2026', '2026-04-11', '2026-05-10', 'closed');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('8d15b180-6c44-4ade-b566-bbfe16418ce5', 'e1dba243-0107-4061-a232-ecce67b29b72', 7, 'May 2026', '2026-05-11', '2026-06-10', 'open');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('221e5f6b-8f1b-4538-b55c-af2438b51d1b', 'e1dba243-0107-4061-a232-ecce67b29b72', 8, 'June 2026', '2026-06-11', '2026-07-10', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('6fe13f06-0048-4fbf-b3e9-96d15fbbc9f7', 'e1dba243-0107-4061-a232-ecce67b29b72', 9, 'July 2026', '2026-07-11', '2026-08-10', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('095f8e35-faa8-4f05-ab9d-8ad639cff3ed', 'e1dba243-0107-4061-a232-ecce67b29b72', 10, 'August 2026', '2026-08-11', '2026-09-10', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('9f9a6b09-2f4e-4323-94c5-4350ac5e1b40', 'e1dba243-0107-4061-a232-ecce67b29b72', 11, 'September 2026', '2026-09-11', '2026-10-10', 'future');
INSERT INTO billing_periods (id, project_id, period_number, period_name, period_start, period_end, status) VALUES
('b678eb3e-f1ba-4ae2-8e5f-2412b3505057', 'e1dba243-0107-4061-a232-ecce67b29b72', 12, 'October 2026', '2026-10-11', '2026-11-10', 'future');

-- Invoices

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('b6d4ea2c-6760-4018-895a-1a717a7dab63', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', 'INV-1952', 1, '2025-06-19', '2025-06-19', 'draft', 8.33, 19452090.13, 0.00, 1621007.51, 0.00, 0.00, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'b6d4ea2c-6760-4018-895a-1a717a7dab63', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '8875df4f-af7e-433e-bca0-7752fd5b3a80' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('76b3d8c4-59c5-4489-8f83-c6759a52f524', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', 'INV-5249', 2, '2025-07-19', '2025-07-19', 'approved', 16.67, 19452090.13, 1621007.51, 1621007.51, 0.00, 0.00, 1621007.51);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '76b3d8c4-59c5-4489-8f83-c6759a52f524', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '8875df4f-af7e-433e-bca0-7752fd5b3a80' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('927279ad-e024-42f4-bd9e-4aa0f9fc5133', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', 'INV-6383', 3, '2025-08-19', '2025-08-19', 'paid', 25.00, 19452090.13, 3242015.02, 1621007.51, 0.00, 0.00, 3242015.02);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '927279ad-e024-42f4-bd9e-4aa0f9fc5133', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '8875df4f-af7e-433e-bca0-7752fd5b3a80' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('be1e47a0-9533-4b4b-9006-fe0ca281f802', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', 'INV-1536', 4, '2025-09-19', '2025-09-19', 'approved', 33.33, 19452090.13, 4863022.53, 1621007.51, 0.00, 0.00, 4863022.53);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'be1e47a0-9533-4b4b-9006-fe0ca281f802', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '8875df4f-af7e-433e-bca0-7752fd5b3a80' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('5cae1936-4a90-49e9-9361-5b1b286f58c5', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', '8875df4f-af7e-433e-bca0-7752fd5b3a80', 'prime_contract', 'INV-3607', 5, '2025-10-19', '2025-10-19', 'paid', 41.67, 19452090.13, 6484030.04, 1621007.51, 0.00, 0.00, 6484030.04);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '5cae1936-4a90-49e9-9361-5b1b286f58c5', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '8875df4f-af7e-433e-bca0-7752fd5b3a80' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('0322e11c-bc59-4b7a-84f4-0cbcd0124ef3', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', 'INV-7312', 1, '2025-05-11', '2025-05-11', 'submitted', 8.33, 26465177.72, 0.00, 2205431.48, 0.00, 0.00, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '0322e11c-bc59-4b7a-84f4-0cbcd0124ef3', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('4f9f1da3-a617-491e-9ea7-bb6948232af6', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', 'INV-6246', 2, '2025-06-11', '2025-06-11', 'draft', 16.67, 26465177.72, 2205431.48, 2205431.48, 0.00, 0.00, 2205431.48);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '4f9f1da3-a617-491e-9ea7-bb6948232af6', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('2fd9a188-1a26-4fe9-85e9-0692600cc2e3', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', 'INV-9436', 3, '2025-07-11', '2025-07-11', 'draft', 25.00, 26465177.72, 4410862.95, 2205431.48, 0.00, 0.00, 4410862.95);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '2fd9a188-1a26-4fe9-85e9-0692600cc2e3', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e44569d9-e60b-4daa-9ec1-35498a2ab8fc', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', 'INV-9050', 4, '2025-08-11', '2025-08-11', 'paid', 33.33, 26465177.72, 6616294.43, 2205431.48, 0.00, 0.00, 6616294.43);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e44569d9-e60b-4daa-9ec1-35498a2ab8fc', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('7bcbe9c4-f41c-4f21-92f8-26573c6ea87a', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132', 'prime_contract', 'INV-5005', 5, '2025-09-11', '2025-09-11', 'draft', 41.67, 26465177.72, 8821725.91, 2205431.48, 0.00, 0.00, 8821725.91);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '7bcbe9c4-f41c-4f21-92f8-26573c6ea87a', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'af1fec21-eb6d-4bfb-a9aa-f1fbc02a3132' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('0c729df2-7b3f-4b73-8e85-c375a2742c79', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', 'INV-7235', 1, '2025-12-10', '2025-12-10', 'submitted', 8.33, 45309129.06, 0.00, 3775760.75, 0.00, 0.00, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '0c729df2-7b3f-4b73-8e85-c375a2742c79', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('4d4f89e6-defc-4bbe-94ba-c5852f69e16f', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', 'INV-3761', 2, '2026-01-10', '2026-01-10', 'submitted', 16.67, 45309129.06, 3775760.75, 3775760.75, 0.00, 0.00, 3775760.75);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '4d4f89e6-defc-4bbe-94ba-c5852f69e16f', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('2814e965-9a59-4fe7-9c69-d38ae3c08c45', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', 'INV-1081', 3, '2026-02-10', '2026-02-10', 'paid', 25.00, 45309129.06, 7551521.51, 3775760.75, 0.00, 0.00, 7551521.51);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '2814e965-9a59-4fe7-9c69-d38ae3c08c45', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('117a07ff-aa1b-46df-9db0-7e8a52a36bd8', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', 'INV-2090', 4, '2026-03-10', '2026-03-10', 'draft', 33.33, 45309129.06, 11327282.26, 3775760.75, 0.00, 0.00, 11327282.26);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '117a07ff-aa1b-46df-9db0-7e8a52a36bd8', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('1758e314-f933-4890-b1a1-72cf1599e507', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39', 'prime_contract', 'INV-6723', 5, '2026-04-10', '2026-04-10', 'approved', 41.67, 45309129.06, 15103043.02, 3775760.75, 0.00, 0.00, 15103043.02);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '1758e314-f933-4890-b1a1-72cf1599e507', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'prime_contract' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'f18ccf9c-4eaa-44b7-8f95-a15aa80baa39' AND cli.contract_type = 'prime_contract';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('701941d9-6ab2-45d8-8bd0-27bcdc68d1e2', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', 'd6b20550-62d9-488f-b764-c92e11dd5773', 'commitment', 'APP-5658', 1, '2025-06-19', '2025-06-19', 'paid', 8.33, 166546.29, 0.00, 13878.86, 10.00, 1387.89, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '701941d9-6ab2-45d8-8bd0-27bcdc68d1e2', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd6b20550-62d9-488f-b764-c92e11dd5773' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('8decad1e-1f8f-415e-ab35-4a53ae1235df', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', 'd6b20550-62d9-488f-b764-c92e11dd5773', 'commitment', 'APP-2392', 2, '2025-07-19', '2025-07-19', 'draft', 16.67, 166546.29, 13878.86, 13878.86, 10.00, 2775.77, 13878.86);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '8decad1e-1f8f-415e-ab35-4a53ae1235df', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd6b20550-62d9-488f-b764-c92e11dd5773' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('580fd51d-ca9b-46ed-aef1-6e1c6802218a', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', 'd6b20550-62d9-488f-b764-c92e11dd5773', 'commitment', 'APP-2278', 3, '2025-08-19', '2025-08-19', 'submitted', 25.00, 166546.29, 27757.72, 13878.86, 10.00, 4163.66, 27757.72);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '580fd51d-ca9b-46ed-aef1-6e1c6802218a', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd6b20550-62d9-488f-b764-c92e11dd5773' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('56f4a902-cbb5-4748-8ec8-35cc185ef3ad', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', 'd6b20550-62d9-488f-b764-c92e11dd5773', 'commitment', 'APP-6903', 4, '2025-09-19', '2025-09-19', 'submitted', 33.33, 166546.29, 41636.57, 13878.86, 10.00, 5551.54, 41636.57);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '56f4a902-cbb5-4748-8ec8-35cc185ef3ad', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd6b20550-62d9-488f-b764-c92e11dd5773' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('b4e0765e-6c2e-447e-83a3-ac56816b0d27', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', 'd6b20550-62d9-488f-b764-c92e11dd5773', 'commitment', 'APP-7902', 5, '2025-10-19', '2025-10-19', 'approved', 41.67, 166546.29, 55515.43, 13878.86, 10.00, 6939.43, 55515.43);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'b4e0765e-6c2e-447e-83a3-ac56816b0d27', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd6b20550-62d9-488f-b764-c92e11dd5773' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('c9b33f1f-afbf-4f19-bb20-97efc6d1ed04', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', '6d658629-1c66-492b-b8f5-b1a512d5599f', 'commitment', 'APP-5449', 1, '2025-06-19', '2025-06-19', 'approved', 8.33, 62957.19, 0.00, 5246.43, 10.00, 524.64, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'c9b33f1f-afbf-4f19-bb20-97efc6d1ed04', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '6d658629-1c66-492b-b8f5-b1a512d5599f' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('ddfe81a5-5b93-468f-842f-733b51ce4fb8', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', '6d658629-1c66-492b-b8f5-b1a512d5599f', 'commitment', 'APP-8429', 2, '2025-07-19', '2025-07-19', 'approved', 16.67, 62957.19, 5246.43, 5246.43, 10.00, 1049.29, 5246.43);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'ddfe81a5-5b93-468f-842f-733b51ce4fb8', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '6d658629-1c66-492b-b8f5-b1a512d5599f' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('0efab19e-96e1-4eb1-97fb-b662d2753dcb', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', '6d658629-1c66-492b-b8f5-b1a512d5599f', 'commitment', 'APP-2940', 3, '2025-08-19', '2025-08-19', 'draft', 25.00, 62957.19, 10492.86, 5246.43, 10.00, 1573.93, 10492.86);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '0efab19e-96e1-4eb1-97fb-b662d2753dcb', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '6d658629-1c66-492b-b8f5-b1a512d5599f' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('3e398ed0-f862-484c-9654-ac61fd09f465', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', '6d658629-1c66-492b-b8f5-b1a512d5599f', 'commitment', 'APP-3083', 4, '2025-09-19', '2025-09-19', 'submitted', 33.33, 62957.19, 15739.30, 5246.43, 10.00, 2098.57, 15739.30);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '3e398ed0-f862-484c-9654-ac61fd09f465', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '6d658629-1c66-492b-b8f5-b1a512d5599f' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('b6156ff8-c21b-42fa-b309-49497fac9472', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', '6d658629-1c66-492b-b8f5-b1a512d5599f', 'commitment', 'APP-5117', 5, '2025-10-19', '2025-10-19', 'submitted', 41.67, 62957.19, 20985.73, 5246.43, 10.00, 2623.22, 20985.73);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'b6156ff8-c21b-42fa-b309-49497fac9472', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '6d658629-1c66-492b-b8f5-b1a512d5599f' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('fe4715cf-444e-47eb-9347-f496ebcc74e5', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', '14db76b8-a944-40d8-a182-db46b31e2f97', 'commitment', 'APP-1861', 1, '2025-06-19', '2025-06-19', 'approved', 8.33, 570430.12, 0.00, 47535.84, 10.00, 4753.58, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'fe4715cf-444e-47eb-9347-f496ebcc74e5', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '14db76b8-a944-40d8-a182-db46b31e2f97' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('8868fb26-44e3-473f-ac7f-b133e6cd8615', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', '14db76b8-a944-40d8-a182-db46b31e2f97', 'commitment', 'APP-4014', 2, '2025-07-19', '2025-07-19', 'paid', 16.67, 570430.12, 47535.84, 47535.84, 10.00, 9507.17, 47535.84);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '8868fb26-44e3-473f-ac7f-b133e6cd8615', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '14db76b8-a944-40d8-a182-db46b31e2f97' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('892460da-bf69-425d-8ab4-8f7112868717', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', '14db76b8-a944-40d8-a182-db46b31e2f97', 'commitment', 'APP-9605', 3, '2025-08-19', '2025-08-19', 'paid', 25.00, 570430.12, 95071.69, 47535.84, 10.00, 14260.75, 95071.69);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '892460da-bf69-425d-8ab4-8f7112868717', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '14db76b8-a944-40d8-a182-db46b31e2f97' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('434fa65c-73ed-41ea-b85e-1828c530107c', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', '14db76b8-a944-40d8-a182-db46b31e2f97', 'commitment', 'APP-2303', 4, '2025-09-19', '2025-09-19', 'paid', 33.33, 570430.12, 142607.53, 47535.84, 10.00, 19014.34, 142607.53);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '434fa65c-73ed-41ea-b85e-1828c530107c', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '14db76b8-a944-40d8-a182-db46b31e2f97' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('fe76501f-6202-4d31-9ac4-53fec1b8b2cb', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', '14db76b8-a944-40d8-a182-db46b31e2f97', 'commitment', 'APP-8277', 5, '2025-10-19', '2025-10-19', 'paid', 41.67, 570430.12, 190143.37, 47535.84, 10.00, 23767.92, 190143.37);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'fe76501f-6202-4d31-9ac4-53fec1b8b2cb', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '14db76b8-a944-40d8-a182-db46b31e2f97' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('338ae045-260e-4c00-aa7f-0b598bad18c9', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', 'd0871904-5ffa-419f-9428-51b05163b407', 'commitment', 'APP-1032', 1, '2025-06-19', '2025-06-19', 'submitted', 8.33, 955114.72, 0.00, 79592.89, 10.00, 7959.29, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '338ae045-260e-4c00-aa7f-0b598bad18c9', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd0871904-5ffa-419f-9428-51b05163b407' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('382ee480-a74b-42c3-9a9b-88d4fada3f58', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', 'd0871904-5ffa-419f-9428-51b05163b407', 'commitment', 'APP-5764', 2, '2025-07-19', '2025-07-19', 'submitted', 16.67, 955114.72, 79592.89, 79592.89, 10.00, 15918.58, 79592.89);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '382ee480-a74b-42c3-9a9b-88d4fada3f58', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd0871904-5ffa-419f-9428-51b05163b407' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('783f7fc2-4122-41a0-a191-02096e82b62f', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', 'd0871904-5ffa-419f-9428-51b05163b407', 'commitment', 'APP-5567', 3, '2025-08-19', '2025-08-19', 'approved', 25.00, 955114.72, 159185.79, 79592.89, 10.00, 23877.87, 159185.79);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '783f7fc2-4122-41a0-a191-02096e82b62f', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd0871904-5ffa-419f-9428-51b05163b407' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('a68b6f80-cac8-405e-82af-395925fffff4', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', 'd0871904-5ffa-419f-9428-51b05163b407', 'commitment', 'APP-8499', 4, '2025-09-19', '2025-09-19', 'approved', 33.33, 955114.72, 238778.68, 79592.89, 10.00, 31837.16, 238778.68);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'a68b6f80-cac8-405e-82af-395925fffff4', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd0871904-5ffa-419f-9428-51b05163b407' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('dafccef9-224b-4df2-ace6-7879ef35bde6', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', 'd0871904-5ffa-419f-9428-51b05163b407', 'commitment', 'APP-6777', 5, '2025-10-19', '2025-10-19', 'paid', 41.67, 955114.72, 318371.57, 79592.89, 10.00, 39796.45, 318371.57);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'dafccef9-224b-4df2-ace6-7879ef35bde6', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd0871904-5ffa-419f-9428-51b05163b407' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('ec1ad908-0d8e-4d9c-b296-9251b8744172', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', 'cc5d36b6-e755-434c-9f2f-68184e28fd02', 'commitment', 'APP-5321', 1, '2025-06-19', '2025-06-19', 'approved', 8.33, 1885469.66, 0.00, 157122.47, 10.00, 15712.25, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'ec1ad908-0d8e-4d9c-b296-9251b8744172', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'cc5d36b6-e755-434c-9f2f-68184e28fd02' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('4fa37e26-eeea-4132-ad50-5fe3fe30a257', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', 'cc5d36b6-e755-434c-9f2f-68184e28fd02', 'commitment', 'APP-1489', 2, '2025-07-19', '2025-07-19', 'draft', 16.67, 1885469.66, 157122.47, 157122.47, 10.00, 31424.49, 157122.47);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '4fa37e26-eeea-4132-ad50-5fe3fe30a257', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'cc5d36b6-e755-434c-9f2f-68184e28fd02' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('626a7cc6-299d-4bdf-ba4f-9eea90143503', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', 'cc5d36b6-e755-434c-9f2f-68184e28fd02', 'commitment', 'APP-5155', 3, '2025-08-19', '2025-08-19', 'approved', 25.00, 1885469.66, 314244.94, 157122.47, 10.00, 47136.74, 314244.94);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '626a7cc6-299d-4bdf-ba4f-9eea90143503', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'cc5d36b6-e755-434c-9f2f-68184e28fd02' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('27e65a62-67c8-4978-9027-412f670310cd', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', 'cc5d36b6-e755-434c-9f2f-68184e28fd02', 'commitment', 'APP-2147', 4, '2025-09-19', '2025-09-19', 'draft', 33.33, 1885469.66, 471367.42, 157122.47, 10.00, 62848.99, 471367.42);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '27e65a62-67c8-4978-9027-412f670310cd', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'cc5d36b6-e755-434c-9f2f-68184e28fd02' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e3538525-6c7a-4eb9-a980-ab99a2cb5c3d', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', 'cc5d36b6-e755-434c-9f2f-68184e28fd02', 'commitment', 'APP-7172', 5, '2025-10-19', '2025-10-19', 'draft', 41.67, 1885469.66, 628489.89, 157122.47, 10.00, 78561.24, 628489.89);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e3538525-6c7a-4eb9-a980-ab99a2cb5c3d', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'cc5d36b6-e755-434c-9f2f-68184e28fd02' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('c419a439-8f96-4365-9ba9-adc310af07a0', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', '789766c2-7b45-49c1-9bf9-c00859b97b6c', 'commitment', 'APP-5681', 1, '2025-06-19', '2025-06-19', 'approved', 8.33, 1138323.23, 0.00, 94860.27, 10.00, 9486.03, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'c419a439-8f96-4365-9ba9-adc310af07a0', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '789766c2-7b45-49c1-9bf9-c00859b97b6c' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('8046c7a5-9141-45ae-a968-4b86ee0b0bbc', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', '789766c2-7b45-49c1-9bf9-c00859b97b6c', 'commitment', 'APP-8632', 2, '2025-07-19', '2025-07-19', 'paid', 16.67, 1138323.23, 94860.27, 94860.27, 10.00, 18972.05, 94860.27);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '8046c7a5-9141-45ae-a968-4b86ee0b0bbc', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '789766c2-7b45-49c1-9bf9-c00859b97b6c' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('918523e6-ada2-47af-988c-40acbce5f8c3', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', '789766c2-7b45-49c1-9bf9-c00859b97b6c', 'commitment', 'APP-6130', 3, '2025-08-19', '2025-08-19', 'draft', 25.00, 1138323.23, 189720.54, 94860.27, 10.00, 28458.08, 189720.54);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '918523e6-ada2-47af-988c-40acbce5f8c3', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '789766c2-7b45-49c1-9bf9-c00859b97b6c' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('d41df32b-0fb7-48f6-99b9-f5a4067fa9f6', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', '789766c2-7b45-49c1-9bf9-c00859b97b6c', 'commitment', 'APP-4791', 4, '2025-09-19', '2025-09-19', 'approved', 33.33, 1138323.23, 284580.81, 94860.27, 10.00, 37944.11, 284580.81);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'd41df32b-0fb7-48f6-99b9-f5a4067fa9f6', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '789766c2-7b45-49c1-9bf9-c00859b97b6c' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('350b7ac8-669b-4afb-9b87-66f047ee317f', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', '789766c2-7b45-49c1-9bf9-c00859b97b6c', 'commitment', 'APP-1211', 5, '2025-10-19', '2025-10-19', 'submitted', 41.67, 1138323.23, 379441.08, 94860.27, 10.00, 47430.13, 379441.08);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '350b7ac8-669b-4afb-9b87-66f047ee317f', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '789766c2-7b45-49c1-9bf9-c00859b97b6c' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('01fb62be-9806-45cd-a6cf-f25a9946980f', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', 'a38ad051-e85b-4042-95a8-b1e774176a8f', 'commitment', 'APP-8408', 1, '2025-06-19', '2025-06-19', 'paid', 8.33, 943361.85, 0.00, 78613.49, 10.00, 7861.35, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '01fb62be-9806-45cd-a6cf-f25a9946980f', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'a38ad051-e85b-4042-95a8-b1e774176a8f' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('095b35c3-1f59-47d0-bc5e-fe4686d07b87', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', 'a38ad051-e85b-4042-95a8-b1e774176a8f', 'commitment', 'APP-9681', 2, '2025-07-19', '2025-07-19', 'paid', 16.67, 943361.85, 78613.49, 78613.49, 10.00, 15722.70, 78613.49);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '095b35c3-1f59-47d0-bc5e-fe4686d07b87', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'a38ad051-e85b-4042-95a8-b1e774176a8f' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('2c5a1f4c-9fdd-485a-9be3-d3b747c81c41', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', 'a38ad051-e85b-4042-95a8-b1e774176a8f', 'commitment', 'APP-2725', 3, '2025-08-19', '2025-08-19', 'approved', 25.00, 943361.85, 157226.98, 78613.49, 10.00, 23584.05, 157226.98);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '2c5a1f4c-9fdd-485a-9be3-d3b747c81c41', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'a38ad051-e85b-4042-95a8-b1e774176a8f' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('acaa62e0-60a5-4e90-b51c-cbff6b6c6b95', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', 'a38ad051-e85b-4042-95a8-b1e774176a8f', 'commitment', 'APP-2281', 4, '2025-09-19', '2025-09-19', 'paid', 33.33, 943361.85, 235840.46, 78613.49, 10.00, 31445.40, 235840.46);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'acaa62e0-60a5-4e90-b51c-cbff6b6c6b95', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'a38ad051-e85b-4042-95a8-b1e774176a8f' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('5f3cfe81-645a-4ce2-b11b-499a9cadebaf', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', 'a38ad051-e85b-4042-95a8-b1e774176a8f', 'commitment', 'APP-2901', 5, '2025-10-19', '2025-10-19', 'submitted', 41.67, 943361.85, 314453.95, 78613.49, 10.00, 39306.74, 314453.95);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '5f3cfe81-645a-4ce2-b11b-499a9cadebaf', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'a38ad051-e85b-4042-95a8-b1e774176a8f' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e886e5ff-7d87-4dc4-ba4d-6f293792cd39', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875', 'commitment', 'APP-2576', 1, '2025-06-19', '2025-06-19', 'paid', 8.33, 942205.57, 0.00, 78517.13, 10.00, 7851.71, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e886e5ff-7d87-4dc4-ba4d-6f293792cd39', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('0d393ccd-5549-44d8-961f-3f03575b2ec6', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875', 'commitment', 'APP-8358', 2, '2025-07-19', '2025-07-19', 'approved', 16.67, 942205.57, 78517.13, 78517.13, 10.00, 15703.43, 78517.13);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '0d393ccd-5549-44d8-961f-3f03575b2ec6', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('37028b58-0cd7-484d-838f-54bb3b89f438', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875', 'commitment', 'APP-9120', 3, '2025-08-19', '2025-08-19', 'draft', 25.00, 942205.57, 157034.26, 78517.13, 10.00, 23555.14, 157034.26);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '37028b58-0cd7-484d-838f-54bb3b89f438', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('206396d4-71ba-4185-af53-e2807ec5beb9', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875', 'commitment', 'APP-4049', 4, '2025-09-19', '2025-09-19', 'draft', 33.33, 942205.57, 235551.39, 78517.13, 10.00, 31406.85, 235551.39);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '206396d4-71ba-4185-af53-e2807ec5beb9', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('97a7cf65-ef6b-4ecb-9cab-3cf62b891f1d', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875', 'commitment', 'APP-7315', 5, '2025-10-19', '2025-10-19', 'paid', 41.67, 942205.57, 314068.52, 78517.13, 10.00, 39258.57, 314068.52);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '97a7cf65-ef6b-4ecb-9cab-3cf62b891f1d', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '0aafdf01-cd1a-4cc3-afe2-bcd0cf9f4875' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('51d728f9-d2db-4750-bc43-a96877b86876', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', 'APP-8062', 1, '2025-06-19', '2025-06-19', 'approved', 8.33, 403954.62, 0.00, 33662.88, 10.00, 3366.29, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '51d728f9-d2db-4750-bc43-a96877b86876', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '5d10066c-b887-49b2-9465-2afb6a9061d9' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e05ddb4b-83f7-4de2-9fab-6b36a520c37c', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', 'APP-4654', 2, '2025-07-19', '2025-07-19', 'submitted', 16.67, 403954.62, 33662.88, 33662.88, 10.00, 6732.58, 33662.88);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e05ddb4b-83f7-4de2-9fab-6b36a520c37c', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '5d10066c-b887-49b2-9465-2afb6a9061d9' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('0b36692f-a1d6-4d65-b7d2-86a2da10eff1', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', 'APP-6261', 3, '2025-08-19', '2025-08-19', 'submitted', 25.00, 403954.62, 67325.77, 33662.88, 10.00, 10098.87, 67325.77);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '0b36692f-a1d6-4d65-b7d2-86a2da10eff1', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '5d10066c-b887-49b2-9465-2afb6a9061d9' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('f4ba92b6-78b3-484e-ac71-cf4ec2b6b3c8', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', 'APP-2093', 4, '2025-09-19', '2025-09-19', 'paid', 33.33, 403954.62, 100988.65, 33662.88, 10.00, 13465.15, 100988.65);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'f4ba92b6-78b3-484e-ac71-cf4ec2b6b3c8', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '5d10066c-b887-49b2-9465-2afb6a9061d9' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('f4ac7594-2836-45ba-8ead-7ff8b78dac04', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', '5d10066c-b887-49b2-9465-2afb6a9061d9', 'commitment', 'APP-8371', 5, '2025-10-19', '2025-10-19', 'paid', 41.67, 403954.62, 134651.54, 33662.88, 10.00, 16831.44, 134651.54);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'f4ac7594-2836-45ba-8ead-7ff8b78dac04', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '5d10066c-b887-49b2-9465-2afb6a9061d9' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('d3668c7d-3655-4c02-a499-576eb18b3ec4', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', '42c5c783-5c35-4adb-83c7-7a12e2d0531b', 'commitment', 'APP-1752', 1, '2025-06-19', '2025-06-19', 'paid', 8.33, 1456753.77, 0.00, 121396.15, 10.00, 12139.61, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'd3668c7d-3655-4c02-a499-576eb18b3ec4', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '42c5c783-5c35-4adb-83c7-7a12e2d0531b' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('10831175-2ab0-41e4-b941-0815ce244545', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', '42c5c783-5c35-4adb-83c7-7a12e2d0531b', 'commitment', 'APP-2494', 2, '2025-07-19', '2025-07-19', 'submitted', 16.67, 1456753.77, 121396.15, 121396.15, 10.00, 24279.23, 121396.15);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '10831175-2ab0-41e4-b941-0815ce244545', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '42c5c783-5c35-4adb-83c7-7a12e2d0531b' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('58271eae-c323-420c-b826-26e9673755a0', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', '42c5c783-5c35-4adb-83c7-7a12e2d0531b', 'commitment', 'APP-7008', 3, '2025-08-19', '2025-08-19', 'approved', 25.00, 1456753.77, 242792.29, 121396.15, 10.00, 36418.84, 242792.29);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '58271eae-c323-420c-b826-26e9673755a0', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '42c5c783-5c35-4adb-83c7-7a12e2d0531b' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('73e909d8-1182-4d84-926d-613172366a11', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', '42c5c783-5c35-4adb-83c7-7a12e2d0531b', 'commitment', 'APP-1197', 4, '2025-09-19', '2025-09-19', 'submitted', 33.33, 1456753.77, 364188.44, 121396.15, 10.00, 48558.46, 364188.44);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '73e909d8-1182-4d84-926d-613172366a11', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '42c5c783-5c35-4adb-83c7-7a12e2d0531b' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('7c8fb356-8923-43c6-b30b-fb2a819efab1', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', '42c5c783-5c35-4adb-83c7-7a12e2d0531b', 'commitment', 'APP-6776', 5, '2025-10-19', '2025-10-19', 'paid', 41.67, 1456753.77, 485584.59, 121396.15, 10.00, 60698.07, 485584.59);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '7c8fb356-8923-43c6-b30b-fb2a819efab1', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '42c5c783-5c35-4adb-83c7-7a12e2d0531b' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('517459bd-331f-4bcb-bc83-388eb1a86d00', '2fcddb24-554b-4588-b252-f78f6956bb52', 'e2f3a789-739b-420d-96df-d88b8cd71ed2', '418b5d15-4aad-40f4-947b-3f5b0965cfd7', 'commitment', 'APP-6415', 1, '2025-06-19', '2025-06-19', 'draft', 8.33, 626260.26, 0.00, 52188.36, 10.00, 5218.84, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '517459bd-331f-4bcb-bc83-388eb1a86d00', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '418b5d15-4aad-40f4-947b-3f5b0965cfd7' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('fc68bbd8-a90e-49a9-9000-c32cd258169c', '2fcddb24-554b-4588-b252-f78f6956bb52', 'd2f54a38-dd7d-4900-922e-3107131b55ff', '418b5d15-4aad-40f4-947b-3f5b0965cfd7', 'commitment', 'APP-9783', 2, '2025-07-19', '2025-07-19', 'approved', 16.67, 626260.26, 52188.36, 52188.36, 10.00, 10437.67, 52188.36);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'fc68bbd8-a90e-49a9-9000-c32cd258169c', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '418b5d15-4aad-40f4-947b-3f5b0965cfd7' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('580eb356-be0c-4e60-820d-c404000d7183', '2fcddb24-554b-4588-b252-f78f6956bb52', '3d87df8f-db55-4c12-8a4f-bbbed6a0b068', '418b5d15-4aad-40f4-947b-3f5b0965cfd7', 'commitment', 'APP-8451', 3, '2025-08-19', '2025-08-19', 'draft', 25.00, 626260.26, 104376.71, 52188.36, 10.00, 15656.51, 104376.71);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '580eb356-be0c-4e60-820d-c404000d7183', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '418b5d15-4aad-40f4-947b-3f5b0965cfd7' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('ec18d883-f463-4979-bc8f-4b2c3cc3d508', '2fcddb24-554b-4588-b252-f78f6956bb52', '8629df99-af6f-4f7f-9527-f3365f2f8a59', '418b5d15-4aad-40f4-947b-3f5b0965cfd7', 'commitment', 'APP-4104', 4, '2025-09-19', '2025-09-19', 'draft', 33.33, 626260.26, 156565.07, 52188.36, 10.00, 20875.34, 156565.07);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'ec18d883-f463-4979-bc8f-4b2c3cc3d508', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '418b5d15-4aad-40f4-947b-3f5b0965cfd7' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('9cdae56c-9aaa-4378-b4ee-b8f776e71e9f', '2fcddb24-554b-4588-b252-f78f6956bb52', '18e98840-a013-468f-881b-f86cc7f9b363', '418b5d15-4aad-40f4-947b-3f5b0965cfd7', 'commitment', 'APP-5755', 5, '2025-10-19', '2025-10-19', 'paid', 41.67, 626260.26, 208753.42, 52188.36, 10.00, 26094.18, 208753.42);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '9cdae56c-9aaa-4378-b4ee-b8f776e71e9f', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '418b5d15-4aad-40f4-947b-3f5b0965cfd7' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('d453c1c0-51f2-4165-91ff-d9fb63431a9c', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', '59cade7d-1da8-4c09-9aac-6ae476c1519e', 'commitment', 'APP-8936', 1, '2025-05-11', '2025-05-11', 'draft', 8.33, 844915.28, 0.00, 70409.61, 10.00, 7040.96, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'd453c1c0-51f2-4165-91ff-d9fb63431a9c', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '59cade7d-1da8-4c09-9aac-6ae476c1519e' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('f7799133-1e36-4554-8d7b-b3ec38176efb', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', '59cade7d-1da8-4c09-9aac-6ae476c1519e', 'commitment', 'APP-2235', 2, '2025-06-11', '2025-06-11', 'draft', 16.67, 844915.28, 70409.61, 70409.61, 10.00, 14081.92, 70409.61);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'f7799133-1e36-4554-8d7b-b3ec38176efb', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '59cade7d-1da8-4c09-9aac-6ae476c1519e' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('9c9efe7a-35aa-4d22-9c9c-ff771be1c8f8', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', '59cade7d-1da8-4c09-9aac-6ae476c1519e', 'commitment', 'APP-3788', 3, '2025-07-11', '2025-07-11', 'draft', 25.00, 844915.28, 140819.21, 70409.61, 10.00, 21122.88, 140819.21);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '9c9efe7a-35aa-4d22-9c9c-ff771be1c8f8', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '59cade7d-1da8-4c09-9aac-6ae476c1519e' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('cb38af51-f454-4a11-92b0-0c5030da520e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', '59cade7d-1da8-4c09-9aac-6ae476c1519e', 'commitment', 'APP-5224', 4, '2025-08-11', '2025-08-11', 'submitted', 33.33, 844915.28, 211228.82, 70409.61, 10.00, 28163.84, 211228.82);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'cb38af51-f454-4a11-92b0-0c5030da520e', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '59cade7d-1da8-4c09-9aac-6ae476c1519e' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('ce30f675-cd4f-4039-a93b-21469789f1a9', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', '59cade7d-1da8-4c09-9aac-6ae476c1519e', 'commitment', 'APP-9682', 5, '2025-09-11', '2025-09-11', 'submitted', 41.67, 844915.28, 281638.43, 70409.61, 10.00, 35204.80, 281638.43);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'ce30f675-cd4f-4039-a93b-21469789f1a9', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '59cade7d-1da8-4c09-9aac-6ae476c1519e' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('a6812cbe-9c50-41ca-92e5-fbb416ed1892', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', 'APP-5205', 1, '2025-05-11', '2025-05-11', 'draft', 8.33, 1318390.06, 0.00, 109865.84, 10.00, 10986.58, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'a6812cbe-9c50-41ca-92e5-fbb416ed1892', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '527a003b-ea84-45f0-ae37-e71549d35383' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('8972796d-5a89-4004-af9d-91c93c5af7e1', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', 'APP-2530', 2, '2025-06-11', '2025-06-11', 'submitted', 16.67, 1318390.06, 109865.84, 109865.84, 10.00, 21973.17, 109865.84);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '8972796d-5a89-4004-af9d-91c93c5af7e1', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '527a003b-ea84-45f0-ae37-e71549d35383' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('a2cacb22-7fd0-4971-97ee-fcb6c705bab5', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', 'APP-4491', 3, '2025-07-11', '2025-07-11', 'paid', 25.00, 1318390.06, 219731.68, 109865.84, 10.00, 32959.75, 219731.68);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'a2cacb22-7fd0-4971-97ee-fcb6c705bab5', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '527a003b-ea84-45f0-ae37-e71549d35383' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('86d565ac-bc29-44f6-a028-c3f2bc59d824', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', 'APP-4828', 4, '2025-08-11', '2025-08-11', 'approved', 33.33, 1318390.06, 329597.52, 109865.84, 10.00, 43946.34, 329597.52);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '86d565ac-bc29-44f6-a028-c3f2bc59d824', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '527a003b-ea84-45f0-ae37-e71549d35383' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e2b416e0-2de0-4a5d-bfb4-52b86cd1d6ee', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', '527a003b-ea84-45f0-ae37-e71549d35383', 'commitment', 'APP-5556', 5, '2025-09-11', '2025-09-11', 'approved', 41.67, 1318390.06, 439463.35, 109865.84, 10.00, 54932.92, 439463.35);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e2b416e0-2de0-4a5d-bfb4-52b86cd1d6ee', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '527a003b-ea84-45f0-ae37-e71549d35383' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('5feb1c36-910e-4538-b390-f6149f9e0cff', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', 'f84d6078-81eb-48d1-8b5b-98441104a67c', 'commitment', 'APP-4277', 1, '2025-05-11', '2025-05-11', 'draft', 8.33, 1539268.87, 0.00, 128272.41, 10.00, 12827.24, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '5feb1c36-910e-4538-b390-f6149f9e0cff', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'f84d6078-81eb-48d1-8b5b-98441104a67c' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('2568732c-edc3-4949-82e6-6a6fc780492b', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', 'f84d6078-81eb-48d1-8b5b-98441104a67c', 'commitment', 'APP-5088', 2, '2025-06-11', '2025-06-11', 'submitted', 16.67, 1539268.87, 128272.41, 128272.41, 10.00, 25654.48, 128272.41);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '2568732c-edc3-4949-82e6-6a6fc780492b', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'f84d6078-81eb-48d1-8b5b-98441104a67c' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('228ca3ba-077c-4f76-bf4c-be830124064e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', 'f84d6078-81eb-48d1-8b5b-98441104a67c', 'commitment', 'APP-5288', 3, '2025-07-11', '2025-07-11', 'submitted', 25.00, 1539268.87, 256544.81, 128272.41, 10.00, 38481.72, 256544.81);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '228ca3ba-077c-4f76-bf4c-be830124064e', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'f84d6078-81eb-48d1-8b5b-98441104a67c' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('8f60406e-97ee-481e-802a-44a2e97700ce', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', 'f84d6078-81eb-48d1-8b5b-98441104a67c', 'commitment', 'APP-8067', 4, '2025-08-11', '2025-08-11', 'submitted', 33.33, 1539268.87, 384817.22, 128272.41, 10.00, 51308.96, 384817.22);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '8f60406e-97ee-481e-802a-44a2e97700ce', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'f84d6078-81eb-48d1-8b5b-98441104a67c' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('0ee3de6a-3567-4d63-9597-9a4842967635', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', 'f84d6078-81eb-48d1-8b5b-98441104a67c', 'commitment', 'APP-5148', 5, '2025-09-11', '2025-09-11', 'draft', 41.67, 1539268.87, 513089.62, 128272.41, 10.00, 64136.20, 513089.62);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '0ee3de6a-3567-4d63-9597-9a4842967635', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'f84d6078-81eb-48d1-8b5b-98441104a67c' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('66f0f44e-e738-40f9-a47e-38ca4327922c', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', '6b0f52b4-93ea-4811-9a37-7bed9822a513', 'commitment', 'APP-4122', 1, '2025-05-11', '2025-05-11', 'paid', 8.33, 758861.26, 0.00, 63238.44, 10.00, 6323.84, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '66f0f44e-e738-40f9-a47e-38ca4327922c', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '6b0f52b4-93ea-4811-9a37-7bed9822a513' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('45253dff-098c-4759-8c60-e92118470bc5', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', '6b0f52b4-93ea-4811-9a37-7bed9822a513', 'commitment', 'APP-9498', 2, '2025-06-11', '2025-06-11', 'submitted', 16.67, 758861.26, 63238.44, 63238.44, 10.00, 12647.69, 63238.44);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '45253dff-098c-4759-8c60-e92118470bc5', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '6b0f52b4-93ea-4811-9a37-7bed9822a513' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('2f4a9e6e-0c08-4706-a6b3-62e72d54032c', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', '6b0f52b4-93ea-4811-9a37-7bed9822a513', 'commitment', 'APP-9465', 3, '2025-07-11', '2025-07-11', 'draft', 25.00, 758861.26, 126476.88, 63238.44, 10.00, 18971.53, 126476.88);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '2f4a9e6e-0c08-4706-a6b3-62e72d54032c', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '6b0f52b4-93ea-4811-9a37-7bed9822a513' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('ae3aa7a4-3f3c-4de8-8b73-78cb194b1484', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', '6b0f52b4-93ea-4811-9a37-7bed9822a513', 'commitment', 'APP-4429', 4, '2025-08-11', '2025-08-11', 'approved', 33.33, 758861.26, 189715.31, 63238.44, 10.00, 25295.38, 189715.31);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'ae3aa7a4-3f3c-4de8-8b73-78cb194b1484', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '6b0f52b4-93ea-4811-9a37-7bed9822a513' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('57bbaf0f-d00f-47cc-9d57-24bbd9e1e379', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', '6b0f52b4-93ea-4811-9a37-7bed9822a513', 'commitment', 'APP-9322', 5, '2025-09-11', '2025-09-11', 'submitted', 41.67, 758861.26, 252953.75, 63238.44, 10.00, 31619.22, 252953.75);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '57bbaf0f-d00f-47cc-9d57-24bbd9e1e379', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '6b0f52b4-93ea-4811-9a37-7bed9822a513' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('2f77337a-5d05-477a-9e91-c21b6f3a4c20', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', '4192a8c9-06d2-4741-aeba-a84384191caa', 'commitment', 'APP-3158', 1, '2025-05-11', '2025-05-11', 'approved', 8.33, 1614533.06, 0.00, 134544.42, 10.00, 13454.44, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '2f77337a-5d05-477a-9e91-c21b6f3a4c20', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '4192a8c9-06d2-4741-aeba-a84384191caa' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('1f23cc7d-2e1d-4b45-b76e-08fbdfcaca0a', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', '4192a8c9-06d2-4741-aeba-a84384191caa', 'commitment', 'APP-9273', 2, '2025-06-11', '2025-06-11', 'paid', 16.67, 1614533.06, 134544.42, 134544.42, 10.00, 26908.88, 134544.42);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '1f23cc7d-2e1d-4b45-b76e-08fbdfcaca0a', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '4192a8c9-06d2-4741-aeba-a84384191caa' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('120a9c00-1788-46ff-9298-fba3d5e1a0a4', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', '4192a8c9-06d2-4741-aeba-a84384191caa', 'commitment', 'APP-4306', 3, '2025-07-11', '2025-07-11', 'approved', 25.00, 1614533.06, 269088.84, 134544.42, 10.00, 40363.33, 269088.84);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '120a9c00-1788-46ff-9298-fba3d5e1a0a4', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '4192a8c9-06d2-4741-aeba-a84384191caa' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('082a8113-abe8-4278-a073-526087d986d4', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', '4192a8c9-06d2-4741-aeba-a84384191caa', 'commitment', 'APP-6559', 4, '2025-08-11', '2025-08-11', 'submitted', 33.33, 1614533.06, 403633.27, 134544.42, 10.00, 53817.77, 403633.27);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '082a8113-abe8-4278-a073-526087d986d4', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '4192a8c9-06d2-4741-aeba-a84384191caa' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('3b11106b-5bd7-46fc-b3c6-a2ee23100b77', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', '4192a8c9-06d2-4741-aeba-a84384191caa', 'commitment', 'APP-6436', 5, '2025-09-11', '2025-09-11', 'submitted', 41.67, 1614533.06, 538177.69, 134544.42, 10.00, 67272.21, 538177.69);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '3b11106b-5bd7-46fc-b3c6-a2ee23100b77', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '4192a8c9-06d2-4741-aeba-a84384191caa' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('4e1d70b9-a8d7-4fe4-a386-3bbd8424d9c7', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', '14dad579-10e4-43e0-bd3d-73b12f5b9d88', 'commitment', 'APP-4434', 1, '2025-05-11', '2025-05-11', 'paid', 8.33, 1057805.70, 0.00, 88150.47, 10.00, 8815.05, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '4e1d70b9-a8d7-4fe4-a386-3bbd8424d9c7', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '14dad579-10e4-43e0-bd3d-73b12f5b9d88' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('78c4a626-8696-4b3f-bd65-a5c8b571ac7a', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', '14dad579-10e4-43e0-bd3d-73b12f5b9d88', 'commitment', 'APP-7345', 2, '2025-06-11', '2025-06-11', 'approved', 16.67, 1057805.70, 88150.47, 88150.47, 10.00, 17630.09, 88150.47);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '78c4a626-8696-4b3f-bd65-a5c8b571ac7a', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '14dad579-10e4-43e0-bd3d-73b12f5b9d88' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('398e377e-0111-4422-bda7-ff26e4b6071a', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', '14dad579-10e4-43e0-bd3d-73b12f5b9d88', 'commitment', 'APP-3468', 3, '2025-07-11', '2025-07-11', 'approved', 25.00, 1057805.70, 176300.95, 88150.47, 10.00, 26445.14, 176300.95);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '398e377e-0111-4422-bda7-ff26e4b6071a', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '14dad579-10e4-43e0-bd3d-73b12f5b9d88' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('36dbd7b5-5970-4fec-a5ee-582850e04db2', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', '14dad579-10e4-43e0-bd3d-73b12f5b9d88', 'commitment', 'APP-6416', 4, '2025-08-11', '2025-08-11', 'draft', 33.33, 1057805.70, 264451.42, 88150.47, 10.00, 35260.19, 264451.42);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '36dbd7b5-5970-4fec-a5ee-582850e04db2', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '14dad579-10e4-43e0-bd3d-73b12f5b9d88' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('92f00843-febd-46e5-8d9e-5a4490a9d459', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', '14dad579-10e4-43e0-bd3d-73b12f5b9d88', 'commitment', 'APP-1136', 5, '2025-09-11', '2025-09-11', 'approved', 41.67, 1057805.70, 352601.90, 88150.47, 10.00, 44075.24, 352601.90);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '92f00843-febd-46e5-8d9e-5a4490a9d459', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '14dad579-10e4-43e0-bd3d-73b12f5b9d88' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('bfdb6d4b-d344-4325-9e6b-40b9e3b38cb0', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e', 'commitment', 'APP-8338', 1, '2025-05-11', '2025-05-11', 'approved', 8.33, 228236.87, 0.00, 19019.74, 10.00, 1901.97, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'bfdb6d4b-d344-4325-9e6b-40b9e3b38cb0', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('5baff43c-c72c-44e6-968a-8ba6fa298f18', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e', 'commitment', 'APP-2729', 2, '2025-06-11', '2025-06-11', 'submitted', 16.67, 228236.87, 19019.74, 19019.74, 10.00, 3803.95, 19019.74);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '5baff43c-c72c-44e6-968a-8ba6fa298f18', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('ec3bafa5-665d-4a5d-af67-7324e7a66d19', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e', 'commitment', 'APP-6985', 3, '2025-07-11', '2025-07-11', 'submitted', 25.00, 228236.87, 38039.48, 19019.74, 10.00, 5705.92, 38039.48);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'ec3bafa5-665d-4a5d-af67-7324e7a66d19', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('9e097cb3-ea4c-4600-a81e-349a9851af00', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e', 'commitment', 'APP-8426', 4, '2025-08-11', '2025-08-11', 'draft', 33.33, 228236.87, 57059.22, 19019.74, 10.00, 7607.90, 57059.22);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '9e097cb3-ea4c-4600-a81e-349a9851af00', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('7d173272-e75d-411c-95a9-a7b5b0206161', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e', 'commitment', 'APP-6274', 5, '2025-09-11', '2025-09-11', 'paid', 41.67, 228236.87, 76078.96, 19019.74, 10.00, 9509.87, 76078.96);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '7d173272-e75d-411c-95a9-a7b5b0206161', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'bb2d5eba-a3ff-434c-9647-35a46b4f0b7e' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('688bb8e9-8bd2-445a-8ccb-331681aff047', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', 'APP-9967', 1, '2025-05-11', '2025-05-11', 'paid', 8.33, 1734896.00, 0.00, 144574.67, 10.00, 14457.47, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '688bb8e9-8bd2-445a-8ccb-331681aff047', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd956f88a-9563-4f2a-ae7b-87f2be65edba' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e80b6b65-9cf8-4bc1-b8de-4b9b3f9b69ca', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', 'APP-9292', 2, '2025-06-11', '2025-06-11', 'approved', 16.67, 1734896.00, 144574.67, 144574.67, 10.00, 28914.93, 144574.67);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e80b6b65-9cf8-4bc1-b8de-4b9b3f9b69ca', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd956f88a-9563-4f2a-ae7b-87f2be65edba' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('19c8c824-e797-4fc2-af97-c375e5f33072', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', 'APP-4182', 3, '2025-07-11', '2025-07-11', 'draft', 25.00, 1734896.00, 289149.33, 144574.67, 10.00, 43372.40, 289149.33);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '19c8c824-e797-4fc2-af97-c375e5f33072', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd956f88a-9563-4f2a-ae7b-87f2be65edba' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e9e15b73-7f8a-419b-a315-b1b88a48d586', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', 'APP-6707', 4, '2025-08-11', '2025-08-11', 'paid', 33.33, 1734896.00, 433724.00, 144574.67, 10.00, 57829.87, 433724.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e9e15b73-7f8a-419b-a315-b1b88a48d586', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd956f88a-9563-4f2a-ae7b-87f2be65edba' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('88260367-130b-449b-91f0-fb6cfc954696', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', 'd956f88a-9563-4f2a-ae7b-87f2be65edba', 'commitment', 'APP-3039', 5, '2025-09-11', '2025-09-11', 'paid', 41.67, 1734896.00, 578298.67, 144574.67, 10.00, 72287.33, 578298.67);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '88260367-130b-449b-91f0-fb6cfc954696', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd956f88a-9563-4f2a-ae7b-87f2be65edba' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('93833484-fb0d-4e44-8490-688416996d9f', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', '74503d45-09b3-4c30-afd0-82edc68859d4', 'commitment', 'APP-5679', 1, '2025-05-11', '2025-05-11', 'submitted', 8.33, 143460.53, 0.00, 11955.04, 10.00, 1195.50, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '93833484-fb0d-4e44-8490-688416996d9f', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '74503d45-09b3-4c30-afd0-82edc68859d4' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('d4157483-2b8f-4542-85d4-63aaded60857', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', '74503d45-09b3-4c30-afd0-82edc68859d4', 'commitment', 'APP-1241', 2, '2025-06-11', '2025-06-11', 'paid', 16.67, 143460.53, 11955.04, 11955.04, 10.00, 2391.01, 11955.04);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'd4157483-2b8f-4542-85d4-63aaded60857', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '74503d45-09b3-4c30-afd0-82edc68859d4' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('921834ae-4321-4d6a-9231-7f0d002c3ccf', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', '74503d45-09b3-4c30-afd0-82edc68859d4', 'commitment', 'APP-3780', 3, '2025-07-11', '2025-07-11', 'paid', 25.00, 143460.53, 23910.09, 11955.04, 10.00, 3586.51, 23910.09);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '921834ae-4321-4d6a-9231-7f0d002c3ccf', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '74503d45-09b3-4c30-afd0-82edc68859d4' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('f91b75f7-503e-4082-804a-f42c4e8cb323', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', '74503d45-09b3-4c30-afd0-82edc68859d4', 'commitment', 'APP-9612', 4, '2025-08-11', '2025-08-11', 'draft', 33.33, 143460.53, 35865.13, 11955.04, 10.00, 4782.02, 35865.13);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'f91b75f7-503e-4082-804a-f42c4e8cb323', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '74503d45-09b3-4c30-afd0-82edc68859d4' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('cd6fb1ba-5397-45c7-ac9e-37f9800a2b1a', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', '74503d45-09b3-4c30-afd0-82edc68859d4', 'commitment', 'APP-2960', 5, '2025-09-11', '2025-09-11', 'submitted', 41.67, 143460.53, 47820.18, 11955.04, 10.00, 5977.52, 47820.18);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'cd6fb1ba-5397-45c7-ac9e-37f9800a2b1a', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '74503d45-09b3-4c30-afd0-82edc68859d4' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('ce6a4532-6c81-4acc-9cf6-55f525303340', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee', 'commitment', 'APP-6777', 1, '2025-05-11', '2025-05-11', 'draft', 8.33, 508357.66, 0.00, 42363.14, 10.00, 4236.31, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'ce6a4532-6c81-4acc-9cf6-55f525303340', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('73117279-7865-4afb-a431-5b1350497da9', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee', 'commitment', 'APP-6035', 2, '2025-06-11', '2025-06-11', 'submitted', 16.67, 508357.66, 42363.14, 42363.14, 10.00, 8472.63, 42363.14);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '73117279-7865-4afb-a431-5b1350497da9', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('23dd4cf2-c842-4129-afda-6879db404d8e', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee', 'commitment', 'APP-3535', 3, '2025-07-11', '2025-07-11', 'approved', 25.00, 508357.66, 84726.28, 42363.14, 10.00, 12708.94, 84726.28);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '23dd4cf2-c842-4129-afda-6879db404d8e', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('49a2424b-a548-4627-b3d9-3e2096b92344', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee', 'commitment', 'APP-4136', 4, '2025-08-11', '2025-08-11', 'paid', 33.33, 508357.66, 127089.41, 42363.14, 10.00, 16945.26, 127089.41);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '49a2424b-a548-4627-b3d9-3e2096b92344', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('bf6fd0aa-eeb8-4bde-8f21-6e89601362fa', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee', 'commitment', 'APP-7587', 5, '2025-09-11', '2025-09-11', 'approved', 41.67, 508357.66, 169452.55, 42363.14, 10.00, 21181.57, 169452.55);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'bf6fd0aa-eeb8-4bde-8f21-6e89601362fa', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '1c0b8af6-55ad-4dd2-ae0e-059bba9905ee' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('5e1ff471-6a64-40b5-a95b-13f3679f7e54', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '3c653560-dae6-4681-9c3e-c2a08d144162', 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128', 'commitment', 'APP-2869', 1, '2025-05-11', '2025-05-11', 'draft', 8.33, 130548.05, 0.00, 10879.00, 10.00, 1087.90, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '5e1ff471-6a64-40b5-a95b-13f3679f7e54', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('cfea0dce-f5af-4bd1-b384-e9c816d93277', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'fdf7314e-b948-4b25-b5e7-d242ccf15571', 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128', 'commitment', 'APP-6444', 2, '2025-06-11', '2025-06-11', 'submitted', 16.67, 130548.05, 10879.00, 10879.00, 10.00, 2175.80, 10879.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'cfea0dce-f5af-4bd1-b384-e9c816d93277', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('df939cb1-b335-4ab3-8fab-525201809074', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '83a6ebd4-1b52-4948-b511-f3fa5fabb4b2', 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128', 'commitment', 'APP-8060', 3, '2025-07-11', '2025-07-11', 'submitted', 25.00, 130548.05, 21758.01, 10879.00, 10.00, 3263.70, 21758.01);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'df939cb1-b335-4ab3-8fab-525201809074', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('f98b6754-55fc-444f-a803-222b57418516', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', '187dfc8d-baec-4501-b3c6-915277d08b10', 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128', 'commitment', 'APP-1041', 4, '2025-08-11', '2025-08-11', 'paid', 33.33, 130548.05, 32637.01, 10879.00, 10.00, 4351.60, 32637.01);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'f98b6754-55fc-444f-a803-222b57418516', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('702c06e7-7c8f-4721-b74c-4dd839b06d4d', 'a7c61ec9-0c62-42c9-9a16-db53cd3bc57f', 'e4eb15f4-7060-45cf-9224-3b10acecfb15', 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128', 'commitment', 'APP-1726', 5, '2025-09-11', '2025-09-11', 'submitted', 41.67, 130548.05, 43516.02, 10879.00, 10.00, 5439.50, 43516.02);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '702c06e7-7c8f-4721-b74c-4dd839b06d4d', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'd93c9ec9-a24d-478e-a59c-7d2aa44a7128' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('3f19f7cf-ef93-48f3-9b69-58d1cc858ebe', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', '37e3c561-6a72-4e21-9c49-ec1b7b2ef884', 'commitment', 'APP-9685', 1, '2025-12-10', '2025-12-10', 'draft', 8.33, 1852732.41, 0.00, 154394.37, 10.00, 15439.44, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '3f19f7cf-ef93-48f3-9b69-58d1cc858ebe', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '37e3c561-6a72-4e21-9c49-ec1b7b2ef884' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('723ba624-a01a-46f1-a3e1-f0cbb92a03b8', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', '37e3c561-6a72-4e21-9c49-ec1b7b2ef884', 'commitment', 'APP-8190', 2, '2026-01-10', '2026-01-10', 'paid', 16.67, 1852732.41, 154394.37, 154394.37, 10.00, 30878.87, 154394.37);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '723ba624-a01a-46f1-a3e1-f0cbb92a03b8', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '37e3c561-6a72-4e21-9c49-ec1b7b2ef884' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('09e4eae3-df2d-4d81-8d8d-37c992d2f113', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', '37e3c561-6a72-4e21-9c49-ec1b7b2ef884', 'commitment', 'APP-8656', 3, '2026-02-10', '2026-02-10', 'draft', 25.00, 1852732.41, 308788.73, 154394.37, 10.00, 46318.31, 308788.73);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '09e4eae3-df2d-4d81-8d8d-37c992d2f113', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '37e3c561-6a72-4e21-9c49-ec1b7b2ef884' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e0a55213-0d3b-4de7-9499-85b7335d254c', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', '37e3c561-6a72-4e21-9c49-ec1b7b2ef884', 'commitment', 'APP-1722', 4, '2026-03-10', '2026-03-10', 'paid', 33.33, 1852732.41, 463183.10, 154394.37, 10.00, 61757.75, 463183.10);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e0a55213-0d3b-4de7-9499-85b7335d254c', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '37e3c561-6a72-4e21-9c49-ec1b7b2ef884' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('01413919-e15b-4b40-9bd7-aee9fff41f36', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', '37e3c561-6a72-4e21-9c49-ec1b7b2ef884', 'commitment', 'APP-8736', 5, '2026-04-10', '2026-04-10', 'approved', 41.67, 1852732.41, 617577.47, 154394.37, 10.00, 77197.18, 617577.47);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '01413919-e15b-4b40-9bd7-aee9fff41f36', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '37e3c561-6a72-4e21-9c49-ec1b7b2ef884' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('eee827eb-0ce4-4600-b08c-aed8374a9adc', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', '626e1cd6-d553-4cff-a326-affc1a9c1e0b', 'commitment', 'APP-1251', 1, '2025-12-10', '2025-12-10', 'paid', 8.33, 1839356.72, 0.00, 153279.73, 10.00, 15327.97, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'eee827eb-0ce4-4600-b08c-aed8374a9adc', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '626e1cd6-d553-4cff-a326-affc1a9c1e0b' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('1d4e6983-99bc-47a3-ade0-0606da71974b', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', '626e1cd6-d553-4cff-a326-affc1a9c1e0b', 'commitment', 'APP-2321', 2, '2026-01-10', '2026-01-10', 'paid', 16.67, 1839356.72, 153279.73, 153279.73, 10.00, 30655.95, 153279.73);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '1d4e6983-99bc-47a3-ade0-0606da71974b', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '626e1cd6-d553-4cff-a326-affc1a9c1e0b' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('b41e06b4-b705-49b2-897d-c2022ceffb25', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', '626e1cd6-d553-4cff-a326-affc1a9c1e0b', 'commitment', 'APP-2174', 3, '2026-02-10', '2026-02-10', 'submitted', 25.00, 1839356.72, 306559.45, 153279.73, 10.00, 45983.92, 306559.45);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'b41e06b4-b705-49b2-897d-c2022ceffb25', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '626e1cd6-d553-4cff-a326-affc1a9c1e0b' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('69d68db2-ad85-4a6a-bd93-a02f8bab8fbc', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', '626e1cd6-d553-4cff-a326-affc1a9c1e0b', 'commitment', 'APP-9961', 4, '2026-03-10', '2026-03-10', 'submitted', 33.33, 1839356.72, 459839.18, 153279.73, 10.00, 61311.89, 459839.18);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '69d68db2-ad85-4a6a-bd93-a02f8bab8fbc', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '626e1cd6-d553-4cff-a326-affc1a9c1e0b' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('4a19952d-7e5f-4edd-a754-076fff10146a', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', '626e1cd6-d553-4cff-a326-affc1a9c1e0b', 'commitment', 'APP-7057', 5, '2026-04-10', '2026-04-10', 'submitted', 41.67, 1839356.72, 613118.91, 153279.73, 10.00, 76639.86, 613118.91);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '4a19952d-7e5f-4edd-a754-076fff10146a', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '626e1cd6-d553-4cff-a326-affc1a9c1e0b' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('cd64b360-5c5a-4e95-b0b9-0a5985d1e8cf', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', 'APP-9055', 1, '2025-12-10', '2025-12-10', 'draft', 8.33, 1960801.72, 0.00, 163400.14, 10.00, 16340.01, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'cd64b360-5c5a-4e95-b0b9-0a5985d1e8cf', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('c837e426-369e-43ce-9a18-2e50f6803f49', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', 'APP-8552', 2, '2026-01-10', '2026-01-10', 'submitted', 16.67, 1960801.72, 163400.14, 163400.14, 10.00, 32680.03, 163400.14);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'c837e426-369e-43ce-9a18-2e50f6803f49', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('03b587e8-12cf-46a7-ac30-483a45e56b50', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', 'APP-3790', 3, '2026-02-10', '2026-02-10', 'approved', 25.00, 1960801.72, 326800.29, 163400.14, 10.00, 49020.04, 326800.29);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '03b587e8-12cf-46a7-ac30-483a45e56b50', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('195f3a52-1983-4a73-bc5e-7ea5da41247c', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', 'APP-7556', 4, '2026-03-10', '2026-03-10', 'draft', 33.33, 1960801.72, 490200.43, 163400.14, 10.00, 65360.06, 490200.43);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '195f3a52-1983-4a73-bc5e-7ea5da41247c', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('a352591f-55d4-4d5c-be1f-a758ca4db894', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0', 'commitment', 'APP-6644', 5, '2026-04-10', '2026-04-10', 'submitted', 41.67, 1960801.72, 653600.57, 163400.14, 10.00, 81700.07, 653600.57);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'a352591f-55d4-4d5c-be1f-a758ca4db894', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '95bdda92-3f6f-4f3c-b3f8-eb3bf77c6cb0' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('102f411d-bee4-480b-ae9b-6aebd55b0de4', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', 'ac707aeb-428f-49b6-a6cb-a995c112f5c5', 'commitment', 'APP-5099', 1, '2025-12-10', '2025-12-10', 'approved', 8.33, 664432.31, 0.00, 55369.36, 10.00, 5536.94, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '102f411d-bee4-480b-ae9b-6aebd55b0de4', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'ac707aeb-428f-49b6-a6cb-a995c112f5c5' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e107dccf-4140-4a6f-b787-31807f75c91b', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', 'ac707aeb-428f-49b6-a6cb-a995c112f5c5', 'commitment', 'APP-4627', 2, '2026-01-10', '2026-01-10', 'draft', 16.67, 664432.31, 55369.36, 55369.36, 10.00, 11073.87, 55369.36);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e107dccf-4140-4a6f-b787-31807f75c91b', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'ac707aeb-428f-49b6-a6cb-a995c112f5c5' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('71082c8e-31cf-4e61-a1b2-a7df1848c4d0', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', 'ac707aeb-428f-49b6-a6cb-a995c112f5c5', 'commitment', 'APP-6244', 3, '2026-02-10', '2026-02-10', 'submitted', 25.00, 664432.31, 110738.72, 55369.36, 10.00, 16610.81, 110738.72);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '71082c8e-31cf-4e61-a1b2-a7df1848c4d0', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'ac707aeb-428f-49b6-a6cb-a995c112f5c5' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('f10dbdcf-8b54-4ca9-9765-0cdc2b384c93', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', 'ac707aeb-428f-49b6-a6cb-a995c112f5c5', 'commitment', 'APP-2297', 4, '2026-03-10', '2026-03-10', 'draft', 33.33, 664432.31, 166108.08, 55369.36, 10.00, 22147.74, 166108.08);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'f10dbdcf-8b54-4ca9-9765-0cdc2b384c93', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'ac707aeb-428f-49b6-a6cb-a995c112f5c5' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e71066ad-f7fd-47ed-9acd-4be4abaeb37e', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', 'ac707aeb-428f-49b6-a6cb-a995c112f5c5', 'commitment', 'APP-2764', 5, '2026-04-10', '2026-04-10', 'submitted', 41.67, 664432.31, 221477.44, 55369.36, 10.00, 27684.68, 221477.44);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e71066ad-f7fd-47ed-9acd-4be4abaeb37e', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'ac707aeb-428f-49b6-a6cb-a995c112f5c5' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('5cd0e8fc-839a-4d45-911f-4f915c549c3f', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc', 'commitment', 'APP-7042', 1, '2025-12-10', '2025-12-10', 'approved', 8.33, 653940.61, 0.00, 54495.05, 10.00, 5449.51, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '5cd0e8fc-839a-4d45-911f-4f915c549c3f', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('8a8ce3e9-75d0-4503-8700-c764a6a53e9f', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc', 'commitment', 'APP-7835', 2, '2026-01-10', '2026-01-10', 'approved', 16.67, 653940.61, 54495.05, 54495.05, 10.00, 10899.01, 54495.05);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '8a8ce3e9-75d0-4503-8700-c764a6a53e9f', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('bb596a41-3666-46b2-bc3a-425f82647a8b', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc', 'commitment', 'APP-1993', 3, '2026-02-10', '2026-02-10', 'submitted', 25.00, 653940.61, 108990.10, 54495.05, 10.00, 16348.52, 108990.10);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'bb596a41-3666-46b2-bc3a-425f82647a8b', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('21709909-e284-44d2-87dc-d2263bb4c991', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc', 'commitment', 'APP-8223', 4, '2026-03-10', '2026-03-10', 'submitted', 33.33, 653940.61, 163485.15, 54495.05, 10.00, 21798.02, 163485.15);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '21709909-e284-44d2-87dc-d2263bb4c991', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('1bbbc5bc-0b1f-4305-8d54-18f36cba495a', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc', 'commitment', 'APP-4366', 5, '2026-04-10', '2026-04-10', 'paid', 41.67, 653940.61, 217980.20, 54495.05, 10.00, 27247.53, 217980.20);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '1bbbc5bc-0b1f-4305-8d54-18f36cba495a', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '1df7cc9a-6f5b-4518-bb3c-68a94d4502dc' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e7a0a290-afb0-446f-b147-b34e4c1bafa7', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef', 'commitment', 'APP-1414', 1, '2025-12-10', '2025-12-10', 'draft', 8.33, 801643.91, 0.00, 66803.66, 10.00, 6680.37, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e7a0a290-afb0-446f-b147-b34e4c1bafa7', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('edb05021-3fa6-4875-b54b-d2a457b9060f', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef', 'commitment', 'APP-9896', 2, '2026-01-10', '2026-01-10', 'approved', 16.67, 801643.91, 66803.66, 66803.66, 10.00, 13360.73, 66803.66);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'edb05021-3fa6-4875-b54b-d2a457b9060f', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('c716bf0d-b5d4-43d6-b205-b21b7001bc73', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef', 'commitment', 'APP-6393', 3, '2026-02-10', '2026-02-10', 'approved', 25.00, 801643.91, 133607.32, 66803.66, 10.00, 20041.10, 133607.32);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'c716bf0d-b5d4-43d6-b205-b21b7001bc73', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('ebf8cc5e-2cbd-403d-a67c-360137c81cda', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef', 'commitment', 'APP-3529', 4, '2026-03-10', '2026-03-10', 'paid', 33.33, 801643.91, 200410.98, 66803.66, 10.00, 26721.46, 200410.98);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'ebf8cc5e-2cbd-403d-a67c-360137c81cda', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e6bb239e-3cd5-40d2-9358-94baf0b9cf50', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef', 'commitment', 'APP-8739', 5, '2026-04-10', '2026-04-10', 'draft', 41.67, 801643.91, 267214.64, 66803.66, 10.00, 33401.83, 267214.64);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e6bb239e-3cd5-40d2-9358-94baf0b9cf50', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = 'fe67ecb8-3ccc-42bf-816f-9d8cb1e077ef' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('15e25d48-de3d-4ba6-8220-8a1b70bc2644', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', '09abfc08-9779-4926-a6e7-53bad423a4f6', 'commitment', 'APP-6784', 1, '2025-12-10', '2025-12-10', 'submitted', 8.33, 738549.49, 0.00, 61545.79, 10.00, 6154.58, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '15e25d48-de3d-4ba6-8220-8a1b70bc2644', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '09abfc08-9779-4926-a6e7-53bad423a4f6' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('7b8dd88f-7178-4563-86e1-1946a321f5f8', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', '09abfc08-9779-4926-a6e7-53bad423a4f6', 'commitment', 'APP-8873', 2, '2026-01-10', '2026-01-10', 'draft', 16.67, 738549.49, 61545.79, 61545.79, 10.00, 12309.16, 61545.79);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '7b8dd88f-7178-4563-86e1-1946a321f5f8', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '09abfc08-9779-4926-a6e7-53bad423a4f6' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('d9ee9fa6-271b-4cfa-943d-1f4493400327', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', '09abfc08-9779-4926-a6e7-53bad423a4f6', 'commitment', 'APP-8866', 3, '2026-02-10', '2026-02-10', 'draft', 25.00, 738549.49, 123091.58, 61545.79, 10.00, 18463.74, 123091.58);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'd9ee9fa6-271b-4cfa-943d-1f4493400327', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '09abfc08-9779-4926-a6e7-53bad423a4f6' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('cf52cf66-5eed-4983-8944-eee664870a1e', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', '09abfc08-9779-4926-a6e7-53bad423a4f6', 'commitment', 'APP-4943', 4, '2026-03-10', '2026-03-10', 'approved', 33.33, 738549.49, 184637.37, 61545.79, 10.00, 24618.32, 184637.37);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'cf52cf66-5eed-4983-8944-eee664870a1e', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '09abfc08-9779-4926-a6e7-53bad423a4f6' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('1b3bdefd-7c3e-44c2-9499-7acce19eb5d2', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', '09abfc08-9779-4926-a6e7-53bad423a4f6', 'commitment', 'APP-3071', 5, '2026-04-10', '2026-04-10', 'paid', 41.67, 738549.49, 246183.16, 61545.79, 10.00, 30772.90, 246183.16);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '1b3bdefd-7c3e-44c2-9499-7acce19eb5d2', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '09abfc08-9779-4926-a6e7-53bad423a4f6' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('c93f3977-4656-4728-9fa4-3eb888a11d13', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', '19bc439f-38c5-4667-a2be-7a43eac9a846', 'commitment', 'APP-6514', 1, '2025-12-10', '2025-12-10', 'draft', 8.33, 1561171.52, 0.00, 130097.63, 10.00, 13009.76, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'c93f3977-4656-4728-9fa4-3eb888a11d13', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '19bc439f-38c5-4667-a2be-7a43eac9a846' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('60f0a1ea-fb43-4fbd-84dd-2b75026ef4cc', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', '19bc439f-38c5-4667-a2be-7a43eac9a846', 'commitment', 'APP-4973', 2, '2026-01-10', '2026-01-10', 'submitted', 16.67, 1561171.52, 130097.63, 130097.63, 10.00, 26019.53, 130097.63);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '60f0a1ea-fb43-4fbd-84dd-2b75026ef4cc', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '19bc439f-38c5-4667-a2be-7a43eac9a846' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('f17ad0f3-a150-437d-96d1-9974682d27e3', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', '19bc439f-38c5-4667-a2be-7a43eac9a846', 'commitment', 'APP-7965', 3, '2026-02-10', '2026-02-10', 'approved', 25.00, 1561171.52, 260195.25, 130097.63, 10.00, 39029.29, 260195.25);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'f17ad0f3-a150-437d-96d1-9974682d27e3', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '19bc439f-38c5-4667-a2be-7a43eac9a846' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('1595265f-1076-4d15-bd2d-ac18127fa41e', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', '19bc439f-38c5-4667-a2be-7a43eac9a846', 'commitment', 'APP-9285', 4, '2026-03-10', '2026-03-10', 'draft', 33.33, 1561171.52, 390292.88, 130097.63, 10.00, 52039.05, 390292.88);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '1595265f-1076-4d15-bd2d-ac18127fa41e', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '19bc439f-38c5-4667-a2be-7a43eac9a846' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('47d04377-c7fd-4ffd-8db6-b7e9d418a233', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', '19bc439f-38c5-4667-a2be-7a43eac9a846', 'commitment', 'APP-9478', 5, '2026-04-10', '2026-04-10', 'submitted', 41.67, 1561171.52, 520390.51, 130097.63, 10.00, 65048.81, 520390.51);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '47d04377-c7fd-4ffd-8db6-b7e9d418a233', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '19bc439f-38c5-4667-a2be-7a43eac9a846' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('182053a4-a7fd-4c06-9142-90b3ab43d934', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', '06fc3dab-57b5-4baf-81a6-148eb0b985a2', 'commitment', 'APP-7979', 1, '2025-12-10', '2025-12-10', 'submitted', 8.33, 51253.81, 0.00, 4271.15, 10.00, 427.12, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '182053a4-a7fd-4c06-9142-90b3ab43d934', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '06fc3dab-57b5-4baf-81a6-148eb0b985a2' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('66962899-e3d9-44c2-8931-21193d51b42d', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', '06fc3dab-57b5-4baf-81a6-148eb0b985a2', 'commitment', 'APP-1340', 2, '2026-01-10', '2026-01-10', 'draft', 16.67, 51253.81, 4271.15, 4271.15, 10.00, 854.23, 4271.15);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '66962899-e3d9-44c2-8931-21193d51b42d', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '06fc3dab-57b5-4baf-81a6-148eb0b985a2' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('00beffe0-a2a5-45a6-a884-b04e98379bc9', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', '06fc3dab-57b5-4baf-81a6-148eb0b985a2', 'commitment', 'APP-3327', 3, '2026-02-10', '2026-02-10', 'draft', 25.00, 51253.81, 8542.30, 4271.15, 10.00, 1281.35, 8542.30);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '00beffe0-a2a5-45a6-a884-b04e98379bc9', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '06fc3dab-57b5-4baf-81a6-148eb0b985a2' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('15c1f70c-6b5c-4e48-b99c-b5bdb84a843e', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', '06fc3dab-57b5-4baf-81a6-148eb0b985a2', 'commitment', 'APP-2226', 4, '2026-03-10', '2026-03-10', 'submitted', 33.33, 51253.81, 12813.45, 4271.15, 10.00, 1708.46, 12813.45);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '15c1f70c-6b5c-4e48-b99c-b5bdb84a843e', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '06fc3dab-57b5-4baf-81a6-148eb0b985a2' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('ae1d3fc5-703b-49ce-a329-d05167666262', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', '06fc3dab-57b5-4baf-81a6-148eb0b985a2', 'commitment', 'APP-4360', 5, '2026-04-10', '2026-04-10', 'approved', 41.67, 51253.81, 17084.60, 4271.15, 10.00, 2135.58, 17084.60);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'ae1d3fc5-703b-49ce-a329-d05167666262', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '06fc3dab-57b5-4baf-81a6-148eb0b985a2' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('279efc6e-b944-464f-9e86-518703f4ece5', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', '92382a85-0a85-49eb-8ee4-cf744cca9456', 'commitment', 'APP-2792', 1, '2025-12-10', '2025-12-10', 'paid', 8.33, 312738.81, 0.00, 26061.57, 10.00, 2606.16, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '279efc6e-b944-464f-9e86-518703f4ece5', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '92382a85-0a85-49eb-8ee4-cf744cca9456' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('3c4cb231-f239-4415-b34b-33beec9949bf', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', '92382a85-0a85-49eb-8ee4-cf744cca9456', 'commitment', 'APP-2479', 2, '2026-01-10', '2026-01-10', 'draft', 16.67, 312738.81, 26061.57, 26061.57, 10.00, 5212.31, 26061.57);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '3c4cb231-f239-4415-b34b-33beec9949bf', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '92382a85-0a85-49eb-8ee4-cf744cca9456' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('b445254c-2643-4238-9b50-cf071d150857', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', '92382a85-0a85-49eb-8ee4-cf744cca9456', 'commitment', 'APP-4024', 3, '2026-02-10', '2026-02-10', 'paid', 25.00, 312738.81, 52123.14, 26061.57, 10.00, 7818.47, 52123.14);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'b445254c-2643-4238-9b50-cf071d150857', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '92382a85-0a85-49eb-8ee4-cf744cca9456' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('e8ee6636-e9bd-4a36-ae2c-f4819ed21db5', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', '92382a85-0a85-49eb-8ee4-cf744cca9456', 'commitment', 'APP-6509', 4, '2026-03-10', '2026-03-10', 'paid', 33.33, 312738.81, 78184.70, 26061.57, 10.00, 10424.63, 78184.70);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'e8ee6636-e9bd-4a36-ae2c-f4819ed21db5', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '92382a85-0a85-49eb-8ee4-cf744cca9456' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('03b94023-2e77-4ae6-82db-abece80b6b24', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', '92382a85-0a85-49eb-8ee4-cf744cca9456', 'commitment', 'APP-7366', 5, '2026-04-10', '2026-04-10', 'submitted', 41.67, 312738.81, 104246.27, 26061.57, 10.00, 13030.78, 104246.27);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '03b94023-2e77-4ae6-82db-abece80b6b24', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '92382a85-0a85-49eb-8ee4-cf744cca9456' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('b4d196d7-7e84-4f58-8c1e-f9c6bef71205', 'e1dba243-0107-4061-a232-ecce67b29b72', '55caa6dc-e5af-446b-8d0c-d7ef0ad617e8', '5de2dde5-0b6b-4500-82e0-8c4b14d318a9', 'commitment', 'APP-4860', 1, '2025-12-10', '2025-12-10', 'draft', 8.33, 1033664.16, 0.00, 86138.68, 10.00, 8613.87, 0.00);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT 'b4d196d7-7e84-4f58-8c1e-f9c6bef71205', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 0 > 0 THEN cli.scheduled_value * 0.0000 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.0833) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '5de2dde5-0b6b-4500-82e0-8c4b14d318a9' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('52410ed1-7fdd-4ce1-818c-b8620e46d743', 'e1dba243-0107-4061-a232-ecce67b29b72', 'f9ee9800-d929-4123-a95a-50df8e0fde4e', '5de2dde5-0b6b-4500-82e0-8c4b14d318a9', 'commitment', 'APP-1432', 2, '2026-01-10', '2026-01-10', 'submitted', 16.67, 1033664.16, 86138.68, 86138.68, 10.00, 17227.74, 86138.68);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '52410ed1-7fdd-4ce1-818c-b8620e46d743', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 1 > 0 THEN cli.scheduled_value * 0.0833 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.1667) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '5de2dde5-0b6b-4500-82e0-8c4b14d318a9' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('5c936f35-9eda-4a6e-94a7-868db2fdea50', 'e1dba243-0107-4061-a232-ecce67b29b72', 'b6bdda11-5fd7-410c-bcb0-790cc7e4e1dd', '5de2dde5-0b6b-4500-82e0-8c4b14d318a9', 'commitment', 'APP-3599', 3, '2026-02-10', '2026-02-10', 'approved', 25.00, 1033664.16, 172277.36, 86138.68, 10.00, 25841.60, 172277.36);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '5c936f35-9eda-4a6e-94a7-868db2fdea50', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 2 > 0 THEN cli.scheduled_value * 0.1667 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.2500) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '5de2dde5-0b6b-4500-82e0-8c4b14d318a9' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('793a1f1e-77fa-4229-b35e-018611349a03', 'e1dba243-0107-4061-a232-ecce67b29b72', '6e348fdb-98b5-4c09-8bbe-cbd70c2bcbd1', '5de2dde5-0b6b-4500-82e0-8c4b14d318a9', 'commitment', 'APP-9540', 4, '2026-03-10', '2026-03-10', 'draft', 33.33, 1033664.16, 258416.04, 86138.68, 10.00, 34455.47, 258416.04);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '793a1f1e-77fa-4229-b35e-018611349a03', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 3 > 0 THEN cli.scheduled_value * 0.2500 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.3333) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '5de2dde5-0b6b-4500-82e0-8c4b14d318a9' AND cli.contract_type = 'commitment';

INSERT INTO invoices (id, project_id, billing_period_id, contract_id, contract_type, invoice_number, application_number, invoice_date, period_to, status, work_complete_percent, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_percent, retention_amount, previous_payments) VALUES
('185c4441-55ab-4746-af74-e01a82fbc335', 'e1dba243-0107-4061-a232-ecce67b29b72', 'cebce4f4-f8dd-42d1-956c-1074527ad85f', '5de2dde5-0b6b-4500-82e0-8c4b14d318a9', 'commitment', 'APP-7249', 5, '2026-04-10', '2026-04-10', 'approved', 41.67, 1033664.16, 344554.72, 86138.68, 10.00, 43069.34, 344554.72);

INSERT INTO invoice_line_items (invoice_id, contract_line_item_id, line_number, description, cost_code_id, scheduled_value, work_completed_from_previous, work_completed_this_period, retention_amount)
SELECT '185c4441-55ab-4746-af74-e01a82fbc335', cli.id, cli.line_number, cli.description, cli.cost_code_id, cli.scheduled_value, 
  CASE WHEN 4 > 0 THEN cli.scheduled_value * 0.3333 ELSE 0 END,
  cli.scheduled_value * 0.0833,
  CASE WHEN 'commitment' = 'commitment' THEN (cli.scheduled_value * 0.4167) * 0.10 ELSE 0 END
FROM contract_line_items cli
WHERE cli.contract_id = '5de2dde5-0b6b-4500-82e0-8c4b14d318a9' AND cli.contract_type = 'commitment';

-- Lien Waivers (sample)
INSERT INTO lien_waivers (invoice_id, waiver_type, waiver_period, amount, through_date, status, company_id)
SELECT i.id, 'conditional', 'progress', i.current_payment_due, i.period_to, 'received', c.company_id
FROM invoices i
JOIN commitments c ON i.contract_id = c.id
WHERE i.contract_type = 'commitment' AND i.status IN ('approved', 'paid')
LIMIT 20;