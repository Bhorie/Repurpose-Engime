import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function calculateReachScore(metrics: {
  impressions: number;
  engagements: number;
  likes: number;
  retweets: number;
  replies: number;
}): number {
  // Weighted formula for reach score (0-100)
  const engagementRate = metrics.impressions > 0 
    ? (metrics.engagements / metrics.impressions) * 100 
    : 0;
  
  const viralityScore = (metrics.retweets * 3 + metrics.likes + metrics.replies * 2) / 10;
  
  return Math.min(100, (engagementRate * 0.4 + viralityScore * 0.6));
}

export function calculateRepurposeScore(item: {
  score: number;
  numComments: number;
  title: string;
  selftext?: string | null;
}): number {
  // Calculate repurpose score (0-100) based on Reddit engagement
  const scoreWeight = Math.min(item.score / 100, 1) * 40;
  const commentsWeight = Math.min(item.numComments / 50, 1) * 30;
  
  // Content quality: has text and good title
  const hasContent = item.selftext && item.selftext.length > 100 ? 15 : 0;
  const titleQuality = item.title.length > 30 && item.title.length < 200 ? 15 : 10;
  
  return scoreWeight + commentsWeight + hasContent + titleQuality;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}
