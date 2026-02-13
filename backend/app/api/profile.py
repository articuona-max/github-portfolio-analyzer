from fastapi import APIRouter, HTTPException
from app.services.github_service import GitHubService
from app.services.scoring_service import ScoringService
from app.models.schemas import AnalysisResult, ProfileStats, Repository
from typing import List

router = APIRouter()

@router.get("/{username}", response_model=AnalysisResult)
async def analyze_profile(username: str):
    github_service = GitHubService()
    scoring_service = ScoringService()

    # 1. Fetch Profile
    profile_data = await github_service.get_profile(username)
    if not profile_data:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Fetch Repos
    repos_data = await github_service.get_repos(username)

    # 3. Process Data
    # Calculate stats
    total_stars = sum(r.get("stargazers_count", 0) for r in repos_data)
    total_forks = sum(r.get("forks_count", 0) for r in repos_data)
    languages = {}
    for r in repos_data:
        lang = r.get("language")
        if lang:
            languages[lang] = languages.get(lang, 0) + 1
    
    stats = ProfileStats(
        total_stars=total_stars,
        total_forks=total_forks,
        total_repos=len(repos_data),
        languages=languages
    )

    # Convert repos to model
    repo_models = []
    for r in repos_data:
        repo_models.append(Repository(
            name=r["name"],
            url=r["html_url"],
            description=r.get("description"),
            stars=r.get("stargazers_count", 0),
            forks=r.get("forks_count", 0),
            language=r.get("language"),
            is_fork=r.get("fork", False),
            last_updated=r.get("updated_at", ""),
            has_readme=False
        ))

    # 4. Score
    score, breakdown = scoring_service.calculate_score(stats, repo_models, profile_data.get("bio", ""))

    # 5. Improvement Tips (Mock for now)
    tips = []
    if score < 50: tips.append("Add more READMEs to your repositories.")
    if not profile_data.get("bio"): tips.append("Add a bio to your profile.")
    if score < 80: tips.append("Try to contribute to more open source projects.")

    return AnalysisResult(
        username=profile_data["login"],
        avatar_url=profile_data["avatar_url"],
        total_score=score,
        breakdown=breakdown,
        stats=stats,
        top_repos=sorted(repo_models, key=lambda x: x.stars, reverse=True)[:5],
        improvement_tips=tips,
        recruiter_feedback=None
    )
