## 1주차: 환경 구축 및 GitHub 프록시 연동

- 프로젝트 계획 수립
  [x] FEATURE.md에 작성
- [x] 3-Tier 아키테처 개발 환경 구성
    - Client (Vite + React + Typescript)
        - [x] axios 설치 및 기본 API 요청 함수 모듈화
        - [x] owner, repo 입력을 받는 폼 UI 구현
        - [x] API 요청: '조회' 버튼 클릭 시 Express 서버(POST /api/github)로 owner, repo 전송
        - [x] API 응답: 서버로부터 받은 GitHub 데이터(커밋/PR 목록) fetch
        - [x] 기본 렌더링: 받아온 데이터를 간단한 목록(list) 형태로 렌더링
        - [x] 로딩/에러 UI: API 요청 상태에 따른 로딩 스피너 및 에러 메시지 처리
        - [x] UI 개선
    - Server (Express)
        - [x] cors, dotenv, axios (또는 node-fetch) 설치
        - [x] 보안: .env 파일을 사용해 GITHUB_TOKEN 안전하게 관리
        - [x] 프록시 엔드포인트: POST /api/github 구현
        - [x] GitHub API 연동: Client 요청을 받아 GitHub GraphQL API로 대신 요청
        - [x] 데이터 전달: GitHub로부터 받은 JSON 데이터를 Client로 그대로 전달

## 2주차: LLM 연동 및 블로그 콘텐츠 생성

- [x] AI 요약 기능 연동 및 UI 고도화
    - Client (Vite + React + TypeScript)
        - [x] AI 요약 요청: 목록에서 특정 항목 클릭 시, 'AI 요약' 버튼으로 서버에 요약 요청 (POST /api/summarize)
        - [x] UI/UX 개선: 1주차 목록 UI 개선 (TailwindCSS 활용)
        - [x] 상세 UI: 요약 결과를 보여줄 모달(Modal) 또는 상세 패널(Panel) 구현
    - Server (Express)
        - [x] 보안: .env 파일에 GEMINI_API_KEY 추가
        - [x] AI 엔드포인트: POST /api/summarize 엔드포인트 구현
        - [x] 프롬프트 엔지니어링: Client로부터 받은 텍스트(커밋 메시지, PR 내용 등)를 기반으로 Gemini API에 전송할 프롬프트 작성
        - [x] LLM 연동: Google Gemini API 호출 및 응답 데이터 정제
        - [x] AI 응답: 정제된 요약 텍스트를 Client로 전달
        - [x] 프롬프트도 전달할 수 있게 기능 추가

- [x] 1주차 피드백 반영
    - [x] 라이브러리를 package.json에 포함시켜서 의존성 문제 해결
    - [x] API URL 환경 변수 처리
    - [x] API 응답 타입 정의 및 옵셔널 체이닝 해결
    - [x] map()에서 index 대신 고유 key 사용 (React 성능 최적화)
    - [x] CORS 대신 Vite 프록시 사용
    - [x] Husky/Lefthook 설정

## 3주차: 콘텐츠 저장 및 관리 (LocalStorage)

- [x] 생성된 글 저장 및 '내 블로그' 기능 구현
    - Client (Vite + React + TypeScript)
        - [x] 저장 기능: '블로그로 저장' 버튼 UI 및 로직 구현
        - [x] 데이터 영속성: 생성된 요약 글을 LocalStorage에 저장 (JSON.stringify) 및 로드 (JSON.parse)
        - [x] 전역 상태 (Optional): Context API 또는 Zustand 등을 사용해 'fetch한 커밋', '저장된 글' 목록 전역 관리
        - [x] '내 저장 글' UI: 저장된 글 목록을 보여주는 별도 탭 또는 페이지 구현
        - [x] 상세 보기: 저장된 글을 클릭 시, 상세 내용을 볼 수 있는 기능
    - Server (Express)
        - [x] SHA를 이용한 Github diff 파일 비교 및 변경 사항을 커밋 메세지와 같이 Gemini로 전달

- [x] 2주차 피드백 반영
    - [x] API 호출 로직을 hook으로 분리
    - [x] Error를 던질 때, Error가 상위로 전파되지 않게 구조 개선
