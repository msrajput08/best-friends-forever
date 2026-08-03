import { MemoryItem } from '../types';

export interface AppConfig {
  enableTimeline: boolean;
  allowFreeNavigation: boolean;
  bubbleCompletionCount: number;
  memoryPoolFolder: string;
  transitionSpeed: number;

  captionPools: {
    poolA: string[];
    poolB: string[];
  };

  memoryTitles: string[];
}

export const APP_CONFIG: AppConfig = {
  enableTimeline: true,
  allowFreeNavigation: true,
  bubbleCompletionCount: 7,
  memoryPoolFolder: '/memories',
  transitionSpeed: 500,
  captionPools: {
    poolA: [
  "Some friendships don't need promises—they simply keep showing up.",
  "The safest place has always been our conversations.",
  "No matter how life changes, our friendship always feels like home.",
  "The best memories were never planned—they happened with you.",
  "Every laugh with you became a memory worth keeping forever.",
  "Distance changes locations, never real friendships.",
  "You made ordinary days feel unforgettable.",
  "The world feels lighter when you're around.",
  "Some people become family without sharing the same blood.",
  "Every chapter of life feels better because you were in it.",
  "Thank you for always believing in me when I couldn't.",
  "Real friendship is choosing each other, again and again.",
  "Every goodbye with you secretly carried another hello.",
  "You stayed when leaving would've been easier.",
  "Life gave me many people, but it gifted me you.",
  "Our friendship has survived silence, distance, and time.",
  "No matter where we go, our memories always find us.",
  "Some bonds aren't explained—they're simply felt.",
  "You turned countless ordinary moments into lifelong treasures.",
  "Forever isn't a promise. It's what true friendship naturally becomes."
],
    poolB: [
  "Some friendships quietly become the safest place you'll ever know.",
  "No matter how life changes, some people always feel like home.",
  "The best memories are the ones we never planned.",
  "A true friend turns ordinary moments into unforgettable stories.",
  "Distance can never weaken a bond built on trust.",
  "Every laugh we shared became a memory worth keeping forever.",
  "Real friendship is showing up, even when words are not enough.",
  "Some people enter your life and make everything feel lighter.",
  "Together, even the toughest days felt a little easier.",
  "The strongest friendships are built on countless little moments.",
  "No filters, no pretending—just genuine friendship.",
  "The comfort of knowing someone will always stand beside you is priceless.",
  "A single conversation with a true friend can brighten the darkest day.",
  "Friendship is the quiet promise of never facing life alone.",
  "Some bonds don't need daily conversations to stay strong.",
  "Every challenge became easier because we faced it together.",
  "The best part of every journey was having you there.",
  "Laughter sounds better when shared with a best friend.",
  "True friends celebrate your happiness like it's their own.",
  "Life gave us memories, but friendship gave them meaning.",
  "Even after every silly fight, we always found our way back.",
  "The strongest bonds are tested by misunderstandings, not broken by them.",
  "Every disagreement taught us how valuable this friendship truly is.",
  "You never let me face my fears alone.",
  "Some friendships heal without needing an apology.",
  "The greatest gift isn't finding a perfect friend—it's finding a real one.",
  "Thank you for believing in me when I couldn't believe in myself.",
  "Your support became my strength when I needed it most.",
  "No matter where life takes us, this friendship will always remain.",
  "Comfort isn't a place—it's the people who understand you.",
  "Some memories fade, but true friendship never does.",
  "Every adventure became unforgettable because you were part of it.",
  "You always knew how to make ordinary days feel special.",
  "Forever isn't about time—it's about the people who never leave your heart.",
  "Our friendship is proof that family isn't always defined by blood.",
  "Through every season of life, you've remained my constant.",
  "The greatest stories begin with an unexpected friendship.",
  "Some people become chapters; true friends become the whole story.",
  "No matter how many years pass, this bond will always feel the same.",
  "Here's to every laugh, every lesson, and every memory we've created together."
],
  },
  memoryTitles : [
  "Two Souls, One Friendship",
  "The Kind of Friend Everyone Wishes For",
  "Where Laughter Lives Forever",
  "Our Little World",
  "A Bond Time Couldn't Break",
  "More Than Just Best Friends",
  "Every Memory Has Your Name",
  "The Chapter Called Us",
  "The Person Who Never Left",
  "The Comfort Behind Every Smile",
  "Together Through Every Storm",
  "When Life Needed a Friend",
  "The Story Only We Understand",
  "Our Forever Kind of Friendship",
  "Every Goodbye Led Back to You",
  "A Safe Place in Every Season",
  "The Magic of Ordinary Moments",
  "Always Found, Never Lost",
  "The Heart Behind Every Memory",
  "Forever Starts With Friendship"
],


};

export const GLOBAL_PHOTO_POOL: string[] = Array.from(
  { length: 71 },
  (_, i) => `/memories/photo (${i + 1}).jpg`
);

// export const MEMORY_ITEMS: MemoryItem[] = [
//   {
//     id: 1,
//     title: 'Late Night Conversations',
//     dateTag: 'CHAPTER 01',
//     imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
//     caption: 'Talking about life, dreams, and everything in between until the sun came up.',
//     stampLabel: 'SEALED MEMORY I',
//   },
//   {
//     id: 2,
//     title: 'The Unplanned Road Trip',
//     dateTag: 'CHAPTER 02',
//     imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
//     caption: 'No destination, endless laughter, and a playlist that defined our summer.',
//     stampLabel: 'SEALED MEMORY II',
//   },
//   {
//     id: 3,
//     title: 'Inside Jokes & Uncontrollable Laughter',
//     dateTag: 'CHAPTER 03',
//     imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
//     caption: 'Moments where one look was enough to make both of us burst into tears of joy.',
//     stampLabel: 'SEALED MEMORY III',
//   },
//   {
//     id: 4,
//     title: 'Standing By Each Other',
//     dateTag: 'CHAPTER 04',
//     imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
//     caption: 'Through every storm and milestone, knowing you always had my back.',
//     stampLabel: 'SEALED MEMORY IV',
//   },
//   {
//     id: 5,
//     title: 'Unforgettable Celebrations',
//     dateTag: 'CHAPTER 05',
//     imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
//     caption: 'Turning even the smallest wins into grand memories worth treasuring forever.',
//     stampLabel: 'SEALED MEMORY V',
//   },
//   {
//     id: 6,
//     title: 'A Bond Built For A Lifetime',
//     dateTag: 'CHAPTER 06',
//     imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
//     caption: 'Time and distance change many things, but our friendship remains unbreakable.',
//     stampLabel: 'SEALED MEMORY VI',
//   },
// ];
