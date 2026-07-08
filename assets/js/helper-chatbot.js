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

  const pageTitle = document.querySelector("h1, .page-title, .post-title")?.textContent?.trim() || document.title;
  const main = document.querySelector("main") || document.querySelector(".page-content") || document.body;
  const pageText = collectText(main).slice(0, 18000);
  const sections = collectSections(main);
  const sectionSummary = buildSectionSummary(sections);

  const glossary = [
    {
      terms: ["variable", "variables", "변수"],
      label: "Variable",
      summary: "A variable stores a value under a name. In Python you create one with assignment, and you can reassign it later.",
      tips: ["Use variables to keep intermediate results readable.", "A variable can point to any type: string, number, list, or object."],
      pages: ["2.md", "3.md"]
    },
    {
      terms: ["function", "functions", "함수"],
      label: "Function",
      summary: "A function bundles a reusable action. It can take inputs, do work, and return a result.",
      tips: ["If you repeat logic, turn it into a function.", "Functions are the easiest way to keep code DRY."],
      pages: ["2.md", "4.md"]
    },
    {
      terms: ["method", "methods", "메서드"],
      label: "Method",
      summary: "A method is a function attached to an object, such as `lower()` or `split()` on strings.",
      tips: ["Methods are called with dot syntax like `text.split()`.", "Methods usually operate on the object they belong to."],
      pages: ["2.md", "3.md"]
    },
    {
      terms: ["list", "lists", "리스트"],
      label: "List",
      summary: "A list is an ordered, mutable sequence. You can index, slice, append, and replace items.",
      tips: ["Use lists when the order matters.", "Lists can hold mixed Python objects."],
      pages: ["3.md", "4.md"]
    },
    {
      terms: ["tuple", "tuples", "튜플"],
      label: "Tuple",
      summary: "A tuple is like a list, but immutable. Once created, its contents cannot be changed.",
      tips: ["Use tuples for fixed records and multiple return values.", "Tuples are handy when data should stay unchanged."],
      pages: ["4.md"]
    },
    {
      terms: ["dictionary", "dictionaries", "dict", "딕셔너리"],
      label: "Dictionary",
      summary: "A dictionary stores key-value pairs and lets you look up values by key.",
      tips: ["Use `dict.get(key, default)` when a key may be missing.", "Dictionaries are good for counts, lookups, and metadata."],
      pages: ["4.md", "5.md"]
    },
    {
      terms: ["tokenization", "tokenize", "tokens", "토큰화"],
      label: "Tokenization",
      summary: "Tokenization splits raw text into smaller units such as words and punctuation.",
      tips: ["Tokenization is the first step in many text processing pipelines.", "Different tokenizers handle punctuation and contractions differently."],
      pages: ["5.md"]
    },
    {
      terms: ["lemmatization", "lemmatize", "lemma", "표제어"],
      label: "Lemmatization",
      summary: "Lemmatization converts a token to its dictionary or base form.",
      tips: ["It often depends on part-of-speech information.", "Lemmatization reduces variation like `running` to `run`."],
      pages: ["5.md"]
    },
    {
      terms: ["concordance", "concord", "kwic", "코퍼스"],
      label: "Concordance",
      summary: "Concordance shows a target word with its surrounding context so you can inspect real usage.",
      tips: ["KWIC means Key Word in Context.", "Concordance is useful for spotting patterns in authentic texts."],
      pages: ["6.md"]
    },
    {
      terms: ["collocation", "collocations", "ngram", "n-gram", "결합"],
      label: "Collocation",
      summary: "Collocation analysis looks for words that occur together more often than expected.",
      tips: ["It is often used to study natural phrasing.", "Collocations help with language modeling and corpus analysis."],
      pages: ["7.md"]
    },
    {
      terms: ["numpy", "array", "matrix", "vector", "넘파이"],
      label: "NumPy",
      summary: "NumPy provides fast arrays and matrix operations for numerical computation.",
      tips: ["NumPy arrays are the foundation for many machine learning libraries.", "Use arrays for vectorized arithmetic and indexing."],
      pages: ["numpy.md"]
    },
    {
      terms: ["pytorch", "tensor", "tensors", "파이토치"],
      label: "PyTorch",
      summary: "PyTorch is a deep learning library built around tensors and dynamic computation graphs.",
      tips: ["Tensors generalize scalars, vectors, and matrices.", "PyTorch is widely used for neural network research and production."],
      pages: ["pytorch.md"]
    },
    {
      terms: ["loop", "loops", "for", "while", "반복"],
      label: "Loop",
      summary: "Loops repeat a block of code across a sequence or until a condition changes.",
      tips: ["Use `for` when you iterate over items.", "Use `while` when repetition depends on a condition."],
      pages: ["3.md"]
    },
    {
      terms: ["condition", "conditional", "if", "else", "elif", "조건"],
      label: "Conditional",
      summary: "Conditionals let code branch based on whether an expression is true or false.",
      tips: ["Compare values with `==`, `<`, `>`, and related operators.", "Conditionals are the basis for decision-making in code."],
      pages: ["3.md"]
    }
  ];

  const stopwords = new Set([
    "the", "and", "for", "with", "this", "that", "what", "how", "why", "is", "are", "a", "an",
    "to", "of", "in", "on", "it", "my", "your", "please", "좀", "이", "그", "저", "부분", "설명", "해줘"
  ]);

  const initialMessages = [
    {
      role: "assistant",
      title: "Ready",
      html: [
        `<p>I can explain the current page, a selected term, or a concept from the tutorial.</p>`,
        `<p>Current page: <strong>${escapeHtml(pageTitle)}</strong></p>`,
        sectionSummary ? `<p>Section snapshot: ${escapeHtml(sectionSummary)}</p>` : ""
      ].join("")
    }
  ];

  let panelOpen = false;

  renderMessages(initialMessages);

  launcher.addEventListener("click", () => togglePanel(true));
  closeButton.addEventListener("click", () => togglePanel(false));
  selectionButton.addEventListener("click", () => sendSelection());
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
    pushMessage("user", text);
    pushAnswer(text);
  });

  promptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = button.getAttribute("data-prompt") || "";
      input.value = prompt;
      input.focus();
    });
  });

  function togglePanel(open) {
    panelOpen = open;
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) {
      input.focus();
    }
  }

  function sendSelection() {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      const prompt = `Explain this selected text: ${selection}`;
      pushMessage("user", prompt);
      pushAnswer(prompt, selection);
      return;
    }

    pushMessage("assistant", "No text is selected. Highlight a term on the page, then click Explain selection.");
  }

  function pushAnswer(question, selection = "") {
    const answer = answerQuestion(question, selection);
    pushMessage("assistant", answer);
  }

  function pushMessage(role, content) {
    const message = typeof content === "string"
      ? { role, title: role === "assistant" ? "Helper" : "You", html: `<p>${escapeHtml(content)}</p>` }
      : { role, title: content.title || (role === "assistant" ? "Helper" : "You"), html: content.html };

    const node = document.createElement("article");
    node.className = `helper-chatbot__message helper-chatbot__message--${role}`;
    node.innerHTML = `<strong>${escapeHtml(message.title)}</strong>${message.html}`;
    messages.appendChild(node);
    messages.scrollTop = messages.scrollHeight;
  }

  function renderMessages(entries) {
    messages.innerHTML = "";
    entries.forEach((entry) => pushMessage(entry.role, entry));
  }

  function answerQuestion(question, selection) {
    const normalized = normalize(question);
    const matched = findGlossaryMatch(normalized, selection);

    if (matched) {
      return {
        title: matched.label,
        html: [
          `<p>${escapeHtml(matched.summary)}</p>`,
          matched.tips.length ? `<ul>${matched.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul>` : "",
          matched.pages.length ? `<p>Related pages: ${matched.pages.map((page) => `<a href="${escapeHtml(pageUrl(page))}">${escapeHtml(pageTitleFor(page))}</a>`).join(", ")}</p>` : ""
        ].join("")
      };
    }

    if (looksLikeSectionQuestion(normalized)) {
      const bestSection = bestMatchingSection(question);
      if (bestSection) {
        return {
          title: bestSection.title,
          html: [
            `<p>${escapeHtml(bestSection.summary)}</p>`,
            bestSection.link ? `<p>Open section source: <a href="${escapeHtml(bestSection.link)}">${escapeHtml(bestSection.pageTitle)}</a></p>` : "",
            bestSection.keypoints.length ? `<ul>${bestSection.keypoints.slice(0, 3).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>` : ""
          ].join("")
        };
      }
    }

    const hits = extractRelevantSentences(question, pageText, 4);
    if (hits.length) {
      return {
        title: "From this page",
        html: [
          `<p>I could not map that directly to the glossary, but these lines look relevant:</p>`,
          `<ul>${hits.map((hit) => `<li>${escapeHtml(hit)}</li>`).join("")}</ul>`,
          sectionSummary ? `<p>Tip: the page context suggests <strong>${escapeHtml(sectionSummary)}</strong>.</p>` : ""
        ].join("")
      };
    }

    return {
      title: "Try this",
      html: [
        `<p>I could not match that yet. Try asking about one of these topics:</p>`,
        `<ul><li>variable</li><li>function</li><li>list</li><li>tokenization</li><li>concordance</li><li>NumPy</li><li>PyTorch</li></ul>`,
        `<p>You can also highlight a word on the page and click <strong>Explain selection</strong>.</p>`
      ].join("")
    };
  }

  function findGlossaryMatch(question, selection) {
    const selected = normalize(selection);
    const questionTokens = tokenize(question);
    const combined = new Set([question, selected, ...questionTokens]);

    for (const entry of glossary) {
      if (entry.terms.some((term) => combinedHas(combined, term))) {
        return entry;
      }
    }

    return null;
  }

  function bestMatchingSection(question) {
    if (!sections.length) return null;

    const tokens = tokenize(question);
    let best = null;

    for (const section of sections) {
      const score = scoreText(tokens, section.title + " " + section.text);
      if (!best || score > best.score) {
        best = { ...section, score };
      }
    }

    return best && best.score > 0 ? best : null;
  }

  function looksLikeSectionQuestion(question) {
    return /(section|page|this part|here|이 부분|이 페이지|설명해줘|요약)/.test(question);
  }

  function extractRelevantSentences(question, text, limit) {
    const sentences = text
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+|\n+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);

    const tokens = tokenize(question);
    const scored = sentences
      .map((sentence) => ({ sentence, score: scoreText(tokens, sentence) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored.map((item) => item.sentence);
  }

  function buildSectionSummary(sectionData) {
    if (!sectionData.length) return "";

    const first = sectionData[0];
    const last = sectionData[Math.min(sectionData.length - 1, 2)];
    if (first && last) {
      return `${first.title}${first.title !== last.title ? `, then ${last.title}` : ""}`;
    }

    return first?.title || "";
  }

  function collectText(node) {
    return (node?.innerText || node?.textContent || "").trim();
  }

  function collectSections(node) {
    const headings = Array.from(node.querySelectorAll("h1, h2, h3, h4"));
    return headings.map((heading, index) => {
      const title = heading.textContent.trim();
      const level = Number(heading.tagName.slice(1));
      const fragments = [];
      let current = heading.nextElementSibling;

      while (current) {
        if (/^H[1-4]$/.test(current.tagName) && Number(current.tagName.slice(1)) <= level) break;
        const text = (current.innerText || current.textContent || "").trim();
        if (text) fragments.push(text);
        current = current.nextElementSibling;
      }

      const pageTitle = document.querySelector("title")?.textContent?.trim() || title;
      return {
        title,
        text: fragments.join(" ").slice(0, 2500),
        summary: fragments[0] ? fragments[0].slice(0, 220) : "Section content from the current page.",
        keypoints: fragments.slice(0, 3).map((item) => item.split("\n")[0]).filter(Boolean),
        link: location.href,
        pageTitle
      };
    });
  }

  function tokenize(text) {
    return normalize(text)
      .split(" ")
      .map((token) => token.trim())
      .filter((token) => token && token.length > 1 && !stopwords.has(token));
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function scoreText(tokens, text) {
    const haystack = normalize(text);
    let score = 0;

    for (const token of tokens) {
      if (!token) continue;
      if (haystack.includes(token)) score += token.length >= 5 ? 2 : 1;
    }

    return score;
  }

  function combinedHas(collection, term) {
    const normalizedTerm = normalize(term);
    for (const value of collection) {
      if (normalize(value).includes(normalizedTerm)) return true;
    }
    return false;
  }

  function pageUrl(source) {
    const entry = (window.PYTHON_TUTORIAL_HELPER?.pages || []).find((page) => samePage(page.url, source));
    return entry?.url || source;
  }

  function pageTitleFor(source) {
    const entry = (window.PYTHON_TUTORIAL_HELPER?.pages || []).find((page) => samePage(page.url, source));
    return entry?.title || source;
  }

  function samePage(left, right) {
    return pageKey(left) === pageKey(right);
  }

  function pageKey(value) {
    return String(value || "")
      .split("?")[0]
      .split("#")[0]
      .replace(/\/$/, "")
      .split("/")
      .pop()
      .replace(/\.(md|html?)$/i, "");
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
