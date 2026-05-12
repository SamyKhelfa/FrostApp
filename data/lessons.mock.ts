/**
 * Mock data aligned on the backend Prisma schema.
 * Replace with real API calls when ready (GET /lesson, /chapter, /subchapter).
 *
 * Backend models (frostapp-v2-backend/prisma/schema.prisma):
 *   - Lesson    (id, title, description, users[], chapters[], createdAt, updatedAt)
 *   - Chapter   (id, title, description, image, status, position, lessonId, SubChapter[], …)
 *   - SubChapter(id, title, description, video, duration, active, position, chapterId, status)
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SubChapter = {
  id: number;
  title: string;
  description: string;
  video: string;
  duration: number; // in seconds
  active: boolean;
  position: number;
  chapterId: number;
  status: boolean;
};

export type Chapter = {
  id: number;
  title: string;
  description: string;
  image: string;
  status: boolean;
  position: number;
  lessonId: number;
  subChapters: SubChapter[];
  createdAt: string;
  updatedAt: string;
};

export type Lesson = {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const NOW = "2026-04-15T10:00:00.000Z";

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const IMAGE = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80`;

// ─── Mock lessons ──────────────────────────────────────────────────────────────

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Les fondations du froid",
    description:
      "Découvre les bases de l'exposition au froid et apprivoise tes premières sensations.",
    createdAt: NOW,
    updatedAt: NOW,
    chapters: [
      {
        id: 11,
        title: "Pourquoi le froid ?",
        description:
          "Comprendre les bénéfices physiologiques et mentaux du froid.",
        image: IMAGE("photo-1483728642387-6c3bdd6c93e5"),
        status: true,
        position: 1,
        lessonId: 1,
        createdAt: NOW,
        updatedAt: NOW,
        subChapters: [
          {
            id: 111,
            title: "Introduction au froid",
            description: "Les origines du protocole et les références modernes.",
            video: SAMPLE_VIDEO,
            duration: 240,
            active: true,
            position: 1,
            chapterId: 11,
            status: true,
          },
          {
            id: 112,
            title: "Les bienfaits scientifiques",
            description: "Vasoconstriction, dopamine, système immunitaire.",
            video: SAMPLE_VIDEO,
            duration: 380,
            active: true,
            position: 2,
            chapterId: 11,
            status: true,
          },
        ],
      },
      {
        id: 12,
        title: "Ta première douche froide",
        description: "Premier protocole concret pour démarrer dès demain.",
        image: IMAGE("photo-1535025639604-9a804c092faa"),
        status: true,
        position: 2,
        lessonId: 1,
        createdAt: NOW,
        updatedAt: NOW,
        subChapters: [
          {
            id: 121,
            title: "Préparer sa salle de bain",
            description: "Le rituel d'avant-douche pour rester centré.",
            video: SAMPLE_VIDEO,
            duration: 180,
            active: true,
            position: 1,
            chapterId: 12,
            status: true,
          },
          {
            id: 122,
            title: "Les 30 secondes magiques",
            description: "Comment passer le cap des premières secondes.",
            video: SAMPLE_VIDEO,
            duration: 300,
            active: true,
            position: 2,
            chapterId: 12,
            status: true,
          },
          {
            id: 123,
            title: "Sortir et se reconstruire",
            description: "Le retour à la chaleur, la respiration de fin.",
            video: SAMPLE_VIDEO,
            duration: 220,
            active: true,
            position: 3,
            chapterId: 12,
            status: true,
          },
        ],
      },
      {
        id: 13,
        title: "Construire ta routine",
        description: "Installer le froid dans ton quotidien sans pression.",
        image: IMAGE("photo-1500964757637-c85e8a162699"),
        status: true,
        position: 3,
        lessonId: 1,
        createdAt: NOW,
        updatedAt: NOW,
        subChapters: [
          {
            id: 131,
            title: "Fréquence et progression",
            description: "Combien de fois par semaine, et comment progresser.",
            video: SAMPLE_VIDEO,
            duration: 260,
            active: true,
            position: 1,
            chapterId: 13,
            status: true,
          },
          {
            id: 132,
            title: "Tenir sur la durée",
            description: "Les pièges du débutant et comment les éviter.",
            video: SAMPLE_VIDEO,
            duration: 320,
            active: true,
            position: 2,
            chapterId: 13,
            status: true,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Méthode Wim Hof",
    description:
      "Maîtrise la respiration et l'eau froide à la manière du maître néerlandais.",
    createdAt: NOW,
    updatedAt: NOW,
    chapters: [
      {
        id: 21,
        title: "Le souffle qui réchauffe",
        description: "La respiration en 3 rondes expliquée pas à pas.",
        image: IMAGE("photo-1506744038136-46273834b3fb"),
        status: true,
        position: 1,
        lessonId: 2,
        createdAt: NOW,
        updatedAt: NOW,
        subChapters: [
          {
            id: 211,
            title: "Anatomie du souffle",
            description: "Diaphragme, poumons, oxygénation.",
            video: SAMPLE_VIDEO,
            duration: 360,
            active: true,
            position: 1,
            chapterId: 21,
            status: true,
          },
          {
            id: 212,
            title: "Première ronde guidée",
            description: "30 respirations + rétention, on y va ensemble.",
            video: SAMPLE_VIDEO,
            duration: 600,
            active: true,
            position: 2,
            chapterId: 21,
            status: true,
          },
          {
            id: 213,
            title: "Trois rondes complètes",
            description: "Session complète guidée par Maxime.",
            video: SAMPLE_VIDEO,
            duration: 1200,
            active: true,
            position: 3,
            chapterId: 21,
            status: true,
          },
        ],
      },
      {
        id: 22,
        title: "Le bain glacé",
        description: "Du baquet à 8°C jusqu'au bain à 2°C.",
        image: IMAGE("photo-1517637382994-f02da38c6728"),
        status: true,
        position: 2,
        lessonId: 2,
        createdAt: NOW,
        updatedAt: NOW,
        subChapters: [
          {
            id: 221,
            title: "Préparation mentale",
            description: "Visualisation et ancrage avant l'immersion.",
            video: SAMPLE_VIDEO,
            duration: 280,
            active: true,
            position: 1,
            chapterId: 22,
            status: true,
          },
          {
            id: 222,
            title: "Entrée progressive",
            description: "Les pieds, puis les jambes, puis tout le corps.",
            video: SAMPLE_VIDEO,
            duration: 420,
            active: true,
            position: 2,
            chapterId: 22,
            status: true,
          },
        ],
      },
      {
        id: 23,
        title: "Méditation et concentration",
        description: "L'esprit qui se pose dans l'inconfort.",
        image: IMAGE("photo-1499209974431-9dddcece7f88"),
        status: true,
        position: 3,
        lessonId: 2,
        createdAt: NOW,
        updatedAt: NOW,
        subChapters: [
          {
            id: 231,
            title: "Le scan corporel",
            description: "Observer sans réagir, scanner du haut vers le bas.",
            video: SAMPLE_VIDEO,
            duration: 540,
            active: true,
            position: 1,
            chapterId: 23,
            status: true,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Bains glacés intensifs",
    description:
      "Programme avancé pour développer ta résistance et ta longévité face au froid.",
    createdAt: NOW,
    updatedAt: NOW,
    chapters: [
      {
        id: 31,
        title: "Tenir 5 minutes à 2°C",
        description: "Le palier mental et physique des 5 minutes.",
        image: IMAGE("photo-1551524559-8af4e6624178"),
        status: true,
        position: 1,
        lessonId: 3,
        createdAt: NOW,
        updatedAt: NOW,
        subChapters: [
          {
            id: 311,
            title: "Avant : le corps prêt",
            description: "Échauffement et état d'esprit du long format.",
            video: SAMPLE_VIDEO,
            duration: 360,
            active: true,
            position: 1,
            chapterId: 31,
            status: true,
          },
          {
            id: 312,
            title: "Pendant : la traversée",
            description: "Comment gérer minute par minute.",
            video: SAMPLE_VIDEO,
            duration: 480,
            active: true,
            position: 2,
            chapterId: 31,
            status: true,
          },
        ],
      },
      {
        id: 32,
        title: "Récupération musculaire",
        description: "Le froid comme outil de récupération sportive.",
        image: IMAGE("photo-1517836357463-d25dfeac3438"),
        status: true,
        position: 2,
        lessonId: 3,
        createdAt: NOW,
        updatedAt: NOW,
        subChapters: [
          {
            id: 321,
            title: "Protocole post-entraînement",
            description: "Quand, combien de temps, à quelle température.",
            video: SAMPLE_VIDEO,
            duration: 300,
            active: true,
            position: 1,
            chapterId: 32,
            status: true,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Mental d'acier",
    description:
      "Travaille ton mental dans l'inconfort et apprends à dompter ton stress.",
    createdAt: NOW,
    updatedAt: NOW,
    chapters: [
      {
        id: 41,
        title: "Comprendre la peur du froid",
        description: "D'où vient la résistance, et comment la décoder.",
        image: IMAGE("photo-1486325212027-8081e485255e"),
        status: true,
        position: 1,
        lessonId: 4,
        createdAt: NOW,
        updatedAt: NOW,
        subChapters: [
          {
            id: 411,
            title: "Réflexe de fuite",
            description: "Le mécanisme nerveux derrière l'envie de sortir.",
            video: SAMPLE_VIDEO,
            duration: 320,
            active: true,
            position: 1,
            chapterId: 41,
            status: true,
          },
          {
            id: 412,
            title: "Hacker son cerveau",
            description: "Outils cognitifs concrets pour rester.",
            video: SAMPLE_VIDEO,
            duration: 380,
            active: true,
            position: 2,
            chapterId: 41,
            status: true,
          },
        ],
      },
      {
        id: 42,
        title: "Apnée sous la glace",
        description: "Aller plus loin : nager 40m sous la surface gelée.",
        image: IMAGE("photo-1518563259479-d003c05a6507"),
        status: true,
        position: 2,
        lessonId: 4,
        createdAt: NOW,
        updatedAt: NOW,
        subChapters: [
          {
            id: 421,
            title: "Sécurité avant tout",
            description: "Le binôme, la corde, la lecture de la glace.",
            video: SAMPLE_VIDEO,
            duration: 420,
            active: true,
            position: 1,
            chapterId: 42,
            status: true,
          },
          {
            id: 422,
            title: "Le geste sous l'eau",
            description: "Économie d'énergie et placement du corps.",
            video: SAMPLE_VIDEO,
            duration: 540,
            active: true,
            position: 2,
            chapterId: 42,
            status: true,
          },
        ],
      },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Total seconds across all subchapters of a lesson. */
export const lessonTotalSeconds = (lesson: Lesson): number =>
  lesson.chapters.reduce(
    (acc, c) => acc + c.subChapters.reduce((s, sc) => s + sc.duration, 0),
    0,
  );

/** Format a duration (seconds) as "1h 25" or "12 min". */
export const formatDuration = (totalSeconds: number): string => {
  const mins = Math.round(totalSeconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m.toString().padStart(2, "0")}`;
};

/** Total number of subchapters in a lesson. */
export const lessonSubChapterCount = (lesson: Lesson): number =>
  lesson.chapters.reduce((acc, c) => acc + c.subChapters.length, 0);

/** Find a lesson by id. */
export const findLesson = (id: number): Lesson | undefined =>
  LESSONS.find((l) => l.id === id);
