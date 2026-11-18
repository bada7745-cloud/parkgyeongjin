# 포켓 크리터즈 v0.4 — 무료 모바일 설치형

게임은 GitHub Pages, 회원 계정과 저장은 Supabase Free로 분리합니다. Render 유료 배포는 취소하고 자동 동기화를 껐습니다. 유료 서버는 생성하지 않았습니다.

## 실행과 업데이트

`.github/workflows/pages.yml`이 main 변경마다 게임 빌드와 22개 검사를 실행한 뒤 dist를 GitHub Pages에 배포합니다. 기존 전투 중에는 강제 업데이트하지 않고 메인/일시정지 상태에서 새 버전을 적용합니다. 홈 화면에 설치하면 Android/iPhone에서 앱처럼 실행할 수 있습니다. APK나 App Store 설치와는 다른 PWA 방식입니다.

GitHub Pages의 프로젝트 경로 `/parkgyeongjin/`에 맞춰 모든 게임 파일·업데이트 경로를 상대 주소로 구성했습니다. 로컬 전투 저장 키는 기존 버전과 같아 같은 주소/브라우저의 저장을 유지합니다. 다른 주소에 저장한 전투가 자동 이동하지는 않습니다.

## 회원 계정 연결 상태

Supabase 프로젝트 연결은 아직 완료하지 않았습니다. 게임은 게스트 플레이가 가능하며, 연결되지 않은 회원 기능은 준비 중이라고 표시합니다. 회원가입 성공이나 클라우드 저장을 가짜로 표시하지 않습니다.

프로젝트 연결 후 `dist/config.js`의 supabaseUrl과 공개 publishable/anon 키를 설정합니다. secret/service_role 키는 이 파일이나 GitHub에 넣지 마세요.

`supabase/migrations/202611180001_game_saves.sql`을 적용하면 사용자별 전투 저장 테이블과 행 단위 읽기 권한, revision 기반 원자적 저장 함수를 만듭니다. 비밀번호와 세션 관리는 공식 Supabase SDK가 담당합니다. 이메일 확인은 Supabase 설정을 따릅니다. 실제 메일 발송은 Supabase의 메일 정책/한도와 SMTP 설정에 영향을 받습니다.

계정 삭제 Edge Function은 `supabase/functions/delete-account/index.ts`입니다. 서버에만 서비스 권한을 보관하며, 토큰으로 확인한 본인 계정만 삭제합니다. `ALLOWED_ORIGIN`은 `https://bada7745-cloud.github.io`로 설정하고, 배포가 완료된 뒤 accountDeletionEnabled를 true로 바꿉니다. 아직 배포되지 않은 기능을 활성화하지 마세요.

Authentication의 Site URL 및 Redirect URLs에는 실제 GitHub Pages 게임 주소를 등록합니다. SDK는 필요할 때 공식 CDN에서 로드하므로 오프라인에서 계정 접속은 불가능하지만 캐시된 게임의 게스트 플레이는 가능합니다.

## 검증

Node 24 이상: `npm test`.

엔진 14개, Supabase 어댑터 6개, 릴리스/업데이트 2개 검사. 어댑터 검사는 모의 클라이언트로 수행합니다. Supabase 프로젝트가 연결되기 전에는 실제 회원가입, DB 권한 정책, 메일, 계정 삭제의 운영 동작을 검증한 것이 아닙니다.

`node release.cjs`로 내용에 따른 릴리스 ID와 파일 해시를 갱신합니다. 무료 플랜 한도와 비활성 프로젝트 일시정지 조건은 실제 사용 시 공급자에서 확인해야 합니다. 유료 플랜 전환은 수행하지 않습니다.

## 이전 구현

server/의 Node·SQLite 서버와 Docker 구성은 이전 버전 참고용입니다. 무료 배포에는 사용하지 않습니다. android/와 ios/의 네이티브 앱 프로젝트도 참고용이며, 이번 배포의 기본 설치 방식은 PWA입니다. iPhone/Android 네이티브 설치 파일이나 스토어 등록이 완료되었다는 의미는 아닙니다.
