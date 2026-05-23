# playlist-lab · 우리반의 음악취향

음악 취향 설문 웹앱. 응답은 Supabase에 저장되고 Google Sheets에 동기화됩니다.

## 배포 (Vercel)

1. Supabase SQL: `supabase/migrations/001_*.sql` → `002_*.sql` 순서 실행
2. 환경변수: `npm run env:vercel` → `vercel-env.env` 생성 → Vercel Import
3. Git push → Vercel 연결 → Deploy
4. 학생 URL: `https://YOUR_PROJECT.vercel.app/`

## 로컬 개발

```bash
npm install && cd server && npm install && cd ..
cp server/.env.example server/.env   # 값 입력
cp survey-config.example.js survey-config.js
npm run config:local                 # survey-config.js 갱신
cd server && npm run dev             # API :8787
# 다른 터미널
python3 -m http.server 8080          # 설문 :8080
```

또는 `npm run dev:local` (API + 웹 동시)

## 환경변수

| 변수 | 설명 |
|------|------|
| `SUPABASE_URL` | Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (서버만) |
| `SURVEY_API_KEY` | 설문 API 인증 (랜덤 문자열 권장) |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | 스프레드시트 ID |
| `GOOGLE_APPLICATION_CREDENTIALS` | 로컬: JSON 경로 |
| `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` | Vercel: JSON base64 |

템플릿: `server/.env.example`, `vercel-env.example.json`, `survey-config.example.js`

## Google Sheets

1. Cloud Console → Sheets API → 서비스 계정 JSON → `server/google-service-account.json`
2. 스프레드시트를 서비스 계정 이메일에 **편집자**로 공유
3. `server/.env`에 `GOOGLE_SHEETS_SPREADSHEET_ID` 설정

동일 학생 재제출 시 DB·시트 모두 **기존 행 갱신**됩니다.

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run build` | Vercel용 `survey-config.js` 생성 |
| `npm run env:vercel` | `vercel-env.env` / `vercel-env.json` 생성 |
| `npm run config:local` | 로컬 `survey-config.js` 생성 |
| `npm run sync-sheets` | 대기 중 응답 시트 동기화 |
