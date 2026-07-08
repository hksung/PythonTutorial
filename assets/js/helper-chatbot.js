(function () {
  const root = document.querySelector("[data-helper-chatbot]");
  if (!root) return;

  const launcher = root.querySelector(".helper-chatbot__launcher");
  const panel = root.querySelector(".helper-chatbot__panel");
  const closeButton = root.querySelector(".helper-chatbot__close");
  const form = root.querySelector(".helper-chatbot__form");
  const input = root.querySelector(".helper-chatbot__input");
  const messages = root.querySelector(".helper-chatbot__messages");
  const selectionButton = root.querySelector('[data-action="selection"]');
  const promptButtons = root.querySelectorAll("[data-prompt]");

  const glossary = [
    {
      term: "variable",
      aliases: ["variables", "변수"],
      title: "Variable",
      summary: "A variable stores a value under a name. You can reuse that name later instead of rewriting the value."
    },
    {
      term: "function",
      aliases: ["functions", "함수"],
      title: "Function",
      summary: "A function is a reusable block of code that can take inputs and return a result."
    },
    {
      term: "method",
      aliases: ["methods", "메서드"],
      title: "Method",
      summary: "A method is a function attached to an object, such as `lower()` or `split()` on a string."
    },
    {
      term: "list",
      aliases: ["lists", "리스트"],
      title: "List",
      summary: "A list is an ordered and mutable collection. You can index it, slice it, append to it, and replace items."
    },
    {
      term: "tuple",
      aliases: ["tuples", "튜플"],
      title: "Tuple",
      summary: "A tuple is like a list, but immutable. Its contents cannot be changed after creation."
    },
    {
      term: "dictionary",
      aliases: ["dictionaries", "dict", "딕셔너리"],
      title: "Dictionary",
      summary: "A dictionary stores key-value pairs and lets you look up values by key."
    },
    {
      term: "tokenization",
      aliases: ["tokenize", "tokens", "토큰화"],
      title: "Tokenization",
      summary: "Tokenization splits raw text into smaller units such as words and punctuation."
    },
    {
      term: "lemmatization",
      aliases: ["lemmatize", "lemma", "표제어"],
      title: "Lemmatization",
      summary: "Lemmatization converts a word to its base or dictionary form."
    },
    {
      term: "concordance",
      aliases: ["concord", "kwic", "코퍼스"],
      title: "Concordance",
      summary: "Concordance shows a target word with its surrounding context so you can inspect real usage."
    },
    {
      term: "collocation",
      aliases: ["collocations", "ngram", "n-gram", "결합"],
      title: "Collocation",
      summary: "Collocation analysis looks for words that occur together more often than expected."
    },
    {
      term: "numpy",
      aliases: ["array", "matrix", "vector", "넘파이"],
      title: "NumPy",
      summary: "NumPy provides fast arrays and matrix operations for numerical computation."
    },
    {
      term: "pytorch",
      aliases: ["tensor", "tensors", "파이토치"],
      title: "PyTorch",
      summary: "PyTorch is a deep learning library built around tensors and dynamic computation graphs."
    },
    {
      term: "loop",
      aliases: ["loops", "for", "while", "반복"],
      title: "Loop",
      summary: "A loop repeats a block of code across a sequence or until a condition changes."
    },
    {
      term: "conditional",
      aliases: ["condition", "if", "else", "elif", "조건"],
      title: "Conditional",
      summary: "A conditional lets code branch based on whether an expression is true or false."
    }
  ];

  const supportedTermText = glossary.map((entry) => entry.term).join(", ");
  let lastSelection = "";
  let panelOpen = false;

  addMessage("assistant", [
    `<p>Select one supported term on the page, then click <strong>Explain selection</strong>.</p>`,
    `<p>Supported words: ${escapeHtml(supportedTermText)}</p>`
  ].join(""));

  launcher.addEventListener("click", () => togglePanel(true));
  closeButton.addEventListener("click", () => togglePanel(false));
  selectionButton.addEventListener("click", explainSelection);

  document.addEventListener("selectionchange", () => {
    const text = currentSelectionText();
    if (text) lastSelection = text;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panelOpen) {
      togglePanel(false);
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    addMessage("user", text);
    explainTerm(text);
  });

  promptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.getAttribute("data-prompt") || "";
      input.focus();
    });
  });

  function togglePanel(open) {
    panelOpen = open;
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  }

  function explainSelection() {
    const selection = currentSelectionText() || lastSelection;
    if (!selection) {
      addMessage("assistant", "Select one supported term first. You can highlight a word like `variable`, `function`, or `tokenization`.");
      return;
    }

    addMessage("user", selection);
    explainTerm(selection);
  }

  function explainTerm(rawTerm) {
    const term = normalizeTerm(rawTerm);
    const entry = findEntry(term);

    if (!entry) {
      addMessage("assistant", [
        `<p>I only explain these highlighted terms:</p>`,
        `<p>${escapeHtml(supportedTermText)}</p>`,
        `<p>Try highlighting one of those words exactly.</p>`
      ].join(""));
      return;
    }

    addMessage("assistant", [
      `<p><strong>${escapeHtml(entry.title)}</strong></p>`,
      `<p>${escapeHtml(entry.summary)}</p>`
    ].join(""));
  }

  function findEntry(term) {
    const exact = glossary.find((entry) => normalizeTerm(entry.term) === term);
    if (exact) return exact;

    return glossary.find((entry) => {
      return entry.aliases.some((alias) => normalizeTerm(alias) === term);
    }) || null;
  }

  function currentSelectionText() {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";
    return text ? text : "";
  }

  function normalizeTerm(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")
      .replace(/\s+/g, " ");
  }

  function addMessage(role, content) {
    const html = typeof content === "string"
      ? `<p>${escapeHtml(content)}</p>`
      : content;

    const node = document.createElement("article");
    node.className = `helper-chatbot__message helper-chatbot__message--${role}`;
    node.innerHTML = `<strong>${role === "assistant" ? "Helper" : "You"}</strong>${html}`;
    messages.appendChild(node);
    messages.scrollTop = messages.scrollHeight;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
