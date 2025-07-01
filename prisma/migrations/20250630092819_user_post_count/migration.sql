CREATE OR REPLACE VIEW user_post_count AS
SELECT
  u.id AS user_id,
  COUNT(p.id) AS post_count
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
GROUP BY u.id;