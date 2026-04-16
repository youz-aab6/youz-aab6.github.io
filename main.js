
// 전역 변수 오염을 막기 위해 IIFE로 전체를 감쌈
(function () {

  const hero         = document.querySelector('.hero');
  const workWrapper  = document.querySelector('.work-wrapper');
  const contact      = document.querySelector('.contact-section');
  const sceneBg      = document.querySelector('.scene-bg');
  const personFloat  = document.querySelector('.person-float');
  const workSection  = document.querySelector('.work-section');
  const sidebarPhoto = document.querySelector('.sidebar-photo');

  if (!hero || !workWrapper || !contact || !sceneBg || !personFloat) return;

  let isSnapping = false;

  // -- getOffsetFrom --
  // getBoundingClientRect()는 현재 뷰포트 기준 좌표를 반환하기 때문에
  // 페이지 초기 로드 시 스크롤 위치에 따라 값이 달라질 수 있음
  // offsetTop/offsetLeft로 부모를 직접 거슬러 올라가면
  // sticky 컨테이너 기준의 정확한 고정 좌표를 얻을 수 있음
  function getOffsetFrom(child, ancestor) {
    let top = 0, left = 0;
    let el = child;
    while (el && el !== ancestor) {
      top  += el.offsetTop;
      left += el.offsetLeft;
      el = el.offsetParent;
    }
    return { top, left };
  }

  const photoOffset = getOffsetFrom(sidebarPhoto, workSection);
  const WORK = {
    top    : photoOffset.top,
    left   : photoOffset.left,
    width  : sidebarPhoto.offsetWidth,
    height : sidebarPhoto.offsetHeight,
  };

  // -- setScene --
  function setScene(state) {
    sceneBg.classList.remove('is-work', 'is-contact');
    if (state === 'work')    sceneBg.classList.add('is-work');
    if (state === 'contact') sceneBg.classList.add('is-contact');
  }

  // -- setPerson --
  function setPerson(state) {
    personFloat.classList.remove('is-contact');

    if (state === 'hero') {
      personFloat.style.top          = '0';
      personFloat.style.left         = '0';
      personFloat.style.width        = '50vw';
      personFloat.style.height       = '100vh';
      personFloat.style.borderRadius = '0';
    }

    if (state === 'work') {
      personFloat.style.top          = WORK.top    + 'px';
      personFloat.style.left         = WORK.left   + 'px';
      personFloat.style.width        = WORK.width  + 'px';
      personFloat.style.height       = WORK.height + 'px';
      personFloat.style.borderRadius = '8px';
    }

    if (state === 'contact') {
      personFloat.classList.add('is-contact');
    }
  }

  // -- setWorkActive --
  // toggle(className, force) : force가 true면 추가, false면 제거
  function setWorkActive(active) {
    workWrapper.classList.toggle('is-work', active);
  }

  // -- jumpTo --
  function jumpTo(targetY, scene) {
    isSnapping = true;

    setScene(scene);
    setPerson(scene);
    setWorkActive(scene === 'work');

    window.scrollTo({ top: targetY, behavior: 'smooth' });

    setTimeout(() => { isSnapping = false; }, 500);
  }

  // -- wheel --
  // preventDefault()를 호출하려면 passive: false 가 필수
  // passive: true(기본값)이면 브라우저가 스크롤을 먼저 처리해버려서 막을 수 없음
  window.addEventListener('wheel', function (e) {
    if (isSnapping) return;

    const sy         = window.scrollY;
    const vh         = window.innerHeight;
    const workTop    = workWrapper.offsetTop;
    const contactTop = contact.offsetTop;

    const down = e.deltaY > 0;
    const up   = e.deltaY < 0;

    if (down && sy < workTop) {
      e.preventDefault();
      jumpTo(workTop, 'work');
      return;
    }

    if (down && sy >= workTop && sy + vh >= contactTop) {
      e.preventDefault();
      jumpTo(contactTop, 'contact');
      return;
    }

    if (up && sy >= contactTop) {
      e.preventDefault();
      jumpTo(Math.max(workTop, contactTop - vh), 'work');
      return;
    }

    if (up && sy <= workTop + 2) {
      e.preventDefault();
      jumpTo(0, 'hero');
      return;
    }

  }, { passive: false });

  // -- initState --
  // 새로고침했을 때 스크롤 위치에 맞는 상태로 초기화
  // 즉시 실행 함수로 선언과 동시에 실행
  (function initState() {
    const sy         = window.scrollY;
    const workTop    = workWrapper.offsetTop;
    const contactTop = contact.offsetTop;

    if (sy >= contactTop) {
      setScene('contact'); setPerson('contact'); setWorkActive(false);
    } else if (sy >= workTop) {
      setScene('work');    setPerson('work');    setWorkActive(true);
    } else {
      setScene('hero');    setPerson('hero');    setWorkActive(false);
    }
  })();

})();



document.querySelectorAll('a').forEach(link => {
  const url = link.href;

  if (url && !url.includes(location.hostname)) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
});
