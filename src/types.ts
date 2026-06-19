export interface SurpriseConfig {
  recipientName: string;
  senderName: string;
  birthdayDate: string; // ISO string or YYYY-MM-DDTHH:mm
  letterParagraphs: string[];
  musicUrl: string;
  theme: "royal" | "rose" | "lavender" | "emerald";
}

export const DEFAULT_CONFIG: SurpriseConfig = {
  recipientName: "Mikachu",
  senderName: "Your Love Love",
  birthdayDate: "2026-07-23T00:00", // Will fallback/adapt when user customizes
  letterParagraphs: [
    "Happy Birthday! 💖",
    "On this very special day, I wanted to create something unique just for you. Year after year, you bring so much warmth, laughter, and light into the lives of everyone around you.",
    "This countdown holds more than just hours and minutes; it carries a deep appreciation for the wonderful person you are. I hope your day is filled with the same boundless joy you share with the world.",
    "May this year bring you closer to your dreams, surround you with love, and bless you with endless peaceful moments. You merit all the happiness in the universe.",
    "With all my love and best wishes,"
  ],
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // high quality fallback
  theme: "rose"
};

export interface HeartOrFlower {
  id: number;
  x: number; // percentage width
  y: number; // percentage height
  size: number;
  type: "heart" | "rose" | "cherry" | "star";
  color: string;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}
