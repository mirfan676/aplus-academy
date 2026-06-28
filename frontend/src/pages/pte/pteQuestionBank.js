const makeChoiceQuestion = (id, prompt, options, correctOptionIds, explanation, extra = {}) => ({
  id,
  prompt,
  options,
  correctOptionIds,
  explanation,
  practiceMode: "choice",
  ...extra,
});

const makeTextQuestion = (id, prompt, sample, extra = {}) => ({
  id,
  prompt,
  sample,
  practiceMode: "text",
  ...extra,
});

const makeShortAnswerQuestion = (id, prompt, acceptableAnswers, explanation, extra = {}) => ({
  id,
  prompt,
  acceptableAnswers,
  explanation,
  practiceMode: "short-answer",
  ...extra,
});

const themes = [
  {
    key: "blended-learning",
    title: "blended learning",
    subject: "Blended learning",
    benefitA: "expand access to lessons",
    benefitB: "give students flexible revision time",
    risk: "weaken concentration when routines are unclear",
    action: "set weekly targets and guided review",
    contrast: "technology should support, not replace, strong teaching",
  },
  {
    key: "renewable-energy",
    title: "renewable energy",
    subject: "Renewable energy",
    benefitA: "lower long-term energy costs",
    benefitB: "reduce environmental damage",
    risk: "remain unreliable without modern storage systems",
    action: "invest in grids and battery technology",
    contrast: "lower prices alone do not complete the energy transition",
  },
  {
    key: "sleep-study",
    title: "sleep and study performance",
    subject: "Adequate sleep",
    benefitA: "improve memory retention",
    benefitB: "reduce careless mistakes",
    risk: "leave students unfocused during demanding lessons",
    action: "treat rest as part of a study plan",
    contrast: "longer study hours are not always better than effective rest",
  },
  {
    key: "digital-literacy",
    title: "digital literacy",
    subject: "Digital literacy",
    benefitA: "help students evaluate online sources",
    benefitB: "improve safe and productive technology use",
    risk: "create false confidence when learners cannot check information quality",
    action: "teach source evaluation and privacy basics early",
    contrast: "frequent device use is not the same as digital competence",
  },
  {
    key: "urban-transport",
    title: "urban transport planning",
    subject: "Urban transport planning",
    benefitA: "reduce traffic congestion",
    benefitB: "improve access to work and education",
    risk: "fail when cities depend only on more private cars",
    action: "combine buses, walking routes, and cycling lanes",
    contrast: "balanced planning is more effective than road expansion alone",
  },
  {
    key: "reading-habits",
    title: "home reading habits",
    subject: "Regular reading",
    benefitA: "strengthen vocabulary development",
    benefitB: "improve comprehension over time",
    risk: "become passive when children only memorize without discussion",
    action: "make reading a daily routine with questions",
    contrast: "discussion deepens learning more than repetition alone",
  },
  {
    key: "project-learning",
    title: "project-based learning",
    subject: "Project-based learning",
    benefitA: "connect theory to real problems",
    benefitB: "increase classroom engagement",
    risk: "lose structure when tasks are not clearly designed",
    action: "use feedback and staged milestones",
    contrast: "active projects still require careful teacher direction",
  },
  {
    key: "exercise-learning",
    title: "exercise and learning",
    subject: "Regular exercise",
    benefitA: "stabilize student mood",
    benefitB: "support concentration in class",
    risk: "be ignored when exam pressure dominates daily routines",
    action: "include movement in weekly study schedules",
    contrast: "physical wellbeing can strengthen academic performance",
  },
  {
    key: "public-libraries",
    title: "public libraries",
    subject: "Public libraries",
    benefitA: "provide low-cost access to books",
    benefitB: "give families quiet study spaces",
    risk: "remain underused when communities do not know what services exist",
    action: "link libraries with schools and reading events",
    contrast: "community reading culture grows when access is practical",
  },
  {
    key: "financial-literacy",
    title: "financial literacy",
    subject: "Financial literacy",
    benefitA: "help young people manage spending responsibly",
    benefitB: "support better long-term planning",
    risk: "leave students vulnerable to debt and poor decisions",
    action: "teach budgeting and basic saving habits at school",
    contrast: "life skills can be as important as examination content",
  },
  {
    key: "cybersecurity",
    title: "cybersecurity awareness",
    subject: "Cybersecurity awareness",
    benefitA: "protect personal information online",
    benefitB: "reduce the risk of common digital fraud",
    risk: "cause serious privacy problems when ignored",
    action: "train students to verify links and passwords carefully",
    contrast: "small online mistakes can have large consequences",
  },
  {
    key: "time-management",
    title: "time management",
    subject: "Effective time management",
    benefitA: "reduce last-minute stress",
    benefitB: "improve the quality of revision",
    risk: "break down when students study without a realistic schedule",
    action: "plan short focused sessions with review blocks",
    contrast: "consistent routines usually outperform panic revision",
  },
  {
    key: "climate-policy",
    title: "climate policy",
    subject: "Climate policy",
    benefitA: "encourage cleaner production choices",
    benefitB: "prepare cities for long-term environmental pressure",
    risk: "remain ineffective without public cooperation",
    action: "combine regulation with public education",
    contrast: "policy works better when citizens understand its purpose",
  },
  {
    key: "teamwork-skills",
    title: "teamwork skills",
    subject: "Teamwork skills",
    benefitA: "improve group problem-solving",
    benefitB: "prepare students for professional collaboration",
    risk: "lead to uneven effort when roles are unclear",
    action: "assign responsibilities and feedback checkpoints",
    contrast: "group work succeeds when accountability is visible",
  },
  {
    key: "vocational-training",
    title: "vocational training",
    subject: "Vocational training",
    benefitA: "prepare learners for practical careers",
    benefitB: "match education more closely to labour-market needs",
    risk: "be unfairly undervalued beside academic routes",
    action: "treat technical education as a respected pathway",
    contrast: "university is not the only route to professional success",
  },
];

