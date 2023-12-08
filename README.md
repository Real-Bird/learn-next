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

## 6. Fetching Data

`Next.js`는 라우트를 이용해 API 엔드포인트를 제공하여 서드 파티 프로그램이나 서버 없이도 데이터를 패칭할 수 있다. 스킵했지만, 앞선 장에서 `Vercel`이 제공하는 서비스를 이용해 `postgres` DB를 생성했는데, `prisma`같은 `ORM`을 통해 관계형 DB를 호출할 수 있다.

> `ORM`이란?
> Object Relational Mapping의 약자로, 구현한 객체와 관계형 DB의 불일치를 자동으로 매핑한 SQL문을 생성해 호환가능하게 해주는 기술이다.

데이터 패치를 하기에 앞서, `Next.js`는 기본적으로 `React Server Component`를 사용하는데, 몇 가지 이점을 알려준다.

- 프로미스를 지원하여 `useState`나 `useEffect`, 데이터 패치 라이브러리, 추가 API 계층 없이 `async/await`을 사용하여 데이터를 가져올 수 있다.
- 서버에서 실행되기 때문에 비용이 많이드는 로직은 서버에서 실행하고, 결과만 클라이언트로 전송할 수 있다.

### 6-1. Fetching data for the dashboard overview page

제공해준 dashboard 페이지의 코드를 보자.

```tsx
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
        {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        {/* <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}  /> */}
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
    </main>
  );
}
```

페이지 컴포넌트는 `async function`으로 되어 있다. 이는 `await`을 곧장 사용할 수 있음을 의미한다. 주석 처리된 컴포넌트들은 모두 데이터를 받는다. 데이터를 패치해 보자.

```tsx
// ...
import { fetchRevenue } from '@/app/lib/data';

export default async function Page() {
  const revenue = await fetchRevenue();
  // ...
}
```

컴포넌트에서 `await`을 사용하는 게 매우 신기하다. ts 에러가 발생하지만 런타임에는 아무 지장없이 잘 실행된다.

![챕터6 dashboard page](/assets/6-chap-6-dashboard-page-css.png '챕터6 dashboard page')

여기서 두 가지 주의해야 할 사항이 있다고 한다.

1. 데이터 요청이 의도치 않게 서로를 차단해 **요청 폭포수**를 만들고 있다.
2. 다른 하나는 `Next.js`가 성능 개선을 위해 기본적으로 prerender하여 정적 렌더링을 하기 때문에 데이터 변화가 있어도 동적으로 반영되지 않는다는 점이다.

이 장에서는 1번을 살피고, 다음 장에서 2번을 살핀다.

### 6-2. What are request waterfalls?

`waterfall`은 **이전 요청의 완료 여부에 따라 달라지는 일련의 네트워크 요청을 의미**한다. 여기서는 앞선 데이터 패칭이 완료 되어야 다음 데이터 패칭이 이루어지는 것이다.

![](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Fsequential-parallel-data-fetching.png&w=1920&q=75&dpl=dpl_GGugRB3M3WE9C8xcmftCsUL7LkbG)

이전 패칭의 결과가 후행 패치에 영향을 미칠 경우에는 나쁘지 않은 패턴이다. 하지만 앞선 주의사항 대로 성능에 영향을 미칠 수 있다.

### 6-3. Parallel data fetching

여러 데이터 요청이 동시에 발생하는 경우 `JS`가 제공하는 [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)이나 [Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)를 사용하여 병행 처리할해 성능을 향상시킬 수 있다. 또한, 자바스크립트가 제공하는 함수를 사용하기 때문에 다른 프레임워크에서도 재사용 가능하다.

## 7. Static and Dynamic Rendering

이전 챕터에서 문제삼은 주의사항 2번을 해결하는 챕터이다. 정적 렌더링은 빌드나 재검증(revalidate) 중 데이터를 가져오고 렌더링하는 과정이다. 이 결과물을 CDN에 배포해 캐싱한다.

![](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Fstatic-site-generation.png&w=1920&q=75&dpl=dpl_GGugRB3M3WE9C8xcmftCsUL7LkbG)

이러한 방식은 다음과 같은 이점이 있다.

