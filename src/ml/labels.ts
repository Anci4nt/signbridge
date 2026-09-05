import type { SignLabel, SignMeta } from '@/types/sign';

export const LABELS: SignLabel[] = [
  'NONE',
  'HELLO',
  'YES',
  'NO',
  'THANK YOU',
  'PLEASE',
  'HELP',
  'STOP',
  'WATER',
  'FOOD',
  'DOCTOR',
  'HOME',
  'SCHOOL',
  'FRIEND',
  'SORRY',
  'EMERGENCY',
  'BAD',
  'BOOK',
  'CAT',
  'DRINK',
  'HOT',
  'ILY',
  'KNOW',
  'LEARN',
  'ME',
  'PHONE',
  'SEE',
  'WELCOME',
  'YOU',
];

export const NUM_CLASSES = LABELS.length;

export const SIGN_META: Record<SignLabel, SignMeta> = {
  NONE: {
    label: 'NONE',
    name: 'No sign',
    description: 'No supported sign is being performed, or no hand is visible.',
    difficulty: 'Beginner',
  },
  HELLO: {
    label: 'HELLO',
    name: 'Hello',
    description: 'An open hand raised near the head, moving side to side slightly — a common greeting.',
    difficulty: 'Beginner',
  },
  YES: {
    label: 'YES',
    name: 'Yes',
    description: 'A closed fist that nods up and down, like a head nodding "yes".',
    difficulty: 'Beginner',
  },
  NO: {
    label: 'NO',
    name: 'No',
    description: 'Index, middle finger and thumb tap together, like a mouth saying "no".',
    difficulty: 'Beginner',
  },
  'THANK YOU': {
    label: 'THANK YOU',
    name: 'Thank You',
    description: 'Fingertips touch the chin, then move forward toward the person you are thanking.',
    difficulty: 'Beginner',
  },
  PLEASE: {
    label: 'PLEASE',
    name: 'Please',
    description: 'Flat hand circles on the chest in a clockwise motion.',
    difficulty: 'Beginner',
  },
  HELP: {
    label: 'HELP',
    name: 'Help',
    description: 'A closed fist rests on a flat palm and is lifted upward — offering help.',
    difficulty: 'Intermediate',
  },
  STOP: {
    label: 'STOP',
    name: 'Stop',
    description: 'a flat, chopping motion with one hand hitting the open palm of the other',
    difficulty: 'Beginner',
  },
  WATER: {
    label: 'WATER',
    name: 'Water',
    description: 'Three-finger "W" handshape taps the chin.',
    difficulty: 'Intermediate',
  },
  FOOD: {
    label: 'FOOD',
    name: 'Food',
    description: 'Bunched fingertips touch the mouth, repeated.',
    difficulty: 'Beginner',
  },
  DOCTOR: {
    label: 'DOCTOR',
    name: 'Doctor',
    description: 'Fingertips of dominant "bent flat" hand taps twice',
    difficulty: 'Intermediate',
  },
  HOME: {
    label: 'HOME',
    name: 'Home',
    description: 'Fingertips touch the cheek, then the cheek again — like "eat" + "sleep" combined.',
    difficulty: 'Intermediate',
  },
  SCHOOL: {
    label: 'SCHOOL',
    name: 'School',
    description: 'A custom trained sign.',
    difficulty: 'Intermediate',
  },
  FRIEND: {
    label: 'FRIEND',
    name: 'Friend',
    description: 'Two hooked index fingers link together, then relink reversed.',
    difficulty: 'Advanced',
  },
  SORRY: {
    label: 'SORRY',
    name: 'Sorry',
    description: 'A closed fist circles on the chest, like an apology.',
    difficulty: 'Beginner',
  },
  EMERGENCY: {
    label: 'EMERGENCY',
    name: 'Emergency',
    description: 'A fist almost open.',
    difficulty: 'Advanced',
  },
  BAD: { label: 'BAD', name: 'Bad', description: 'A custom trained sign.', difficulty: 'Beginner' },
  BOOK: { label: 'BOOK', name: 'Book', description: 'A custom trained sign.', difficulty: 'Beginner' },
  CAT: { label: 'CAT', name: 'Cat', description: 'A custom trained sign.', difficulty: 'Beginner' },
  DRINK: { label: 'DRINK', name: 'Drink', description: 'A custom trained sign.', difficulty: 'Beginner' },
  HOT: { label: 'HOT', name: 'Hot', description: 'A custom trained sign.', difficulty: 'Beginner' },
  ILY: { label: 'ILY', name: 'I Love You', description: 'A custom trained sign.', difficulty: 'Beginner' },
  KNOW: { label: 'KNOW', name: 'Know', description: 'A custom trained sign.', difficulty: 'Beginner' },
  LEARN: { label: 'LEARN', name: 'Learn', description: 'A custom trained sign.', difficulty: 'Beginner' },
  ME: { label: 'ME', name: 'Me', description: 'A custom trained sign.', difficulty: 'Beginner' },
  PHONE: { label: 'PHONE', name: 'Phone', description: 'A custom trained sign.', difficulty: 'Beginner' },
  SEE: { label: 'SEE', name: 'See', description: 'A custom trained sign.', difficulty: 'Beginner' },
  WELCOME: { label: 'WELCOME', name: 'Welcome', description: 'A custom trained sign.', difficulty: 'Beginner' },
  YOU: { label: 'YOU', name: 'You', description: 'A custom trained sign.', difficulty: 'Beginner' },
};

export const PRACTICABLE_SIGNS = LABELS.filter(
  (label) => label !== 'NONE' && label !== 'SCHOOL',
);

export function labelDisplayName(label: SignLabel): string {
  return SIGN_META[label].name;
}
