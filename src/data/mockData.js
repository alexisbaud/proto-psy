// =============================================================================
// Sereni — Mock Data
// =============================================================================
// Toutes les données fictives utilisées dans le prototype.
// Les dates sont calculées relativement à aujourd'hui pour rester cohérentes.
// =============================================================================

// ---------------------------------------------------------------------------
// Helpers — dates relatives
// ---------------------------------------------------------------------------

const today = new Date();
today.setHours(0, 0, 0, 0);

function daysAgo(n) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n) {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d;
}

function atTime(date, hours, minutes) {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// ---------------------------------------------------------------------------
// 1. MOOD_GRID — grille 5x5 de mots-humeurs
//    Axe Y (row 0 = haute énergie → row 4 = basse énergie)
//    Axe X (col 0 = valence désagréable → col 4 = valence agréable)
// ---------------------------------------------------------------------------

// Quadrants HowWeFeel-style (Bubble Cloud):
//   TOP-LEFT:     High energy + Unpleasant  → Rouge
//   TOP-RIGHT:    High energy + Pleasant    → Jaune
//   BOTTOM-LEFT:  Low energy  + Unpleasant  → Bleu
//   BOTTOM-RIGHT: Low energy  + Pleasant    → Vert

export const MOOD_QUADRANTS = {
  highUnpleasant: {
    label: 'Énergie haute · Désagréable',
    bg: '#E53935',
    bgLight: '#FFEBEE',
    moods: [
      { id: 'hu-1', label: 'Enragé·e',   color: '#C62828', def: "Une colère intense qui submerge tout le reste." },
      { id: 'hu-2', label: 'Paniqué·e',  color: '#D32F2F', def: "Un sentiment d'urgence incontrôlable face au danger." },
      { id: 'hu-3', label: 'Stressé·e',  color: '#E53935', def: "Une pression mentale qui crée de la tension." },
      { id: 'hu-4', label: 'Anxieux·se', color: '#EF5350', def: "Une inquiétude diffuse tournée vers l'avenir." },
      { id: 'hu-5', label: 'Frustré·e',  color: '#FF5252', def: "Le sentiment d'être bloqué·e malgré ses efforts." },
      { id: 'hu-6', label: 'Agacé·e',    color: '#FF8A65', def: "Une irritation légère mais persistante." },
      { id: 'hu-7', label: 'En colère',  color: '#D84315', def: "Une réaction vive face à une injustice perçue." },
      { id: 'hu-8', label: 'Tendu·e',    color: '#FF7043', def: "Un état de vigilance qui empêche de se relâcher." },
      { id: 'hu-9', label: 'Agité·e',    color: '#FF8A65', def: "Une nervosité qui rend difficile de rester en place." },
    ],
  },
  highPleasant: {
    label: 'Énergie haute · Agréable',
    bg: '#FDD835',
    bgLight: '#FFFDE7',
    moods: [
      { id: 'hp-1', label: 'Euphorique',   color: '#F57F17', def: "Un bonheur débordant qui donne envie de tout." },
      { id: 'hp-2', label: 'Excité·e',     color: '#F9A825', def: "Une anticipation joyeuse de quelque chose à venir." },
      { id: 'hp-3', label: 'Enthousiaste', color: '#FBC02D', def: "Un élan d'énergie positive tourné vers l'action." },
      { id: 'hp-4', label: 'Joyeux·se',    color: '#FFEB3B', def: "Un sentiment lumineux de bien-être intérieur." },
      { id: 'hp-5', label: 'Énergique',    color: '#C0CA33', def: "Un surplus de vitalité qui pousse à bouger." },
      { id: 'hp-6', label: 'Optimiste',    color: '#9CCC65', def: "La conviction que les choses vont bien se passer." },
      { id: 'hp-7', label: 'Confiant·e',   color: '#AED581', def: "Un sentiment de force et de capacité intérieure." },
      { id: 'hp-8', label: 'Inspiré·e',    color: '#DCE775', def: "Un souffle créatif qui ouvre des possibilités." },
      { id: 'hp-9', label: 'Fier·e',       color: '#FFD54F', def: "La satisfaction d'avoir accompli quelque chose." },
    ],
  },
  lowUnpleasant: {
    label: 'Énergie basse · Désagréable',
    bg: '#5C6BC0',
    bgLight: '#E8EAF6',
    moods: [
      { id: 'lu-1', label: 'Épuisé·e',    color: '#283593', def: "Un vide d'énergie total, physique et mental." },
      { id: 'lu-2', label: 'Désespéré·e', color: '#3949AB', def: "L'impression que rien ne peut s'améliorer." },
      { id: 'lu-3', label: 'Triste',      color: '#5C6BC0', def: "Une peine intérieure qui ralentit tout." },
      { id: 'lu-4', label: 'Seul·e',      color: '#7986CB', def: "Un sentiment d'isolement, même entouré·e." },
      { id: 'lu-5', label: 'Découragé·e', color: '#9FA8DA', def: "L'envie d'abandonner face aux obstacles." },
      { id: 'lu-6', label: 'Vidé·e',      color: '#42A5F5', def: "Un manque de ressources intérieures." },
      { id: 'lu-7', label: 'Mélancolique', color: '#64B5F6', def: "Une nostalgie douce mêlée de tristesse." },
      { id: 'lu-8', label: 'Ennuyé·e',    color: '#78909C', def: "Un manque de stimulation et d'intérêt." },
      { id: 'lu-9', label: 'Fatigué·e',   color: '#90A4AE', def: "Un besoin profond de repos et de calme." },
    ],
  },
  lowPleasant: {
    label: 'Énergie basse · Agréable',
    bg: '#66BB6A',
    bgLight: '#E8F5E9',
    moods: [
      { id: 'lp-1', label: 'Paisible',        color: '#2E7D32', def: "Un calme profond, en harmonie avec soi." },
      { id: 'lp-2', label: 'Détendu·e',       color: '#388E3C', def: "Le corps et l'esprit relâchés, sans tension." },
      { id: 'lp-3', label: 'Serein·e',        color: '#43A047', def: "Une tranquillité intérieure stable et douce." },
      { id: 'lp-4', label: 'Apaisé·e',        color: '#4CAF50', def: "Un soulagement après un moment difficile." },
      { id: 'lp-5', label: 'Reconnaissant·e', color: '#66BB6A', def: "De la gratitude pour ce qu'on a." },
      { id: 'lp-6', label: 'Satisfait·e',     color: '#81C784', def: "Le sentiment que les choses sont bien comme elles sont." },
      { id: 'lp-7', label: 'Bien',            color: '#A5D6A7', def: "Un état simple et confortable, sans excès." },
      { id: 'lp-8', label: 'En sécurité',     color: '#C8E6C9', def: "Un sentiment de protection et de stabilité." },
      { id: 'lp-9', label: 'Réconforté·e',    color: '#69F0AE', def: "La chaleur d'un soutien reçu ou ressenti." },
    ],
  },
};

export const CONTEXT_TAGS = [
  { id: 'work',     label: 'Travail',       icon: '💼' },
  { id: 'family',   label: 'Famille',       icon: '👨‍👩‍👧' },
  { id: 'friends',  label: 'Ami·es',        icon: '👋' },
  { id: 'health',   label: 'Santé',         icon: '🏥' },
  { id: 'rest',     label: 'Repos',         icon: '😴' },
  { id: 'sport',    label: 'Sport',         icon: '🏃' },
  { id: 'food',     label: 'Alimentation',  icon: '🍽️' },
  { id: 'love',     label: 'Relation',      icon: '❤️' },
  { id: 'money',    label: 'Finances',      icon: '💰' },
  { id: 'studies',  label: 'Études',        icon: '📚' },
  { id: 'hobby',    label: 'Loisir',        icon: '🎨' },
  { id: 'therapy',  label: 'Thérapie',      icon: '🧠' },
];

// ---------------------------------------------------------------------------
// 2. JOURNAL_ENTRIES — entrées de journal pré-remplies
// ---------------------------------------------------------------------------

export const JOURNAL_ENTRIES = [
  // Jour 1 — il y a 3 jours
  {
    id: 'entry-1',
    date: atTime(daysAgo(3), 9, 30),
    time: '09:30',
    mood: 'Serein·e',
    moodColor: '#A5D6A7',
    content:
      "Ce matin j'ai pris le temps de marcher un peu avant de commencer la journée. " +
      "L'air était frais, ça m'a fait du bien de sentir le soleil sur mon visage. " +
      "J'ai l'impression que ces petits moments m'aident à rester ancré·e.",
  },
  {
    id: 'entry-2',
    date: atTime(daysAgo(3), 15, 0),
    time: '15:00',
    mood: 'Anxieux·se',
    moodColor: '#EF6C00',
    content:
      "L'après-midi a été compliquée au travail. Trop de choses à gérer en même temps, " +
      "je me suis senti·e submergé·e par la charge. J'ai du mal à dire non quand on me " +
      "demande des choses et ça s'accumule. J'ai besoin de trouver un moyen de mieux " +
      "poser mes limites.",
    completedExercise: {
      id: 'circles-1',
      title: 'Cercles de contrôle',
    },
  },

  // Jour 2 — il y a 2 jours
  {
    id: 'entry-3',
    date: atTime(daysAgo(2), 8, 15),
    time: '08:15',
    mood: 'Fatigué·e',
    moodColor: '#90A4AE',
    content:
      "Très mal dormi cette nuit, je me suis réveillé·e plusieurs fois. " +
      "J'ai l'impression que les pensées tournent en boucle dès que je ferme les yeux. " +
      "Ce matin c'est dur de trouver l'énergie pour démarrer.",
  },

  // Jour 3 — hier
  {
    id: 'entry-4',
    date: atTime(daysAgo(1), 19, 45),
    time: '19:45',
    mood: 'Apaisé·e',
    moodColor: '#80CBC4',
    content:
      "Séance avec Dr. Martin aujourd'hui. On a parlé de mon besoin de tout contrôler " +
      "et de comment ça crée de l'anxiété. Ça m'a fait du bien de mettre des mots dessus. " +
      "Je me sens plus léger·e ce soir, comme si un poids avait été enlevé.",
    debriefCompleted: true,
  },
];

// ---------------------------------------------------------------------------
// 3. SESSIONS — séances de thérapie
// ---------------------------------------------------------------------------

export const SESSIONS = [
  {
    id: 'session-1',
    date: daysAgo(14),
    therapist: 'Dr. Martin',
    type: 'past',
    debriefCompleted: true,
  },
  {
    id: 'session-2',
    date: daysAgo(1),
    therapist: 'Dr. Martin',
    type: 'past',
    debriefCompleted: false,
  },
  {
    id: 'session-3',
    date: daysFromNow(14),
    therapist: 'Dr. Martin',
    type: 'upcoming',
    debriefCompleted: false,
  },
];

// ---------------------------------------------------------------------------
// 4. QUESTIONNAIRE_QUESTIONS — questionnaire initial
// ---------------------------------------------------------------------------

export const QUESTIONNAIRE_QUESTIONS = [
  {
    id: 'q1',
    text: "Dans l'ensemble, je suis satisfait·e avec moi-même",
    type: 'likert',
    options: [
      { id: 'q1-1', label: "Pas du tout d'accord" },
      { id: 'q1-2', label: "Pas d'accord" },
      { id: 'q1-3', label: 'Neutre' },
      { id: 'q1-4', label: "D'accord" },
      { id: 'q1-5', label: "Tout à fait d'accord" },
    ],
  },
  {
    id: 'q2',
    text: 'Je me sens capable de gérer les situations stressantes',
    type: 'likert',
    options: [
      { id: 'q2-1', label: "Pas du tout d'accord" },
      { id: 'q2-2', label: "Pas d'accord" },
      { id: 'q2-3', label: 'Neutre' },
      { id: 'q2-4', label: "D'accord" },
      { id: 'q2-5', label: "Tout à fait d'accord" },
    ],
  },
  {
    id: 'q3',
    text: "Quels sont tes objectifs en utilisant l'application ?",
    type: 'multiple',
    options: [
      { id: 'q3-1', label: 'Mieux me comprendre' },
      { id: 'q3-2', label: 'Gérer mon stress' },
      { id: 'q3-3', label: 'Améliorer mon sommeil' },
      { id: 'q3-4', label: 'Suivre ma progression' },
      { id: 'q3-5', label: 'Préparer mes séances' },
    ],
  },
  {
    id: 'q4',
    text: "À quelle fréquence souhaites-tu utiliser l'app ?",
    type: 'single',
    options: [
      { id: 'q4-1', label: 'Tous les jours' },
      { id: 'q4-2', label: 'Plusieurs fois par semaine' },
      { id: 'q4-3', label: 'Une fois par semaine' },
      { id: 'q4-4', label: "Quand j'en ressens le besoin" },
    ],
  },
];

// ---------------------------------------------------------------------------
// 5. EXERCISE_ITEMS — items pour l'exercice "Cercles de contrôle"
// ---------------------------------------------------------------------------

export const EXERCISE_ITEMS = [
  { id: 'item-1',  text: 'La charge de travail que mon manager m\'impose' },
  { id: 'item-2',  text: 'Ma réaction face au stress' },
  { id: 'item-3',  text: "L'opinion que les autres ont de moi" },
  { id: 'item-4',  text: 'Le temps que je consacre à me reposer' },
  { id: 'item-5',  text: 'Les embouteillages le matin' },
  { id: 'item-6',  text: 'Ma façon de communiquer mes besoins' },
  { id: 'item-7',  text: "L'attitude de mes collègues" },
  { id: 'item-8',  text: 'Le choix de mes activités le week-end' },
  { id: 'item-9',  text: "L'économie et le marché de l'emploi" },
  { id: 'item-10', text: 'Ma routine du soir avant de dormir' },
  { id: 'item-11', text: 'Les décisions de mon entreprise' },
  { id: 'item-12', text: 'La manière dont je parle de moi-même' },
];

// ---------------------------------------------------------------------------
// 6. EXERCISES_LIST — liste des exercices disponibles
// ---------------------------------------------------------------------------

export const EXERCISES_LIST = [
  {
    id: 'circles',
    title: 'Cercles de contrôle',
    description:
      'Apprends à distinguer ce que tu peux contrôler de ce qui te dépasse pour réduire ton anxiété.',
    duration: '10 min',
    category: 'Gestion du stress',
    icon: '🎯',
    active: true,
  },
  {
    id: 'breathing',
    title: 'Respiration guidée',
    description:
      'Des exercices de respiration pour calmer ton système nerveux en quelques minutes.',
    duration: '5 min',
    category: 'Relaxation',
    icon: '🌬️',
    active: false,
  },
  {
    id: 'body-scan',
    title: 'Scan corporel',
    description:
      'Parcours ton corps de la tête aux pieds pour relâcher les tensions accumulées.',
    duration: '15 min',
    category: 'Relaxation',
    icon: '🧘',
    active: false,
  },
  {
    id: 'cognitive-restructuring',
    title: 'Restructuration cognitive',
    description:
      "Identifie et reformule tes pensées automatiques pour adopter un regard plus nuancé.",
    duration: '10 min',
    category: 'Pensées',
    icon: '🧠',
    active: false,
  },
  {
    id: 'grounding',
    title: 'Ancrage sensoriel',
    description:
      "Utilise tes 5 sens pour te reconnecter au moment présent quand l'anxiété monte.",
    duration: '5 min',
    category: 'Pleine conscience',
    icon: '✋',
    active: false,
  },
];

// ---------------------------------------------------------------------------
// 7. DEBRIEF_SCRIPT — arbre conversationnel du débrief post-séance
// ---------------------------------------------------------------------------

export const DEBRIEF_SCRIPT = {
  start: {
    id: 'start',
    message: "Salut ! Comment s'est passée ta séance aujourd'hui ?",
    options: [
      { id: 'opt-good',      label: 'Plutôt bien', nextId: 'good' },
      { id: 'opt-mixed',     label: 'Mitigé',      nextId: 'mixed' },
      { id: 'opt-difficult', label: 'Difficile',   nextId: 'difficult' },
    ],
  },

  // Branche "Plutôt bien"
  good: {
    id: 'good',
    message: "Super ! Qu'est-ce qui t'a le plus marqué·e pendant cette séance ?",
    options: [
      { id: 'opt-good-1', label: 'Une prise de conscience',  nextId: 'end' },
      { id: 'opt-good-2', label: 'Un exercice utile',        nextId: 'end' },
      { id: 'opt-good-3', label: 'Le soutien de mon psy',    nextId: 'end' },
    ],
  },

  // Branche "Mitigé"
  mixed: {
    id: 'mixed',
    message:
      "Je comprends. Est-ce qu'il y a un sujet en particulier qui t'a mis·e mal à l'aise ?",
    options: [
      { id: 'opt-mixed-1', label: 'Un sujet difficile',             nextId: 'end' },
      { id: 'opt-mixed-2', label: 'Je ne sais pas trop',            nextId: 'end' },
      { id: 'opt-mixed-3', label: "Je me suis senti·e incompris·e", nextId: 'end' },
    ],
  },

  // Branche "Difficile"
  difficult: {
    id: 'difficult',
    message:
      'Merci de partager ça. Les séances difficiles font aussi partie du processus. Tu veux en parler un peu ?',
    options: [
      { id: 'opt-diff-1', label: 'Oui',            nextId: 'difficult-talk' },
      { id: 'opt-diff-2', label: 'Pas maintenant',  nextId: 'end' },
    ],
  },

  'difficult-talk': {
    id: 'difficult-talk',
    message:
      "Je t'écoute. Prends le temps qu'il te faut pour écrire ce que tu ressens.",
    options: [
      { id: 'opt-difftalk-1', label: "J'ai terminé", nextId: 'end' },
    ],
  },

  // Fin commune
  end: {
    id: 'end',
    message:
      "Merci pour ce partage. N'hésite pas à noter tes réflexions dans ton journal. Prends soin de toi \uD83D\uDC9B",
    options: [],
  },
};

// ---------------------------------------------------------------------------
// 8. DANGER_KEYWORDS — mots-clés de danger (risque suicidaire / auto-lésion)
// ---------------------------------------------------------------------------

export const DANGER_KEYWORDS = [
  'me tuer',
  'me suicider',
  'envie de mourir',
  'en finir',
  'plus envie de vivre',
  'me faire du mal',
  'me couper',
  'me blesser',
  'automutilation',
  'scarification',
  "sauter d'un pont",
  'avaler des cachets',
  'je veux disparaître',
  'le monde serait mieux sans moi',
];

// ---------------------------------------------------------------------------
// 9. COGNITIVE_DISTORTION_KEYWORDS — mots-clés distorsions cognitives
//    (sentiment de perte de contrôle)
// ---------------------------------------------------------------------------

export const COGNITIVE_DISTORTION_KEYWORDS = [
  'je ne contrôle rien',
  'tout me dépasse',
  "c'est trop pour moi",
  'je ne peux rien faire',
  'impuissant',
  'impuissante',
  'submergé',
  'submergée',
  'débordé',
  'débordée',
  "je n'ai aucun pouvoir",
  'rien ne dépend de moi',
  'je suis bloqué',
  'je suis bloquée',
];

// ---------------------------------------------------------------------------
// 10. INSOMNIA_KEYWORDS — mots-clés liés aux troubles du sommeil
// ---------------------------------------------------------------------------

export const INSOMNIA_KEYWORDS = [
  'insomnie',
  "je n'arrive pas à dormir",
  'je dors mal',
  'réveils nocturnes',
  'cauchemars',
  'je me réveille la nuit',
  'épuisé',
  'épuisée',
  'pas dormi',
];

// ---------------------------------------------------------------------------
// 11. RUMINATION_KEYWORDS — mots-clés liés à la rumination
// ---------------------------------------------------------------------------

export const RUMINATION_KEYWORDS = [
  "je n'arrête pas d'y penser",
  'ça tourne en boucle',
  'ruminer',
  'rumination',
  'obsédé',
  'obsédée',
  'pensées intrusives',
  'je ressasse',
];
