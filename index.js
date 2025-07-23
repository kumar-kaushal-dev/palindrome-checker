let isDarkTheme = false;

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  document.body.classList.toggle('dark-theme', isDarkTheme);

  const themeIcon = document.querySelector('.theme-toggle i');
  if (themeIcon) {
    themeIcon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
  }

  try {
    localStorage.setItem('darkTheme', isDarkTheme);
  } catch (e) {
    console.warn('Could not save theme preference:', e);
  }
}

function loadTheme() {
  try {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
      isDarkTheme = true;
      document.body.classList.add('dark-theme');
      const themeIcon = document.querySelector('.theme-toggle i');
      if (themeIcon) {
        themeIcon.className = 'fas fa-sun';
      }
    }
  } catch (e) {
    console.warn('Could not load theme preference:', e);
  }
}

function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

function checkPalindrome() {
  const input = document.getElementById('inputField');
  const resultContainer = document.getElementById('resultContainer');
  const text = input.value.trim();

  if (!text) {
    showResult('Please enter some text to check', 'info');
    return;
  }

  showResult('<div class="loading"></div> Checking...', 'loading');

  setTimeout(() => {
    const result = isPalindrome(text);

    if (result) {
      showResult(`<i class="fas fa-check-circle result-icon"></i> "${text}" is a palindrome! 🎉`, 'success');
    } else {
      showResult(`<i class="fas fa-times-circle result-icon"></i> "${text}" is not a palindrome`, 'error');
    }
  }, 500);
}

function showResult(message, type) {
  const resultContainer = document.getElementById('resultContainer');
  resultContainer.className = `result-container ${type}`;
  resultContainer.innerHTML = `<div class="result-text">${message}</div>`;
}

function clearInput() {
  const input = document.getElementById('inputField');
  const resultContainer = document.getElementById('resultContainer');
  input.value = '';
  input.focus();

  resultContainer.className = 'result-container';
  resultContainer.innerHTML = `
    <div class="result-text">
      <i class="fas fa-info-circle result-icon"></i>
      Enter some text above to check if it's a palindrome
    </div>
  `;
}

// Voice Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

function initializeVoiceRecognition() {
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      const voiceBtn = document.getElementById('voiceBtn');
      if (voiceBtn) {
        voiceBtn.classList.add('listening');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
      }
    };

    recognition.onend = () => {
      const voiceBtn = document.getElementById('voiceBtn');
      if (voiceBtn) {
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById('inputField');
      if (input) {
        input.value = transcript;
        input.focus();
        setTimeout(checkPalindrome, 500);
      }
    };

    recognition.onerror = (event) => {
      showResult(`Voice recognition error: ${event.error}`, 'error');
    };
  } else {
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
      voiceBtn.style.display = 'none';
    }
  }
}

function startVoiceInput() {
  if (!recognition) {
    showResult('Speech recognition not supported in this browser', 'error');
    return;
  }

  const voiceBtn = document.getElementById('voiceBtn');
  if (voiceBtn.classList.contains('listening')) {
    recognition.stop();
  } else {
    recognition.start();
  }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initializeVoiceRecognition();

  const input = document.getElementById('inputField');
  input.focus();

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      checkPalindrome();
    }
  });

  input.addEventListener('input', () => {
    const resultContainer = document.getElementById('resultContainer');
    if (resultContainer && !resultContainer.classList.contains('result-container')) {
      resultContainer.className = 'result-container';
      resultContainer.innerHTML = `
        <div class="result-text">
          <i class="fas fa-info-circle result-icon"></i>
          Press Enter or click Check to validate
        </div>
      `;
    }
  });
});
