---
slug: "react_calendar"
title: "[React] 라이브러리 없이 달력을 만들어 보자! - react 달력 만들기"
authors: [yeheum]
tags: [JavaScript, React, calendar, new Date, 달력]
---

![](https://images.velog.io/images/cyheum/post/3c4333ff-8597-441c-a7a9-6cf38d2c56df/ezgif.com-gif-maker.gif)

# new Date()로 달력만들기!

회사에서 달력이 필요한 부분이 있어서 라이브러리 들을 찾아 보았다.
괜찮은 오픈 소스들도 많이 있었지만 스타일을 커스텀하거나 원하는 기능들을 자유롭게 사용하기에는 조금 불편해서 만들어 보기로 했다.

대강 어떻게 만들어야 할지는 생각하면 나올 것 같았지만(?) ~~편하게 하기위해ㅎㅎ~~ 다른 분들도 잘 해 놓았을 것 같아서 구글링을 해보았다.

여러가지들이 있었지만 특정 라이브러리를 사용해서 하는 경우가 많았다.
그래서 그냥 new Date() 를 사용해서 혼자 만들어 보기로 했다.

## 1. 스타일 모티브

![](https://images.velog.io/images/cyheum/post/466da755-ba02-4dae-8ac7-728926d127f0/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-03-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%202.53.18.png)

기본 스타일은 그냥 [react-calendar](https://github.com/wojtekmaj/react-calendar) 라이브러리 스타일을 따라서 해보았다.

## 2. new Date()를 사용해 월별 달력 뽑기

여러가지 방법이 있겠지만 그냥 가장 단순하게 생각나는 방법으로 했다.
(수정이 필요할 수도 있을듯)

```js
export function getNewDateObj(newDate: Date) {
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const date = newDate.getDate();
  const day = newDate.getDay();
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const seconds = newDate.getSeconds();

  return { year, month, date, day, hours, minutes, seconds };
}
```

먼저는 편의를 위해 new Date()로 만들어진 것을 파라미터로 받아서 년,월,일 등등으로 리턴하는 함수를 만들어준다.

```js
function getMonthDate(newDate, page = 0) {
  const doMonth = getNewDateObj(
    new Date(newDate.year, newDate.month - 1 + page, 1)
  );

  const prevMonthLastDate = getNewDateObj(
    new Date(doMonth.year, doMonth.month - 1, 0)
  );
  const startDate =
    prevMonthLastDate.day === 0
      ? prevMonthLastDate
      : prevMonthLastDate.day === 6
      ? doMonth
      : getNewDateObj(
          new Date(doMonth.year, doMonth.month - 1, -prevMonthLastDate.day)
        );
  let monthDate = [];
  for (let i = 0; i < 42; i++) {
    monthDate.push(
      getNewDateObj(
        new Date(startDate.year, startDate.month - 1, startDate.date + i)
      )
    );
  }

  const week1 = monthDate.slice(0, 7);
  const week2 = monthDate.slice(7, 14);
  const week3 = monthDate.slice(14, 21);
  const week4 = monthDate.slice(21, 28);
  const week5 = monthDate.slice(28, 35);
  const week6 = monthDate.slice(35);

  const week4LastDate = week4[week4.length - 1];
  const week5LastDate = week5[week5.length - 1];
  const lastDate = new Date(doMonth.year, doMonth.month, 0);
  const isLastWeek4 =
    week4LastDate.month !== doMonth.month ||
    !(week4LastDate.date < lastDate.getDate());
  const isLastWeek5 =
    week5LastDate.month !== doMonth.month ||
    !(week5LastDate.date < lastDate.getDate());
  const dateArr = [week1, week2, week3, week4];

  return {
    year: doMonth.year,
    month: doMonth.month,
    date: isLastWeek4
      ? dateArr
      : isLastWeek5
      ? [...dateArr, week5]
      : [...dateArr, week5, week6],
  };
}
```

- 먼저 이 함수는 선택된 날짜 ( 시작 날짜 ) 를 받아서 해당 월의 첫 날을 뽑아낸다.
  => page는 다음이나 이전 월을 넣을 수 있게 만들었다.
- new Date()의 세번째 파라미터에 0을 넣어서 지난달의 마지막 날을 뽑아낸다.
- 지난달의 마지막날이 일요일인지, 토요일인지를 통해서 선택된 날짜의 월 달력의 첫주차의 첫 번째 날짜를 지정해 준다.
- 아무리 많아봤자 42개의 날짜 이기에 반복문을 통해서 최대 6주차를 뽑아낸다.
- 해당 월의 마지막 주차의 마지막 날의 월이 start Date의 월과 다른지 비교를 통해서 4,5,6주차를 정해준다.
  => 4주차 밖에 없을 수도 있다. 2월의 1일이 처음이고 28일이 마지막이라면?

이렇게 해서 완성된 달력이다.

![](https://images.velog.io/images/cyheum/post/75d9e19a-bb1b-4d89-80ca-1a954beddaef/ezgif.com-gif-maker.gif)

생각보다 간단한 것 같다.
기본적으로 저렇게 선택한 날짜를 state에 저장해서 사용할 수 있도록만 해놓았다.
아마 공휴일이나 지난 날짜를 선택못하게 하는 것은 금방 할 수 있을 것 같다.
