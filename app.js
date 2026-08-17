"use strict";

const STORAGE_KEY = "career-compass-v1";

const scaleSets = {
  interest: [
    [1, "Strongly dislike"], [2, "Dislike"], [3, "Unsure"], [4, "Like"], [5, "Strongly like"]
  ],
  personality: [
    [1, "Very inaccurate"], [2, "Inaccurate"], [3, "Neutral"], [4, "Accurate"], [5, "Very accurate"]
  ],
  values: [
    [1, "Not important"], [2, "Slightly"], [3, "Important"], [4, "Very important"], [5, "Essential"]
  ],
  readiness: [
    [1, "Little evidence"], [2, "Some doubts"], [3, "Developing"], [4, "Good evidence"], [5, "Strong evidence"]
  ]
};

const interestMeta = {
  R: { name: "Realistic", color: "#47a798", description: "building, making, fixing, fieldwork, and practical systems" },
  I: { name: "Investigative", color: "#6c9cff", description: "researching, analyzing, explaining, and solving complex questions" },
  A: { name: "Artistic", color: "#a485dc", description: "creating, designing, expressing, and working with open-ended ideas" },
  S: { name: "Social", color: "#f06e42", description: "teaching, supporting, understanding, and developing people" },
  E: { name: "Enterprising", color: "#f3a257", description: "leading, persuading, initiating, and making decisions" },
  C: { name: "Conventional", color: "#d0aa38", description: "organizing, checking, structuring, and managing information" }
};

const valueMeta = {
  achievement: { name: "Achievement", description: "using your abilities, mastering difficult work, and seeing meaningful results" },
  independence: { name: "Independence", description: "having room to choose methods, think for yourself, and shape your work" },
  recognition: { name: "Recognition", description: "gaining responsibility, influence, advancement, or visible respect" },
  relationships: { name: "Relationships", description: "helping people, cooperating, and acting in line with your ethics" },
  support: { name: "Support", description: "having fair leadership, useful feedback, mentoring, and reliable resources" },
  conditions: { name: "Working conditions", description: "having stability, fair rewards, safety, and a sustainable life outside work" }
};

const readinessMeta = {
  math: "Mathematics & quantitative reasoning",
  physical: "Physics & chemistry",
  life: "Biology & health science",
  computing: "Computing & data",
  writing: "Writing & languages",
  society: "History & social systems",
  creative: "Visual, musical & creative work",
  people: "Teaching, listening & teamwork",
  practical: "Building, making & fieldwork"
};

// Original activity-interest items, organized using the RIASEC framework.
const interestItems = [
  { id: "i01", area: "R", text: "Build or repair a physical device so that it works properly" },
  { id: "i02", area: "I", text: "Investigate why a result does not match what was predicted" },
  { id: "i03", area: "A", text: "Create a story, image, performance, or piece of music" },
  { id: "i04", area: "S", text: "Explain a difficult idea until someone else understands it" },
  { id: "i05", area: "E", text: "Persuade a group to support an idea you believe in" },
  { id: "i06", area: "C", text: "Maintain accurate records that other people depend on" },
  { id: "i07", area: "R", text: "Work outdoors to inspect a site or collect useful samples" },
  { id: "i08", area: "I", text: "Analyze a set of data to find patterns and exceptions" },
  { id: "i09", area: "A", text: "Improve a design so it communicates a stronger mood or message" },
  { id: "i10", area: "S", text: "Listen carefully and help someone think through a personal problem" },
  { id: "i11", area: "E", text: "Lead a team when a decision has to be made" },
  { id: "i12", area: "C", text: "Organize a schedule, budget, or set of resources" },
  { id: "i13", area: "R", text: "Learn by using tools or equipment, not only by reading about them" },
  { id: "i14", area: "I", text: "Read deeply about a scientific or social question" },
  { id: "i15", area: "A", text: "Express an ordinary idea in an original or memorable way" },
  { id: "i16", area: "S", text: "Support another person as they learn, recover, or grow" },
  { id: "i17", area: "E", text: "Pitch a new project to people who could make it happen" },
  { id: "i18", area: "C", text: "Check detailed work for errors before it is submitted" },
  { id: "i19", area: "R", text: "Design and test a prototype that has to work in the real world" },
  { id: "i20", area: "I", text: "Plan a fair experiment or study to answer a question" },
  { id: "i21", area: "A", text: "Develop a concept where there is no single correct answer" },
  { id: "i22", area: "S", text: "Join a team project that directly serves a community" },
  { id: "i23", area: "E", text: "Start a small venture, campaign, club, or initiative" },
  { id: "i24", area: "C", text: "Use clear procedures to keep a complex process reliable" },
  { id: "i25", area: "R", text: "Troubleshoot how a machine, material, or physical system works" },
  { id: "i26", area: "I", text: "Solve a multi-step problem that requires abstract reasoning" },
  { id: "i27", area: "A", text: "Edit writing, audio, photography, or video until it feels right" },
  { id: "i28", area: "S", text: "Study why people behave, feel, or learn differently" },
  { id: "i29", area: "E", text: "Negotiate an agreement between people with competing goals" },
  { id: "i30", area: "C", text: "Sort and categorize a large amount of information systematically" },
  { id: "i31", area: "R", text: "Coordinate practical work in a lab, workshop, kitchen, clinic, or field site" },
  { id: "i32", area: "I", text: "Compare competing explanations and decide which has better evidence" },
  { id: "i33", area: "A", text: "Notice and discuss style, symbolism, composition, or visual detail" },
  { id: "i34", area: "S", text: "Give someone constructive feedback or coaching" },
  { id: "i35", area: "E", text: "Take responsibility for a result even when there is uncertainty" },
  { id: "i36", area: "C", text: "Plan a project step by step and track it through completion" }
];

