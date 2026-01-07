-- check_thumbnails.sql
SELECT id, name, code, image_path, thumbnail_path, description
FROM equipment
WHERE code = '1P00101'; -- Checking the AMX example from user screenshot
