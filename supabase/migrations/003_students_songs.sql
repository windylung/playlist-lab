-- students 테이블
create table if not exists public.students (
  id text primary key,
  name text not null,
  class smallint not null,
  "group" smallint not null,
  sort_order int not null default 0
);

alter table public.students enable row level security;

create policy "students_public_read" on public.students
  for select using (true);

-- songs 테이블
create table if not exists public.songs (
  id text primary key,
  title text not null,
  artist text not null,
  genre text not null,
  genre_en text not null,
  hue int not null default 0,
  edge_color jsonb not null default '[0,0,0]'::jsonb,
  artwork text not null default '',
  youtube text not null default '',
  sort_order int not null default 0
);

alter table public.songs enable row level security;

create policy "songs_public_read" on public.songs
  for select using (true);

-- 시드: 학생 명단 (인공지능 기초 1·4·5반)
insert into public.students (id, name, class, "group", sort_order) values
  -- 1반
  ('20417', '정찬영', 1, 1, 1),
  ('20418', '최시우', 1, 1, 2),
  ('20804', '염예은', 1, 1, 3),
  ('20112', '유은환', 1, 2, 4),
  ('20122', '제성진', 1, 2, 5),
  ('20211', '우성민', 1, 2, 6),
  ('20802', '김소윤', 1, 2, 7),
  ('20111', '용지우', 1, 3, 8),
  ('20203', '김민준', 1, 3, 9),
  ('20208', '박하울', 1, 3, 10),
  ('20403', '김민찬', 1, 3, 11),
  ('20205', '김시후', 1, 4, 12),
  ('20401', '강우민', 1, 4, 13),
  ('20412', '이세준', 1, 4, 14),
  ('20107', '신준호', 1, 5, 15),
  ('20218', '한지훈', 1, 5, 16),
  ('20416', '정세영', 1, 5, 17),
  -- 4반
  ('20807', '이나경', 4, 1, 18),
  ('20409', '안경빈', 4, 1, 19),
  ('20110', '오준서', 4, 1, 20),
  ('20413', '이시우', 4, 1, 21),
  ('20716', '황시연', 4, 2, 22),
  ('20206', '김신우', 4, 2, 23),
  ('20310', '서준호', 4, 2, 24),
  ('20705', '김재연', 4, 2, 25),
  ('20406', '박준혁', 4, 3, 26),
  ('20220', '홍성덕', 4, 3, 27),
  ('20313', '이준서', 4, 3, 28),
  ('20415', '이진석', 4, 3, 29),
  ('20808', '이소민', 4, 4, 30),
  ('20816', '표상아', 4, 4, 31),
  ('20803', '박소율', 4, 4, 32),
  ('20812', '장서인', 4, 4, 33),
  ('20407', '배재성', 4, 5, 34),
  ('20601', '강윤지', 4, 5, 35),
  ('20201', '김도윤', 4, 5, 36),
  ('20805', '윤예진', 4, 5, 37),
  -- 5반
  ('20503', '권우진', 5, 1, 38),
  ('20508', '배준성', 5, 1, 39),
  ('20510', '서보현', 5, 1, 40),
  ('20519', '주현준', 5, 1, 41),
  ('20117', '정일환', 5, 2, 42),
  ('20502', '구교찬', 5, 2, 43),
  ('20506', '문승혁', 5, 2, 44),
  ('20512', '이규범', 5, 2, 45),
  ('20514', '이주연', 5, 2, 46),
  ('20116', '이하늬', 5, 3, 47),
  ('20317', '조상률', 5, 3, 48),
  ('20513', '이연준', 5, 3, 49),
  ('20515', '이주원', 5, 3, 50),
  ('20516', '임시우', 5, 3, 51),
  ('20501', '강태겸', 5, 4, 52),
  ('20504', '김재원', 5, 4, 53),
  ('20505', '김학현', 5, 4, 54),
  ('20511', '신지환', 5, 4, 55),
  ('20517', '임재성', 5, 4, 56),
  ('20507', '박승찬', 5, 5, 57),
  ('20509', '백현민', 5, 5, 58),
  ('20518', '장서우', 5, 5, 59),
  ('20520', '황지원', 5, 5, 60),
  ('20613', '전혜성', 5, 5, 61)
on conflict (id) do nothing;