const shortAnswers = [
  ["What instrument is commonly used to measure air pressure?", ["barometer"], "The expected answer is barometer."],
  ["Which part of a plant carries water from the roots to the leaves?", ["stem", "xylem"], "Stem is accepted in basic usage, and xylem is the precise transport tissue."],
  ["What do we call the study of stars, planets, and space?", ["astronomy"], "The expected answer is astronomy."],
  ["What device measures temperature?", ["thermometer"], "The expected answer is thermometer."],
  ["Which gas do plants absorb from the atmosphere during photosynthesis?", ["carbon dioxide"], "The expected answer is carbon dioxide."],
  ["What do we call a person who designs buildings?", ["architect"], "The expected answer is architect."],
  ["Which organ pumps blood around the human body?", ["heart"], "The expected answer is heart."],
  ["What is the written record of a lecture called?", ["transcript"], "The expected answer is transcript."],
  ["Which branch of science studies living organisms?", ["biology"], "The expected answer is biology."],
  ["What do we call money set aside for future use?", ["savings", "saving"], "Savings is the strongest answer."],
  ["What instrument is used to look at very small objects?", ["microscope"], "The expected answer is microscope."],
  ["Which document outlines the skills and experience of a job applicant?", ["resume", "cv"], "Resume and CV are both accepted."],
  ["What do we call the speed of a computer network connection?", ["bandwidth"], "The expected answer is bandwidth."],
  ["Which subject studies numbers, patterns, and equations?", ["mathematics", "maths", "math"], "All common forms are accepted."],
  ["What do we call a person who starts a new business?", ["entrepreneur"], "The expected answer is entrepreneur."],
];

const essayTopics = [
  "Some people believe technology improves classroom learning, while others think it distracts students. Discuss both views and give your opinion.",
  "Governments should spend more money on public transport than on building new roads. To what extent do you agree or disagree?",
  "Working from home is becoming more common. Do the advantages of remote work outweigh the disadvantages?",
  "Happiness affects personal economic success. Do you agree with this? Give your own example.",
  "Some people believe every young person should go to university. To what extent do you agree or disagree?",
  "Schools should spend more time teaching practical life skills than traditional academic subjects. Discuss both views and give your opinion.",
  "Artificial intelligence will change the way students learn in the future. Will this be mostly positive or mostly negative?",
  "Online learning can never fully replace classroom learning. To what extent do you agree?",
  "Public libraries are more important than ever in the digital age. Do you agree or disagree?",
  "Exercise should be a compulsory part of every school day. Discuss both views and give your opinion.",
  "Financial education should be taught in all secondary schools. To what extent do you agree or disagree?",
  "Cities should restrict private car use in busy areas. Discuss both views and give your opinion.",
  "Vocational education should receive the same social respect as university education. Do you agree or disagree?",
  "Students learn more effectively in groups than on their own. To what extent do you agree?",
  "Climate change education should be compulsory in schools. Discuss both views and give your opinion.",
];

