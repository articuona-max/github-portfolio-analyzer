const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface AnalysisResult {
    username: string;
    avatar_url: string;
    total_score: number;
    breakdown: {
        documentation: number;
        code_structure: number;
        activity: number;
        impact: number;
        technical: number;
        professionalism: number;
    };
    stats: {
        total_stars: number;
        total_forks: number;
        total_repos: number;
        languages: Record<string, number>;
    };
    top_repos: Array<{
        name: string;
        url: string;
        description: string;
        stars: number;
        forks: number;
        language: string;
        last_updated: string;
    }>;
    improvement_tips: string[];
}

export async function fetchProfileAnalysis(username: string): Promise<AnalysisResult> {
    const res = await fetch(`${API_URL}/profile/${username}`);
    if (!res.ok) {
        if (res.status === 404) throw new Error("User not found");
        throw new Error("Failed to fetch analysis");
    }
    return res.json();
}
