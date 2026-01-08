
-- Check Equipment for Brazil (assuming Brazil is a country, let's find its ID first then query)
WITH brazil_equipment AS (
    SELECT 
        e.id, 
        e.name, 
        c.name as category_name, 
        e.category_id
    FROM country_equipment ce
    JOIN countries cnt ON ce.country_id = cnt.id
    JOIN equipment e ON ce.equipment_id = e.id
    JOIN categories c ON e.category_id = c.id
    WHERE cnt.name = 'Brazil'
)
SELECT * FROM brazil_equipment
ORDER BY category_name, name;
