## 목차

1. [프로젝트 소개](#-프로젝트-소개-)
2. [팀원](#팀원)
3. [기술 스택](#기술-스택)
4. [프로젝트 자료](#프로젝트-자료)
5. [프로젝트 기능](#프로젝트-기능)
6. [게임 시작 방법](#게임-시작-방법)
7. [프로젝트 및 회고](#프로젝트-및-회고)

---

## 📋 프로젝트 소개 📋

📌 마피아 게임을 통해 플레이어들은 협력하며 마피아를 찾아내고, 전략적으로 게임을 진행할 수 있습니다.
📌 의사, 경찰 등 다양한 직업 이 있어 재미있는 플레이를 할수 있습니다. 힘을 합쳐 마피아를 찾아보세요!
📌 마피아 게임을 통해 얻은 포인트를 통해 상점에서 아이템을 구매할수 있습니다. 원하는 아이템을 구매해 보세요!
📌 랭킹을 통해 누가 최고의 플레이어인지 확인할수 있습니다. 최고의 플레이어가 되어보세요!

## 팀원

🤵🏻정찬식(팀장)  
🕵윤형근(부팀장)  
🕵유대원(부팀장)  
🙍김호진  
🙍김동환  
🙍박양선  
🙍김용우

## 기술 스택

### FRONTEND

📄HTML
🎨CSS
⚙️Javascript

### BACKEND

🟢Node.js
🚀Nest.js
🗄️TypeOrm  
💻Typescript
⚡WebSocket
🚩Redis Pub/Sub
🔀Bull Queue

### DATABASE

🛢️AWS RDS-MYSQL
🔴REDIS

### DevOps / Infra

☁️AWS Lambda
⏱️AWS Cloud-watch
🔔AWS SNS
🚨Sentry
⚖️AWS ALB
🐳AWS ECS
🗃️AWS S3
🔒AWS HTTPS

## 프로젝트 자료

🧩 [피그마](https://www.figma.com/design/NOOZIfc4SlIlGoU0vDcVML/%EC%B5%9C%EC%A2%85-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%3A-%EB%A7%88%ED%94%BC%EC%95%84-%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0?node-id=0-1&p=f&t=3voTGuDi9FMaGqiN-0)

📑 [다이어그램](https://drawsql.app/teams/adqqs/diagrams/mafia)

🎥 [게임 소개 영상](https://www.youtube.com/watch?v=2UVN-dpqvPU)

📖 [브로셔](https://teamsparta.notion.site/Node-js-7-1a72dc3ef514808e9ee0f43119a22e8d?p=1b32dc3ef51480ed8e27dad771b8203d&pm=c)

## 프로젝트 기능

### 🍷 1.마피아 게임방을 누구나 만들어 게임을 시작할수 있습니다. 부담없이 게임을 해보세요!

### 🎩 2.실시간 채팅을 통해 서로의 의견을 나눌수 있습니다. 추리를 해서 마피아를 찾아주세요!

### 🎭 3.투표를 통해 처형을 선택할수 있습니다. 신중하게 투표를 하세요!

### 🚬 4.게시판에 댓글이나 이미지를 올려 의견을 나눌수 있습니다. 원활한 커뮤니케이션을 경험하세요!

### 💸 5.AWS 에 EC2/ECS 를 통해 안정적인 게임 서버를 운영합니다. 안심하고 마피아 게임을 하세요!

## 🎮 게임 시작 방법

### 1.회원가입 & 로그인

마피아 게임 홈페이지에서 우측 상단에 회원가입 및 로그인을 하세요

### 2.게임 시작

홈페이지 정중앙에 있는 게임 시작 버튼을 눌러 게임 시작을 하세요

### 3.방 만들기

6인/8인, 비공개(방 비번 생성), 제목 등 설정을 통해 원하는 방을 만드세요

### 4.게임할 사람 모으기

초대 또는 기달려서 게임 인원을 모으세요

### 5.마피아를 찾아라!

인원이 다 모이면 직업을 할당 받고 본격적인 행동을 하세요

## 🤝 프로젝트 및 회고

### 프로젝트 과정

- 마피아 게임 기획 및 초기 와이어프레임 설계
- 타입스크립트, Nest.js를 사용함으로써 안정성 높은 프로젝트 생성
- SQLdraw, Figma를 사용하여 ERD 설계 및 테이블 스키마 작성
- 역할 분담 후 브랜치를 생성해 각각 맡은 역할을 담당
- Redis를 사용해 데이터를 빠르게 처리함
- EC2/ECS를 통해 안정적인 게임 서버를 생성
- CloudWatch를 통해 실시간 알람 캡처 및 웹후크 를 통해 Discord 채널로 전송
- 유저 테스트를 진행하여 피드백을 수렴

### 회고

이번 프로젝트에서는 신규 기술들을 대거 도입함으로써 좋은 결과물을 만들 수 있었습니다.
웹소켓, 도커, AWS, Redis, Bull Queue 등을 프로젝트에 사용하면서 많은 것을 배울 수 있었고, 매우 유익한 경험이었습니다.
하지만 아쉬운 점도 있었습니다. 신규 기술들을 사용하는 데 시간이 많이 소요되었고, 프로젝트가 큰 만큼 버그도 예전 프로젝트들보다 많이 발생했습니다.
그럼에도 불구하고 팀원들과 지속적인 소통 및 담당 튜터님의 도움을 받으면서 프로젝트를 완성할 수 있었습니다.
마피아 웹 게임 프로젝트를 진행하면서 신규 기술의 도입과 활용도가 얼마나 중요한지 깨닫게 되었습니다.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```
MAFI4
├─ .eslintrc.js
├─ .prettierrc
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ public
│  ├─ board
│  │  ├─ board.css
│  │  ├─ board.html
│  │  └─ board.js
│  ├─ login
│  │  ├─ login.css
│  │  ├─ login.html
│  │  └─ login.js
│  └─ signup
│     ├─ signup.css
│     ├─ signup.html
│     └─ signup.js
├─ README.md
├─ src
│  ├─ achievements
│  │  ├─ achievements.controller.spec.ts
│  │  ├─ achievements.controller.ts
│  │  ├─ achievements.module.ts
│  │  ├─ achievements.service.spec.ts
│  │  ├─ achievements.service.ts
│  │  ├─ dto
│  │  │  ├─ create-achievement.dto.ts
│  │  │  └─ update-achievement.dto.ts
│  │  └─ entities
│  │     └─ achievement.entity.ts
│  ├─ admin
│  │  ├─ admin.controller.ts
│  │  ├─ admin.module.ts
│  │  ├─ admin.service.ts
│  │  └─ dto
│  │     ├─ create-announcement.dto.ts
│  │     └─ update-user.dto.ts
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ auth
│  │  ├─ auth.module.ts
│  │  ├─ controllers
│  │  │  ├─ auth.controller.spec.ts
│  │  │  └─ auth.controller.ts
│  │  ├─ dto
│  │  │  ├─ login.dto.ts
│  │  │  └─ verify-email.dto.ts
│  │  ├─ guards
│  │  │  ├─ ban.guard.ts
│  │  │  ├─ jwt-auth.guard.spec.ts
│  │  │  └─ jwt-auth.guard.ts
│  │  ├─ repositories
│  │  │  └─ auth.repository.ts
│  │  └─ services
│  │     ├─ auth.service.spec.ts
│  │     └─ auth.service.ts
│  ├─ comments
│  │  ├─ comments.controller.spec.ts
│  │  ├─ comments.controller.ts
│  │  ├─ comments.module.ts
│  │  ├─ comments.repository.ts
│  │  ├─ comments.service.spec.ts
│  │  ├─ comments.service.ts
│  │  ├─ dto
│  │  │  ├─ create-comment.dto.ts
│  │  │  └─ update-comment.dto.ts
│  │  └─ entities
│  │     └─ comment.entity.ts
│  ├─ common
│  │  └─ exceptions
│  │     ├─ achievements.exception.ts
│  │     ├─ auth.exception.ts
│  │     ├─ comments.exception.ts
│  │     ├─ games.exception.ts
│  │     ├─ http-exception.filter.ts
│  │     ├─ posts.exception.ts
│  │     ├─ rooms.exception.ts
│  │     ├─ statistics.exception.ts
│  │     └─ users.exception.ts
│  ├─ games
│  │  ├─ dto
│  │  │  ├─ create-game.dto.ts
│  │  │  └─ update-game.dto.ts
│  │  ├─ entities
│  │  │  └─ game.entity.ts
│  │  ├─ games.controller.spec.ts
│  │  ├─ games.controller.ts
│  │  ├─ games.module.ts
│  │  ├─ games.service.spec.ts
│  │  └─ games.service.ts
│  ├─ likes
│  │  ├─ entities
│  │  │  └─ like.entity.ts
│  │  ├─ likes.controller.spec.ts
│  │  ├─ likes.controller.ts
│  │  ├─ likes.module.ts
│  │  ├─ likes.repository.ts
│  │  ├─ likes.service.spec.ts
│  │  └─ likes.service.ts
│  ├─ main.ts
│  ├─ posts
│  │  ├─ dto
│  │  │  ├─ create-post.dto.ts
│  │  │  └─ update-post.dto.ts
│  │  ├─ entities
│  │  │  └─ post.entity.ts
│  │  ├─ posts.controller.spec.ts
│  │  ├─ posts.controller.ts
│  │  ├─ posts.module.ts
│  │  ├─ posts.repository.ts
│  │  ├─ posts.service.spec.ts
│  │  └─ posts.service.ts
│  ├─ redis
│  │  ├─ redis.module.ts
│  │  ├─ redis.service.spec.ts
│  │  └─ redis.service.ts
│  ├─ rooms
│  │  ├─ dto
│  │  │  ├─ create-room.dto.ts
│  │  │  └─ update-room.dto.ts
│  │  ├─ entities
│  │  │  └─ room.entity.ts
│  │  ├─ rooms.controller.spec.ts
│  │  ├─ rooms.controller.ts
│  │  ├─ rooms.module.ts
│  │  ├─ rooms.repository.ts
│  │  ├─ rooms.service.spec.ts
│  │  └─ rooms.service.ts
│  ├─ s3uploader
│  │  ├─ s3uploader.module.ts
│  │  ├─ s3uploader.service.spec.ts
│  │  └─ s3uploader.service.ts
│  ├─ statistics
│  │  ├─ dto
│  │  │  ├─ create-statistic.dto.ts
│  │  │  └─ update-statistic.dto.ts
│  │  ├─ entities
│  │  │  └─ statistic.entity.ts
│  │  ├─ statistics.controller.spec.ts
│  │  ├─ statistics.controller.ts
│  │  ├─ statistics.module.ts
│  │  ├─ statistics.service.spec.ts
│  │  └─ statistics.service.ts
│  ├─ user-achievements
│  │  ├─ dto
│  │  │  ├─ create-users-achievement.dto.ts
│  │  │  └─ update-users-achievement.dto.ts
│  │  ├─ entities
│  │  │  └─ users-achievement.entity.ts
│  │  ├─ users-achievements.controller.spec.ts
│  │  ├─ users-achievements.controller.ts
│  │  ├─ users-achievements.module.ts
│  │  ├─ users-achievements.service.spec.ts
│  │  └─ users-achievements.service.ts
│  └─ users
│     ├─ dto
│     │  ├─ create-user.dto.ts
│     │  └─ update-user.dto.ts
│     ├─ entities
│     │  └─ user.entity.ts
│     ├─ users.controller.spec.ts
│     ├─ users.controller.ts
│     ├─ users.module.ts
│     ├─ users.repository.ts
│     ├─ users.service.spec.ts
│     └─ users.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```

```
MAFI4
├─ .eslintrc.js
├─ .prettierrc
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ achievements
│  │  ├─ achievements.controller.spec.ts
│  │  ├─ achievements.controller.ts
│  │  ├─ achievements.module.ts
│  │  ├─ achievements.service.spec.ts
│  │  ├─ achievements.service.ts
│  │  ├─ dto
│  │  │  ├─ create-achievement.dto.ts
│  │  │  └─ update-achievement.dto.ts
│  │  └─ entities
│  │     └─ achievement.entity.ts
│  ├─ admin
│  │  ├─ admin.controller.ts
│  │  ├─ admin.module.ts
│  │  ├─ admin.service.ts
│  │  └─ dto
│  │     ├─ create-announcement.dto.ts
│  │     └─ update-user.dto.ts
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ auth
│  │  ├─ auth.module.ts
│  │  ├─ controllers
│  │  │  ├─ auth.controller.spec.ts
│  │  │  └─ auth.controller.ts
│  │  ├─ dto
│  │  │  ├─ login.dto.ts
│  │  │  └─ verify-email.dto.ts
│  │  ├─ guards
│  │  │  ├─ ban.guard.ts
│  │  │  ├─ jwt-auth.guard.spec.ts
│  │  │  └─ jwt-auth.guard.ts
│  │  ├─ repositories
│  │  │  └─ auth.repository.ts
│  │  └─ services
│  │     ├─ auth.service.spec.ts
│  │     └─ auth.service.ts
│  ├─ comments
│  │  ├─ comments.controller.spec.ts
│  │  ├─ comments.controller.ts
│  │  ├─ comments.module.ts
│  │  ├─ comments.repository.ts
│  │  ├─ comments.service.spec.ts
│  │  ├─ comments.service.ts
│  │  ├─ dto
│  │  │  ├─ create-comment.dto.ts
│  │  │  └─ update-comment.dto.ts
│  │  └─ entities
│  │     └─ comment.entity.ts
│  ├─ common
│  │  └─ exceptions
│  │     ├─ achievements.exception.ts
│  │     ├─ auth.exception.ts
│  │     ├─ comments.exception.ts
│  │     ├─ games.exception.ts
│  │     ├─ http-exception.filter.ts
│  │     ├─ posts.exception.ts
│  │     ├─ rooms.exception.ts
│  │     ├─ statistics.exception.ts
│  │     └─ users.exception.ts
│  ├─ games
│  │  ├─ dto
│  │  │  ├─ create-game.dto.ts
│  │  │  └─ update-game.dto.ts
│  │  ├─ entities
│  │  │  └─ game.entity.ts
│  │  ├─ games.controller.spec.ts
│  │  ├─ games.controller.ts
│  │  ├─ games.module.ts
│  │  ├─ games.service.spec.ts
│  │  └─ games.service.ts
│  ├─ likes
│  │  ├─ entities
│  │  │  └─ like.entity.ts
│  │  ├─ likes.controller.spec.ts
│  │  ├─ likes.controller.ts
│  │  ├─ likes.module.ts
│  │  ├─ likes.repository.ts
│  │  ├─ likes.service.spec.ts
│  │  └─ likes.service.ts
│  ├─ main.ts
│  ├─ posts
│  │  ├─ dto
│  │  │  ├─ create-post.dto.ts
│  │  │  └─ update-post.dto.ts
│  │  ├─ entities
│  │  │  └─ post.entity.ts
│  │  ├─ posts.controller.spec.ts
│  │  ├─ posts.controller.ts
│  │  ├─ posts.module.ts
│  │  ├─ posts.repository.ts
│  │  ├─ posts.service.spec.ts
│  │  └─ posts.service.ts
│  ├─ public
│  │  ├─ board
│  │  │  ├─ board.css
│  │  │  ├─ board.html
│  │  │  └─ board.js
│  │  ├─ components
│  │  │  ├─ footer
│  │  │  │  ├─ footer.html
│  │  │  │  └─ footer.js
│  │  │  └─ header
│  │  │     ├─ header.html
│  │  │     └─ header.js
│  │  ├─ createPost
│  │  │  ├─ createPost.css
│  │  │  ├─ createPost.html
│  │  │  └─ createPost.js
│  │  ├─ home
│  │  │  ├─ home.css
│  │  │  ├─ home.html
│  │  │  └─ home.js
│  │  ├─ login
│  │  │  ├─ login.css
│  │  │  ├─ login.html
│  │  │  └─ login.js
│  │  ├─ myPage
│  │  │  ├─ myPage.css
│  │  │  ├─ myPage.html
│  │  │  └─ myPage.js
│  │  ├─ post
│  │  │  ├─ post.css
│  │  │  ├─ post.html
│  │  │  └─ post.js
│  │  ├─ scripts
│  │  │  ├─ api.js
│  │  │  └─ common.js
│  │  ├─ signup
│  │  │  ├─ signup.css
│  │  │  ├─ signup.html
│  │  │  └─ signup.js
│  │  └─ styles
│  │     └─ common.css
│  ├─ redis
│  │  ├─ redis.module.ts
│  │  ├─ redis.service.spec.ts
│  │  └─ redis.service.ts
│  ├─ rooms
│  │  ├─ dto
│  │  │  ├─ create-room.dto.ts
│  │  │  └─ update-room.dto.ts
│  │  ├─ entities
│  │  │  └─ room.entity.ts
│  │  ├─ rooms.controller.spec.ts
│  │  ├─ rooms.controller.ts
│  │  ├─ rooms.module.ts
│  │  ├─ rooms.repository.ts
│  │  ├─ rooms.service.spec.ts
│  │  └─ rooms.service.ts
│  ├─ s3uploader
│  │  ├─ s3uploader.module.ts
│  │  ├─ s3uploader.service.spec.ts
│  │  └─ s3uploader.service.ts
│  ├─ statistics
│  │  ├─ dto
│  │  │  ├─ create-statistic.dto.ts
│  │  │  └─ update-statistic.dto.ts
│  │  ├─ entities
│  │  │  └─ statistic.entity.ts
│  │  ├─ statistics.controller.spec.ts
│  │  ├─ statistics.controller.ts
│  │  ├─ statistics.module.ts
│  │  ├─ statistics.service.spec.ts
│  │  └─ statistics.service.ts
│  ├─ user-achievements
│  │  ├─ dto
│  │  │  ├─ create-users-achievement.dto.ts
│  │  │  └─ update-users-achievement.dto.ts
│  │  ├─ entities
│  │  │  └─ users-achievement.entity.ts
│  │  ├─ users-achievements.controller.spec.ts
│  │  ├─ users-achievements.controller.ts
│  │  ├─ users-achievements.module.ts
│  │  ├─ users-achievements.service.spec.ts
│  │  └─ users-achievements.service.ts
│  └─ users
│     ├─ dto
│     │  ├─ create-user.dto.ts
│     │  └─ update-user.dto.ts
│     ├─ entities
│     │  └─ user.entity.ts
│     ├─ users.controller.spec.ts
│     ├─ users.controller.ts
│     ├─ users.module.ts
│     ├─ users.repository.ts
│     ├─ users.service.spec.ts
│     └─ users.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```

```
MAFI4
├─ .eslintrc.js
├─ .prettierrc
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ achievements
│  │  ├─ achievements.controller.spec.ts
│  │  ├─ achievements.controller.ts
│  │  ├─ achievements.list.json
│  │  ├─ achievements.module.ts
│  │  ├─ achievements.repository.ts
│  │  ├─ achievements.service.spec.ts
│  │  ├─ achievements.service.ts
│  │  ├─ dto
│  │  │  ├─ create-achievement.dto.ts
│  │  │  └─ update-achievement.dto.ts
│  │  └─ entities
│  │     └─ achievement.entity.ts
│  ├─ admin
│  │  ├─ admin.controller.ts
│  │  ├─ admin.module.ts
│  │  ├─ admin.repository.ts
│  │  ├─ admin.service.ts
│  │  ├─ constants
│  │  │  └─ admin-log-messages.ts
│  │  ├─ dto
│  │  │  ├─ create-announcement.dto.ts
│  │  │  └─ update-user.dto.ts
│  │  └─ entities
│  │     └─ adminLog.entity.ts
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ auth
│  │  ├─ auth.module.ts
│  │  ├─ controllers
│  │  │  └─ auth.controller.ts
│  │  ├─ dto
│  │  │  ├─ login.dto.ts
│  │  │  └─ verify-email.dto.ts
│  │  ├─ guards
│  │  │  ├─ community-ban.guard.ts
│  │  │  ├─ game-ban.guard.ts
│  │  │  ├─ jwt-auth.guard.spec.ts
│  │  │  └─ jwt-auth.guard.ts
│  │  ├─ processors
│  │  │  └─ email.processor.ts
│  │  ├─ repositories
│  │  │  └─ auth.repository.ts
│  │  └─ services
│  │     ├─ auth.service.spec.ts
│  │     └─ auth.service.ts
│  ├─ comments
│  │  ├─ comments.controller.spec.ts
│  │  ├─ comments.controller.ts
│  │  ├─ comments.module.ts
│  │  ├─ comments.repository.ts
│  │  ├─ comments.service.spec.ts
│  │  ├─ comments.service.ts
│  │  ├─ dto
│  │  │  ├─ create-comment.dto.ts
│  │  │  └─ update-comment.dto.ts
│  │  └─ entities
│  │     └─ comment.entity.ts
│  ├─ common
│  │  └─ exceptions
│  │     ├─ achievements.exception.ts
│  │     ├─ auth.exception.ts
│  │     ├─ comments.exception.ts
│  │     ├─ games.exception.ts
│  │     ├─ http-exception.filter.ts
│  │     ├─ item.exception.ts
│  │     ├─ posts.exception.ts
│  │     ├─ rooms.exception.ts
│  │     ├─ statistics.exception.ts
│  │     └─ users.exception.ts
│  ├─ gameAchievements
│  │  ├─ entities
│  │  │  └─ gameAchievements.entity.ts
│  │  ├─ gameAchievements.controller.ts
│  │  ├─ gameAchievements.module.ts
│  │  └─ gameAchievements.service.ts
│  ├─ gameResults
│  │  ├─ entities
│  │  │  └─ gameResults.entity.ts
│  │  ├─ gameResults.controller.ts
│  │  ├─ gameResults.module.ts
│  │  ├─ gameResults.service.ts
│  │  └─ gameResults.subscriber.ts
│  ├─ items
│  │  ├─ dto
│  │  │  ├─ create-item.dto.ts
│  │  │  └─ update-item.dto.ts
│  │  ├─ entities
│  │  │  └─ item.entity.ts
│  │  ├─ items.controller.ts
│  │  ├─ items.module.ts
│  │  ├─ items.repository.ts
│  │  └─ items.service.ts
│  ├─ likes
│  │  ├─ entities
│  │  │  └─ like.entity.ts
│  │  ├─ likes.controller.spec.ts
│  │  ├─ likes.controller.ts
│  │  ├─ likes.module.ts
│  │  ├─ likes.repository.ts
│  │  ├─ likes.service.spec.ts
│  │  └─ likes.service.ts
│  ├─ main.ts
│  ├─ posts
│  │  ├─ dto
│  │  │  ├─ create-post.dto.ts
│  │  │  └─ update-post.dto.ts
│  │  ├─ entities
│  │  │  └─ post.entity.ts
│  │  ├─ posts.controller.spec.ts
│  │  ├─ posts.controller.ts
│  │  ├─ posts.module.ts
│  │  ├─ posts.repository.ts
│  │  ├─ posts.service.spec.ts
│  │  └─ posts.service.ts
│  ├─ public
│  │  ├─ admin
│  │  │  ├─ admin.css
│  │  │  ├─ admin.html
│  │  │  └─ admin.js
│  │  ├─ board
│  │  │  ├─ board.css
│  │  │  ├─ board.html
│  │  │  └─ board.js
│  │  ├─ components
│  │  │  ├─ footer
│  │  │  │  ├─ footer.html
│  │  │  │  └─ footer.js
│  │  │  └─ header
│  │  │     ├─ header.html
│  │  │     └─ header.js
│  │  ├─ createPost
│  │  │  ├─ createPost.css
│  │  │  ├─ createPost.html
│  │  │  └─ createPost.js
│  │  ├─ game.html
│  │  ├─ guide
│  │  │  ├─ guide.css
│  │  │  ├─ guide.html
│  │  │  └─ guide.js
│  │  ├─ home
│  │  │  ├─ home.css
│  │  │  ├─ home.html
│  │  │  └─ home.js
│  │  ├─ imageFile
│  │  │  ├─ citizen.png
│  │  │  ├─ commingSoon.png
│  │  │  ├─ condition.png
│  │  │  ├─ doctor.png
│  │  │  ├─ game.png
│  │  │  ├─ goal.png
│  │  │  ├─ mafia.png
│  │  │  ├─ MafiaBackground.png
│  │  │  ├─ NeoBackground.png
│  │  │  ├─ Nickname.png
│  │  │  ├─ placeholder.svg
│  │  │  ├─ police.png
│  │  │  ├─ Profile.png
│  │  │  ├─ Record.png
│  │  │  ├─ SparkleBackground.png
│  │  │  └─ whistle.png
│  │  ├─ index.html
│  │  ├─ js
│  │  │  └─ config.js
│  │  ├─ login
│  │  │  ├─ login.css
│  │  │  ├─ login.html
│  │  │  └─ login.js
│  │  ├─ myPage
│  │  │  ├─ myPage.css
│  │  │  ├─ myPage.html
│  │  │  └─ myPage.js
│  │  ├─ post
│  │  │  ├─ post.css
│  │  │  ├─ post.html
│  │  │  └─ post.js
│  │  ├─ ranking
│  │  │  ├─ ranking.css
│  │  │  ├─ ranking.html
│  │  │  └─ ranking.js
│  │  ├─ room
│  │  │  ├─ js
│  │  │  │  └─ config.js
│  │  │  ├─ room.css
│  │  │  ├─ room.html
│  │  │  └─ room.js
│  │  ├─ room.html
│  │  ├─ roomList
│  │  │  ├─ roomList.css
│  │  │  ├─ roomList.html
│  │  │  └─ roomList.js
│  │  ├─ scripts
│  │  │  ├─ api.js
│  │  │  └─ common.js
│  │  ├─ shop
│  │  │  ├─ shop.css
│  │  │  ├─ shop.html
│  │  │  └─ shop.js
│  │  ├─ signup
│  │  │  ├─ signup.css
│  │  │  ├─ signup.html
│  │  │  └─ signup.js
│  │  ├─ styles
│  │  │  └─ common.css
│  │  └─ test
│  │     ├─ js
│  │     │  └─ config.js
│  │     └─ testRoom.html
│  ├─ redis
│  │  ├─ redis.module.ts
│  │  ├─ redis.service.spec.ts
│  │  └─ redis.service.ts
│  ├─ rooms
│  │  ├─ dto
│  │  │  ├─ create-room.dto.ts
│  │  │  └─ update-room.dto.ts
│  │  ├─ entities
│  │  │  └─ room.entity.ts
│  │  ├─ rooms.controller.spec.ts
│  │  ├─ rooms.controller.ts
│  │  ├─ rooms.module.ts
│  │  ├─ rooms.repository.ts
│  │  ├─ rooms.service.spec.ts
│  │  └─ rooms.service.ts
│  ├─ s3uploader
│  │  ├─ s3uploader.module.ts
│  │  ├─ s3uploader.service.spec.ts
│  │  └─ s3uploader.service.ts
│  ├─ schedule
│  │  ├─ ban-expiration.service.ts
│  │  └─ schedule.module.ts
│  ├─ statistics
│  │  ├─ dto
│  │  │  ├─ create-statistic.dto.ts
│  │  │  └─ update-statistic.dto.ts
│  │  ├─ entities
│  │  │  └─ statistic.entity.ts
│  │  ├─ statistics.controller.spec.ts
│  │  ├─ statistics.controller.ts
│  │  ├─ statistics.module.ts
│  │  ├─ statistics.service.spec.ts
│  │  └─ statistics.service.ts
│  ├─ user-achievements
│  │  ├─ dto
│  │  │  ├─ create-users-achievement.dto.ts
│  │  │  └─ update-users-achievement.dto.ts
│  │  ├─ entities
│  │  │  └─ users-achievement.entity.ts
│  │  ├─ users-achievements.controller.spec.ts
│  │  ├─ users-achievements.controller.ts
│  │  ├─ users-achievements.module.ts
│  │  ├─ users-achievements.repository.ts
│  │  ├─ users-achievements.service.spec.ts
│  │  └─ users-achievements.service.ts
│  ├─ user-item
│  │  ├─ dto
│  │  │  ├─ create-user-item.dto.ts
│  │  │  └─ update-user-item.dto.ts
│  │  ├─ entities
│  │  │  └─ user-item.entity.ts
│  │  ├─ user-item.controller.ts
│  │  ├─ user-item.module.ts
│  │  ├─ user-item.repository.ts
│  │  └─ user-item.service.ts
│  └─ users
│     ├─ dto
│     │  ├─ create-user.dto.ts
│     │  └─ update-user.dto.ts
│     ├─ entities
│     │  └─ user.entity.ts
│     ├─ users.controller.spec.ts
│     ├─ users.controller.ts
│     ├─ users.module.ts
│     ├─ users.repository.ts
│     ├─ users.service.spec.ts
│     └─ users.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```

```
MAFI4
├─ .eslintrc.js
├─ .prettierrc
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ achievements
│  │  ├─ achievements.controller.spec.ts
│  │  ├─ achievements.controller.ts
│  │  ├─ achievements.list.json
│  │  ├─ achievements.module.ts
│  │  ├─ achievements.repository.ts
│  │  ├─ achievements.service.spec.ts
│  │  ├─ achievements.service.ts
│  │  ├─ dto
│  │  │  ├─ create-achievement.dto.ts
│  │  │  └─ update-achievement.dto.ts
│  │  └─ entities
│  │     └─ achievement.entity.ts
│  ├─ admin
│  │  ├─ admin.controller.ts
│  │  ├─ admin.module.ts
│  │  ├─ admin.repository.ts
│  │  ├─ admin.service.ts
│  │  ├─ constants
│  │  │  └─ admin-log-messages.ts
│  │  ├─ dto
│  │  │  ├─ create-announcement.dto.ts
│  │  │  └─ update-user.dto.ts
│  │  └─ entities
│  │     └─ adminLog.entity.ts
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ auth
│  │  ├─ auth.module.ts
│  │  ├─ controllers
│  │  │  └─ auth.controller.ts
│  │  ├─ dto
│  │  │  ├─ login.dto.ts
│  │  │  └─ verify-email.dto.ts
│  │  ├─ guards
│  │  │  ├─ community-ban.guard.ts
│  │  │  ├─ game-ban.guard.ts
│  │  │  ├─ jwt-auth.guard.spec.ts
│  │  │  └─ jwt-auth.guard.ts
│  │  ├─ processors
│  │  │  └─ email.processor.ts
│  │  ├─ repositories
│  │  │  └─ auth.repository.ts
│  │  └─ services
│  │     ├─ auth.service.spec.ts
│  │     └─ auth.service.ts
│  ├─ comments
│  │  ├─ comments.controller.spec.ts
│  │  ├─ comments.controller.ts
│  │  ├─ comments.module.ts
│  │  ├─ comments.repository.ts
│  │  ├─ comments.service.spec.ts
│  │  ├─ comments.service.ts
│  │  ├─ dto
│  │  │  ├─ create-comment.dto.ts
│  │  │  └─ update-comment.dto.ts
│  │  └─ entities
│  │     └─ comment.entity.ts
│  ├─ common
│  │  └─ exceptions
│  │     ├─ achievements.exception.ts
│  │     ├─ auth.exception.ts
│  │     ├─ comments.exception.ts
│  │     ├─ games.exception.ts
│  │     ├─ http-exception.filter.ts
│  │     ├─ item.exception.ts
│  │     ├─ posts.exception.ts
│  │     ├─ rooms.exception.ts
│  │     ├─ statistics.exception.ts
│  │     └─ users.exception.ts
│  ├─ gameAchievements
│  │  ├─ entities
│  │  │  └─ gameAchievements.entity.ts
│  │  ├─ gameAchievements.controller.ts
│  │  ├─ gameAchievements.module.ts
│  │  └─ gameAchievements.service.ts
│  ├─ gameResults
│  │  ├─ entities
│  │  │  └─ gameResults.entity.ts
│  │  ├─ gameResults.controller.ts
│  │  ├─ gameResults.module.ts
│  │  ├─ gameResults.service.ts
│  │  └─ gameResults.subscriber.ts
│  ├─ items
│  │  ├─ dto
│  │  │  ├─ create-item.dto.ts
│  │  │  └─ update-item.dto.ts
│  │  ├─ entities
│  │  │  └─ item.entity.ts
│  │  ├─ items.controller.ts
│  │  ├─ items.module.ts
│  │  ├─ items.repository.ts
│  │  └─ items.service.ts
│  ├─ likes
│  │  ├─ entities
│  │  │  └─ like.entity.ts
│  │  ├─ likes.controller.spec.ts
│  │  ├─ likes.controller.ts
│  │  ├─ likes.module.ts
│  │  ├─ likes.repository.ts
│  │  ├─ likes.service.spec.ts
│  │  └─ likes.service.ts
│  ├─ main.ts
│  ├─ posts
│  │  ├─ dto
│  │  │  ├─ create-post.dto.ts
│  │  │  └─ update-post.dto.ts
│  │  ├─ entities
│  │  │  └─ post.entity.ts
│  │  ├─ posts.controller.spec.ts
│  │  ├─ posts.controller.ts
│  │  ├─ posts.module.ts
│  │  ├─ posts.repository.ts
│  │  ├─ posts.service.spec.ts
│  │  └─ posts.service.ts
│  ├─ public
│  │  ├─ admin
│  │  │  ├─ admin.css
│  │  │  ├─ admin.html
│  │  │  └─ admin.js
│  │  ├─ board
│  │  │  ├─ board.css
│  │  │  ├─ board.html
│  │  │  └─ board.js
│  │  ├─ components
│  │  │  ├─ footer
│  │  │  │  ├─ footer.html
│  │  │  │  └─ footer.js
│  │  │  └─ header
│  │  │     ├─ header.html
│  │  │     └─ header.js
│  │  ├─ createPost
│  │  │  ├─ createPost.css
│  │  │  ├─ createPost.html
│  │  │  └─ createPost.js
│  │  ├─ game.html
│  │  ├─ guide
│  │  │  ├─ guide.css
│  │  │  ├─ guide.html
│  │  │  └─ guide.js
│  │  ├─ home
│  │  │  ├─ home.css
│  │  │  ├─ home.html
│  │  │  └─ home.js
│  │  ├─ imageFile
│  │  │  ├─ citizen.png
│  │  │  ├─ commingSoon.png
│  │  │  ├─ condition.png
│  │  │  ├─ doctor.png
│  │  │  ├─ game.png
│  │  │  ├─ goal.png
│  │  │  ├─ mafia.png
│  │  │  ├─ MafiaBackground.png
│  │  │  ├─ NeoBackground.png
│  │  │  ├─ Nickname.png
│  │  │  ├─ placeholder.svg
│  │  │  ├─ police.png
│  │  │  ├─ Profile.png
│  │  │  ├─ Record.png
│  │  │  ├─ SparkleBackground.png
│  │  │  └─ whistle.png
│  │  ├─ js
│  │  │  └─ config.js
│  │  ├─ login
│  │  │  ├─ login.css
│  │  │  ├─ login.html
│  │  │  └─ login.js
│  │  ├─ myPage
│  │  │  ├─ myPage.css
│  │  │  ├─ myPage.html
│  │  │  └─ myPage.js
│  │  ├─ post
│  │  │  ├─ post.css
│  │  │  ├─ post.html
│  │  │  └─ post.js
│  │  ├─ ranking
│  │  │  ├─ ranking.css
│  │  │  ├─ ranking.html
│  │  │  └─ ranking.js
│  │  ├─ room
│  │  │  ├─ js
│  │  │  │  └─ config.js
│  │  │  ├─ room.css
│  │  │  ├─ room.html
│  │  │  └─ room.js
│  │  ├─ room.html
│  │  ├─ roomList
│  │  │  ├─ roomList.css
│  │  │  ├─ roomList.html
│  │  │  └─ roomList.js
│  │  ├─ scripts
│  │  │  ├─ api.js
│  │  │  └─ common.js
│  │  ├─ shop
│  │  │  ├─ shop.css
│  │  │  ├─ shop.html
│  │  │  └─ shop.js
│  │  ├─ signup
│  │  │  ├─ signup.css
│  │  │  ├─ signup.html
│  │  │  └─ signup.js
│  │  ├─ styles
│  │  │  └─ common.css
│  │  ├─ test
│  │  │  ├─ js
│  │  │  │  └─ config.js
│  │  │  └─ testRoom.html
│  │  └─ testasdd.html
│  ├─ redis
│  │  ├─ redis.module.ts
│  │  ├─ redis.service.spec.ts
│  │  └─ redis.service.ts
│  ├─ rooms
│  │  ├─ dto
│  │  │  ├─ create-room.dto.ts
│  │  │  └─ update-room.dto.ts
│  │  ├─ entities
│  │  │  └─ room.entity.ts
│  │  ├─ rooms.controller.spec.ts
│  │  ├─ rooms.controller.ts
│  │  ├─ rooms.module.ts
│  │  ├─ rooms.repository.ts
│  │  ├─ rooms.service.spec.ts
│  │  └─ rooms.service.ts
│  ├─ s3uploader
│  │  ├─ s3uploader.module.ts
│  │  ├─ s3uploader.service.spec.ts
│  │  └─ s3uploader.service.ts
│  ├─ schedule
│  │  ├─ ban-expiration.service.ts
│  │  └─ schedule.module.ts
│  ├─ statistics
│  │  ├─ dto
│  │  │  ├─ create-statistic.dto.ts
│  │  │  └─ update-statistic.dto.ts
│  │  ├─ entities
│  │  │  └─ statistic.entity.ts
│  │  ├─ statistics.controller.spec.ts
│  │  ├─ statistics.controller.ts
│  │  ├─ statistics.module.ts
│  │  ├─ statistics.service.spec.ts
│  │  └─ statistics.service.ts
│  ├─ user-achievements
│  │  ├─ dto
│  │  │  ├─ create-users-achievement.dto.ts
│  │  │  └─ update-users-achievement.dto.ts
│  │  ├─ entities
│  │  │  └─ users-achievement.entity.ts
│  │  ├─ users-achievements.controller.spec.ts
│  │  ├─ users-achievements.controller.ts
│  │  ├─ users-achievements.module.ts
│  │  ├─ users-achievements.repository.ts
│  │  ├─ users-achievements.service.spec.ts
│  │  └─ users-achievements.service.ts
│  ├─ user-item
│  │  ├─ dto
│  │  │  ├─ create-user-item.dto.ts
│  │  │  └─ update-user-item.dto.ts
│  │  ├─ entities
│  │  │  └─ user-item.entity.ts
│  │  ├─ user-item.controller.ts
│  │  ├─ user-item.module.ts
│  │  ├─ user-item.repository.ts
│  │  └─ user-item.service.ts
│  └─ users
│     ├─ dto
│     │  ├─ create-user.dto.ts
│     │  └─ update-user.dto.ts
│     ├─ entities
│     │  └─ user.entity.ts
│     ├─ users.controller.spec.ts
│     ├─ users.controller.ts
│     ├─ users.module.ts
│     ├─ users.repository.ts
│     ├─ users.service.spec.ts
│     └─ users.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
