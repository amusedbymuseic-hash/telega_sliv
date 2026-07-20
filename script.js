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
    },
    {
      caseNumber: 4,
      chatImage: 'assets/chat-anya.jpg',
      storyImage: 'assets/story-anya.jpg',
      options: [
        { id: 'nastya', label: 'Настя' },
        { id: 'anya', label: 'Аня' }
      ],
      correct: 'anya'
    },
    {
      caseNumber: 5,
      chatImage: 'assets/chat-marina.jpg',
      storyImage: 'assets/story-marina.jpg',
      options: [
        { id: 'alisa', label: 'Алиса' },
        { id: 'marina', label: 'Марина' }
      ],
      correct: 'marina'
    },
    // {
    //   caseNumber: 6,
    //   chatImage: 'assets/chat-alisa.jpg',
    //   storyImage: 'assets/story-alisa.jpg',
    //   options: [
    //     { id: 'alisa', label: 'Алиса' },
    //     { id: 'dasha', label: 'Даша' }
    //   ],
    //   correct: 'alisa'
    // },
    {
      caseNumber: 6,
      chatImage: 'assets/chat-nastya.jpg',
      storyImage: 'assets/story-nastya.jpg',
      options: [
        { id: 'nastya', label: 'Настя' },
        { id: 'masha', label: 'Маша' }
      ],
      correct: 'nastya'
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
  const nextClueButton = document.getElementById('nextClueButton');

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

    selectedFriend.innerHTML = '';
    nextClueButton.hidden = true;

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
  
    renderScore();
  
    friendChoices.querySelectorAll('button').forEach(item => {
      item.disabled = true;
    });
  
    setTimeout(() => {
      selectedFriend.innerHTML = '';
  
      round.options.forEach(item => {
        const storyButton = document.createElement('button');
        storyButton.className = 'choice';
        storyButton.textContent = item.label;
        storyButton.disabled = true;
  
        if (item.id === option.id) {
          storyButton.classList.add(resultClass);
        } else {
          storyButton.classList.add('choice--hidden');
        }
  
        selectedFriend.appendChild(storyButton);
      });
  
      showSlide('story');
    }, 650);
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
  
    nextClueButton.textContent =
      roundIndex < rounds.length - 1
        ? 'Следующая улика'
        : 'Завершить расследование';
  
    nextClueButton.hidden = false;
  }

  nextClueButton.addEventListener('click', () => {
    if (roundIndex < rounds.length - 1) {
      roundIndex++;
      renderRound();
      showSlide('chat');
    } else {
      let resultText = '';
  
      if (score <= 6) {
        resultText =
          'Ты так много переписываешься с подружками, что уже не помнишь, где какая. Жди скрины в паблике «Подслушано Митино»!';
      } else if (score <= 10) {
        resultText =
          'А ты хорошо помнишь свои переписки! Так уж и быть, ваши секреты останутся между вами.';
      } else {
        resultText =
          'От тебя ничего не скроешь! Снимаю шляпу и удаляю слитые архивы!';
      }
  
      finishText.textContent =
        `Ты набрала ${score} из ${rounds.length * 2} баллов. ${resultText}`;
  
      showSlide('finish');
    }
  });

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