-- 시드: 플레이리스트 (5장르 × 2곡)
insert into public.songs (id, title, artist, genre, genre_en, hue, edge_color, artwork, youtube, sort_order) values
  ('M001', 'REDRED', 'CORTIS (코르티스)', 'K-POP', 'K-POP', 350, '[117,136,124]',
   'https://cdnimg.melon.co.kr/cm2/album/images/133/38/387/13338387_20260504133459_500.jpg/melon/resize/500/quality/90/optimize',
   'https://www.youtube.com/results?search_query=REDRED+CORTIS', 1),
  ('M002', '빌려온 고양이 (Do the Dance)', 'ILLIT', 'K-POP', 'K-POP', 10, '[157,123,95]',
   'https://cdnimg.melon.co.kr/cm2/album/images/118/47/505/11847505_20250616145148_500.jpg?22d51bebcead638000841b4450c14fbd/melon/resize/500/quality/90/optimize',
   'https://www.youtube.com/results?search_query=ILLIT+%EB%B9%8C%EB%A0%A4%EC%98%A8+%EA%B3%A0%EC%96%91%EC%9D%B4', 2),
  ('M003', '주저하는 연인들을 위해', '잔나비', '인디', 'Indie', 145, '[238,185,17]',
   'https://cdnimg.melon.co.kr/cm/album/images/102/60/858/10260858_500.jpg?02df39ed806cd5e224ae1be4ab9417dd/melon/resize/500/quality/90/optimize',
   'https://www.youtube.com/results?search_query=%EC%A3%BC%EC%A0%80%ED%95%98%EB%8A%94+%EC%97%B0%EC%9D%B8%EB%93%A4%EC%9D%84+%EC%9C%84%ED%95%B4+%EC%9E%94%EB%82%98%EB%B9%84', 3),
  ('M004', '0+0', '한로로', '인디', 'Indie', 160, '[200,71,78]',
   'https://cdnimg.melon.co.kr/cm2/album/images/119/82/233/11982233_20250801150859_500.jpg/melon/resize/500/quality/90/optimize',
   'https://www.youtube.com/results?search_query=0%2B0+%ED%95%9C%EB%A1%9C%EB%A1%9C', 4),
  ('M005', 'LOV3 (Feat. Bryan Chase, Okasian)', '식케이 (Sik-K), Lil Moshpit', '힙합', 'Hip-Hop', 55, '[132,132,132]',
   'https://cdnimg.melon.co.kr/cm2/album/images/117/39/571/11739571_20250317113503_500.jpg?8a557d886c240b571913cf7e7ad386eb/melon/resize/500/quality/90/optimize',
   'https://www.youtube.com/results?search_query=LOV3+%EC%8B%9D%EC%BC%80%EC%9D%B4+Sik-K', 5),
  ('M006', 'KISS KISS KISS', 'NOWIMYOUNG (나우아임영), Royal 44', '힙합', 'Hip-Hop', 65, '[202,29,11]',
   'https://cdnimg.melon.co.kr/cm2/album/images/129/35/901/12935901_20260319143630_500.jpg?YUV444/melon/resize/500/quality/90/optimize',
   'https://www.youtube.com/results?search_query=KISS+KISS+KISS+NOWIMYOUNG', 6),
  ('M007', 'Blinding Lights', 'The Weeknd', '팝', 'Pop', 195, '[250,207,125]',
   'https://cdnimg.melon.co.kr/cm2/album/images/103/58/189/10358189_500.jpg?df9333f7cbf26b136727c230392a7610/melon/resize/500/quality/90/optimize',
   'https://www.youtube.com/results?search_query=Blinding+Lights+The+Weeknd', 7),
  ('M008', 'Sorry', 'Justin Bieber', '팝', 'Pop', 210, '[123,122,119]',
   'https://cdnimg.melon.co.kr/cm/album/images/023/37/419/2337419_500.jpg/melon/resize/500/quality/90/optimize',
   'https://www.youtube.com/results?search_query=Sorry+Justin+Bieber', 8),
  ('M009', '소나기', '이클립스 (ECLIPSE)', '발라드', 'Ballad', 240, '[92,219,247]',
   'https://cdnimg.melon.co.kr/cm2/album/images/114/59/325/11459325_20240405171054_500.jpg?d0a5cf78d5ff0fd792ede55996016f66/melon/resize/500/quality/90/optimize',
   'https://www.youtube.com/results?search_query=%EC%86%8C%EB%82%98%EA%B8%B0+%EC%9D%B4%ED%81%B4%EB%A6%BD%EC%8A%A4+ECLIPSE', 9),
  ('M010', '그대만 있다면', '너드커넥션 (Nerd Connection)', '발라드', 'Ballad', 255, '[156,101,66]',
   'https://cdnimg.melon.co.kr/cm2/album/images/113/05/759/11305759_20230814111006_500.jpg?d0b78d0df98510f195ccde3e38769717/melon/resize/500/quality/90/optimize',
   'https://www.youtube.com/results?search_query=%EA%B7%B8%EB%8C%80%EB%A7%8C+%EC%9E%88%EB%8B%A4%EB%A9%B4+%EB%84%88%EB%93%9C%EC%BB%A4%EB%84%A5%EC%85%98', 10)
on conflict (id) do nothing;
