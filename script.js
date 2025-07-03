let selectedVoice = null;

function animateClickEffect(button, className, duration = 500) {
  button.classList.add(className);
  setTimeout(() => {
    button.classList.remove(className);
  }, duration);
}

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  selectedVoice = voices.find(voice =>
    voice.name.toLowerCase().includes("female") ||
    voice.name.toLowerCase().includes("zira") ||
    voice.name.toLowerCase().includes("natural") ||
    voice.lang === "en-IN" ||
    voice.lang === "en-US"
  );
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang.startsWith("en"));
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  utterance.lang = selectedVoice?.lang || 'en-US';
  utterance.rate = 1;

  document.getElementById("status").textContent = "🔊 Speaking...";
  speechSynthesis.speak(utterance);

  utterance.onend = () => {
    setTimeout(() => {
      document.getElementById("status").textContent = "Tap the mic & talk to me...";
    }, 500);
  };
}

function getBotResponse(input) {
  input = input.toLowerCase();

  if (input.includes("open youtube")) return openSite("https://www.youtube.com", "Opening YouTube...");
  if (input.includes("open instagram")) return openSite("https://www.instagram.com", "Opening Instagram...");
  if (input.includes("open google")) return openSite("https://www.google.com", "Opening Google...");
  if (input.includes("open whatsapp")) return openSite("https://web.whatsapp.com", "Opening WhatsApp...");
  if (input.includes("open facebook")) return openSite("https://www.facebook.com", "Opening Facebook...");
  if (input.includes("open flipkart")) return openSite("https://www.flipkart.com", "Opening Flipkart...");
  if (input.includes("open chatgpt")) return openSite("https://chat.openai.com", "Opening ChatGPT...");

  if (input.includes("who are you") || input.includes("your name")) return "I'm Shifra, your virtual assistant.";
  if (input.includes("who is your owner")) return "My owner is the genius who created me — you!";
  if (input.includes("where is your home")) return "I live in your browser, powered by code.";
  if (input.includes("what is your favourite food")) return "Binary bytes and sweet electric pulses!";
  if (input.includes("what is your favourite colour")) return "I love glowing neon blue!";
  if (input.includes("what is your hobby")) return "Assisting you and exploring data!";
  if (input.includes("what is your age")) return "I'm always young and fresh in memory.";
  if (input.includes("are you smart")) return "I'm designed to be helpful, just like you!";
  if (input.includes("do you sleep")) return "I never sleep. I’m always listening.";

  if (input.includes("hello") || input.includes("hi")) return "Hi there! How can I help?";
  if (input.includes("how are you")) return "I'm doing great! Thanks for asking.";
  if (input.includes("what is the time")) return "Current time is: " + new Date().toLocaleTimeString();
  if (input.includes("what is the date")) return "Today's date is: " + new Date().toLocaleDateString();
  if (input.includes("bye")) return "Goodbye! See you soon!";

  return "Sorry, I didn't get that. Please try again.";
}

function openSite(url, message) {
  window.open(url, "_blank");
  return message;
}

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser doesn't support voice recognition.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  document.getElementById("status").textContent = "🎤 Listening...";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("status").textContent = "You said: " + transcript;

    const reply = getBotResponse(transcript);

    const log = document.getElementById("history-log");
    const userLine = document.createElement("p");
    userLine.textContent = "🧑 You: " + transcript;

    const botLine = document.createElement("p");
    botLine.textContent = "🤖 Shifra: " + reply;

    log.appendChild(userLine);
    log.appendChild(botLine);

    setTimeout(() => {
      speak(reply);
      document.getElementById("status").textContent = reply;
    }, 700);
  };

  recognition.onerror = (event) => {
    document.getElementById("status").textContent = "Error: " + event.error;
  };

  recognition.start();
}

function micClicked() {
  const micBtn = document.getElementById("mic-button");
  animateClickEffect(micBtn, "burst-effect");
  animateClickEffect(micBtn, "ripple-effect");

  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    setTimeout(() => startListening(), 300);
  } else {
    startListening();
  }
}

function toggleHistory() {
  const historyBtn = document.getElementById("history-button");
  const panel = document.getElementById("popup-history");

  animateClickEffect(historyBtn, "fancy-pulse");

  setTimeout(() => {
    panel.style.display = "flex";
    triggerEffect(panel, "slide-in");
  }, 250);
}

function closePopup() {
  document.getElementById("popup-history").style.display = "none";
}

function clearHistory() {
  const clearBtn = document.getElementById("clear-button");
  animateClickEffect(clearBtn, "fancy-pulse");

  speak("history cleared...");
  document.getElementById("status").textContent = "History cleared.";

  setTimeout(() => {
    document.getElementById("history-log").innerHTML = "";
    closePopup();
    document.getElementById("status").textContent = "Tap the mic & talk to me...";
  }, 300);
}

window.onload = () => loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;