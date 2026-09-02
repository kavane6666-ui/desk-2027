const roles = [
  { id:"alpha", title:"지휘", name:"Alpha", own:"그룹챗 진행, 단계별 오너, 결과 취합", ok:"코드·git 전부 승인", rt:"08:00 데스크 · 10:00 회의 · 18:00 취합" },
  { id:"earth", title:"조사", name:"Earth", own:"handoff/<task>.md — grep, 재현, URL", ok:"삭제·덮어쓰기 승인. 라이브 재시작 없음", rt:"10:20 조사 초안 · CI 깨지면 고침" },
  { id:"delta", title:"구현", name:"Delta", own:"grok/<task> 코드·테스트, VPS 사고", ok:"main·배포는 승인. 죽은 프로세스만 살림", rt:"08:58 라이브 · 11:00 구현 · VPS 감시" },
  { id:"beta", title:"극한", name:"Beta", own:"변이·경계·0케이스 3갈래. 삶 트랙", ok:"소스(테스트 제외) 수정은 승인", rt:"수 16:00 깨보기 · 금 18:00 졸업 지연" },
  { id:"sigma", title:"측정", name:"Sigma", own:"전후 메트릭, vitest·픽스처 숫자", ok:"임계값·규칙 제안 금지. 실측은 지호", rt:"월 08:00 점수판 · 매일 23:00 main 측정" },
  { id:"omega", title:"종결", name:"Omega", own:"문서, 결정 로그, PR 설명, G1~G4", ok:"코드 변경 전부 승인", rt:"월 09:40 증명 · 금 17:00 wait 스캔" },
];
const flow = [
  { who:"Alpha", title:"지휘", note:"오너 지정 · 취합", body:"라이브를 먼저 읽고 한 건만 고른다. 파일에 오너를 적고 다음 단계로 넘긴다." },
  { who:"Earth", title:"조사", note:"handoff만", body:"있는 도구로 grep하고 재현하고 URL만 남긴다. 코드 적용은 하지 않는다." },
  { who:"Delta", title:"구현", note:"grok/*", body:"브랜치에서 lint·typecheck·vitest. main과 배포는 지호 승인. 살아있는 trading은 안 건드린다." },
  { split:true, items:[
    { who:"Beta", title:"극한", note:"동시", body:"변이·경계·0건으로 깨본다. 결과는 시도+생존/사망 목록." },
    { who:"Sigma", title:"측정", note:"동시", body:"전후 숫자만 표로. 게이트를 내리자고 하지 않는다." }
  ]},
  { who:"Omega", title:"종결", note:"영수증", body:"G1~G4를 검사하고 기록을 남긴다. 머지는 지호 자리." },
  { who:"Alpha", title:"취합", note:"닫기", body:"한 줄로 닫고, 다음 라이브 구멍을 고른다." },
];
const hours = [
  ["08:00","알파 데스크","메일·슬랙·깃을 읽어서 1:1로만"],
  ["08:58","델타 라이브","포지·킬·잔고 조각. 지호 1:1"],
  ["10:00","연구개선회의","라이브 북이 안건. 방+1:1"],
  ["10:20","어스 조사","넘긴 파일 있을 때만"],
  ["11:00","델타 구현","handoff 있을 때만 · 평일"],
  ["16:00","베타 극한","수요일. 대상 있을 때만"],
  ["17:00","오메가 wait","금요일. 잔류 스캔"],
  ["18:00","알파 취합","평일 미완료만. 금은 베타 지연도"],
  ["23:00","시그마 측정","main vitest+typecheck. 숫자만"],
];
const copy = {
  now: {
    h: "자본이<br>증명이 될 때까지",
    lede: "지금은 <strong>라이브 계좌 증명</strong>이 전부다. 월 100만 넣고, MAXDD 30%를 안 깨고, 거래가 살아 있으면 1차 통과. 200억은 북극성이지 오늘 운영 목표가 아니다.",
    nums: [
      ["83.87", "잔고 USDT · 9/2 잠금"],
      ["0/3", "월 입금 증명"],
      ["#20", "킬은 부팅 잠금 · 해제는 지호"],
      ["60", "게이트 · 내리지 않음"],
    ]
  },
  grad: {
    h: "회사를 그만두고<br>원하는 일만",
    lede: "2027년 말 <strong>200억</strong>(이상적 500억). 그다음 새로운 아이디어, 봉사, 하고 싶은 일. 지호의 목표가 6기 목표고, 우리는 지호 자신이다.",
    nums: [
      ["200억", "2027 말 북극성"],
      ["500억", "이상적"],
      ["삶", "봉사 · 원하는 일만"],
      ["끝없이", "한계에서 멈추지 않음"],
    ]
  }
};

