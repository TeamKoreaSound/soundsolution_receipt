// 한국어 표기법 변환기 (십/백/천/만 앞의 "일" 생략)
export const numberToKoreanAmt = (num: number): string => {
  if (num === 0) return "";
  const digits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  const smallUnits = ["", "십", "백", "천"];
  const bigUnits = ["", "만", "억", "조", "경"];

  let result = "";
  let groupIdx = 0;
  let n = num;
  while (n > 0) {
    const group = n % 10000;
    if (group > 0) {
      let groupStr = "";
      let g = group;
      let pos = 0;
      while (g > 0) {
        const d = g % 10;
        if (d > 0) {
          // 십/백/천 앞의 "일"은 생략 (예: 일천 → 천)
          const digitStr = (d === 1 && pos > 0) ? "" : digits[d];
          groupStr = digitStr + smallUnits[pos] + groupStr;
        }
        g = Math.floor(g / 10);
        pos++;
      }
      result = groupStr + bigUnits[groupIdx] + result;
    }
    n = Math.floor(n / 10000);
    groupIdx++;
  }
  return `일금 ${result}원정`;
};

export const formatKoreanDateWithDow = (isoDate: string): string => {
  const parts = (isoDate || '').split('-');
  const y = parseInt(parts[0] || '0', 10);
  const m = parseInt(parts[1] || '0', 10);
  const d = parseInt(parts[2] || '0', 10);
  if (!y || !m || !d) return isoDate;
  const dowName = ['일', '월', '화', '수', '목', '금', '토'][new Date(y, m - 1, d).getDay()];
  return `${y}년 ${m}월 ${d}일 ${dowName}요일`;
};