const optionId = (index) => String.fromCharCode(97 + index);
const percentage = (base, index, spread = 4) => base + index * spread;

const buildReadAloud = (theme, index) =>
  makeTextQuestion(
    `ra-${index + 1}`,
    `Read the passage clearly and naturally.\n\n${theme.subject} can ${theme.benefitA}, ${theme.benefitB}, and ${theme.action}. However, it may ${theme.risk} if leaders ignore the need to ${theme.action}.`,
    `Stress the main idea words such as ${theme.subject.toLowerCase()}, ${theme.benefitA.split(" ")[0]}, and ${theme.action.split(" ")[0]}. Pause naturally at the contrast word however.`,
    {
      audioText: `${theme.subject} can ${theme.benefitA}, ${theme.benefitB}, and ${theme.action}. However, it may ${theme.risk} if leaders ignore the need to ${theme.action}.`,
      tips: ["Pause naturally at punctuation.", "Keep the pace even from start to finish.", "Emphasize the main academic nouns and verbs."],
    }
  );

const buildRepeatSentence = (theme, index) => {
  const sentence = `${theme.subject} can ${theme.benefitA} when institutions ${theme.action}.`;
  return makeShortAnswerQuestion(
    `rs-${index + 1}`,
    "Listen and repeat the sentence as accurately as possible.",
    [sentence],
    `Keep the full idea together, especially the phrase ${theme.action}.`,
    {
      audioText: sentence,
      transcript: sentence,
      tips: ["Keep the meaning in your head.", "Repeat immediately and steadily.", "Do not stop if you miss one word."],
    }
  );
};

const buildDescribeImage = (theme, index) => {
  const low = percentage(28, index, 1);
  const mid = percentage(44, index, 1);
  const high = percentage(62, index, 1);
  const prompt = `Describe the image.\n\nA bar chart about ${theme.title} compares three groups. Awareness rises from ${low}% in junior learners to ${mid}% in senior learners, while strong performance grows further to ${high}% after guided practice programs.`;
  const sample = `The bar chart presents data on ${theme.title}. It shows a clear upward trend from junior learners to senior learners, and the highest performance appears after guided practice programs. Overall, the image suggests that structured support leads to better outcomes in this area.`;
  return makeTextQuestion(`di-${index + 1}`, prompt, sample, {
    audioText: `A bar chart about ${theme.title} compares three groups. Awareness rises from ${low} percent in junior learners to ${mid} percent in senior learners, while strong performance grows further to ${high} percent after guided practice programs.`,
    tips: ["Start with the image type.", "Mention the main trend.", "End with a short overall conclusion."],
  });
};

const buildRetellLecture = (theme, index) => {
  const transcript = `In this lecture, the speaker explains that ${theme.subject.toLowerCase()} can ${theme.benefitA} and ${theme.benefitB}. However, the lecture also warns that systems may ${theme.risk} unless leaders ${theme.action}. The speaker concludes that ${theme.contrast}.`;
  const sample = `The lecture explains that ${theme.subject.toLowerCase()} can ${theme.benefitA} and ${theme.benefitB}. At the same time, the speaker warns that problems may appear when people ignore the need to ${theme.action}. The main conclusion is that ${theme.contrast}.`;
  return makeTextQuestion(`rl-${index + 1}`, "Listen to the lecture and retell the main ideas.", sample, {
    audioText: transcript,
    transcript,
    tips: ["Note the topic, two key points, and the conclusion.", "Retell ideas, not every word.", "Use connecting words such as however and therefore."],
  });
};

const buildAnswerShortQuestion = ([prompt, answers, explanation], index) =>
  makeShortAnswerQuestion(`asq-${index + 1}`, prompt, answers, explanation, {
    audioText: prompt,
    transcript: prompt,
    tips: ["Answer directly.", "Use a single word or short phrase.", "Do not explain unless the question asks for it."],
  });

