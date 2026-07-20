(() => {
  const rounds = [
    {
      caseNumber: 1,
      chatImage: 'assets/chat-masha.jpg',
      storyImage: 'assets/story-masha.jpg',
      options: [
        { id: 'masha', label: 'Маша' },
        { id: 'anya', label: 'Аня' }
      ],
      correct: 'masha'
    },
    {
      caseNumber: 2,
      chatImage: 'assets/chat-dasha.jpg',
      storyImage: 'assets/story-dasha.jpg',
      options: [
        { id: 'marina', label: 'Марина' },
        { id: 'dasha', label: 'Даша' }
      ],
      correct: 'dasha'
    },
    {
      caseNumber: 3,
      chatImage: 'assets/chat-mashap.jpg',
      storyImage: 'assets/story-mashap.jpg',
      options: [
        { id: 'masha', label: 'Маша' },
        { id: 'anya', label: 'Аня' }
      ],
      correct: 'masha'
    }
  ];

  const slides = [...document.querySelectorAll('.slide')];
  const scoreNodes = [...document.querySelectorAll('[data-score]')];
  const caseNodes = [...document.querySelectorAll('[data-case]')];
  const selectedFriend = document.getElementById('selectedFriend');
  const friendChoices = document.getElementById('friendChoices');
  const chatSlide = document.getElementById('chatSlide');
  const storySlide = document.getElementById('storySlide');
  const finishText = document.getElementById('finishText');

  let score = 0;
  let roundIndex = 0;
  let friendAnswered = false;
  let storyAnswered = false;

  function showSlide(name) {
    slides.forEach(slide => {
      slide.classList.toggle('is-active', slide.dataset.slide === name);
    });
    window.scrollTo(0, 0);
  }

  function renderScore() {
    scoreNodes.forEach(node => { node.textContent = String(score); });
  }

  function renderRound() {
    const round = rounds[roundIndex];
    friendAnswered = false;
    storyAnswered = false;

    caseNodes.forEach(node => { node.textContent = String(round.caseNumber); });
    chatSlide.style.setProperty('--bg', `url('${round.chatImage}')`);
    storySlide.style.setProperty('--bg', `url('${round.storyImage}')`);

    selectedFriend.textContent = '';
    selectedFriend.classList.remove('is-correct', 'is-wrong');

    friendChoices.innerHTML = '';
    round.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'choice';
      button.dataset.answer = option.id;
      button.textContent = option.label;
      button.addEventListener('click', () => chooseFriend(button, option));
      friendChoices.appendChild(button);
    });

    document.querySelectorAll('[data-story]').forEach(button => {
      button.disabled = false;
      button.classList.remove('is-correct', 'is-wrong');
    });
  }

  function chooseFriend(button, option) {
    if (friendAnswered) return;
    friendAnswered = true;

    const round = rounds[roundIndex];
    const isCorrect = option.id === round.correct;
    const resultClass = isCorrect ? 'is-correct' : 'is-wrong';

    if (isCorrect) score += 1;
    button.classList.add(resultClass);

    selectedFriend.textContent = option.label;
    selectedFriend.classList.remove('is-correct', 'is-wrong');
    selectedFriend.classList.add(resultClass);

    renderScore();
    friendChoices.querySelectorAll('button').forEach(item => item.disabled = true);
    setTimeout(() => showSlide('story'), 650);
  }

  function finishStory(button) {
    if (storyAnswered) return;
    storyAnswered = true;

    if (button.dataset.story === 'yes') {
      score += 1;
      button.classList.add('is-correct');
    } else {
      button.classList.add('is-wrong');
    }

    renderScore();
    document.querySelectorAll('[data-story]').forEach(item => item.disabled = true);

    setTimeout(() => {
      if (roundIndex < rounds.length - 1) {
        roundIndex += 1;
        renderRound();
        showSlide('chat');
      } else {
        finishText.textContent = `Ты раскрыла ${score} из ${rounds.length * 2} возможных баллов.`;
        showSlide('finish');
      }
    }, 650);
  }

  document.querySelector('[data-next="rules"]').addEventListener('click', () => showSlide('rules'));

  document.getElementById('startGameButton').addEventListener('click', () => {
    score = 0;
    roundIndex = 0;
    renderScore();
    renderRound();
    showSlide('chat');
  });

  document.querySelectorAll('[data-story]').forEach(button => {
    button.addEventListener('click', () => finishStory(button));
  });

  document.getElementById('restartButton').addEventListener('click', () => {
    score = 0;
    roundIndex = 0;
    renderScore();
    renderRound();
    showSlide('intro');
  });

  renderScore();
  renderRound();
})();