// Public-domain Mini-IPIP items (Donnellan et al., 2006), retained in their published order.
const personalityItems = [
  { id: "p01", trait: "E", text: "I am the life of the party." },
  { id: "p02", trait: "A", text: "I sympathize with others’ feelings." },
  { id: "p03", trait: "C", text: "I get chores done right away." },
  { id: "p04", trait: "N", text: "I have frequent mood swings." },
  { id: "p05", trait: "O", text: "I have a vivid imagination." },
  { id: "p06", trait: "E", reverse: true, text: "I don’t talk a lot." },
  { id: "p07", trait: "A", reverse: true, text: "I am not interested in other people’s problems." },
  { id: "p08", trait: "C", reverse: true, text: "I often forget to put things back in their proper place." },
  { id: "p09", trait: "N", reverse: true, text: "I am relaxed most of the time." },
  { id: "p10", trait: "O", reverse: true, text: "I am not interested in abstract ideas." },
  { id: "p11", trait: "E", text: "I talk to a lot of different people at parties." },
  { id: "p12", trait: "A", text: "I feel others’ emotions." },
  { id: "p13", trait: "C", text: "I like order." },
  { id: "p14", trait: "N", text: "I get upset easily." },
  { id: "p15", trait: "O", reverse: true, text: "I have difficulty understanding abstract ideas." },
  { id: "p16", trait: "E", reverse: true, text: "I keep in the background." },
  { id: "p17", trait: "A", reverse: true, text: "I am not really interested in others." },
  { id: "p18", trait: "C", reverse: true, text: "I make a mess of things." },
  { id: "p19", trait: "N", reverse: true, text: "I seldom feel blue." },
  { id: "p20", trait: "O", reverse: true, text: "I do not have a good imagination." }
];

const valueItems = [
  { id: "v01", value: "achievement", text: "A future career lets me use my strongest abilities on demanding work" },
  { id: "v02", value: "independence", text: "I have room to choose how I approach problems and complete my work" },
  { id: "v03", value: "recognition", text: "Strong performance can lead to responsibility, influence, or advancement" },
  { id: "v04", value: "relationships", text: "My work helps people and does not require me to act against my values" },
  { id: "v05", value: "support", text: "I can learn from fair leaders, mentors, or experienced colleagues" },
  { id: "v06", value: "conditions", text: "My work offers reasonable stability, safety, and financial security" },
  { id: "v07", value: "achievement", text: "I can see meaningful results and keep developing real expertise" },
  { id: "v08", value: "independence", text: "I can think for myself and shape part of the direction of my work" },
  { id: "v09", value: "recognition", text: "My contribution is visible, respected, and trusted by others" },
  { id: "v10", value: "relationships", text: "Cooperation, kindness, and useful service are part of everyday work" },
  { id: "v11", value: "support", text: "The organization gives people clear feedback and the resources to succeed" },
  { id: "v12", value: "conditions", text: "The career can support a sustainable life outside work over the long term" }
];

const readinessItems = [
  { id: "r01", area: "math", text: "Mathematics and quantitative reasoning" },
  { id: "r02", area: "physical", text: "Physics and chemistry" },
  { id: "r03", area: "life", text: "Biology and health science" },
  { id: "r04", area: "computing", text: "Computing, coding, spreadsheets, or data" },
  { id: "r05", area: "writing", text: "Writing, reading, languages, and presenting ideas" },
  { id: "r06", area: "society", text: "History, society, politics, and human systems" },
  { id: "r07", area: "creative", text: "Visual, musical, literary, or other creative work" },
  { id: "r08", area: "people", text: "Listening, teaching, teamwork, and supporting people" },
  { id: "r09", area: "practical", text: "Building, making, physical practice, or outdoor fieldwork" }
];