const buildRespondSituation = (theme, index) =>
  makeTextQuestion(
    `rts-${index + 1}`,
    `A student asks you for help about ${theme.title}. Write a polite and helpful response explaining what they should do next.`,
    `Of course, I can help you. First, you should review the main idea of ${theme.title} and focus on how it can ${theme.benefitA}. After that, make short notes, check the teacher instructions carefully, and practise again with a clear plan so that you can improve with more confidence.`,
    {
      minWords: 25,
      maxWords: 90,
      tips: ["Use polite language.", "Give practical steps.", "Keep the reply direct and complete."],
    }
  );

const buildSummarizeWritten = (theme, index) => {
  const passage = `${theme.subject} can ${theme.benefitA} and ${theme.benefitB}, but experts warn that programs may ${theme.risk} unless governments and institutions ${theme.action}. For this reason, recent reports argue that ${theme.contrast}.`;
  const sample = `${theme.subject} can ${theme.benefitA} and ${theme.benefitB}, but successful results depend on leaders who ${theme.action}, which supports the view that ${theme.contrast}.`;
  return makeTextQuestion(`swt-${index + 1}`, `Read the passage and summarize it in one sentence between 5 and 75 words.\n\n${passage}`, sample, {
    minWords: 5,
    maxWords: 75,
    tips: ["Write one sentence only.", "Include the main idea and key contrast.", "Avoid copying long phrases from the passage."],
  });
};

const buildEssay = (prompt, index) =>
  makeTextQuestion(`essay-${index + 1}`, `Write a 200-300 word essay on the following topic:\n\n${prompt}`, "Use 4 to 5 paragraphs, include one counterargument, and keep a formal academic tone throughout.", {
    minWords: 200,
    maxWords: 300,
    tips: ["Plan before typing.", "Use 4-5 paragraphs.", "Keep a formal academic tone."],
  });

const buildRwFib = (theme, index) => {
  const answerA = theme.benefitA.split(" ").at(-1).replace(/[.,]/g, "");
  const answerB = theme.action.split(" ").at(-1).replace(/[.,]/g, "");
  return makeShortAnswerQuestion(
    `rwfib-${index + 1}`,
    `Complete the paragraph with the best words.\n\n${theme.subject} can ${theme.benefitA.replace(answerA, "______")} and ${theme.benefitB}. Strong programs become more effective when teachers ${theme.action.replace(answerB, "______")}.`,
    [`${answerA}, ${answerB}`, `${answerA} ${answerB}`],
    `The strongest completions are ${answerA} and ${answerB}.`,
    {
      minWords: 2,
      maxWords: 20,
      tips: ["Check grammar before meaning.", "Look at the whole sentence.", "Use exact word forms."],
    }
  );
};

const buildMcma = (theme, index) => {
  const options = [
    { id: optionId(0), text: `${theme.subject} can ${theme.benefitA}.` },
    { id: optionId(1), text: `${theme.subject} can ${theme.benefitB}.` },
    { id: optionId(2), text: `${theme.subject} always succeeds without any planning or support.` },
    { id: optionId(3), text: `Leaders should ${theme.action}.` },
  ];
  return makeChoiceQuestion(
    `mcma-${index + 1}`,
    `Read the passage and choose all correct answers.\n\nThe article explains that ${theme.subject.toLowerCase()} can ${theme.benefitA} and ${theme.benefitB}. However, the writer warns that progress may ${theme.risk} unless leaders ${theme.action}.\n\nWhich statements are supported by the passage?`,
    options,
    [optionId(0), optionId(1), optionId(3)],
    "The passage supports the two benefits and the recommended action, but not the exaggerated claim that success happens automatically.",
  );
};

const buildReorder = (theme, index) =>
  makeShortAnswerQuestion(
    `rop-${index + 1}`,
    `Write the correct paragraph order as letters only.\n\nA. Finally, the group can review weak points and make targeted improvements.\nB. First, students should identify the main issue in ${theme.title} and understand the task requirements.\nC. After that, they can apply ${theme.action} and organise their response more clearly.`,
    ["B C A", "BCA"],
    "The logical flow begins with understanding the task, then applying a plan, and finally reviewing performance.",
    {
      minWords: 1,
      maxWords: 10,
      tips: ["Find the opening sentence first.", "Track time order and pronouns.", "Check the final review step."],
    }
  );

