export interface User {
    _id: string;
    email: string;
    profilePicture?: string;
    totalExperience?: number;
    experiencePoints?: { points: number, timestamp: string }[];
    community?: string;
}

export interface Community {
    _id: string;
    name: string;
    logo?: string;
    users?: Array<string>;
}

export interface Leaderboard {
    _id: string;
    community?: string;
    communityLogo?: string;
    communityName?: string;
    rank?: number;
    communityPoints?: number;
    userCount?: number;
}