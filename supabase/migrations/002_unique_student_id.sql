-- 학생 1인 1응답 (중복 제출 시 UPDATE). 기존 중복 행이 있으면 먼저 정리 후 실행하세요.
create unique index if not exists idx_survey_responses_student_id_unique
  on public.survey_responses (student_id)
  where student_id <> '';