- 더 빠른 웹사이트 : 미리 렌더링된 콘텐츠를 캐싱하여 배포하므로 전 세계 사용자가 웹사이트에 더 빠르고 안정적으로 액세스할 수 있다.
- 서버 부하 감소 : 콘텐츠가 캐시되므로 서버에서 각 사용자 요청에 대해 콘텐츠를 동적으로 생성할 필요가 없다.
- SEO : 미리 렌더링된 콘텐츠는 페이지가 로드될 때 이미 콘텐츠를 사용할 수 있으므로 검색 엔진 크롤러가 색인을 생성하기가 더 쉽다. 이는 검색 엔진 순위 향상으로 이어질 수 있다.

따라서 정적 렌더링은 데이터 변화가 없거나 적은 블로그나 제품 페이지 등에 적합하다. 그러나 `dashboard`와 같이 데이터에 변화가 잦은 페이지에는 적합하지 않을 수 있다.

이와 반대되는 개념이 **동적 렌더링(Dynamic Rendering)**이다.

### 7-1. What is Dynamic Rendering?

동적 렌더링은 사용자가 페이지에 방문했을 때 렌더링하여 콘텐츠를 생성한다. 이점은 다음과 같다.

- 실시간 데이터 : 애플리케이션에서 실시간 또는 자주 업데이트되는 데이터를 표시할 수 있다. 데이터가 자주 변경되는 애플리케이션에 이상적이다.
- 사용자별 콘텐츠 : 대시보드나 사용자 프로필과 같은 개인화된 콘텐츠를 제공하고 사용자 상호 작용에 따라 데이터를 업데이트하는 것이 더 쉽다.
- 요청 시간 정보 : 동적 렌더링을 사용하면 쿠키나 URL 검색 매개변수와 같이 요청 시점에만 알 수 있는 정보에 액세스할 수 있다.

### 7-2. Using Dynamic Rendering

데이터 패치 함수 초입에 `unstable_noStore`를 불러와 적용한다.

```ts
// ...
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  noStore();
  // ...fetch logic
}

export async function fetchLatestInvoices() {
  noStore();
  // ...fetch logic
}

export async function fetchCardData() {
  noStore();
  // ...fetch logic
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  // ...fetch logic
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  // ...fetch logic
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  // ...fetch logic
}

export async function fetchInvoiceById(query: string) {
  noStore();
  // ...fetch logic
}
```

`unstable_noStore`는 실험적인 API이므로 추후 변경될 수도 있다고 한다. 안정적인 API는 [Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)의 `export const dynamic = "force-dynamic"`를 사용한다.

```tsx
export const dynamic = 'force-dynamic';

export default function MyComponent() {}
```

동적 렌더링이 가져오는 문제는 **느리게 도착하는 데이터에 의해 앱의 성능이 결정된다**는 점이다. 이를 해결하는 과정을 다음 챕터에서 안내한다.

## 8. Streaming

느린 데이터 가져오기 환경을 개선하는 방법을 알려주는 장이다.

### 8-1. What is streaming?

스트리밍(streaming)은 **데이터를 '작은 조각(chunk)'로 분할하여 서버에서 준비되는 대로 클라이언트 측에 보내는 전송 방식**을 말한다. 느린 데이터 요청으로 인한 앱 전체가 차단되는 것을 방지하고, 전체 데이터 패칭이 완료되지 않아도 일부 페이지를 조작할 수 있도록 한다.

![](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Fserver-rendering-with-streaming-chart.png&w=1920&q=75&dpl=dpl_GGugRB3M3WE9C8xcmftCsUL7LkbG)

리액트 컴포넌트는 하나의 청크로 간주될 수 있기 때문에 스트리밍을 적용하기에 좋다. 페이지에서는 `loading.tsx`을, 컴포넌트에서는 `<Suspense>`를 사용하여 스트리밍을 적용할 수 있다.

### 8-2. Using loading.tsx

페이지 전체 로딩을 적용하는 방법은 매우 간단하다. 라우트 경로에 `loading.tsx`를 추가한다.

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

의도적으로 데이터 패치 중 하나를 느리게 만들면 로딩 화면이 보인다.

![챕터 8 스트리밍 로딩](/assets/8-chap-8-loading.gif '챕터 8 스트리밍 로딩')

