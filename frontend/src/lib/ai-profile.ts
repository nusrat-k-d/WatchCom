export interface AICinematicData {
  aiSummary: string
  whyWatch: string
  aiReview: string
  memorableQuote: { text: string; by: string }
  reasonsToWatch: string[]
  moodTags: string[]
  metrics: {
    story: number
    characters: number
    emotionalIntensity: number
    storyComplexity: number
    cinematography: number
    visualEffects: number
    soundtrack: number
    pacing: number
    rewatchability: number
    endingImpact: number
  }
  discussionQuestions: string[]
}

// Simple seedable pseudo-random generator
function getSeededRandom(seedStr: string) {
  let hash = 0
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash)
  }
  return () => {
    hash = (hash * 1664525 + 1013904223) % 4294967296
    return Math.abs(hash) / 4294967296
  }
}

// Handcrafted rich profiles for mock movies (matched by title substring)
const MOCK_PROFILES: Record<string, AICinematicData> = {
  interstellar: {
    aiSummary: "Interstellar is a breathtaking, emotionally resonant sci-fi epic set in a near-future Earth ravaged by crop blights. A group of astronauts embark on a desperate voyage through a newly discovered wormhole near Saturn in search of a new home for mankind, leading to stunning encounters with time dilation, gravity fields, and cosmic isolation.",
    whyWatch: "This masterpiece seamlessly combines cutting-edge theoretical physics with a deeply moving father-daughter story. Backed by a historic, pipe-organ-infused score by Hans Zimmer and jaw-dropping practical and digital visual effects, it stands as one of the most intellectually ambitious and emotionally devastating sci-fi journeys ever filmed.",
    aiReview: "Christopher Nolan delivers a magnificent cinematic spectacle that is as much about human connection as it is about astrophysics. The storytelling is sweeping yet deeply intimate, anchored by a career-best performance from Matthew McConaughey. The visuals of Gargantua and the water planet are legendary, while the pacing balances cosmic dread with intimate hope.",
    memorableQuote: { 
      text: "We've always defined ourselves by the ability to overcome the impossible. And we count these moments, these moments when we dare to aim higher, to break barriers, to reach for the stars, to make the unknown known. We count these moments as our proudest achievements.", 
      by: "Cooper" 
    },
    reasonsToWatch: [
      "Hans Zimmer's pipe-organ score elevates the cosmic scale.",
      "Scientific accuracy advised by Nobel laureate Kip Thorne.",
      "Stunning, mind-bending visual depictions of black holes and relativity.",
      "A deeply moving father-daughter bond that anchors the high-concept sci-fi.",
      "Spectacular cinematography by Hoyte van Hoytema."
    ],
    moodTags: ["Mind-Bending", "Existential", "Emotional", "Atmospheric", "Intellectual"],
    metrics: { story: 9.3, characters: 8.7, emotionalIntensity: 9.6, storyComplexity: 8.8, cinematography: 9.7, visualEffects: 9.8, soundtrack: 9.9, pacing: 8.4, rewatchability: 9.2, endingImpact: 9.5 },
    discussionQuestions: [
      "How does Nolan weave love as a literal, physical dimension alongside gravity?",
      "Does Cooper make the right decision leaving his family for the survival of the species?",
      "How does the concept of time dilation affect the emotional stakes of the film?"
    ]
  },
  inception: {
    aiSummary: "Inception is a mind-bending heist thriller where thieves enter the dreams of others to steal corporate secrets. Dom Cobb, a fugitive specialist, is offered a chance to clear his criminal record by performing 'inception'—planting an idea in a target's subconscious rather than stealing it.",
    whyWatch: "It is a rare blockbuster that treats its audience with intellectual respect. Blending complex dream-logic layers, zero-gravity combat choreography, and Hans Zimmer's iconic brass-heavy score, it creates an unforgettable puzzle box that lingers in the mind long after the final frame.",
    aiReview: "A technical marvel that showcases Christopher Nolan's absolute command over parallel action and pacing. Leonardo DiCaprio leads an exceptional ensemble cast through multiple, nested dreamscapes. The visual effects remain peerless, and the emotional core of grief and guilt provides a solid anchor to the high-concept rules.",
    memorableQuote: { 
      text: "What is the most resilient parasite? Bacteria? A virus? An intestinal worm? An idea. Resilient... highly contagious. Once an idea has taken hold of the brain it's almost impossible to eradicate.", 
      by: "Cobb" 
    },
    reasonsToWatch: [
      "Peerless zero-gravity hallway fight sequence.",
      "Nested multi-layer narrative structure that keeps you hyper-engaged.",
      "Enigmatic ending that remains one of cinema's most debated moments.",
      "Iconic score containing the legendary 'brammm' brass motifs.",
      "Intelligent world-building detailing rules of sleep, projection, and kicks."
    ],
    moodTags: ["Mind-Bending", "Intense", "Intellectual", "Stylish", "Thrilling"],
    metrics: { story: 9.5, characters: 8.5, emotionalIntensity: 8.8, storyComplexity: 9.4, cinematography: 9.2, visualEffects: 9.6, soundtrack: 9.5, pacing: 9.1, rewatchability: 9.6, endingImpact: 9.7 },
    discussionQuestions: [
      "Does Dom Cobb ultimately care if he is in reality or in a dream?",
      "How does Nolan use the totems to symbolize the characters' grip on truth?",
      "What are the ethical implications of planting ideas inside someone's mind?"
    ]
  },
  "dark knight": {
    aiSummary: "The Dark Knight is a dark, gritty crime thriller that pits Batman against the Joker, a psychopathic criminal mastermind seeking to plunge Gotham City into total anarchy. The conflict forces Batman to confront the limits of his moral code and the true cost of justice.",
    whyWatch: "It redefined what a superhero movie could be, transforming it into a high-stakes crime epic. Heath Ledger's legendary, Oscar-winning portrayal of the Joker stands as one of the greatest villain performances in cinema history, backed by David Julyan/Hans Zimmer's terrifying, minimalist score.",
    aiReview: "A masterpiece of pacing and tension that escalates from the opening bank heist to the final tragic choice. Ledger completely disappears into the chaotic, magnetic role, while Christian Bale delivers a tormented, heavy Batman. The film raises profound philosophical questions about morality, heroism, and societal order.",
    memorableQuote: { 
      text: "You either die a hero or you live long enough to see yourself become the villain.", 
      by: "Harvey Dent" 
    },
    reasonsToWatch: [
      "Heath Ledger's tour-de-force, genre-defining performance.",
      "Thrusting superhero tropes into a realistic, gritty crime drama.",
      "Stunning IMAX practical stunt choreography (including the semi-truck flip).",
      "A tragic, complex narrative arc surrounding the fall of Harvey Dent.",
      "Profound philosophical dialogue about order, chaos, and human nature."
    ],
    moodTags: ["Dark", "Intense", "Intellectual", "Gripping", "Tragic"],
    metrics: { story: 9.4, characters: 9.7, emotionalIntensity: 9.2, storyComplexity: 8.2, cinematography: 9.4, visualEffects: 8.8, soundtrack: 9.3, pacing: 9.5, rewatchability: 9.7, endingImpact: 9.6 },
    discussionQuestions: [
      "Is the Joker's assessment of human nature correct in the ferry experiment?",
      "What does the final lie say about the necessity of myths in society?",
      "How does Batman's surveillance system challenge our views on privacy vs security?"
    ]
  },
  "fight club": {
    aiSummary: "Fight Club follows an insomniac office worker seeking an escape from corporate consumerism. He crosses paths with Tyler Durden, a charismatic soap salesman, and together they form an underground fight club that evolves into a chaotic anti-establishment movement.",
    whyWatch: "It is a satirical masterpiece that dissects modern masculinity, consumerism, and alienation. David Fincher's dark, gritty visual style, coupled with a shocking plot twist and sharp dark humor, makes this a cult classic of the highest order.",
    aiReview: "Fincher's direction is razor-sharp, pacing the descent into radicalism with visceral energy and kinetic editing. Brad Pitt and Edward Norton form an iconic, volatile screen partnership. The film is grimy, visually inventive, and offers a searing commentary on turn-of-the-century cultural fatigue.",
    memorableQuote: { 
      text: "It's only after we've lost everything that we're free to do anything.", 
      by: "Tyler Durden" 
    },
    reasonsToWatch: [
      "One of cinema's most famous and mind-bending plot twists.",
      "Searing, darkly funny critique of modern consumer culture.",
      "Fincher's signature sleek, gritty, low-light cinematography.",
      "Outstanding, magnetic performances from Pitt, Norton, and Marla Singer.",
      "A legendary alt-rock soundtrack by The Dust Brothers."
    ],
    moodTags: ["Dark", "Mind-Bending", "Cynical", "Provocative", "Stylish"],
    metrics: { story: 9.2, characters: 9.4, emotionalIntensity: 8.9, storyComplexity: 8.7, cinematography: 9.2, visualEffects: 8.5, soundtrack: 9.0, pacing: 8.9, rewatchability: 9.5, endingImpact: 9.6 },
    discussionQuestions: [
      "How does consumerism lead to the psychological fractures seen in the Narrator?",
      "Is Tyler Durden's philosophy genuinely liberating, or is it another form of control?",
      "What does the final shot symbolize regarding the collapse of financial structures?"
    ]
  },
  matrix: {
    aiSummary: "The Matrix is a groundbreaking sci-fi action film about Neo, a computer hacker who discovers that his entire reality is a simulated illusion created by machines to harvest human energy. He joins a band of rebels to fight the machine controllers.",
    whyWatch: "It changed cinema forever, introducing the world to 'Bullet Time' visual effects and blending wire-fu martial arts with deep philosophical questions about perception, control, and free will. It is the ultimate cyberpunk classic.",
    aiReview: "A masterclass in action direction and world-building. The Wachowskis build a green-tinted dystopia that feels both slick and terrifying. Keanu Reeves is iconic as Neo, supported by Laurence Fishburne's majestic Morpheus. The pacing is relentless, and the themes of awakening remain universally relevant.",
    memorableQuote: { 
      text: "This is your last chance. After this, there is no turning back. You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill - you stay in Wonderland and I show you how deep the rabbit-hole goes.", 
      by: "Morpheus" 
    },
    reasonsToWatch: [
      "Pioneering 'Bullet Time' visual effects that revolutionized action movies.",
      "Spectacular combination of Hong Kong martial arts choreography and sci-fi.",
      "Deep philosophical references to Baudrillard, Descartes, and gnosticism.",
      "Iconic leather-and-sunglasses cyberpunk style.",
      "Outstanding pacing that builds a perfect hero's journey."
    ],
    moodTags: ["Mind-Bending", "Intellectual", "Philosophical", "Action-Packed", "Cyberpunk"],
    metrics: { story: 9.5, characters: 8.9, emotionalIntensity: 8.7, storyComplexity: 8.6, cinematography: 9.4, visualEffects: 9.7, soundtrack: 9.3, pacing: 9.4, rewatchability: 9.8, endingImpact: 9.5 },
    discussionQuestions: [
      "If the simulated Matrix is comfortable, is Cypher wrong for wanting to return to it?",
      "How does the film explore the concept of the 'Self' outside of physical form?",
      "What does the Red Pill symbolize in modern cultural contexts?"
    ]
  },
  whiplash: {
    aiSummary: "Whiplash is an intense drama about Andrew Neiman, a young jazz drummer determined to achieve greatness at a cut-throat music conservatory. His ambition is weaponized by Terence Fletcher, a conductor who uses emotional abuse to push students beyond their limits.",
    whyWatch: "It plays like a high-octane psychological thriller, exchanging guns and car chases for drumsticks and jazz sheets. J.K. Simmons gives an terrifying, Oscar-winning performance that will leave you breathless, culminating in one of the greatest endings in film history.",
    aiReview: "Damien Chazelle directs with kinetic, rhythmic editing that mimics the tempo of a drum solo. Miles Teller is incredible, matching J.K. Simmons' explosive presence stroke-for-stroke. The pacing is intense, and the film refuses to offer easy moral answers about the price of artistic perfection.",
    memorableQuote: { 
      text: "There are no two words in the English language more harmful than 'good job'.", 
      by: "Terence Fletcher" 
    },
    reasonsToWatch: [
      "Simmons' Oscar-winning, terrifyingly magnetic performance.",
      "Relentless, heart-pounding editing that matches jazz tempos.",
      "A jaw-dropping, legendary final 10-minute drum solo sequence.",
      "Visceral sound design that makes you feel every drop of sweat and blood.",
      "Thought-provoking themes about greatness vs. psychological torture."
    ],
    moodTags: ["Intense", "Emotional", "Obsessive", "Intellectual", "Gripping"],
    metrics: { story: 9.2, characters: 9.5, emotionalIntensity: 9.8, storyComplexity: 7.2, cinematography: 8.8, visualEffects: 6.0, soundtrack: 9.8, pacing: 9.6, rewatchability: 9.3, endingImpact: 9.9 },
    discussionQuestions: [
      "Does Fletcher's abuse create greatness, or does it just destroy potential?",
      "Who wins at the end of the film: Andrew, Fletcher, or neither?",
      "How much of our personal relationships should we sacrifice in the pursuit of genius?"
    ]
  },
  "pulp fiction": {
    aiSummary: "Pulp Fiction is a landmark crime comedy that weaves together several stories in non-linear order. The tales involve two philosophical mob hitmen, a boxer who refuses to throw a fight, a gangster's wife, and a pair of nervous diner robbers.",
    whyWatch: "It revolutionized independent cinema in the 90s. Famous for its razor-sharp, pop-culture-soaked dialogue, unforgettable soundtrack, and stylish, cool aesthetic, Quentin Tarantino created a pop-art masterpiece that defined a generation.",
    aiReview: "Tarantino's dialogue crackles with unique energy, turning mundane conversations about hamburgers into cinematic gold. The ensemble cast is iconic, particularly John Travolta and Samuel L. Jackson. The pacing is fast and funny, and the non-linear structure creates a perfect puzzle of crime.",
    memorableQuote: { 
      text: "The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men.", 
      by: "Jules Winnfield" 
    },
    reasonsToWatch: [
      "Genre-defining, endlessly quotable pop-culture dialogue.",
      "Innovative non-linear screenplay that re-established narrative structures.",
      "Reactivated John Travolta's career alongside Samuel L. Jackson's breakout.",
      "Cool, eclectic surf-rock and soul soundtrack.",
      "Perfect balance of dark comedy, shock violence, and cool style."
    ],
    moodTags: ["Witty", "Dark", "Stylish", "Philosophical", "Unconventional"],
    metrics: { story: 9.3, characters: 9.8, emotionalIntensity: 8.4, storyComplexity: 8.8, cinematography: 8.9, visualEffects: 6.5, soundtrack: 9.7, pacing: 9.0, rewatchability: 9.9, endingImpact: 9.4 },
    discussionQuestions: [
      "What is the significance of Jules' spiritual awakening compared to Vincent's skepticism?",
      "What is actually inside Marcellus Wallace's glowing briefcase?",
      "How does the non-linear structure change our perception of life and death in the film?"
    ]
  },
  primer: {
    aiSummary: "Primer is an ultra-low-budget sci-fi masterpiece about two engineers who accidentally build a time-travel machine in their garage. As they begin to exploit the discovery, they become entangled in overlapping timelines, growing paranoia, and a loss of trust.",
    whyWatch: "It is famous for being the most scientifically realistic and mathematically complex time travel movie ever made. It avoids standard cinematic hand-waving, presenting time loops as a grueling, confusing, and psychologically damaging puzzle.",
    aiReview: "Made for just $7,000, Shane Carruth's film is an intellectual titan. The storytelling is incredibly dense, refusing to spoon-feed the audience. The cinematography is raw and realistic, matching the low-tech garage setting, and the pacing builds an intense atmosphere of paranoia.",
    memorableQuote: { 
      text: "They do not trust what they can't see, and they can't see the mechanism.", 
      by: "Aaron" 
    },
    reasonsToWatch: [
      "The most mathematically rigorous and complex time-travel chart in cinema.",
      "Fascinating, naturalistic dialogue detailing real engineering jargon.",
      "An absolute masterclass in micro-budget indie filmmaking.",
      "A suspenseful atmosphere built on psychological distrust rather than visual effects.",
      "Requires and rewards multiple repeat viewings to unlock the timeline."
    ],
    moodTags: ["Mind-Bending", "Intellectual", "Paranoid", "Existential", "Minimalist"],
    metrics: { story: 8.8, characters: 7.5, emotionalIntensity: 8.0, storyComplexity: 10.0, cinematography: 7.8, visualEffects: 5.0, soundtrack: 8.0, pacing: 8.0, rewatchability: 9.7, endingImpact: 9.0 },
    discussionQuestions: [
      "How many timelines actually exist by the end of the movie?",
      "How does the box symbolize the decay of human trust when faced with infinite control?",
      "Is Aaron or Abe ultimately responsible for the fracture of their friendship?"
    ]
  },
  coherence: {
    aiSummary: "Coherence is a psychological sci-fi thriller set during a dinner party on the night a comet passes overhead. When a sudden blackout occurs, the party guests discover that the comet has fractured reality, connecting them to parallel dimensions of themselves.",
    whyWatch: "It is a masterclass in tension and conceptual horror. Utilizing an almost entirely improvised script and a single-house setting, it creates a terrifyingly realistic puzzle of identity, survival, and quantum decoherence.",
    aiReview: "James Ward Byrkit crafts an incredibly tense, claustrophobic atmosphere. The performances feel raw and genuinely shocked because the actors were reacting to improvised clues. The pacing is superb, accelerating into a chaotic struggle for survival as trust disintegrates.",
    memorableQuote: { 
      text: "We have a window of opportunity to choose which reality we belong in, before it decoheres.", 
      by: "Lee" 
    },
    reasonsToWatch: [
      "A fascinating application of Schrödinger's cat quantum theory to a dinner party.",
      "Almost entirely improvised performances that feel incredibly authentic.",
      "Tense, claustrophobic single-setting staging.",
      "A terrifying look at how quickly civilized trust breaks down.",
      "A highly original concept executed without CGI."
    ],
    moodTags: ["Mind-Bending", "Tense", "Intellectual", "Claustrophobic", "Suspenseful"],
    metrics: { story: 9.0, characters: 8.2, emotionalIntensity: 9.0, storyComplexity: 9.5, cinematography: 8.0, visualEffects: 5.5, soundtrack: 8.2, pacing: 9.0, rewatchability: 9.4, endingImpact: 9.2 },
    discussionQuestions: [
      "Which version of Em do we follow at the end of the movie, and is she justified?",
      "How does the film use color markers to track different dimensions?",
      "How would you react if you saw a parallel version of yourself acting out your worst traits?"
    ]
  },
  moon: {
    aiSummary: "Moon is a minimalist sci-fi drama centering on astronaut Sam Bell, who is nearing the end of his solitary three-year contract harvesting energy on the Moon. After a near-fatal accident, he discovers a shocking secret that challenges his identity.",
    whyWatch: "A beautiful throwback to classic 70s sci-fi (like 2001 and Solaris). Driven by a brilliant, tour-de-force performance by Sam Rockwell and Clint Mansell's hauntingly beautiful piano score, it is a deeply moving study of isolation and humanity.",
    aiReview: "Duncan Jones directs with patience and empathy, focusing on Sam's deteriorating mental state. Sam Rockwell is outstanding, carrying the entire film with nuance and emotional depth. The production design captures a tactile, realistic lunar base, and the pacing is a perfect slow burn.",
    memorableQuote: { 
      text: "We're not programs, Sam. We're people. Do you understand?", 
      by: "GERTY" 
    },
    reasonsToWatch: [
      "Sam Rockwell's exceptional, multi-faceted acting performance.",
      "Clint Mansell's haunting, evocative piano soundtrack.",
      "Gorgeous practical miniature work depicting lunar harvesters.",
      "A deeply emotional, philosophical exploration of corporate ethics.",
      "A touching portrayal of a friendly AI robot voiced by Kevin Spacey."
    ],
    moodTags: ["Existential", "Emotional", "Atmospheric", "Intellectual", "Melancholy"],
    metrics: { story: 9.1, characters: 9.6, emotionalIntensity: 8.8, storyComplexity: 8.3, cinematography: 9.0, visualEffects: 8.2, soundtrack: 9.4, pacing: 8.2, rewatchability: 8.7, endingImpact: 9.3 },
    discussionQuestions: [
      "What are the corporate ethics of creating clones to execute high-risk labor?",
      "How does GERTY's loyalty shift, and does he display genuine empathy?",
      "How does absolute isolation alter our sense of identity and self?"
    ]
  }
}

