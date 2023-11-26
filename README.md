# [Next.js] 공식 문서만 보고 Next.js 익히기

> 공식 문서 보기를 돌같이 하는 버릇을 고치자!

13버전을 익히기도 전에 14버전이 출시된 `Next.js`... 마지막으로 공부했던 버전이 12였기에 새로 공부해야 함을 느꼈다. 다행히 공식 문서가 매우매우 잘 되어 있었다. [Learn Next](https://nextjs.org/learn/dashboard-app) 페이지를 이용하여 14버전을 익혀보려고 한다.

## 0. Introduction

대시보드 앱을 만드는 과정으로, 16장으로 이루어졌다. 모두 익히면 `Next.js`의 필수 기술을 갖추게 된다고 한다. 다음은 배울 내용이다.

- Styling: Next.js에서 애플리케이션의 스타일을 지정하는 다양한 방법.
- Optimizations: 이미지, 링크 및 글꼴을 최적화하는 방법.
- Routing: 파일 시스템 라우팅을 사용하여 중첩 레이아웃과 페이지를 만드는 방법.
- Data Fetching: Vercel에서 데이터베이스를 설정하는 방법과 가져오기 및 스트리밍에 대한 모범 사례.
- Search and Pagination: URL 검색 매개변수를 사용하여 검색 및 페이지 매김을 구현하는 방법.
- Mutating Data: React 서버 액션을 사용하여 데이터를 변경하고 Next.js 캐시를 재검증하는 방법.
- Error Handling: 일반 오류와 404 찾을 수 없음 오류를 처리하는 방법.
- Form Validation and Accessibility: 서버 측 양식 유효성 검사를 수행하는 방법과 접근성을 개선하기 위한 팁.
- Authentication: NextAuth.js 및 미들웨어를 사용하여 애플리케이션에 인증을 추가하는 방법.
- Metadata: 메타데이터를 추가하고 소셜 공유를 위해 애플리케이션을 준비하는 방법.

**React와 자바스크립트에 대한 기본적인 이해가 있다고 가정**하며 `Node`는 **18.17.0** 이상을 기준으로 한다.

## 1. Getting Started

`Next`의 설치는 `npx create-next-app@latest`로 하는데, 여기서는 제공하는 예제를 포함하여 설치한다.

```
npx create-next-app@latest nextjs-dashboard --use-npm --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example"
```

예제의 `app` 디렉토리의 구성은 다음과 같다.

```shell
├─public
│
├─app
│   │  layout.tsx # 전체 레이아웃 (필수)
│   │  page.tsx # index 페이지 (필수)
│   │
│   ├─lib
│   │   data.ts # 데이터 패치
│   │   definitions.ts # 타입 정의
│   │   placeholder-data.js # 미리 생성한 mockup 데이터
│   │   utils.ts # 화폐 단위, 날짜 형식, 컬럼 설정, 페지네이션 생성 등
│   │
│   └─ui # UI를 구성하는 컴포넌트
│       │  acme-logo.tsx
│       │  button.tsx
│       │  global.css
│       │  login-form.tsx
│       │  search.tsx
│       │  skeletons.tsx
│       │
│       ├─customers
│       │      table.tsx
│       │
│       ├─dashboard
│       │      cards.tsx
│       │      latest-invoices.tsx
│       │      nav-links.tsx
│       │      revenue-chart.tsx
│       │      sidenav.tsx
│       │
│       └─invoices
│             breadcrumbs.tsx
│             buttons.tsx
│             create-form.tsx
│             edit-form.tsx
│             pagination.tsx
│             status.tsx
│             table.tsx
└─scripts
      seed.js # 데이터베이스를 채울 시딩
```

컴포넌트 이름과 내부의 이름이 깔끔해서 어렵게 고민할 필요가 없었다. 이게 네이밍 센스란 건가? 벌써 하나 배웠다.

`npm run dev`로 실행한 첫 화면이다.

![챕터1 기본 화면](./assets/1-chap-1-default.png '챕터1 기본 화면')

## 2. CSS Styling

2장에서는 아무것도 꾸며지지 않은 홈페이지를 어떻게 스타일링하는가를 알려준다.

### 2-1. Global Styling

앱 전체에 공용으로 적용하는 스타일은 최상위 루트에서 호출하여 사용한다. `Next`에서는 `app` 디렉토리의 바로 아래에 있는 `layout.tsx`이 **Root Layout**이다.

`RootLayout`에서 `global.css`를 호출한다.

```diff
// layout.tsx
+ import '@/app/ui/global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`Next`는 `Tailwind CSS`를 지원하기 때문에 `global.css`에는 `Tailwind CSS`의 기본 지시문을 포함하고 있다.

```css
/* global.css*/
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`global.css`를 적용한 화면은 처음과 달리 보기 편안하다.

![챕터2 global.css](./assets/2-chap-2-global-css.png '챕터2 global.css')

### 2-2. Tailwind CSS

앞서 언급한 [Tailwind CSS](https://tailwindcss.com/)는 **className**으로 빠르고 쉽게 스타일을 적용하는 *CSS Framework*이다. `Next`에서 기본적으로 지원하며, `create-next-app`으로 세팅 시 사용 여부를 묻는다. `yes`를 선택하면 필요한 자원을 알아서 설치해준다.

```tsx
<Link
  href="/login"
  className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
>
  <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
</Link>
```

위 이미지에서 보이는 `Log in` 버튼의 코드이다. 개인적으로 제일 선호하는 스타일링 시스템이기도 하다. `config` 파일에서 **커스텀 클래스**를 만들 수도 있고, 수치가 적용되는 클래스명에 직접 설정할 수도 있다.

```js
// tailwind.config.js

import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      // custom color를 세팅한다
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
      },
    },
  },
};
export default config;

// temp.jsx
<p className="p-[10px]">패딩 수치 직접 설정</p>
```

### 2-3. CSS Modules

`CSS Modules`는 CSS의 범위를 컴포넌트 범위로 축소해 더 쉽게 스타일을 관리하고 충돌을 방지하는 이점을 제공한다. `*.module.css`로 생성한 후 `import styles from "./temp.module.css"`로 호출했다. `className={styles.wrapper}`으로 적용했다.

```tsx
import styles from './temp.module.css';

function Temp() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Hello CSS Modules!</h1>
    </div>
  );
}
```

선호하는 방식은 아니다. CSS 작성도 귀찮고, 파일도 늘어나고, 보기도 불편하기 때문이다. 아직 스타일 변화가 잦아 유지보수가 빡세게 필요한 무언가를 만들어 본 경험이 없어서 그럴 수도. 아무튼 지금은 패스.

### 2-4. clsx

[clsx](https://www.npmjs.com/package/clsx)는 조건부로 클래스명을 입력할 때 사용할 수 있는 라이브러리이다.

```tsx
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
)}
```

value가 `truthy`일 경우 key로 받은 클래스명을 적용한다.

### 2-5. Other styling solutions

이 외에 `CSS-in-JS` 방식의 `styled-components`, `styled-jsx`, `emotion` 등이나 `SASS`가 있다.
