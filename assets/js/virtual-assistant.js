document.addEventListener('DOMContentLoaded', () => {
  const assistant = document.getElementById('virtualAssistant');
  const avatar = document.getElementById('assistantAvatar');
  const message = document.getElementById('assistantMessage');

  if (!assistant || !avatar || !message) return;

  const messages = [
    '\u0623\u0647\u0644\u0627\u064b \u0628\u0643 \u0641\u064a \u0645\u0633\u0627\u0642\u064a! \u0643\u064a\u0641 \u064a\u0645\u0643\u0646\u0646\u064a \u0645\u0633\u0627\u0639\u062f\u062a\u0643\u061f',
    '\u064a\u0645\u0643\u0646\u0646\u064a \u062a\u0648\u062c\u064a\u0647\u0643 \u0644\u0644\u062e\u062f\u0645\u0627\u062a \u0623\u0648 \u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0630\u0643\u064a\u0629.',
    '\u0647\u0644 \u062a\u0631\u063a\u0628 \u0628\u062d\u062c\u0632 \u0627\u0633\u062a\u0634\u0627\u0631\u0629 \u0645\u0639 \u0641\u0631\u064a\u0642 \u0645\u0633\u0627\u0642\u064a\u061f',
    '\u0627\u0633\u062a\u0643\u0634\u0641 \u062d\u0644\u0648\u0644 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0627\u0644\u0645\u0635\u0645\u0645\u0629 \u0644\u0646\u0645\u0648 \u0623\u0639\u0645\u0627\u0644\u0643.'
  ];

  let hideTimer;

  const showMessage = () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    message.textContent = randomMessage;
    message.classList.add('show');
    avatar.setAttribute('aria-expanded', 'true');

    clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      message.classList.remove('show');
      avatar.setAttribute('aria-expanded', 'false');
    }, 5200);
  };

  avatar.setAttribute('aria-expanded', 'false');
  avatar.addEventListener('click', showMessage);

  document.addEventListener('mousemove', (event) => {
    const rect = avatar.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    if (Math.abs(distanceX) > 720 || Math.abs(distanceY) > 520) {
      avatar.style.setProperty('--assistant-x', '0px');
      avatar.style.setProperty('--assistant-y', '0px');
      return;
    }

    const moveX = Math.max(-22, Math.min(0, distanceX / 20));
    const moveY = Math.max(-12, Math.min(12, distanceY / 42));

    avatar.style.setProperty('--assistant-x', `${moveX}px`);
    avatar.style.setProperty('--assistant-y', `${moveY}px`);
  });

  document.addEventListener('mouseleave', () => {
    avatar.style.setProperty('--assistant-x', '0px');
    avatar.style.setProperty('--assistant-y', '0px');
  });
});