제공한 스켈레톤으로 로딩을 교체했는데, 작은 버그가 하나 있다. `dashboard` 바로 아래에 `loading`을 생성한 탓에 하위 라우트인 `dashboard/invoices`와 `dashboard/customers`에서도 로딩이 적용된다. `dashboard`에만 적용하려면 하위에 `(overview)` 폴더를 추가하고, `page.tsx`와 `loading.tsx`를 옮긴다.

```
🗂app/
  └─🗂dashboard/
    ├─layout.tsx
    ├─🗂(overview)
    │ ├─loading.tsx
    │ └─page.tsx
    ├─🗂invoices/
    └─🗂customers/
```

이렇게 경로 나누는 방식이 [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)이며, 괄호로 작성한 폴더를 경로에 포함시키지 않으면서 나눌 수 있다. 예를 들어, 여기서 사용한 `loading.tsx`는 `(overview)` 하위에 있는 `page.tsx`에만 적용된다.

### 8-3. Streaming a component

위의 방식이 전체 페이지 스트리밍에 해당한다면, `<Suspense>`는 데이터가 필요한 특정 컴포넌트만 지연 로딩하는 방식이다. 지연 로딩할 부분을 `<Suspense>`로 감싸고 지연되는 동안 보여줄 `fallback`을 추가한다.

`dashboard`에서 하나의 요청을 의도적으로 지연시켜 전체 페이지에 로딩이 발생했다. 해당 요청을 제거하고, 해당 컴포넌트를 `<Suspense>`로 감싼다.

```diff
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
+ import { fetchLatestInvoices, fetchCardData } from '@/app/lib/data';  // remove fetchRevenue
import { Suspense } from 'react';
import { RevenueChartSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
-  const revenue = await fetchRevenue // delete this line
  // ...

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* ...Cards */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
+        <Suspense fallback={<RevenueChartSkeleton />}>
+          <RevenueChart />
+        </Suspense>
        {/* ...*/}
      </div>
    </main>
  );
}
```

특정 컴포넌트의 요청이 끝날 때까지 전체 로딩하던 화면에서 특정 컴포넌트만 지연 로딩되는 화면으로 바뀌었다.

![챕터 8 스트리밍 서스펜스](/assets/8-chap-8-2-suspense.gif '챕터 8 스트리밍 서스펜스')

### 8-3. Deciding where to place your Suspense boundaries

`Suspense`의 경계는 원하는 사용자 경험, 콘텐츠 우선순위, 컴포넌트가 의존하는 데이터 패칭에 따라 달라진다. 정답은 없지만 일반적으로 데이터가 필요한 컴포넌트를 `Suspense`로 감싸는 게 낫고, 필요한 경우 전체 페이지를 스트리밍한다.

## 9. Adding Search and Pagination

이 장에서는 URL search params을 통한 검색과 pagination을 학습한다.

### 9-1. Why use URL search params?

URL search params를 이용하여 검색을 하면 몇 가지 이점이 있다.

- 북마크 및 공유 가능 : 검색 정보가 URL에 담겨 있기 때문에 사용자는 북마크에 추가해 나중에 참조하거나 공유하기 쉽다.
- 서버 측 렌더링과 초기 로드 : URL 매개변수를 서버에서 직접 조작하여 초기 상태 렌더링을 더 처리하기 쉽다.
- 분석 및 추적: 검색 쿼리와 필터를 URL에 직접 넣으면 추가적인 클라이언트 측 로직 없이도 사용자 행동을 더 쉽게 추적할 수 있다.

URL search params를 이용하는데 `Next.js`의 다음 훅들을 사용한다.

