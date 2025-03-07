<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

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