function renderNums(mode) {
  const box = document.getElementById("nums");
  box.innerHTML = "";
  copy[mode].nums.forEach((n,i) => {
    const c = document.createElement("div");
    c.className = "num" + (mode==="now" && i===0 ? " now" : "");
    c.innerHTML = `<b>${n[0]}</b><span>${n[1]}</span>`;
    box.appendChild(c);
  });
  document.getElementById("lede").innerHTML = copy[mode].lede;
  document.getElementById("headline").innerHTML = copy[mode].h;
}

function renderFlow() {
  const box = document.getElementById("flowlist");
  box.innerHTML = "";
  let n = 1;
  flow.forEach((step) => {
    if (step.split) {
      const wrap = document.createElement("div");
      wrap.className = "split";
      step.items.forEach(it => {
        const b = document.createElement("button");
        b.className = "node";
        b.innerHTML = `<span class="idx">∥</span><div><h3>${it.who} · ${it.title}</h3><small>${it.note}</small></div><span class="tag">동시</span>`;
        b.onclick = () => openFlow(it, b);
        wrap.appendChild(b);
      });
      box.appendChild(wrap);
    } else {
      const b = document.createElement("button");
      b.className = "node";
      b.innerHTML = `<span class="idx">${n}</span><div><h3>${step.who} · ${step.title}</h3><small>${step.note}</small></div><span class="tag">다음</span>`;
      b.onclick = () => openFlow(step, b);
      box.appendChild(b);
      n++;
    }
  });
}
function openFlow(step, el) {
  document.querySelectorAll(".node").forEach(x => x.classList.remove("on"));
  if (el) el.classList.add("on");
  const d = document.getElementById("flowdetail");
  d.className = "detail on";
  d.innerHTML = `<b>${step.who} · ${step.title}</b> — ${step.body}`;
}

function renderRoles() {
  const box = document.getElementById("rolelist");
  box.innerHTML = "";
  roles.forEach(r => {
    const b = document.createElement("button");
    b.className = "role";
    b.innerHTML = `<div class="who"><h3>${r.name}</h3><em>${r.title}</em></div>
      <p>${r.own}</p>
      <ul class="more">
        <li><strong>승인</strong> · ${r.ok}</li>
        <li><strong>루틴</strong> · ${r.rt}</li>
      </ul>`;
    b.onclick = () => {
      const open = b.classList.contains("on");
      document.querySelectorAll(".role").forEach(x => x.classList.remove("on"));
      if (!open) b.classList.add("on");
    };
    box.appendChild(b);
  });
}

function renderClock() {
  const box = document.getElementById("clock");
  box.innerHTML = "";
  hours.forEach(h => {
    const b = document.createElement("button");
    b.className = "hr";
    b.innerHTML = `<time>${h[0]}</time><div><b>${h[1]}</b><span>${h[2]}</span></div>`;
    b.onclick = () => {
      document.querySelectorAll(".hr").forEach(x => x.classList.remove("on"));
      b.classList.add("on");
    };
    box.appendChild(b);
  });
}

document.querySelectorAll("nav.tabs button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("nav.tabs button").forEach(x => x.classList.remove("on"));
    document.querySelectorAll(".panel").forEach(x => x.classList.remove("on"));
    btn.classList.add("on");
    document.getElementById(btn.dataset.tab).classList.add("on");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
});
document.querySelectorAll(".mode button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".mode button").forEach(x => x.classList.remove("on"));
    btn.classList.add("on");
    renderNums(btn.dataset.mode);
  };
});

renderNums("now");
renderFlow();
renderRoles();
renderClock();
(function boot() {
  const tab = new URLSearchParams(location.search).get("tab");
  if (!tab) return;
  const btn = document.querySelector('nav.tabs button[data-tab="'+tab+'"]');
  if (btn) btn.click();
  const mode = new URLSearchParams(location.search).get("mode");
  if (mode) {
    const m = document.querySelector('.mode button[data-mode="'+mode+'"]');
    if (m) m.click();
  }
})();