const buildReadingFib = (theme, index) => {
  const answer = theme.action.split(" ")[0];
  return makeShortAnswerQuestion(
    `rfib-${index + 1}`,
    `Complete the sentence.\n\nTo make ${theme.title} more effective, institutions should ______ clear goals and review progress regularly.`,
    [answer],
    `The strongest academic verb is ${answer}.`,
    {
      minWords: 1,
      maxWords: 10,
      tips: ["Check grammar around the blank.", "Choose the verb that fits the full meaning.", "Avoid informal words."],
    }
  );
};

const buildMcsa = (theme, index) =>
  makeChoiceQuestion(
    `mcsa-${index + 1}`,
    `Read the passage and choose the best answer.\n\nThe writer argues that ${theme.subject.toLowerCase()} can ${theme.benefitA} and ${theme.benefitB}. However, this only happens when decision-makers ${theme.action}, because otherwise programs may ${theme.risk}.\n\nWhat is the main idea of the passage?`,
    [
      { id: optionId(0), text: `${theme.subject} can be valuable, but it depends on proper planning.` },
      { id: optionId(1), text: `${theme.subject} should be avoided in every situation.` },
      { id: optionId(2), text: `The passage mainly describes historical facts without giving a view.` },
      { id: optionId(3), text: `${theme.subject} only matters for one small group of people.` },
    ],
    [optionId(0)],
    "Option A captures both the benefit and the condition stated by the writer.",
  );

const buildSst = (theme, index) => {
  const transcript = `The speaker explains that ${theme.subject.toLowerCase()} can ${theme.benefitA} and ${theme.benefitB}. However, the lecture emphasizes that progress may ${theme.risk} unless institutions ${theme.action}. Overall, the speaker argues that ${theme.contrast}.`;
  const sample = `The lecture explains that ${theme.subject.toLowerCase()} can ${theme.benefitA} and ${theme.benefitB}, but success depends on institutions that ${theme.action}. The speaker therefore concludes that ${theme.contrast}.`;
  return makeTextQuestion(`sst-${index + 1}`, "Listen to the recording and write a 50-70 word summary.", sample, {
    minWords: 35,
    maxWords: 90,
    audioText: transcript,
    transcript,
    tips: ["Include the topic and two main points.", "Keep the summary concise.", "Avoid adding your own opinion."],
  });
};

const buildListeningFib = (theme, index) => {
  const answerA = theme.benefitA.split(" ").at(-1).replace(/[.,]/g, "");
  const answerB = theme.benefitB.split(" ").at(-1).replace(/[.,]/g, "");
  const transcript = `${theme.subject} can ${theme.benefitA} and ${theme.benefitB}, but only when institutions ${theme.action}.`;
  return makeShortAnswerQuestion(
    `lfib-${index + 1}`,
    `Listen and fill in the missing words.\n\n${theme.subject} can ${theme.benefitA.replace(answerA, "______")} and ${theme.benefitB.replace(answerB, "______")}, but only when institutions ${theme.action}.`,
    [`${answerA}, ${answerB}`, `${answerA} ${answerB}`],
    `The missing words are ${answerA} and ${answerB}.`,
    {
      minWords: 2,
      maxWords: 20,
      audioText: transcript,
      transcript,
      tips: ["Listen for exact word forms.", "Check spelling carefully.", "Use grammar around the blank."],
    }
  );
};

const buildHcs = (theme, index) =>
  makeChoiceQuestion(
    `hcs-${index + 1}`,
    "Listen to the recording and select the best summary.",
    [
      { id: optionId(0), text: `The speaker argues that ${theme.subject.toLowerCase()} can ${theme.benefitA} and ${theme.benefitB}, but only with better planning.` },
      { id: optionId(1), text: `The speaker says ${theme.subject.toLowerCase()} has no real benefit for society.` },
      { id: optionId(2), text: `The speaker only describes a historical event and gives no recommendation.` },
    ],
    [optionId(0)],
    "The correct summary includes the main benefits and the condition for success.",
    {
      audioText: `The lecturer explains that ${theme.subject.toLowerCase()} can ${theme.benefitA} and ${theme.benefitB}. However, these gains may not appear unless decision-makers ${theme.action}.`,
      transcript: `The lecturer explains that ${theme.subject.toLowerCase()} can ${theme.benefitA} and ${theme.benefitB}. However, these gains may not appear unless decision-makers ${theme.action}.`,
    }
  );

