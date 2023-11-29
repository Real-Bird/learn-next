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

## 3. Optimizing Fonts and Images

이 장에서는 `next/font`와 `next/image` 적용과 최적화 방법을 배운다.

### 3-1. Why optimize fonts?

기본 폰트가 아닌 사용자 정의 폰트는 외부에서 로드하는 시간이 필요하다. 그 과정에서 [Cumulative Layout Shift(CLS)](https://web.dev/articles/cls?hl=ko) 점수를 높여 나쁜 사용자 경험을 제공할 수도 있다.

> **Cumulative Layout Shift**란, 구글에서 레이아웃 변경을 측정하는 지표이다. 요소의 이동이나 변경이 많을수록 높은 점수가 측정된다.

`Next`에서는 `next/font`를 이용해 빌드 시점에 폰트를 다운로드하여 자동 최적화한다.

### 3-2. Adding a primary font

`next/font/google`에서 `Inter` 폰트를 가져온다.

```ts
// app/ui/fonts.ts
import { Inter } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
```

폰트를 `layout`의 `body`에 추가하여 기본 폰트로 설정한다.

```tsx
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```

`antialiased`는 `Tailwind` 코드로, 폰트를 부드럽게 처리하는 클래스이다. 멋지라고 넣었다고 한다.

### 3-3. Why optimize images?

이미지 파일을 수동으로 지정할 경우 다양한 부분을 고려하기 어려워 진다.

- 다양한 화면 크기에서 이미지가 반응하는지 확인해야 한다.
- 다양한 디바이스에 맞는 이미지 크기를 지정해야 한다.
- 이미지 로드 시 레이아웃 이동을 방지해야 한다.
- 사용자 뷰포트 외부에 있는 이미지를 지연 로드해야 한다.

이런 포인트를 `next/image` 모듈의 `<Image>` 컴포넌트를 이용해 자동으로 최적화한다.

- 이미지가 로드될 때 레이아웃이 자동으로 바뀌는 것을 방지
- 뷰포트가 작은 기기에 큰 이미지가 전송되지 않도록 이미지 크기 조정
- 기본적으로 이미지 지연 로딩(이미지가 뷰포트에 들어올 때 로드됨)
- 브라우저에서 지원하는 경우 WebP 및 AVIF와 같은 최신 형식의 이미지 제공

```tsx
import Image from 'next/image';

export default function Page() {
  return (
    // ...
    <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
      <Image
        src="/hero-desktop.png"
        width={1000}
        height={760}
        className="hidden md:block"
        alt="Screenshots of the dashboard project showing desktop version"
      />
    </div>
    //...
  );
}
```

이미지가 로드되는 동안 레이아웃이 변경되지 않도록 `width`와 `height`를 지정하고, 원본과 같은 비율로 설정하는 것이 좋다.

`width`와 `height`를 비율에 맞춰 자동으로 설정하려면 이미지를 import해 이미지 컴포넌트에 제공한다.

```tsx
import Image from 'next/image';
import heroMobile from '../public/hero-mobile.png';

export default function Page() {
  return (
    // ...
    <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
      <Image
        src={heroMobile}
        className="block md:hidden"
        alt="Screenshots of the dashboard project showing mobile version"
      />
    </div>
    //...
  );
}
```

이미지나 폰트 최적화에 관한 자세한 정보는 [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)과 [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)를 참고한다.

## 4. Creating Layouts and Pages

새로운 페이지를 만드는 장이다. 파일 시스템 라우트를 사용하여 파일과 폴더의 역할과 `layout`을 이해하는 것이 주 목표이다.

### 4-1. Nested routing

파일 시스템 라우팅에서 폴더는 `URL`의 path에 따라 구분하는 역할을 한다. 최상위인 `app`은 `root(/)`를 의미하고, 하위 폴더들은 `pathname`을 의미한다. 즉, `/`로 구분되는 영역이다. 예를 들어, `localhost / dashboard / invoices` 경로라면, `🗂app/🗂dashboard/🗂invoices`이다.

각각의 폴더는 `layout.tsx`과 `page.tsx` 파일을 갖는다. `page.tsx`는 라우트에 해당하는 view 컴포넌트를 내보내는 역할을 한다. `🗂app/🗂dashboard/page.tsx`를 만들고 `localhost:3000/dashboard`에 접근하면 해당 컴포넌트가 렌더링된 화면을 볼 수 있다.

![챕터4 dashboard page](/assets/4-chap-4-dashboard-page-css.png '챕터4 dashboard page')

`🗂app/🗂dashboard/sidebar.tsx`라는 파일을 만들었을 때, `/dashboard/sidebar`로 접근할 수 있는 게 아닌가 하는 의문이 들었다. 하지만 `Next.js`에서는 `page`와 ui 컴포넌트, 테스트 파일 등이 공존 가능한 [colocation](https://nextjs.org/docs/app/building-your-application/routing#colocation)을 허용한다. 오직 `page.tsx` 파일이 있어야 라우트로 접근할 수 있다.

### 4-2. layout

`layout.tsx` 파일은 여러 페이지에서 같은 레이아웃을 공유하는 역할이다. `layout`의 이점 중 하나는 다른 페이지 컴포넌트를 업데이트할 때 `layout`은 리렌더링을 하지 않는다는 것이다. [partial rendering](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#3-partial-rendering)이라고 부른다고 한다.

나의 실행 환경에서는 페이지 이동마다 `layout`도 리렌더링되던데...게다가 `SPA`가 아닌 `MPA`처럼 동작한다. 뭔가 조치가 더 필요한 건가? 약간의 의문 추가.

`🗂app/layout.tsx`는 **Root layout**으로, 모든 페이지가 공유하는 필수 레이아웃이다. 여기에서 `<html>`과 `<body>` 태그를 수정하거나 `metadata`를 추가할 수도 있다.

## 5. Navigating Between Pages

페이지 간의 이동을 다루는 장이다. 위에서 품었던 의문이 곧바로 해결되었다.

### 5.1 Link Component

`dashboard`의 하위 페이지 간 이동은 `<a>` 태그를 이용하고 있었다. 이동마다 전체 페이지가 새로고침되는 원인이었다. `next/link`의 `<Link>` 컴포넌트로 대체하면 새로고침 없이 이동한다.

```tsx
import Link from 'next/link';

export default function NavLinks() {
  return (
    <>
      {/* ... */}
      <Link key={link.name} href={link.href}>
        <LinkIcon className="w-6" />
        <p className="hidden md:block">{link.name}</p>
      </Link>
      {/* ... */}
    </>
  );
}
```

### 5.2 Automatic code-splitting and prefetching

`Next.js`는 자동으로 코드를 분할한다. 분할된 코드는 고립되었다는 의미이며, 이 페이지에서 에러가 발생해도 다른 페이지는 정상 동작한다. 또한, `<Link>` 컴포넌트가 동작할 때마다 백그라운드에서 라우트의 코드를 `prefetch`한다. 백그라운드에서 미리 로드된 목적지 페이지는 사용자가 클릭했을 때 거의 즉시 전환된다.

### 5.3 Pattern: Showing active links

일반적인 UI는 현재 페이지와 같은 링크를 활성화 상태로 보여준다. 그러기 위해서 현재 `pathname`을 알아야 한다. `next/navigation`의 `usePathname`을 사용해 `pathname`에 접근한다.

```tsx
'use client';

import { usePathname } from 'next/navigation';
```

훅은 `Client Component`에서 사용하므로 최상단에 `use client`를 명시해야 한다.