- [`useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params) : 현재 URL의 매개변수에 액세스한다. 예를 들어, `/dashboard/invoices?page=1&query=pending`에 대한 검색 매개 변수는`{page: '1', query: 'pending'}`이다.
- [`usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) : 현재 URL의 경로 이름을 읽는다. 예를 들어, `/dashboard/invoices`의 경우, 사용 경로명은 `/dashboard/invoices`를 반환한다.
- [`useRouter`](https://nextjs.org/docs/app/api-reference/functions/use-router#userouter) : 클라이언트 구성 요소 내에서 경로 간 탐색을 활성화한다.

### 9-2. Adding the search functionality

검색의 첫 번째 순서는 유저의 입력 정보를 얻는 것으로, 클라이언트 컴포넌트에서 이루어진다. 때문에 검색 파일 최상단에 `use client`를 작성하여 클라이언트 컴포넌트임을 명시해야 이벤트 리스너나 훅을 사용할 수 있다.

```tsx
'use client'; // client component

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}
```

- `URLSearchParams`는 Web API 메서드로, 쿼리 파라미터를 `?page=1&query=a`와 같은 문자열로 만들어준다. `set`으로 검색어를 추가하고 `delete`로 비운다.
- `usePathname`으로 가져온 경로에 `useRouter`의 `replace`를 이용하여 쿼리를 추가한다.
- URL로 직접 이동했을 때 쿼리와 `input`을 동기화하려면 `defaultValue`를 설정한다.

### 9-3. Best practice: Debouncing

검색 기능을 최적화하자.

```
Searching... S
Searching... St
Searching... Ste
Searching... Stev
Searching... Steve
Searching... Steven
```

지금은 입력할 때마다 요청을 보내 서버 부하를 유발한다. 입력 이벤트가 끝났을 때만 쿼리를 보내도록 `Debounce`로 이벤트를 제어한다. 여기서는 [`use-debounce`](https://www.npmjs.com/package/use-debounce) 라이브러리를 사용한다.

```tsx
// ...
import { useDebouncedCallback } from 'use-debounce';

// Inside the Search Component...
const handleSearch = useDebouncedCallback((term) => {
  console.log(`Searching... ${term}`);

  const params = new URLSearchParams(searchParams);
  if (term) {
    params.set('query', term);
  } else {
    params.delete('query');
  }
  replace(`${pathname}?${params.toString()}`);
}, 300);
```

`300ms`이내에 아무런 입력값이 없을 때 쿼리 요청을 보낸다. 띄엄띄엄 입력했을 때의 결과다.

```
Searching... ste
Searching... steven
```

### 9-4. Adding pagination

pagination도 비슷한 과정으로 진행한다.

```tsx
'use client';

// ...
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
  // ...
}
```

검색했을 때는 페이지가 `1`이 되도록 `Search`를 수정한다.

```tsx
export default function Search({ placeholder }: { placeholder: string }) {
  // ...
  const handleSearch = useDebouncedCallback((term) => {
    // ...
    params.set('page', '1');
    // ...
  }, 300);
```

## 10. Mutating Data

이전 장에서 CRUD 중 Read를 배웠으니 여기서는 Create, Update, Delete 기능을 추가한다.

### 10-1. What are Server Actions?

`React Server Actions`는 서버에서 실행되는 비동기 함수를 클라이언트나 서버에서 호출하여 사용하고, API 엔드포인트 없이 데이터 변경이 가능하다. `Next.js`가 서버 액션을 권장하는 이유는 **보안** 때문이다. 다양한 공격으로부터 데이터를 안전하게 보호하고 접근을 보장하는 효과적인 보안 솔루션을 제공한다고 한다. POST 요청, 암호화, 엄격한 입력 확인, 오류 메세지 해싱, 호스트 제한과 같은 기술을 통해 보안 목표를 달성하면서 앱의 안정성을 크게 향상시킨다.

`JS`의 내장 API인 [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)를 통해 `action` 속성으로 입력값을 수신할 수 있다.

```tsx
// Server Component
export default function Page() {
  // Action
  async function create(formData: FormData) {
    'use server';

    // Logic to mutate data...
  }

  // Invoke the action using the "action" attribute
  return <form action={create}>...</form>;
}
```

`use server`는 서버 컴포넌트를 가리키는데, 서버 컴포넌트에서 서버 액션을 호출하면 클라이언트의 `JS`가 비활성화되어 있더라도 양식이 작동하는 이점이 있다.

`Next.js`에서의 서버 액션은 [`Next.js Caching`](https://nextjs.org/docs/app/building-your-application/caching)과 긴밀하게 통합되어 있다. 서버 액션을 통해 양식이 제출되면 해당 액션을 사용하여 데이터를 변경할 수 있을 뿐만 아니라 `revalidatePath` 및 `revalidateTag`와 같은 API를 사용하여 관련 캐시의 유효성을 다시 검사할 수도 있다.

### 10-2. Create a Server Action

서버 액션에서 사용하는 함수를 모아둔 파일을 만들고 최상단에 `use server` 지시문을 작성한다. 해당 지시문이 추가된 파일에서 내보낸 함수는 서버 함수로 표시되어 클라이언트나 서버에서 다양하게 사용할 수 있다.

```ts
// app/lib/actions.ts
'use server';

export async function createInvoice(formData: FormData) {}
```

생성한 서버 액션 함수를 form에 전달한다.

```tsx
'use client';

import { customerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';

export default function Form({
  customers,
}: {
  customers: customerField[];
}) {
  return (
    <form action={createInvoice}>
      // ...
  )
}
```

HTML의 `<form>`과 다른 점은 `action`에 URL이 아닌 함수가 들어갔다는 점이다. React에서는 특별한 속성으로 간주되어 액션을 호출할 수 있도록 그 위에 빌드됨을 의미한다. 서버 액션은 뒤에서 POST API 엔드포인트를 자동으로 생성한다.

### 10-3. Validate and Revalidate and Redirect

form을 제출하여 서버 액션이 실행되었을 때 다음과 같은 타입을 기댓값으로 원한다.

```ts
export type Invoice = {
  id: string; // Will be created on the database
  customer_id: string;
  amount: number; // Stored in cents
  status: 'pending' | 'paid';
  date: string;
};
```

하지만 `console.log(typeof rawFormData.amount)`를 해보면 `number`가 아닌 `string`으로 찍히는 것을 볼 수 있다. `input type="number"`를 했다손 쳐도 `FomData`에서는 `string`을 반환한다. 이러한 검증을 수동으로 할 수도 있지만, 여기서는 [`Zod`](https://zod.dev/) 라이브러리를 사용하여 검증한다.

```ts
'use server';

import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // ...
}
```

데이터를 새로 생성하면 기존의 `invoices` 페이지가 stale한지 아닌지 검증해야 한다. 또한, 작성이 완료되었으므로 생성 페이지에서 `invoices` 페이지로 리다이렉트한다.

```ts
'use server';

// ...

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // ...
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

### 10-4. Updating an invoice

`invoice`를 수정하기 위해서 개별 페이지를 만들어야 한다. `id`에 따라 보여지는 `invoice` 페이지가 다르므로 [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)로 개별 페이지를 구현한다. `invoices/[id]/edit/page.tsx` 경로로 파일을 만든다.

![](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Fedit-invoice-route.png&w=1920&q=75&dpl=dpl_8s8Dnm8T2UqYs4Sz3a1AK4vKuj5w)

만약 `id`가 `1`인 `invoice`를 수정한다면 경로는 `dashboard/invoices/1/edit`이 될 것이다.

`id`를 받아 업데이트하는 서버 액션을 만든다.

```tsx
// ...
import { updateInvoice } from '@/app/lib/actions';

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

  return (
    <form action={updateInvoiceWithId}>
      <input type="hidden" name="id" value={invoice.id} />
    </form>
  );
}
```

`bind`를 사용한 이유는 `action`에 id 인수를 담은 `updateInvoice(invoice.id)`를 사용할 수 없기 때문이다. 하지만 이렇게는 사용할 수 있더라. 이후 로직은 `Create`와 유사하다.

### 10-5. Deleting an invoice

Delete는 `id`를 받아 삭제 요청을 보내면 된다.

```tsx
import { deleteInvoice } from '@/app/lib/actions';

// ...

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}
```

## 11. Handling Errors

예기치 못한 에러 발생은 사용자에게 안 좋은 경험을 심어준다. 거기에 에러 스택까지 보여준다면? 사용자에게도, 개발자에게도 최악의 페이지가 될 것이다. `Next.js`에서는 파일로 에러를 핸들링하는 기능을 제공한다. 에러 처리가 필요한 폴더 하위에 [`error.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/error)를 추가한다.

```tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
```

`error`는 `JS`의 에러 객체이고, `reset`은 에러 경계로 되돌리는 함수이다. `reset`을 실행하면 에러가 발생한 라우트의 리렌더링을 시도하도록 유도할 수 있다.

`error.tsx`는 전체 에러를 핸들링하는 역할이라면, `not-found.tsx`는 404 error를 핸들링한다. `not-found`가 필요한 라우트 하위에 파일을 생성한다.

![](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Fnot-found-file.png&w=1920&q=75&dpl=dpl_AMSyfMpgLTgL1H5bxt6C3RVhhjQ4)

```tsx
// app/dashboard/invoices/[id]/edit/not-found.tsx
import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested invoice.</p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}
```

페이지에서는 `notfound()` 함수를 호출한다.

```diff
// app/dashboard/invoices/[id]/edit/page.tsx

import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { updateInvoice } from '@/app/lib/actions';
+ import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

+  if (!invoice) {
+    notFound();
+  }

  // ...
}
```

## 12. Improving Accessibility

접근성은 **장애인을 포함한 모든 사람이 사용할 수 있는 애플리케이션을 설계하고 구현하는 것**을 말한다. 참고 [web.dev - learn accessibility](https://web.dev/learn/accessibility/)

### 12-1. Using the ESLint accessibility plugin in Next.js

`Next.js`는 기본적으로 [`eslint-plugin-jsx-a11y`](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)를 포함하고 있다. 이 플러그인은 `aria-*`, `alt`, `role` 등 접근성에 대한 이슈를 체크해준다. `"lint": "next lint"` 스크립트를 추가하여 검사할 수 있다. 예를 들어, 이미지의 `alt`가 없다면 검사했을 때의 경고 문구이다.

```
./app/ui/invoices/table.tsx
29:23  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text
```

### 12-2. Improving form accessibility

사용하고 있는 `form`에서는 접근성 향상을 위해 3가지를 이미 실천하고 있다.

1. Semantic HTML : `div` 대신 `input`, `option` 등의 시멘틱 태그를 사용하여 사용자에게 양식을 탐색하고 이해하기 쉽게 만든다.
2. Labelling : `label`과 `htmlFor`를 사용하면 사용자가 label를 클릭하여 해당 입력 필드에 집중할 수 있다.
3. Focus Outline : 탭을 눌러 필드에 초점이 맞춰졌을 때 윤곽선이 표시되도록하여 키보드 및 화면 리더 사용자가 양식의 현재 위치를 이해하는 데 도움이 된다.

일반적인 접근성 설정을 했지만, form validation을 충족하지는 못한다. 현재 비어 있는 양식을 제출하면 에러가 발생하기 때문이다.

### 12-3. Form validation

클라이언트 측에서 간단한 대응은 `input`에 `required` 속성을 추가하는 것이다.

```diff
<input
  id="amount"
  name="amount"
  type="number"
  placeholder="Enter USD amount"
  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
+ required
/>
```

일반적으로는 괜찮지만, dev tool에서 해당 요소의 `required` 속성을 지우면 검증이 먹히지 않는다. `Next.js`에서는 서버 측 대안을 제시한다. 서버 측 검증에서는

- 데이터를 데이터베이스로 보내기 전에 데이터가 예상되는 형식인지 확인한다.
- 악의적인 사용자가 클라이언트 측 유효성 검사를 우회하는 위험을 줄일 수 있다.
- 유효한 데이터로 간주되는 데이터에 대한 신뢰할 수 있는 단일 소스를 확보한다.

`useFormState`를 사용하여 서버 측 검증을 진행한다. 훅을 사용하므로 `use client`를 명시해 클라이언트 컴포넌트로 전환한다.

```tsx
'use client';

// ...
import { useFormState } from 'react-dom';
```

[`useFormState`](https://react.dev/reference/react-dom/hooks/useFormState)는 [useReducer](https://react.dev/reference/react/useReducer)와 유사한 실험적 기능이다. `action`과 `initialState`를 인자로 받고, `state`와 `dispatch`를 반환한다. `<form action={}>`에 `dispatch`를 주입한다.

```tsx
// ...
import { useFormState } from 'react-dom';

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createInvoice, initialState);

  return <form action={dispatch}>...</form>;
}
```

`zod`를 이용해 검증할 데이터 스키마를 추가한다.

```ts
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
```

`useFormState`를 위해 `createInvoice`에 `prevState`를 추가한다. 사용하지 않더라도 `useFormState`가 필수로 요구하기 때문이다.

```ts
// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // ...
}
```

`zod`의 `parse` 대신 `safeParse`로 교체한다. `safeParse`는 성공 또는 실패 시의 객체를 반환하여 `try/catch` 구문에 넣지 않아도 유효성 검사를 처리할 수 있다.

```ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // ...
}
```

검증을 통과하지 못하면 `useFormState`의 `state`는 다음과 같은 에러 객체를 반환한다.

```js
{
  errors: { customerId: Array(1), amount: Array(1), status: Array(1) },
  message: "Missing Fields. Failed to Create Invoice."
}
```

에러가 발생하면 화면에 표시하는 코드를 작성한다.

```diff
<form action={dispatch}>
  {/* ... */}
    <select
      id="customer"
      name="customerId"
      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
      defaultValue=""
+     aria-describedby="customer-error"
    >
    {/* ... */}
    </select>
+   <div id="customer-error" aria-live="polite" aria-atomic="true">
+     {state.errors?.customerId &&
+       state.errors.customerId.map((error: string) => (
+         <p className="mt-2 text-sm text-red-500" key={error}>
+           {error}
+         </p>
+       ))}
+   </div>
    {/* ... */}
</form>
```

`aria-describedby="customer-error"`는 `id="customer-error"`와 관계를 형성해 오류가 발생하면 화면 판독기가 해당 설명을 읽게 된다. `aria-live="polite"`는 오류가 발생했음을 알릴 때 사용자를 방해하지 않고 유휴 상태일 때만 알린다.

## 13. Adding Authentication

**Authentication(인증)**은 웹앱의 핵심 중 하나로, 실제 유저와 시스템이 바라는 유저가 같은지 확인하는 단계이다. 인증의 방법에는 여러 가지가 있다. 아이디와 비밀번호 입력 후 인증 코드를 발급한다거나 Google이나 Naver 등의 서드 파티를 이용한다. 혹은 외부 앱을 이용한 2단계 인증(2FA)으로 보안을 강화할 수도 있다. 이러한 인증 방법은 로그인 정보에 접근하더라도 고유 토큰 없이는 액세스할 수 없도록 한다.

### 13-1. Authentication vs. Authorization

웹 개발에서 Authentication과 Authorization은 비슷하지만 서로 다른 역할을 하는 개념이다.

**Authentication(인증)**은 사용자가 자신이 말한 사람이 **맞는지** 확인하는 것이다.

**Authorization(인가)**은 사용자의 신원이 확인되면 애플리케이션의 어떤 부분에 대한 **권한**이 있는지 결정하는 것이다.

### 13-2. NextAuth.js

여기서 사용하는 인증 라이브러리는 [`NextAuth.js`](https://authjs.dev/reference/nextjs)이다. 세션 관리, 로그인 및 로그아웃, 기타 인증과 관련된 복잡한 과정에 대한 솔루션을 제공한다. `Next.js @14`와 호환되는 버전을 `npm install next-auth@beta`로 설치한다.

다음으로 `openssl rand -base64 32`로 비밀키를 생성하고, `.env`에 추가한다.

```
AUTH_SECRET=your-secret-key
```

루트 폴더에 `auth.config.ts` 파일을 생성해 `NextAuth`에 대한 옵션을 추가한다.

```ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
```

`pages` 옵션을 통해 로그인, 로그아웃, 오류 페이지 경로 등을 지정할 수 있다. `signIn: '/login'`을 추가하면 `NextAuth`의 기본 페이지가 아닌 커스텀 로그인 페이지로 리디렉션한다(고 한다. 뭔 소린지 모르겠다.).

`callbacks`은 `Next.js`의 `middleware`를 통해 로그인 요청이 완료되기 전 권한이 있는지 확인하는 데 사용한다. `auth`는 유저의 session, `request` 속성 등이 들어있다.

`providers`는 다양한 로그인 옵션을 나열하는 배열이다. `NextAuth`의 구성을 충족하기 위해 일단 빈 배열로 설정되어 있다.

`authConfig` 객체를 가져올 `middleware.ts` 파일도 루트 폴더에 생성한다.

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
```

`NextAuth` 객체를 초기화하고, `matcher`에 따라 `middleware`를 실행한다. 배열에 담긴 문자열은 `api`나 `_next/static`, `_next/image`, `.png`로 끝나는 경로를 제외하고 `middleware`를 실행한다는 의미이다. 이렇게 하면 미들웨어가 보호된 경로에서 인증이 확인될 때까지 렌더링을 하지 않아 성능 향상의 이점이 생긴다.

패스워드는 보통 생성할 때 해싱하여 저장한다. 이 프로젝트에서는 `bcrypt` 패키지를 사용하여 해싱 처리했는데, 문제는 Node API에 의존하는 패키지이기 때문에 미들웨어에서는 실행할 수 없다는 점이다. 이를 위해 `authConfig` 객체를 퍼트리는 `auth.ts` 파일을 새로 만든다.

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
```

`NextAuth`에 `providers` 옵션을 추가해야 한다. `providers`는 Google 또는 GitHub와 같은 다양한 로그인 옵션을 나열하는 배열이다. 여기서는 [Credentials provider](https://nextjs.org/learn/dashboard-app/adding-authentication)만 사용한다.

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({})],
});
```

`zod`를 사용하여 이메일과 비밀번호 유효성을 검사한 후 유저 정보를 확인하자.

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
});
```

로그인 `action`을 작성한 다음 form을 수정한다.

```ts
// lib/actions

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
```

```tsx
// login-form

'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">{/* ... */}</div>
        <LoginButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
```

로그아웃 기능도 추가한다.

```tsx
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      // ...
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
```

`use server`를 최상단이 아닌 `action` 속성 내에 선언하는 게 신기했다. 이게 그 유명한 밈으로 탄생한 부분인 듯하다.

![](https://media.licdn.com/dms/image/D4D12AQEZJHiY-2xb5w/article-cover_image-shrink_720_1280/0/1700390410238?e=1707350400&v=beta&t=8rnKQ49XVBsBa6FaYfV0Tw-E3su-v8YtfhZA35q_Ea0)

아무튼 다 작성하고 나니 위 `authConfig`에서 궁금했던 `signIn: '/login'`의 정체를 알았다. 이것을 설정하지 않으면 비로그인 유저가 인증이 필요한 페이지로 접근했을 때 리디렉션하지 않고 `not-found`를 실행한다. 설정했다면 자동으로 로그인 페이지로 연결한다.

## 14. Adding Metadata

**SEO**와 콘텐츠 공유에 관련해서 웹앱의 `metadata`는 매우 중요한 요소이다. 최종장에서는 `metadata`에 대해서 학습한다.

### 14-1. What is metadata?

`metadata`는 웹 페이지에 대한 추가 세부 정보를 제공한다. 사용자에게는 표시되지 않지만, `<head>` 태그 내에 포함되어 백그라운드에서 동작한다. 이는 검색 엔진 등이 웹 페이지를 더 잘 이해하도록 돕는다. SEO를 향상시키는 데 중요한 역할을 하며, 적절한 metadata는 검색 엔진에서 웹 페이지의 순위를 높인다.

`Next.js`가 제공하는 **Metadata API**에는 두 가지 방식이 있다. 하나는 `Config-based`로, **정적인 metadata 객체**를 export하거나 **동적으로 metadata를 생성하는 함수**를 `layout.tsx`나 `page.tsx`에서 export하는 방식이다. 다른 하나는 `File-based`로, `favicon.ico`, `opengraph-image.jpg`, `robots.txt`, `sitemap.xml` 등 특수한 목적의 이름을 가진 파일들을 사용한다. 두 방식을 사용하면 `Next.js`가 자동으로 적절한 `<head>` 요소를 생성한다.

예시로, `/public` 폴더에 `favicon.ico`와 `opengraph-image.jpg` 파일이 들어있다. 이것을 `/app` 폴더로 옮기면 자동으로 `head`에 추가된다.

`layout.tsx`나 `page.tsx` 파일 내에 `metadata` 객체를 포함할 수도 있다.

```tsx
// app/layout.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout() {
  // ...
}
```

특정 페이지에 추가하여 해당 페이지의 정보만 담을 수 있다.

```tsx
// dashboard/invoices
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices | Acme Dashboard',
};

export default async function Page() {}
```

하지만 이렇게 입력하면 문제가 하나 있다. 회사명과 같은 주요 정보가 바뀌었을 때 모든 페이지의 metadata를 찾아 수정해야 한다. 그렇게 하는 대신 `title.template`을 사용하여 기본값을 정하고 페이지마다 다른 `title`을 부여할 수 있다.

```tsx
// app/layout.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

// dashboard/invoices

export const metadata: Metadata = {
  title: 'Invoices',
};
```