const studyFamilies = [
  {
    name: "Engineering & technology",
    interests: { R: .45, I: .40, C: .15 }, readiness: ["math", "physical", "practical"],
    values: { achievement: .50, independence: .30, support: .20 },
    majors: ["Mechanical engineering", "Electrical engineering", "Civil engineering", "Mechatronics"],
    experiment: "Build or simulate a small device, then write down which part—design, maths, testing, or troubleshooting—you enjoyed."
  },
  {
    name: "Computing & data",
    interests: { I: .45, C: .25, R: .15, A: .15 }, readiness: ["computing", "math"],
    values: { achievement: .45, independence: .35, conditions: .20 },
    majors: ["Computer science", "Software engineering", "Data science", "Cybersecurity"],
    experiment: "Complete one beginner coding or data-analysis exercise and notice whether debugging makes you curious or only frustrated."
  },
  {
    name: "Natural & physical sciences",
    interests: { I: .65, R: .20, C: .15 }, readiness: ["math", "physical"],
    values: { achievement: .55, independence: .30, support: .15 },
    majors: ["Physics", "Chemistry", "Mathematics", "Earth science"],
    experiment: "Watch an introductory university lecture, attempt one problem set, and compare your interest before and after the difficult part."
  },
  {
    name: "Health & medicine",
    interests: { I: .45, S: .35, R: .20 }, readiness: ["life", "physical", "people"],
    values: { achievement: .40, relationships: .40, support: .20 },
    majors: ["Medicine", "Nursing", "Pharmacy", "Dentistry", "Medical laboratory science"],
    experiment: "Interview a health student or practitioner about an ordinary day—including paperwork, pressure, and patient contact—not just the highlights."
  },
  {
    name: "Psychology & behavioral sciences",
    interests: { S: .40, I: .35, A: .15, E: .10 }, readiness: ["people", "writing", "society"],
    values: { relationships: .50, achievement: .30, support: .20 },
    majors: ["Psychology", "Sociology", "Behavioral science", "Social work"],
    experiment: "Read a real introductory research paper summary and explain what the evidence does—and does not—show to someone else."
  },
  {
    name: "Education & human development",
    interests: { S: .55, A: .20, E: .15, C: .10 }, readiness: ["people", "writing"],
    values: { relationships: .55, support: .30, achievement: .15 },
    majors: ["Education", "Special education", "Early childhood", "Educational technology"],
    experiment: "Teach a 15-minute mini-lesson, then ask the learner what was clear and what was confusing."
  },
  {
    name: "Business & entrepreneurship",
    interests: { E: .50, C: .20, S: .20, I: .10 }, readiness: ["math", "writing", "people"],
    values: { recognition: .40, achievement: .35, independence: .25 },
    majors: ["Business administration", "Marketing", "Management", "Entrepreneurship"],
    experiment: "Create a one-page plan for solving a real customer problem and ask three people whether they would use the solution."
  },
  {
    name: "Economics, finance & accounting",
    interests: { C: .40, E: .30, I: .30 }, readiness: ["math", "computing"],
    values: { achievement: .40, recognition: .30, conditions: .30 },
    majors: ["Economics", "Finance", "Accounting", "Actuarial science"],
    experiment: "Analyze a simple budget, company report, or economic dataset and explain the most important pattern you found."
  },
  {
    name: "Law, policy & international affairs",
    interests: { E: .35, S: .25, I: .25, A: .15 }, readiness: ["writing", "society", "people"],
    values: { recognition: .35, achievement: .35, relationships: .30 },
    majors: ["Law", "Political science", "Public policy", "International relations"],
    experiment: "Read two opposing arguments on one issue, write the strongest case for each, and decide what evidence would change your mind."
  },
  {
    name: "Arts, media & communication",
    interests: { A: .55, E: .20, S: .15, R: .10 }, readiness: ["creative", "writing"],
    values: { independence: .40, recognition: .35, achievement: .25 },
    majors: ["Graphic design", "Film and media", "Journalism", "Fine arts", "Communication"],
    experiment: "Finish and share one small creative piece under a deadline, then notice whether revision energizes you or drains you."
  },
  {
    name: "Architecture & built environment",
    interests: { A: .35, R: .30, I: .25, C: .10 }, readiness: ["creative", "math", "physical"],
    values: { achievement: .45, independence: .35, recognition: .20 },
    majors: ["Architecture", "Urban planning", "Interior architecture", "Landscape architecture"],
    experiment: "Redesign a small space for a real user, working within measurements, budget, and accessibility constraints."
  },
  {
    name: "Humanities & languages",
    interests: { A: .45, I: .30, S: .20, C: .05 }, readiness: ["writing", "society"],
    values: { independence: .40, achievement: .35, relationships: .25 },
    majors: ["Literature", "Languages", "History", "Philosophy", "Linguistics"],
    experiment: "Compare two interpretations of a text or historical event and defend your own reading with specific evidence."
  },
  {
    name: "Environmental & agricultural sciences",
    interests: { I: .40, R: .35, S: .15, C: .10 }, readiness: ["life", "physical", "practical"],
    values: { achievement: .40, relationships: .35, independence: .25 },
    majors: ["Environmental science", "Agriculture", "Ecology", "Food science"],
    experiment: "Investigate one local environmental or food-system problem using observations, measurements, or public data."
  },
  {
    name: "Hospitality, tourism & events",
    interests: { E: .35, S: .35, C: .20, R: .10 }, readiness: ["people", "writing", "practical"],
    values: { relationships: .40, recognition: .30, conditions: .30 },
    majors: ["Hospitality management", "Tourism", "Event management", "Culinary management"],
    experiment: "Help plan and run a real small event, then reflect on whether guest contact and last-minute problem-solving suited you."
  },
  {
    name: "Sport, movement & rehabilitation",
    interests: { R: .35, S: .35, I: .20, E: .10 }, readiness: ["life", "people", "practical"],
    values: { relationships: .45, achievement: .35, support: .20 },
    majors: ["Physiotherapy", "Sport science", "Occupational therapy", "Exercise science"],
    experiment: "Observe or help lead a safe training, movement, or rehabilitation session and ask what science guides each activity."
  }
];

