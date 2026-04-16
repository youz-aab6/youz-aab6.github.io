// EmailJS 초기화
emailjs.init({ publicKey: 'ASzDDZBD6t8D1pXfe' });

const contactForm = document.querySelector('.contact-form');
const sendBtn     = document.querySelector('.send-btn');

// 폼 제출 이벤트
contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // 버튼 비활성화 (중복 전송 방지)
  sendBtn.disabled    = true;
  sendBtn.textContent = 'SENDING...';

  emailjs.sendForm('service_mpn2t1n', 'template_lwm7opd', contactForm)
    .then(function () {
      sendBtn.textContent = 'SENT ✓';
      contactForm.reset();

      // 2초 후 버튼 원상복구
      setTimeout(() => {
        sendBtn.disabled    = false;
        sendBtn.textContent = 'SEND →';
      }, 2000);
    })
    .catch(function (error) {
      console.error('전송 실패:', error);
      sendBtn.textContent = 'FAILED — retry';

      setTimeout(() => {
        sendBtn.disabled    = false;
        sendBtn.textContent = 'SEND →';
      }, 2000);
    });
});