const buildSmw = (theme, index) =>
  makeChoiceQuestion(
    `smw-${index + 1}`,
    "Listen to the recording and choose the missing ending.",
    [
      { id: optionId(0), text: theme.action },
      { id: optionId(1), text: "ignore the issue completely" },
      { id: optionId(2), text: "remove all forms of guidance" },
    ],
    [optionId(0)],
    "The recording ends with the recommended action, not an extreme negative alternative.",
    {
      audioText: `The speaker concludes that ${theme.subject.toLowerCase()} can ${theme.benefitA}, but only if institutions ${theme.action}`,
      transcript: `The speaker concludes that ${theme.subject.toLowerCase()} can ${theme.benefitA}, but only if institutions ${theme.action}.`,
    }
  );

const buildHiw = (theme, index) => {
  const wrongWord = theme.benefitA.split(" ").at(-1).replace(/[.,]/g, "");
  const correction = theme.benefitB.split(" ").at(-1).replace(/[.,]/g, "");
  return makeShortAnswerQuestion(
    `hiw-${index + 1}`,
    `Listen and identify the incorrect word and the correction.\n\nDisplayed text: ${theme.subject} can ${theme.benefitA.replace(wrongWord, correction)}.\nAudio says: ${theme.subject} can ${theme.benefitA}.`,
    [`${correction} -> ${wrongWord}`, `${correction} to ${wrongWord}`],
    `The displayed word ${correction} is incorrect; the spoken word is ${wrongWord}.`,
    {
      minWords: 2,
      maxWords: 20,
      audioText: `${theme.subject} can ${theme.benefitA}.`,
      transcript: `${theme.subject} can ${theme.benefitA}.`,
      tips: ["Focus on meaning-changing words.", "Type the incorrect word and the correction clearly.", "Check similar academic vocabulary."],
    }
  );
};

const buildWfd = (theme, index) => {
  const sentence = `${theme.subject} can ${theme.benefitA} when leaders ${theme.action}.`;
  return makeShortAnswerQuestion(
    `wfd-${index + 1}`,
    "Listen to the sentence and type exactly what you hear.",
    [sentence],
    "Check exact wording, spelling, and punctuation.",
    {
      minWords: 5,
      maxWords: 25,
      audioText: sentence,
      transcript: sentence,
      tips: ["Type every word.", "Check plural endings and punctuation.", "Use sentence grammar to recover missed words."],
    }
  );
};

export const pteQuestionBank = {
  "read-aloud": themes.map(buildReadAloud),
  "repeat-sentence": themes.map(buildRepeatSentence),
  "describe-image": themes.map(buildDescribeImage),
  "retell-lecture": themes.map(buildRetellLecture),
  "answer-short-question": shortAnswers.map(buildAnswerShortQuestion),
  "respond-to-a-situation": themes.map(buildRespondSituation),
  "summarize-written-text": themes.map(buildSummarizeWritten),
  "write-essay": essayTopics.map(buildEssay),
  "reading-writing-fill-blanks": themes.map(buildRwFib),
  "multiple-choice-multiple-answers": themes.map(buildMcma),
  "reorder-paragraphs": themes.map(buildReorder),
  "reading-fill-blanks": themes.map(buildReadingFib),
  "reading-multiple-choice-single-answer": themes.map(buildMcsa),
  "summarize-spoken-text": themes.map(buildSst),
  "listening-fill-blanks": themes.map(buildListeningFib),
  "highlight-correct-summary": themes.map(buildHcs),
  "select-missing-word": themes.map(buildSmw),
  "highlight-incorrect-words": themes.map(buildHiw),
  "write-from-dictation": themes.map(buildWfd),
};

export const getTaskQuestions = (slug) => pteQuestionBank[slug] || [];

export const getSectionQuestionCount = (tasks) =>
  tasks.reduce((sum, task) => sum + getTaskQuestions(task.slug).length, 0);

export const getTotalQuestionCount = () =>
  Object.values(pteQuestionBank).reduce((sum, questions) => sum + questions.length, 0);
