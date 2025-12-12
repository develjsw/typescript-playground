# ECMAScript Modules vs CommonJS Modules

## 1. 역사적 배경

### JavaScript에는 원래 모듈 시스템이 없었음

초기 JavaScript는 **브라우저에서 간단한 스크립트를 실행하기 위한 언어**였고, 파일을 나눠서 관리하는 모듈 개념이 없었음

### 모듈 시스템의 등장

#### 1. CommonJS (2009년) - Node.js의 선택
- Node.js가 서버 환경을 위해 독자적으로 도입
- `require`/`module.exports` 문법

#### 2. ECMAScript Modules (2015년, ES6) - 표준의 탄생
- JavaScript 공식 표준으로 추가
- `import`/`export` 문법

---

## 2. 핵심 개념

### ECMAScript (ES)
- **JavaScript 언어의 표준 명세**
- ECMA International이 제정
- 버전: ES2015(ES6), ES2021, ES2022, ES2023 등
- 내용: 언어 문법, 내장 객체, API 등을 정의

### ECMAScript Modules (ESM)
- **ECMAScript 표준에 포함된 모듈 시스템**
- ES2015(ES6)부터 공식 표준으로 추가
- `import`/`export` 문법 사용

### CommonJS (CJS)
- **Node.js가 만든 별도의 모듈 시스템**
- ECMAScript 표준이 아님 (Node.js 전용)
- `require`/`module.exports` 문법 사용

### TypeScript의 역할 - 번역기
```json
{
  "compilerOptions": {
    //"module": "commonjs" // CJS 방식
    //"module": "ES2022"   // ESM 방식
  }
}
```
- TypeScript는 **이미 존재하는 두 방식 중 하나를 선택**하는 것
- `.ts` → `.js` 변환 시 **어떤 모듈 방식으로 변환할지 결정**
- 실제로 컴파일 된 결과물(.js) 파일을 보게되면 CJS 방식은 `require`/`module.exports` 방식으로 변환되어 있고, ESM 방식은 `import`/`export` 방식으로 변환되어 있음
- TypeScript로 코드를 작성할 때는 **`import`/`export` 방식 사용 권장** (타입 시스템과 완벽히 호환)

#### 핵심 정리

| 항목 | 설명 |
|------|------|
| **JavaScript 세계** | CJS와 ESM 두 가지 모듈 방식 존재 |
| **순수 JS 파일** | 둘 중 하나 방식 사용 (CJS → require, ESM → import) |
| **TypeScript** | .ts → .js 변환 시 "어떤 방식으로?" 선택 |
| **module 옵션** | 그 선택지를 제공 |

---

## 3. 모듈 시스템 비교

### CommonJS (CJS) - 구식이지만 안정적

```javascript
// 문법
const { foo } = require('./module');
module.exports = { bar: 123 };

// 특징
- Node.js 전용 (비표준)
- NestJS, Express 등 대부분의 Node.js 프레임워크 기본값
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "module": "commonjs"
  }
}
```

### ESM (ES Modules) - 최신 표준

```javascript
// 문법
import { foo } from './module.js';
export const bar = 123;

// 특징
- ECMAScript 공식 표준
- 브라우저 + Node.js 모두 지원
- Tree-shaking 가능 (번들 크기 최적화)
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "module": "ES2022"  // 또는 "ESNext"
  }
}
```

## 4. TypeScript의 2단계 변환

### 핵심 개념
TypeScript는 **코드 작성 문법**과 **컴파일 결과**가 다름

### 예시: `"module": "commonjs"` 설정 시

**작성 코드 (.ts)**
```typescript
import { Injectable } from '@nestjs/common';

export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

**컴파일 결과 (.js)**
```javascript
"use strict";
const common_1 = require("@nestjs/common");  // ← import가 require로 변환됨

class AppService {
  getHello() {
    return 'Hello World!';
  }
}
exports.AppService = AppService;  // ← export가 module.exports로 변환됨
```

### 정리

| 단계 | 문법 | 실제 방식 |
|------|------|----------|
| **작성 시** (.ts) | `import`/`export` | TypeScript 문법 |
| **실행 시** (.js) | `require`/`module.exports` | CommonJS |

## 5. 선택 가이드

### CommonJS를 사용해야 하는 경우

- NestJS, Express 등 기존 프레임워크 사용
- 기존 Node.js 생태계와 호환성 필요
- 안정성과 검증된 방식 선호

### ESM을 사용해야 하는 경우

- 순수 ESM 전용 라이브러리 사용 (node-fetch v3, chalk v5 등)
- 브라우저용 번들링 (Vite, Webpack)
- **Top-level await 사용하고 싶을 때** (ESM에서만 가능)
  ```typescript
  // 파일 최상위에서 await 사용
  const data = await fetch('...');  // ✅ ESM만 가능, CJS는 ❌
  ```
- Tree-shaking으로 번들 크기 최적화

### Playground 환경 (이 프로젝트)

```json
// 옵션 1: 안정적인 기본값 (권장)
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs"
  }
}

// 옵션 2: 최신 표준
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "NodeNext"
  }
}
```

## 6. 자주 하는 혼란: TypeScript의 import/export는 무엇인가?

### 핵심 질문
**[ Q1 ] .ts 파일에서 import/export를 쓰면 ESM인가?**

**[ A1 ] NO! 컴파일 결과를 봐야함**

TypeScript는 **작성 문법**과 **실행 결과**가 다름 (구체적 예시는 **섹션 4** 참고)

### 핵심 정리

| 질문 | 답변 |
|------|------|
| .ts에서 import 쓰면 ESM? | **아니요** - tsconfig 설정에 따라 다름 |
| 어떻게 확인? | **컴파일된 .js 파일**을 확인 |
| CJS인지 ESM인지 결정? | `tsconfig.json`의 `"module"` 옵션 |

```typescript
// TypeScript 코드 (.ts)
import { foo } from './bar';
// ↑ 이것만으로는 ESM인지 CJS인지 알 수 없음!

// tsconfig.json의 "module" 옵션을 봐야 함
"module": "commonjs"  → CJS로 변환
"module": "ES2022"    → ESM 유지
```

**결론**: TypeScript에서 `import`/`export`를 쓰는 것은 ESM 문법이 맞지만, 최종 실행 파일(.js)이 ESM인지는 **tsconfig 설정에 달려있음**

## 7. 참고 자료

- [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
- [CommonJS vs ESM](https://nodejs.org/api/packages.html#determining-module-system)