// Deterministic cinematic data generator for any movie not in the mock list
export function getAICinematicData(movieId: string, movieTitle: string, genres: string[], overview: string): AICinematicData {
  const normalizedTitle = movieTitle.toLowerCase().trim()
  
  // Try to match a handcrafted profile
  for (const [key, profile] of Object.entries(MOCK_PROFILES)) {
    if (normalizedTitle.includes(key)) {
      return profile
    }
  }

  // Fallback seed generation
  const rand = getSeededRandom(movieId + "_" + movieTitle)
  
  const generateScore = (min: number = 7.0, max: number = 9.8) => {
    return Number((min + rand() * (max - min)).toFixed(1))
  }

  const primaryGenre = genres[0] || "Drama"
  
  // Generate metrics
  const metrics = {
    story: generateScore(7.5, 9.6),
    characters: generateScore(7.2, 9.5),
    emotionalIntensity: generateScore(6.8, 9.4),
    storyComplexity: generateScore(6.0, 9.5),
    cinematography: generateScore(7.5, 9.7),
    visualEffects: generateScore(5.0, 9.8),
    soundtrack: generateScore(7.0, 9.6),
    pacing: generateScore(7.2, 9.3),
    rewatchability: generateScore(6.5, 9.5),
    endingImpact: generateScore(7.0, 9.8)
  }

  // Adjust scores depending on genres
  if (genres.includes("Sci-Fi") || genres.includes("Fantasy") || genres.includes("Action")) {
    metrics.visualEffects = generateScore(8.2, 9.8)
    metrics.storyComplexity = generateScore(7.5, 9.6)
  } else {
    metrics.visualEffects = generateScore(5.0, 7.8)
  }

  if (genres.includes("Drama") || genres.includes("Romance")) {
    metrics.emotionalIntensity = generateScore(8.2, 9.7)
    metrics.characters = generateScore(8.4, 9.8)
  }

  // Generate Mood Tags
  const allTags = [
    "Thought-Provoking", "Atmospheric", "Intellectual", "Visually Stunning", 
    "Emotional", "Intense", "Hopeful", "Dark", "Cynical", "Heartwarming", 
    "Suspenseful", "Witty", "Philosophical", "Cerebral", "Immersive", "Melancholy"
  ]
  const moodTags: string[] = []
  
  // Assign 2 matching tags based on genre
  if (genres.includes("Sci-Fi") || genres.includes("Mystery")) {
    moodTags.push("Mind-Bending", "Intellectual")
  } else if (genres.includes("Thriller") || genres.includes("Crime")) {
    moodTags.push("Intense", "Suspenseful")
  } else if (genres.includes("Comedy")) {
    moodTags.push("Witty", "Heartwarming")
  } else if (genres.includes("Drama")) {
    moodTags.push("Emotional", "Thought-Provoking")
  }

  // Populate rest randomly from pool
  while (moodTags.length < 5) {
    const nextTag = allTags[Math.floor(rand() * allTags.length)]
    if (!moodTags.includes(nextTag)) {
      moodTags.push(nextTag)
    }
  }

  // Generate Reasons to Watch
  const reasonsPool = [
    `Masterful directing that maintains exceptional narrative tension throughout.`,
    `A standout, emotionally resonant screenplay that avoids standard genre clichés.`,
    `Gorgeous, detail-rich cinematography that paints every frame like a masterpiece.`,
    `Visceral, highly atmospheric sound design that draws you straight into the scene.`,
    `Superb, multi-layered performances from the lead ensemble cast.`,
    `A thought-provoking study of human nature that leaves a strong lingering impact.`,
    `Masterful execution of pacing, perfectly balancing slow-burn drama with tense highlights.`,
    `An unforgettable ending that challenges the audience's assumptions.`,
    `Exceptional world-building detailing highly creative environments.`,
    `A beautiful, curated musical score that deepens the emotional weight of key scenes.`
  ]

  const reasonsToWatch: string[] = []
  const usedReasonIndices = new Set<number>()
  while (reasonsToWatch.length < 5) {
    const idx = Math.floor(rand() * reasonsPool.length)
    if (!usedReasonIndices.has(idx)) {
      usedReasonIndices.add(idx)
      reasonsToWatch.push(reasonsPool[idx])
    }
  }

  // Generate AI Summaries / Reviews
  const aiSummary = `${movieTitle} is a remarkable ${primaryGenre.toLowerCase()} film that captures the imagination. ${
    overview ? (overview.length > 200 ? overview.substring(0, 197) + "..." : overview) : "An engaging story focusing on the complexity of its central themes."
  } The narrative moves with careful precision, developing complex thematic structures and exploring profound concepts of choice, circumstance, and human connection.`

  const whyWatch = `What makes ${movieTitle} unique is its bold approach to ${primaryGenre.toLowerCase()} storytelling. Rather than playing it safe with typical block-patterned structures, the film layers complex character psychology under stellar visual direction. It stands out in modern cinema as a rewarding, intellectually stimulating work that demands discussion.`

  const aiReview = `A cinematic achievement that holds your attention from start to finish. The pacing is deliberate and rewarding, taking the time to flesh out character relationships before escalating the dramatic stakes. Technically, the cinematography and score work in perfect harmony to establish a rich, immersive atmosphere, making ${movieTitle} a highly recommended viewing experience.`

  // Memorable quotes
  const quotesPool = [
    { text: "We seek answers in the stars, yet the greatest mysteries are those we carry inside.", by: "Lead Protagonist" },
    { text: "Truth is not what we remember, but what we cannot afford to forget.", by: "Narrator" },
    { text: "Every choice we make ripples across a horizon we can never fully see.", by: "Supporting Character" },
    { text: "In the quietest moments, the loudest truths are spoken.", by: "Main Character" }
  ]
  const memorableQuote = quotesPool[Math.floor(rand() * quotesPool.length)]

  // Discussion Questions
  const discussionQuestions = [
    `How does ${movieTitle} establish the core conflict between its main characters, and how does it resolve?`,
    `In what ways does the film's visual and musical design reflect its deeper thematic questions?`,
    `How does the ending of ${movieTitle} challenge the viewers' expectations established during the first act?`
  ]

  return {
    aiSummary,
    whyWatch,
    aiReview,
    memorableQuote,
    reasonsToWatch,
    moodTags,
    metrics,
    discussionQuestions
  }
}