function chunk(items, size) {
  const result = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}

const pages = [
  ...chunk(interestItems, 6).map((items, index) => ({
    type: "interest", items, stage: "Interests", kicker: `Part 1 • Activity interests • ${index + 1} of 6`,
    title: "What would you enjoy doing?", help: "Rate the activity itself—not whether you are already good at it or have had the chance to try it."
  })),
  ...chunk(personalityItems, 5).map((items, index) => ({
    type: "personality", items, stage: "Work style", kicker: `Part 2 • Personality tendencies • ${index + 1} of 4`,
    title: "How accurately does this describe you?", help: "Think about your usual behavior across the last year, not just your best day or your worst week."
  })),
  ...chunk(valueItems, 6).map((items, index) => ({
    type: "values", items, stage: "Values", kicker: `Part 3 • Future work values • ${index + 1} of 2`,
    title: "How important would this be?", help: "Rate the working life you would want—not the job title you think you should choose."
  })),
  ...chunk(readinessItems, 5).map((items, index) => ({
    type: "readiness", items, stage: "Readiness", kicker: `Part 4 • Current evidence • ${index + 1} of 2`,
    title: "What does your evidence say so far?", help: "Use classes, projects, hobbies, and feedback. A low score means “investigate or build,” not “never.”"
  }))
];

const welcomeView = document.querySelector("#welcome-view");
const assessmentView = document.querySelector("#assessment-view");
const resultsView = document.querySelector("#results-view");
const startButton = document.querySelector("#start-button");
const questionForm = document.querySelector("#question-form");
const questionsNode = document.querySelector("#questions");
const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");
const formError = document.querySelector("#form-error");
const saveStatus = document.querySelector("#save-status");
const methodDialog = document.querySelector("#method-dialog");

let state = loadState();

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && parsed.answers && typeof parsed.answers === "object") {
      return {
        answers: parsed.answers,
        page: Math.min(Math.max(Number(parsed.page) || 0, 0), pages.length - 1),
        completed: Boolean(parsed.completed)
      };
    }
  } catch (_) {
    // A fresh state is safer than failing when browser storage is unavailable or corrupted.
  }
  return { answers: {}, page: 0, completed: false };
}

function persistState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* storage is optional */ }
}

function showView(view) {
  [welcomeView, assessmentView, resultsView].forEach(node => { node.hidden = node !== view; });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (view === assessmentView || view === resultsView) {
    const heading = view === assessmentView ? document.querySelector("#page-title") : document.querySelector("#results-title");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      window.requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }
  }
}

function startOrResume() {
  if (state.completed && hasAllAnswers()) {
    renderResults();
    return;
  }
  renderPage();
  showView(assessmentView);
}

function hasAllAnswers() {
  const all = [...interestItems, ...personalityItems, ...valueItems, ...readinessItems];
  return all.every(item => Number.isInteger(Number(state.answers[item.id])));
}

