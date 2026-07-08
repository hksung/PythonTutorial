(function () {
  const root = document.querySelector("[data-helper-chatbot]");
  if (!root) return;

  const launcher = root.querySelector(".helper-chatbot__launcher");
  const panel = root.querySelector(".helper-chatbot__panel");
  const closeButton = root.querySelector(".helper-chatbot__close");
  const messages = root.querySelector(".helper-chatbot__messages");
  const supportedTermsBlock = root.querySelector("[data-supported-terms]");

  const glossary = [
    {
      term: "python",
      aliases: ["파이썬"],
      title: "Python",
      summary: "Python is a high-level programming language used for general programming, data work, and NLP."
    },
    {
      term: "interpreter",
      aliases: ["interpretation", "인터프리터"],
      title: "Interpreter",
      summary: "An interpreter runs Python code step by step instead of compiling the whole program ahead of time."
    },
    {
      term: "script",
      aliases: ["scripts", "스크립트"],
      title: "Script",
      summary: "A script is a file containing Python code that you run as a program."
    },
    {
      term: "ide",
      aliases: ["vscode", "pycharm", "editor", "에디터"],
      title: "IDE",
      summary: "An IDE is a development environment that helps you edit, run, and debug code."
    },
    {
      term: "notebook",
      aliases: ["colab", "jupyter", "노트북"],
      title: "Notebook",
      summary: "A notebook is an interactive coding environment where you run code in cells."
    },
    {
      term: "environment",
      aliases: ["env", "virtual environment", "가상환경"],
      title: "Environment",
      summary: "An environment is an isolated setup for Python and packages so projects do not conflict."
    },
    {
      term: "venv",
      aliases: ["virtualenv"],
      title: "venv",
      summary: "venv is Python's built-in tool for creating virtual environments."
    },
    {
      term: "conda",
      aliases: ["anaconda", "miniconda"],
      title: "Conda",
      summary: "Conda is a package and environment manager that can handle Python and non-Python dependencies."
    },
    {
      term: "package",
      aliases: ["packages", "library", "libraries"],
      title: "Package",
      summary: "A package is reusable code distributed for installation and import."
    },
    {
      term: "string",
      aliases: ["strings", "문자열"],
      title: "String",
      summary: "A string is text enclosed in quotes."
    },
    {
      term: "integer",
      aliases: ["integers", "int", "정수"],
      title: "Integer",
      summary: "An integer is a whole number with no decimal part."
    },
    {
      term: "float",
      aliases: ["floats", "실수"],
      title: "Float",
      summary: "A float is a number with a decimal point."
    },
    {
      term: "boolean",
      aliases: ["bool", "booleans", "true", "false", "불리언"],
      title: "Boolean",
      summary: "A boolean is a truth value: `True` or `False`."
    },
    {
      term: "none",
      aliases: ["null", "없음"],
      title: "None",
      summary: "None represents the absence of a value."
    },
    {
      term: "assignment",
      aliases: ["reassignment", "대입"],
      title: "Assignment",
      summary: "Assignment stores a value in a variable name."
    },
    {
      term: "indexing",
      aliases: ["index", "indices", "인덱싱"],
      title: "Indexing",
      summary: "Indexing retrieves an item from a sequence by position."
    },
    {
      term: "slicing",
      aliases: ["slice", "슬라이싱"],
      title: "Slicing",
      summary: "Slicing selects a range of items from a sequence."
    },
    {
      term: "concatenation",
      aliases: ["concat", "연결"],
      title: "Concatenation",
      summary: "Concatenation joins values together, such as strings or lists."
    },
    {
      term: "membership",
      aliases: ["in", "멤버십"],
      title: "Membership",
      summary: "Membership checks whether a value exists inside a string, list, or other container."
    },
    {
      term: "mutability",
      aliases: ["mutable", "immutability", "immutable", "가변성"],
      title: "Mutability",
      summary: "Mutability describes whether an object can be changed after creation."
    },
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
      term: "key",
      aliases: ["keys", "키"],
      title: "Key",
      summary: "A key is the lookup label used in a dictionary."
    },
    {
      term: "value",
      aliases: ["values", "값"],
      title: "Value",
      summary: "A value is the data stored or returned by an expression, variable, or dictionary entry."
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
      term: "corpus",
      aliases: ["corpora", "corpus", "코퍼스"],
      title: "Corpus",
      summary: "A corpus is a collection of texts used for analysis."
    },
    {
      term: "collocation",
      aliases: ["collocations", "ngram", "n-gram", "결합"],
      title: "Collocation",
      summary: "Collocation analysis looks for words that occur together more often than expected."
    },
    {
      term: "frequency",
      aliases: ["count", "counts", "빈도"],
      title: "Frequency",
      summary: "Frequency tells you how often a word or item appears."
    },
    {
      term: "regex",
      aliases: ["regular expression", "regular expressions", "정규식"],
      title: "Regex",
      summary: "Regex is a pattern language for matching and searching text."
    },
    {
      term: "pattern",
      aliases: ["patterns", "패턴"],
      title: "Pattern",
      summary: "A pattern is a rule used to match a class of strings or structures."
    },
    {
      term: "kwic",
      aliases: ["key word in context"],
      title: "KWIC",
      summary: "KWIC means Key Word in Context."
    },
    {
      term: "mi",
      aliases: ["mutual information"],
      title: "Mutual Information",
      summary: "Mutual Information is a collocation score that favors rare but exclusive pairs."
    },
    {
      term: "tscore",
      aliases: ["t-score"],
      title: "T-score",
      summary: "T-score is a collocation score that favors frequent and reliable co-occurrences."
    },
    {
      term: "deltap",
      aliases: ["delta p", "delta-p"],
      title: "Delta P",
      summary: "Delta P measures how much one item changes the likelihood of another."
    },
    {
      term: "numpy",
      aliases: ["array", "matrix", "vector", "넘파이"],
      title: "NumPy",
      summary: "NumPy provides fast arrays and matrix operations for numerical computation."
    },
    {
      term: "ndarray",
      aliases: ["np.ndarray"],
      title: "ndarray",
      summary: "ndarray is NumPy's main array data type."
    },
    {
      term: "pytorch",
      aliases: ["tensor", "tensors", "파이토치"],
      title: "PyTorch",
      summary: "PyTorch is a deep learning library built around tensors and dynamic computation graphs."
    },
    {
      term: "tensor",
      aliases: ["tensors", "텐서"],
      title: "Tensor",
      summary: "A tensor is a multi-dimensional array used in machine learning."
    },
    {
      term: "embedding",
      aliases: ["embeddings", "word embedding", "word embeddings"],
      title: "Embedding",
      summary: "An embedding is a vector representation of a word or token."
    },
    {
      term: "batch",
      aliases: ["batches", "배치"],
      title: "Batch",
      summary: "A batch is a group of examples processed together."
    },
    {
      term: "sequence",
      aliases: ["sequential", "sequences", "시퀀스"],
      title: "Sequence",
      summary: "A sequence is ordered data where item position matters."
    },
    {
      term: "gpu",
      aliases: ["cuda", "graphics processing unit"],
      title: "GPU",
      summary: "A GPU is specialized hardware that can accelerate parallel computation."
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

  let panelOpen = false;

  if (supportedTermsBlock) {
    supportedTermsBlock.replaceChildren(
      ...glossary.map((entry) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "helper-chatbot__term";
        button.textContent = entry.term;
        button.addEventListener("click", () => explainTerm(entry.term));
        return button;
      })
    );
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panelOpen) {
      togglePanel(false);
    }
  });

  launcher.addEventListener("click", () => togglePanel(true));
  closeButton.addEventListener("click", () => togglePanel(false));

  addMessage("assistant", {
    html: "<p>Click a supported term below to see its explanation.</p>"
  });

  function togglePanel(open) {
    panelOpen = open;
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
  }

  function explainTerm(rawTerm) {
    const term = normalizeTerm(rawTerm);
    const entry = findEntry(term);

    if (!entry) {
      addMessage("assistant", {
        html: [
          `<p>I only explain these highlighted terms:</p>`,
          `<pre class="helper-chatbot__terms">${escapeHtml(glossary.map((item) => item.term).join("\n"))}</pre>`,
          `<p>Try highlighting one of those words exactly.</p>`
        ].join("")
      });
      return;
    }

    addMessage("assistant", {
      html: [
        `<p><strong>${escapeHtml(entry.title)}</strong></p>`,
        `<p>${escapeHtml(entry.summary)}</p>`
      ].join("")
    });
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
