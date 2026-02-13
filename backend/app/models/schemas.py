from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict

class Repository(BaseModel):
    name: str
    url: HttpUrl
    description: Optional[str] = None
    stars: int
    forks: int
    language: Optional[str] = None
    is_fork: bool
    last_updated: str
    has_readme: bool = False

class ProfileStats(BaseModel):
    total_stars: int
    total_forks: int
    total_repos: int
    languages: Dict[str, int]

class ScoreBreakdown(BaseModel):
    documentation: int
    code_structure: int
    activity: int
    impact: int
    technical: int
    professionalism: int

class AnalysisResult(BaseModel):
    username: str
    avatar_url: HttpUrl
    total_score: int
    breakdown: ScoreBreakdown
    stats: ProfileStats
    top_repos: List[Repository]
    improvement_tips: List[str]
    recruiter_feedback: Optional[Dict] = None