function renderPage() {
  const page = pages[state.page];
  const progress = Math.round((state.page / pages.length) * 100);
  document.querySelector("#stage-label").textContent = page.stage;
  document.querySelector("#progress-label").textContent = `Step ${state.page + 1} of ${pages.length}`;
  document.querySelector("#progress-bar").style.width = `${progress}%`;
  document.querySelector(".progress-track").setAttribute("aria-valuenow", String(progress));
  document.querySelector("#section-kicker").textContent = page.kicker;
  document.querySelector("#page-title").textContent = page.title;
  document.querySelector("#page-help").textContent = page.help;
  nextButton.innerHTML = state.page === pages.length - 1 ? "See my compass <span aria-hidden=\"true\">→</span>" : "Continue <span aria-hidden=\"true\">→</span>";
  backButton.innerHTML = state.page === 0 ? "<span aria-hidden=\"true\">←</span> Overview" : "<span aria-hidden=\"true\">←</span> Back";
  formError.hidden = true;

  const labels = scaleSets[page.type];
  questionsNode.innerHTML = page.items.map((item, localIndex) => {
    const overallIndex = getOverallIndex(item.id);
    const options = labels.map(([value, label]) => `
      <label class="answer-option">
        <input type="radio" name="${item.id}" value="${value}" ${Number(state.answers[item.id]) === value ? "checked" : ""}>
        <span class="answer-value">${value}</span>
        <span class="answer-label">${label}</span>
      </label>`).join("");
    return `
      <fieldset class="question-card" data-question="${item.id}">
        <legend><span class="question-number">${String(overallIndex).padStart(2, "0")}</span>${item.text}</legend>
        <div class="answer-row" aria-label="Choose from 1 to 5">${options}</div>
      </fieldset>`;
  }).join("");

  const firstUnchecked = page.items.find(item => !state.answers[item.id]);
  if (firstUnchecked) {
    const field = questionsNode.querySelector(`[data-question="${firstUnchecked.id}"]`);
    if (field) field.scrollIntoView({ block: "nearest" });
  }
}

function getOverallIndex(id) {
  const all = [...interestItems, ...personalityItems, ...valueItems, ...readinessItems];
  return all.findIndex(item => item.id === id) + 1;
}

questionForm.addEventListener("change", event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== "radio") return;
  state.answers[input.name] = Number(input.value);
  state.completed = false;
  persistState();
  input.closest(".question-card")?.classList.remove("has-error");
  formError.hidden = true;
  saveStatus.textContent = "Saved on this device";
  window.setTimeout(() => { saveStatus.textContent = "Answers save automatically"; }, 1400);
});

