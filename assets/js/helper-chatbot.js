(function () {
  const root = document.querySelector("[data-helper-chatbot]");
  if (!root) return;

  const launcher = root.querySelector(".helper-chatbot__launcher");
  const panel = root.querySelector(".helper-chatbot__panel");
  const closeButton = root.querySelector(".helper-chatbot__close");
  const messages = root.querySelector(".helper-chatbot__messages");
  const termsContainer = root.querySelector("[data-supported-terms]");
  const questionForm = root.querySelector("[data-helper-chatbot-form]");
  const questionInput = root.querySelector("[data-helper-chatbot-input]");

  if (!launcher || !panel || !closeButton || !messages) return;

  const glossary = [
    {
      term: "python",
      aliases: [],
      title: "Python",
      summary: "Python is a high-level programming language used for general programming, data work, and NLP."
    },
    {
      term: "interpreter",
      aliases: ["interpretation"],
      title: "Interpreter",
      summary: "An interpreter runs Python code step by step instead of compiling the whole program ahead of time.",
      example: "python -c \"print('Hello')\""
    },
    {
      term: "script",
      aliases: ["scripts"],
      title: "Script",
      summary: "A script is a file containing Python code that you run as a program.",
      example: "# save as hello.py\\nprint('Hello, World!')\\n# Then run: python hello.py"
    },
    {
      term: "ide",
      aliases: ["vscode", "pycharm", "editor"],
      title: "IDE",
      summary: "An IDE is a development environment that helps you edit, run, and debug code.",
      example: "VS Code, PyCharm, Jupyter"
    },
    {
      term: "notebook",
      aliases: ["colab", "jupyter"],
      title: "Notebook",
      summary: "A notebook is an interactive coding environment where you run code in cells.",
      example: "Google Colab, Jupyter Notebook"
    },
    {
      term: "environment",
      aliases: ["env", "virtual environment"],
      title: "Environment",
      summary: "An environment is an isolated setup for Python and packages so projects do not conflict.",
      example: "Python 3.9 + numpy 1.20 vs Python 3.8 + numpy 1.19"
    },
    {
      term: "venv",
      aliases: ["virtualenv"],
      title: "venv",
      summary: "venv is Python's built-in tool for creating virtual environments.",
      example: "python -m venv myenv"
    },
    {
      term: "conda",
      aliases: ["anaconda", "miniconda"],
      title: "Conda",
      summary: "Conda is a package and environment manager that can handle Python and non-Python dependencies.",
      example: "conda create -n myenv python=3.9"
    },
    {
      term: "package",
      aliases: ["packages", "library", "libraries"],
      title: "Package",
      summary: "A package is reusable code distributed for installation and import.",
      example: "import numpy  # numpy is a package"
    },
    {
      term: "string",
      aliases: ["strings"],
      title: "String",
      summary: "A string is text enclosed in quotes.",
      example: "greeting = \"Hello, World!\""
    },
    {
      term: "integer",
      aliases: ["integers", "int"],
      title: "Integer",
      summary: "An integer is a whole number with no decimal part.",
      example: "age = 25"
    },
    {
      term: "float",
      aliases: ["floats"],
      title: "Float",
      summary: "A float is a number with a decimal point.",
      example: "price = 19.99"
    },
    {
      term: "boolean",
      aliases: ["bool", "booleans", "true", "false"],
      title: "Boolean",
      summary: "A boolean is a truth value: `True` or `False`.",
      example: "is_active = True"
    },
    {
      term: "variable",
      aliases: ["variables"],
      title: "Variable",
      summary: "A variable stores a value under a name. You can reuse that name later instead of rewriting the value.",
      example: "x = 10  # Store 10 in variable x"
    },
    {
      term: "list",
      aliases: ["lists"],
      title: "List",
      summary: "A list is an ordered and mutable collection. You can index it, slice it, append to it, and replace items.",
      example: "fruits = [\"apple\", \"banana\", \"cherry\"]"
    },
    {
      term: "tuple",
      aliases: ["tuples"],
      title: "Tuple",
      summary: "A tuple is like a list, but immutable. Its contents cannot be changed after creation.",
      example: "colors = (\"red\", \"green\", \"blue\")"
    },
    {
      term: "dictionary",
      aliases: ["dictionaries", "dict"],
      title: "Dictionary",
      summary: "A dictionary stores key-value pairs and lets you look up values by key.",
      example: "person = {\"name\": \"Alice\", \"age\": 30}"
    },
    {
      term: "function",
      aliases: ["functions"],
      title: "Function",
      summary: "A function is a reusable block of code that can take inputs and return a result.",
      example: "def greet(name):\\n  return \"Hello, \" + name"
    },
    {
      term: "method",
      aliases: ["methods"],
      title: "Method",
      summary: "A method is a function attached to an object, such as `lower()` or `split()` on a string.",
      example: "text = \"HELLO\"\\ntext.lower()  # Returns \"hello\""
    },
    {
      term: "mutability",
      aliases: ["mutable", "immutability", "immutable"],
      title: "Mutability",
      summary: "Mutability describes whether an object can be changed after creation.",
      example: "lst = [1, 2]; lst[0] = 99  # Mutable (can change)"
    },
    {
      term: "corpus",
      aliases: ["corpora", "corpus"],
      title: "Corpus",
      summary: "A corpus is a collection of texts used for analysis.",
      example: "500 Shakespeare plays, 1 million tweets"
    },
    {
      term: "collocation",
      aliases: ["collocations", "ngram", "n-gram"],
      title: "Collocation",
      summary: "Collocation analysis looks for words that occur together more often than expected.",
      example: "\"machine learning\" occurs together more often than chance"
    },
    {
      term: "frequency",
      aliases: ["count", "counts"],
      title: "Frequency",
      summary: "Frequency tells you how often a word or item appears.",
      example: "In a 1000-word text, 'the' appears 50 times"
    },
    {
      term: "regex",
      aliases: ["regular expression", "regular expressions"],
      title: "Regex",
      summary: "Regex is a pattern language for matching and searching text.",
      example: "r'\\d+' matches any number"
    },
    {
      term: "pattern",
      aliases: ["patterns"],
      title: "Pattern",
      summary: "A pattern is a rule used to match a class of strings or structures.",
      example: "/[a-z]+/ matches lowercase words"
    },
    {
      term: "kwic",
      aliases: ["key word in context"],
      title: "KWIC",
      summary: "KWIC means Key Word in Context.",
      example: "...students often **fail** exams when..."
    },
    {
      term: "mi",
      aliases: ["mutual information"],
      title: "Mutual Information",
      summary: "Mutual Information is a collocation score that favors rare but exclusive pairs.",
      example: "Strong signal for uncommon word pairs"
    },
    {
      term: "tscore",
      aliases: ["t-score"],
      title: "T-score",
      summary: "T-score is a collocation score that favors frequent and reliable co-occurrences.",
      example: "Picks common reliable pairs like 'machine learning'"
    },
    {
      term: "deltap",
      aliases: ["delta p", "delta-p"],
      title: "Delta P",
      summary: "Delta P measures how much one item changes the likelihood of another.",
      example: "P(B|A) - P(B|not A) = how much A predicts B"
    },
    {
      term: "concatenation",
      aliases: ["concat", "combine", "join"],
      title: "Concatenation",
      summary: "Concatenation joins strings or sequences end-to-end.",
      example: "\"Hello\" + \" \" + \"World\"  # \"Hello World\""
    },
    {
      term: "membership",
      aliases: ["in", "contains"],
      title: "Membership",
      summary: "Membership checks if an item is in a collection.",
      example: "\"a\" in \"apple\"  # True"
    },
    {
      term: "key",
      aliases: ["keys", "dictionary key"],
      title: "Key",
      summary: "A key is the index used to look up a value in a dictionary.",
      example: "d = {'name': 'Alice'}\\nkey is 'name'"
    },
    {
      term: "value",
      aliases: ["values", "dictionary value"],
      title: "Value",
      summary: "A value is the data associated with a key in a dictionary.",
      example: "d = {'name': 'Alice'}\\nvalue is 'Alice'"
    },
    {
      term: "none",
      aliases: ["none", "null", "nil"],
      title: "None",
      summary: "None represents the absence of a value in Python.",
      example: "x = None  # x is empty/undefined"
    },
    {
      term: "numpy",
      aliases: ["array", "matrix", "vector"],
      title: "NumPy",
      summary: "NumPy provides fast arrays and matrix operations for numerical computation.",
      example: "import numpy as np\\na = np.array([1, 2, 3])"
    },
    {
      term: "ndarray",
      aliases: ["np.ndarray"],
      title: "ndarray",
      summary: "ndarray is NumPy's main array data type.",
      example: "np.array([[1, 2], [3, 4]])  # 2D array"
    },
    {
      term: "pytorch",
      aliases: ["tensor", "tensors"],
      title: "PyTorch",
      summary: "PyTorch is a deep learning library built around tensors and dynamic computation graphs.",
      example: "import torch\\nt = torch.tensor([1, 2, 3])"
    },
    {
      term: "tensor",
      aliases: ["tensors"],
      title: "Tensor",
      summary: "A tensor is a multi-dimensional array used in machine learning.",
      example: "[1, 2] is 1D, [[1, 2], [3, 4]] is 2D"
    },
    {
      term: "embedding",
      aliases: ["embeddings", "word embedding", "word embeddings"],
      title: "Embedding",
      summary: "An embedding is a vector representation of a word or token.",
      example: "\"king\" → [0.2, 0.5, -0.3, ...]"
    },
    {
      term: "batch",
      aliases: ["batches"],
      title: "Batch",
      summary: "A batch is a group of examples processed together.",
      example: "Process 32 examples per batch during training"
    },
    {
      term: "sequence",
      aliases: ["sequential", "sequences"],
      title: "Sequence",
      summary: "A sequence is ordered data where item position matters.",
      example: "\"The cat sat\" - word order is crucial"
    },
    {
      term: "gpu",
      aliases: ["cuda", "graphics processing unit"],
      title: "GPU",
      summary: "A GPU is specialized hardware that can accelerate parallel computation.",
      example: "GPU is 10-100x faster than CPU for matrix operations"
    },
    {
      term: "loop",
      aliases: ["loops", "for", "while"],
      title: "Loop",
      summary: "A loop repeats a block of code across a sequence or until a condition changes.",
      example: "for i in range(3):\\n  print(i)  # prints 0, 1, 2"
    },
    {
      term: "conditional",
      aliases: ["condition", "if", "else", "elif"],
      title: "Conditional",
      summary: "A conditional lets code branch based on whether an expression is true or false.",
      example: "if x > 5:\\n  print('x is big')\\nelse:\\n  print('x is small')"
    }
  ];

  let panelOpen = false;
  let visibleTerms = [];
  const termExplanationCache = new Map();
  const MAX_VISIBLE_TERMS = 12;
  const MAX_MESSAGES = 14;

  renderRelevantTerms();

  if (termsContainer) {
    termsContainer.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest("[data-term]");
      if (!button) return;

      explainTerm(button.getAttribute("data-term") || button.textContent || "");
    });
  }

  if (questionForm && questionInput instanceof HTMLTextAreaElement) {
    questionForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const question = questionInput.value.trim();
      if (!question) return;

      addMessage("user", question);
      questionInput.value = "";

      await answerQuestion(question);
      questionInput.focus();
    });
  }

  messages.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const removeButton = target.closest("[data-remove-message]");
    if (!removeButton) return;

    const message = removeButton.closest(".helper-chatbot__message");
    if (message && message.parentNode === messages) {
      messages.removeChild(message);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panelOpen) {
      togglePanel(false);
    }
  });

  launcher.addEventListener("click", () => {
    togglePanel(!panelOpen);
  });

  closeButton.addEventListener("click", () => {
    togglePanel(false);
  });

  function togglePanel(open) {
    panelOpen = open;
    panel.hidden = !open;
    panel.setAttribute("aria-hidden", String(!open));
    launcher.setAttribute("aria-expanded", String(open));
  }

  async function explainTerm(rawTerm) {
    const term = normalizeTerm(rawTerm);
    const entry = findEntry(term);

    if (!entry) {
      await answerQuestion(rawTerm);
      return;
    }

    const cacheKey = normalizeTerm(entry.term);
    const cached = termExplanationCache.get(cacheKey);
    if (cached) {
      addMessage("assistant", {
        html: renderExplanationHtml(cached)
      });
      return;
    }

    // Show glossary definition with example if available
    const explanation = {
      title: entry.title,
      summary: entry.summary,
      example: entry.example || "",
      wikipediaUrl: "",
      wikidataId: "",
      wikidataDescription: "",
      wikidataUrl: ""
    };

    termExplanationCache.set(cacheKey, explanation);
    addMessage("assistant", {
      html: renderExplanationHtml(explanation)
    });
  }

  async function answerQuestion(questionText) {
    const query = String(questionText || "").trim();
    if (!query) return;

    const cacheKey = `query:${normalizeTerm(query)}`;
    const cached = termExplanationCache.get(cacheKey);
    if (cached) {
      addMessage("assistant", {
        html: renderExplanationHtml(cached)
      });
      return;
    }

    const glossaryEntry = findBestEntryInQuestion(normalizeForSearch(query));
    if (glossaryEntry) {
      const explanation = {
        title: glossaryEntry.title,
        summary: glossaryEntry.summary,
        example: glossaryEntry.example || "",
        wikipediaUrl: "",
        wikidataId: "",
        wikidataDescription: "",
        wikidataUrl: ""
      };

      termExplanationCache.set(cacheKey, explanation);
      addMessage("assistant", {
        html: renderExplanationHtml(explanation)
      });
      return;
    }

    addMessage("assistant", {
      html: [
        `<p>I could not find a definition for <strong>${escapeHtml(query)}</strong> in the glossary.</p>`,
        `<p>Please ask with a simpler NLP or Python term.</p>`
      ].join("")
    });
  }

  function findBestEntryInQuestion(normalizedQuestion) {
    if (!normalizedQuestion) return null;

    let best = null;
    let bestLength = 0;

    glossary.forEach((entry) => {
      const candidates = [entry.term].concat(entry.aliases || []);
      candidates.forEach((candidate) => {
        const normalizedCandidate = normalizeForSearch(candidate);
        if (!normalizedCandidate) return;
        if (!includesAsWholeTerm(normalizedQuestion, normalizedCandidate)) return;

        if (normalizedCandidate.length > bestLength) {
          best = entry;
          bestLength = normalizedCandidate.length;
        }
      });
    });

    return best;
  }

  function includesAsWholeTerm(haystack, needle) {
    if (!haystack || !needle) return false;

    const escaped = escapeRegExp(needle).replace(/\s+/g, "\\s+");
    const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i");
    return regex.test(haystack);
  }

  function renderExplanationHtml(explanation) {
    const html = [
      `<p><strong>${escapeHtml(explanation.title)}</strong></p>`,
      `<p>${escapeHtml(explanation.summary)}</p>`
    ];

    if (explanation.example) {
      html.push(`<p><em>Example:</em> <code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px;">${escapeHtml(explanation.example)}</code></p>`);
    }

    if (explanation.wikidataDescription
      && normalizeForSearch(explanation.wikidataDescription) !== normalizeForSearch(explanation.summary)) {
      html.push(`<p><em>Wikidata:</em> ${escapeHtml(explanation.wikidataDescription)}</p>`);
    }

    const sources = [];
    if (explanation.wikipediaUrl) {
      sources.push(`<a href="${escapeHtml(explanation.wikipediaUrl)}" target="_blank" rel="noopener noreferrer">Wikipedia</a>`);
    }
    if (explanation.wikidataUrl) {
      sources.push(`<a href="${escapeHtml(explanation.wikidataUrl)}" target="_blank" rel="noopener noreferrer">Wikidata</a>`);
    }
    if (sources.length) {
      html.push(`<p>Source: ${sources.join(" | ")}</p>`);
    }

    return html.join("");
  }

  function findEntry(term) {
    const exact = glossary.find((entry) => normalizeTerm(entry.term) === term);
    if (exact) return exact;

    return glossary.find((entry) => {
      return entry.aliases.some((alias) => normalizeTerm(alias) === term);
    }) || null;
  }

  function normalizeTerm(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")
      .replace(/\s+/g, " ");
  }

  function addMessage(role, content) {
    const message = typeof content === "string"
      ? { title: role === "assistant" ? "Term" : "You", html: `<p>${escapeHtml(content)}</p>` }
      : { title: content.title || (role === "assistant" ? "Term" : "You"), html: content.html || "" };

    const node = document.createElement("article");
    node.className = `helper-chatbot__message helper-chatbot__message--${role}`;
    const dismissButton = role === "assistant"
      ? `<button class="helper-chatbot__message-close" type="button" aria-label="Dismiss this explanation" data-remove-message>x</button>`
      : "";
    node.innerHTML = `<strong>${escapeHtml(message.title)}</strong>${message.html}${dismissButton}`;
    messages.appendChild(node);

    while (messages.children.length > MAX_MESSAGES) {
      messages.removeChild(messages.firstElementChild);
    }

    messages.scrollTop = messages.scrollHeight;
  }

  function renderRelevantTerms() {
    if (!termsContainer) return;

    visibleTerms = getRelevantTerms();

    renderTerms();
  }

  function renderTerms() {
    if (!termsContainer) return;

    termsContainer.innerHTML = "";
    visibleTerms.forEach((entry) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "helper-chatbot__term";
      button.setAttribute("data-term", entry.term);
      button.textContent = entry.term;

      termsContainer.appendChild(button);
    });

    if (!visibleTerms.length) {
      const empty = document.createElement("p");
      empty.className = "helper-chatbot__terms-empty";
      empty.textContent = "All terms hidden. Reload the page to restore the list.";
      termsContainer.appendChild(empty);
    }
  }

  function getRelevantTerms() {
    const text = getPageText();
    const seen = new Set();

    const scored = glossary
      .map((entry) => {
        const terms = [entry.term].concat(entry.aliases || []);
        const positions = terms
          .map((candidate) => findTermPosition(text, candidate))
          .filter((position) => position >= 0);

        if (!positions.length) return null;

        return {
          entry,
          position: Math.min.apply(null, positions)
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.position - b.position);

    const selected = [];
    for (let i = 0; i < scored.length; i += 1) {
      const item = scored[i];
      if (seen.has(item.entry.term)) continue;
      seen.add(item.entry.term);
      selected.push(item.entry);
      if (selected.length >= MAX_VISIBLE_TERMS) break;
    }

    if (selected.length) return selected;

    return glossary.slice(0, MAX_VISIBLE_TERMS);
  }

  function getPageText() {
    const source = getPrimaryContentElement();
    return normalizeForSearch(source ? source.textContent || "" : "");
  }

  function getPrimaryContentElement() {
    const preferred = document.querySelector("main")
      || document.querySelector("article")
      || document.querySelector(".post-content")
      || document.querySelector(".page-content");

    if (preferred) return preferred;

    // Fall back to body clone with non-content regions removed.
    const body = document.body;
    if (!body) return null;

    const clone = body.cloneNode(true);
    if (!(clone instanceof Element)) return body;

    clone.querySelectorAll("nav, footer, header, aside, script, style, [data-helper-chatbot]").forEach((node) => {
      node.remove();
    });

    return clone;
  }

  function normalizeForSearch(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function findTermPosition(text, candidate) {
    const normalized = normalizeForSearch(candidate);
    if (!normalized) return -1;

    const latinNumberOnly = /^[a-z0-9\s-]+$/.test(normalized);
    if (latinNumberOnly) {
      const escaped = escapeRegExp(normalized).replace(/\s+/g, "\\s+");
      const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i");
      const match = regex.exec(text);
      return match ? match.index : -1;
    }

    return text.indexOf(normalized);
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
