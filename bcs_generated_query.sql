-- ==========================================
-- BCS Agent: Generated SQL Query
-- Requirement: write sql query for top ranking students
-- ==========================================

WITH TeamPerformance AS (
    SELECT 
        student_id,
        name,
        department,
        cgpa,
        RANK() OVER (PARTITION BY department ORDER BY cgpa DESC) AS dept_rank
    FROM student_records
    WHERE cgpa >= 7.0
)
SELECT 
    student_id,
    name,
    department,
    cgpa,
    dept_rank
FROM TeamPerformance
WHERE dept_rank <= 3
ORDER BY department, dept_rank;