questionForm.addEventListener("submit", event => {
  event.preventDefault();
  const page = pages[state.page];
  const missing = page.items.filter(item => !state.answers[item.id]);
  questionsNode.querySelectorAll(".question-card").forEach(node => node.classList.remove("has-error"));
  if (missing.length) {
    missing.forEach(item => questionsNode.querySelector(`[data-question="${item.id}"]`)?.classList.add("has-error"));
    formError.hidden = false;
    questionsNode.querySelector(`[data-question="${missing[0].id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (state.page < pages.length - 1) {
    state.page += 1;
    persistState();
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    state.completed = true;
    persistState();
    renderResults();
  }
});

backButton.addEventListener("click", () => {
  if (state.page === 0) {
    showView(welcomeView);
    return;
  }
  state.page -= 1;
  persistState();
  renderPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

startButton.addEventListener("click", startOrResume);
document.querySelector(".brand").addEventListener("click", event => { event.preventDefault(); showView(welcomeView); });
document.querySelector("#footer-method-button").addEventListener("click", () => methodDialog.showModal());

if (state.completed && hasAllAnswers()) {
  startButton.firstChild.textContent = "View my saved compass ";
} else if (Object.keys(state.answers).length) {
  startButton.firstChild.textContent = "Continue my compass ";
}

function normalizedMean(items, valueFn = item => state.answers[item.id]) {
  const values = items.map(valueFn).filter(value => Number.isFinite(value));
  if (!values.length) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(((mean - 1) / 4) * 100);
}

function calculateScores() {
  const interests = {};
  Object.keys(interestMeta).forEach(area => {
    interests[area] = normalizedMean(interestItems.filter(item => item.area === area));
  });

  const personality = {};
  ["E", "A", "C", "N", "O"].forEach(trait => {
    const items = personalityItems.filter(item => item.trait === trait);
    personality[trait] = normalizedMean(items, item => item.reverse ? 6 - state.answers[item.id] : state.answers[item.id]);
  });

  const values = {};
  Object.keys(valueMeta).forEach(value => {
    values[value] = normalizedMean(valueItems.filter(item => item.value === value));
  });

  const readiness = {};
  Object.keys(readinessMeta).forEach(area => {
    readiness[area] = normalizedMean(readinessItems.filter(item => item.area === area));
  });

  const rankedFamilies = studyFamilies.map(family => {
    const interestScore = weightedScore(interests, family.interests);
    const readinessScore = average(family.readiness.map(area => readiness[area]));
    const valueScore = weightedScore(values, family.values);
    const score = Math.round(interestScore * .65 + readinessScore * .20 + valueScore * .15);
    return { ...family, score, interestScore: Math.round(interestScore), readinessScore: Math.round(readinessScore), valueScore: Math.round(valueScore) };
  }).sort((a, b) => b.score - a.score);

  return { interests, personality, values, readiness, rankedFamilies };
}

function weightedScore(scores, weights) {
  const entries = Object.entries(weights);
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  if (!totalWeight) return 0;
  return entries.reduce((sum, [key, weight]) => sum + scores[key] * weight, 0) / totalWeight;
}

function average(numbers) {
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : 0;
}

function renderResults() {
  if (!hasAllAnswers()) {
    state.completed = false;
    persistState();
    renderPage();
    showView(assessmentView);
    return;
  }

  const scores = calculateScores();
  const interestOrder = Object.entries(scores.interests).sort((a, b) => b[1] - a[1]);
  const code = interestOrder.slice(0, 3).map(([key]) => key).join("");
  const topInterestNames = interestOrder.slice(0, 3).map(([key]) => interestMeta[key].name);
  const topFamilies = scores.rankedFamilies.slice(0, 4);
  const wildcard = scores.rankedFamilies[4];
  const topValues = Object.entries(scores.values).sort((a, b) => b[1] - a[1]).slice(0, 2);

  document.querySelector("#results-content").innerHTML = `
    <section class="results-hero" data-code="${code}">
      <p class="eyebrow">Your university exploration compass</p>
      <h1 id="results-title">Your strongest pull is <em>${topInterestNames[0].toLowerCase()}</em>.</h1>
      <p class="result-lede">Your ${code} pattern combines ${topInterestNames.join(", ").toLowerCase()} interests. ${interestPatternNote(interestOrder)} The shortlist below is a set of leads to test—not a prediction of admission, grades, income, or happiness.</p>
      <div class="result-actions">
        <button class="button button-primary" id="print-results" type="button">Print / save PDF <span aria-hidden="true">↗</span></button>
        <button class="button button-secondary" id="review-answers" type="button">Review answers</button>
        <button class="button button-secondary" id="reset-assessment" type="button">Start over</button>
      </div>
    </section>

    <section class="result-section">
      <div class="section-heading">
        <span>01 / INTERESTS</span>
        <div><h2>Your activity-interest profile</h2><p>Scores are positions on this 1–5 response scale, converted to 0–100. They are not percentiles and are most useful in relation to one another.</p></div>
      </div>
      <div class="interest-layout">
        <div class="result-card">
          <h3>All six interest signals</h3>
          <p class="result-card-sub">Look at the full shape, not only the highest letter.</p>
          <div class="score-bars">${renderScoreBars(interestOrder, interestMeta)}</div>
        </div>
        <div class="result-card">
          <h3>Your three-letter compass</h3>
          <div class="code-stack"><strong>${code}</strong><span>top interest pattern</span></div>
          <div class="code-definitions">
            ${interestOrder.slice(0, 3).map(([key]) => `<div class="code-definition"><strong>${key} · ${interestMeta[key].name}</strong><span>${interestMeta[key].description}</span></div>`).join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="result-section">
      <div class="section-heading">
        <span>02 / LEADS</span>
        <div><h2>Study families worth investigating first</h2><p>The exploration score combines activity interests (65%), current readiness evidence (20%), and values (15%). A higher number means “investigate sooner,” not “you will succeed.”</p></div>
      </div>
      <div class="recommendation-grid">
        ${topFamilies.map((family, index) => renderFamilyCard(family, index, scores)).join("")}
      </div>
    </section>

    <section class="result-section">
      <div class="section-heading">
        <span>03 / STYLE</span>
        <div><h2>The study environment to look for</h2><p>These Mini-IPIP Big Five scores describe broad tendencies. They do not decide your subject, and neither end of a trait is “better.”</p></div>
      </div>
      <div class="personality-grid">${renderPersonality(scores.personality)}</div>
      <p class="personality-note">These are response-scale scores, not population percentiles. The brief four-item scales trade detail for speed, so focus on the descriptions you recognize rather than small numerical differences.</p>
    </section>

    <section class="result-section">
      <div class="section-heading">
        <span>04 / VALUES</span>
        <div><h2>What your future working life should protect</h2><p>At 17, values are still developing. Use these priorities as interview questions for students and professionals, then update them as you gain experience.</p></div>
      </div>
      <div class="values-layout">
        <div class="result-card top-values">
          <h3>Your two strongest priorities</h3>
          ${topValues.map(([key, score], index) => `<div class="top-value-item"><span>0${index + 1} · ${score}/100</span><strong>${valueMeta[key].name}</strong><p>${valueMeta[key].description}</p></div>`).join("")}
        </div>
        <div class="result-card">
          <h3>Your current readiness evidence</h3>
          <p class="result-card-sub">Confidence can grow. Use lower areas to identify prerequisites, bridging courses, or a small test project.</p>
          <div class="readiness-grid">${renderReadiness(scores.readiness)}</div>
        </div>
      </div>
    </section>

    <section class="result-section">
      <div class="section-heading">
        <span>05 / ACTION</span>
        <div><h2>Turn the result into better evidence</h2><p>A questionnaire becomes useful when it changes what you investigate next. Complete these steps before making a final program choice.</p></div>
      </div>
      <div class="action-grid">
        <article class="result-card action-card"><h3>Build a comparison set</h3><p>Compare your top three leads plus one deliberately different option. Your wildcard is <strong>${wildcard.name}</strong>.</p></article>
        <article class="result-card action-card"><h3>Run small experiments</h3><ol class="experiment-list">${topFamilies.slice(0, 3).map(family => `<li><strong>${family.name}:</strong> ${family.experiment}</li>`).join("")}</ol></article>
        <article class="result-card action-card"><h3>Check the real course</h3><p>Read first-year module lists, assessment methods, entry requirements, cost, length, accreditation, and switching options at actual universities.</p></article>
        <article class="result-card action-card"><h3>Interview two humans</h3><p>Ask one current student and one recent graduate what an ordinary week looks like, what surprised them, and who tends to dislike the program.</p></article>
      </div>

      <div class="result-card" style="margin-top: 1rem">
        <h3>Blank decision matrix</h3>
        <p class="result-card-sub">After researching, score each category from 1 (poor evidence) to 5 (strong evidence). Do not fill it from impressions alone.</p>
        <div class="decision-table-wrap">
          <table class="decision-table">
            <thead><tr><th>Study family</th><th>Interest</th><th>Entry readiness</th><th>Daily study fit</th><th>Values</th><th>Cost / time</th><th>Notes</th></tr></thead>
            <tbody>
              ${[...topFamilies.slice(0, 3), wildcard].map(family => `<tr><td>${family.name}</td><td>__/5</td><td>__/5</td><td>__/5</td><td>__/5</td><td>__/5</td><td>____________</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <aside class="closing-note">
      <div><h2>The result is a compass, not a cage.</h2><p>Discuss it with a school counselor or another adult who knows both you and the local university system. Bring your grades, program requirements, financial constraints, and the evidence from your mini-experiments.</p></div>
      <button class="button button-primary" id="open-method" type="button">Read method &amp; limits</button>
    </aside>`;

  showView(resultsView);
  bindResultActions();
}

function interestPatternNote(order) {
  const highest = order[0][1];
  const second = order[1][1];
  const lowest = order[order.length - 1][1];
  if (highest < 45) return "Your responses are fairly cautious, so hands-on exploration may teach you more than another questionnaire.";
  if (highest - lowest < 16) return "Your profile is broad, which can suit interdisciplinary programs and makes real course comparisons especially important.";
  if (highest - second < 6) return "Your top interests are close together, so combinations between fields may be more revealing than a single label.";
  return "The difference between your stronger and lower interests gives you a useful direction for a first shortlist.";
}

function renderScoreBars(entries, metadata) {
  return entries.map(([key, score]) => `
    <div class="score-bar">
      <div class="score-bar-head"><strong>${key} · ${metadata[key].name}</strong><span>${score}</span></div>
      <div class="score-track"><span style="width:${score}%;--bar-color:${metadata[key].color}"></span></div>
    </div>`).join("");
}

function renderFamilyCard(family, index, scores) {
  const contributionOrder = Object.entries(family.interests)
    .map(([key, weight]) => ({ key, contribution: weight * scores.interests[key] }))
    .sort((a, b) => b.contribution - a.contribution);
  const leadingInterests = contributionOrder.slice(0, 2).map(item => interestMeta[item.key].name.toLowerCase());
  const strongestReadiness = [...family.readiness].sort((a, b) => scores.readiness[b] - scores.readiness[a])[0];
  const relevantValue = Object.keys(family.values).sort((a, b) => scores.values[b] - scores.values[a])[0];
  const bridgeArea = [...family.readiness].sort((a, b) => scores.readiness[a] - scores.readiness[b])[0];
  const needsBridge = scores.readiness[bridgeArea] < 50;
  return `
    <article class="result-card recommendation-card">
      <div class="match-rank"><span class="rank-number">LEAD 0${index + 1}</span><span class="match-chip">${matchLabel(family.score)}</span></div>
      <h3>${family.name}</h3>
      <div class="match-score"><strong>${family.score}</strong><span>/ 100 exploration signal</span></div>
      <ul class="why-list">
        <li>Interest match: ${leadingInterests.join(" + ")}</li>
        <li>Best current evidence: ${readinessMeta[strongestReadiness].toLowerCase()}</li>
        <li>Relevant priority: ${valueMeta[relevantValue].name.toLowerCase()}</li>
      </ul>
      ${needsBridge ? `<div class="bridge-note"><strong>Build or verify:</strong> ${readinessMeta[bridgeArea]}. This is a planning target, not a reason to rule the field out.</div>` : ""}
      <div class="major-list"><span>Example majors—not a complete list</span><div class="major-tags">${family.majors.map(major => `<span>${major}</span>`).join("")}</div></div>
    </article>`;
}

function matchLabel(score) {
  if (score >= 72) return "Strong lead";
  if (score >= 60) return "Promising lead";
  return "Worth comparing";
}

const traitDefinitions = {
  E: { name: "Social energy", color: "#f06e42" },
  A: { name: "Cooperation", color: "#47a798" },
  C: { name: "Structure", color: "#d0aa38" },
  N: { name: "Emotional sensitivity", color: "#a485dc" },
  O: { name: "Idea exploration", color: "#6c9cff" }
};

function traitInterpretation(trait, score) {
  const band = score >= 63 ? "high" : score <= 37 ? "low" : "middle";
  const interpretations = {
    E: {
      high: "Discussion, visible participation, and collaborative projects may energize you.",
      middle: "A mix of discussion and independent focus may suit you best.",
      low: "Quiet focus, preparation time, and smaller groups may help you contribute at your best."
    },
    A: {
      high: "Cooperative, supportive learning cultures may bring out your best work.",
      middle: "You may balance empathy with direct debate depending on the situation.",
      low: "You may be comfortable challenging ideas directly; look for respectful, evidence-led debate."
    },
    C: {
      high: "Long projects, schedules, and clear milestones may fit your natural approach.",
      middle: "You can likely use structure without needing every step fixed in advance.",
      low: "Flexible, varied work may appeal; external routines can protect deadlines and follow-through."
    },
    N: {
      high: "You may notice stress quickly; compare workload, support, feedback, and recovery time.",
      middle: "Stress response may depend strongly on context, support, and preparation.",
      low: "You may stay steady under pressure, while still benefiting from realistic workload limits."
    },
    O: {
      high: "Novel, abstract, creative, and interdisciplinary learning may hold your attention.",
      middle: "You may enjoy new ideas most when they connect to a clear purpose.",
      low: "Concrete, applied, and well-defined learning may feel more satisfying than open-ended theory."
    }
  };
  return interpretations[trait][band];
}

function renderPersonality(personality) {
  return Object.entries(traitDefinitions).map(([key, meta]) => {
    const score = personality[key];
    return `<article class="result-card trait-card"><div class="trait-score">${score}<small>/100</small></div><h3>${meta.name}</h3><p>${traitInterpretation(key, score)}</p><div class="trait-mini-track"><span style="width:${score}%;--trait-color:${meta.color}"></span></div></article>`;
  }).join("");
}

function renderReadiness(readiness) {
  return Object.entries(readinessMeta).map(([key, label]) => `
    <div class="readiness-item">
      <div class="readiness-item-head"><span>${label}</span><span>${readiness[key]}</span></div>
      <div class="score-track"><span style="width:${readiness[key]}%;--bar-color:#47a798"></span></div>
    </div>`).join("");
}

function bindResultActions() {
  document.querySelector("#print-results").addEventListener("click", () => window.print());
  document.querySelector("#review-answers").addEventListener("click", () => {
    state.page = 0;
    state.completed = false;
    persistState();
    renderPage();
    showView(assessmentView);
  });
  document.querySelector("#reset-assessment").addEventListener("click", () => {
    const confirmed = window.confirm("Delete the saved answers on this device and start again?");
    if (!confirmed) return;
    state = { answers: {}, page: 0, completed: false };
    persistState();
    startButton.firstChild.textContent = "Start my compass ";
    showView(welcomeView);
  });
  document.querySelector("#open-method").addEventListener("click", () => methodDialog.showModal());
}
