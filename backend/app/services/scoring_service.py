from app.models.schemas import ScoreBreakdown, ProfileStats, Repository
from typing import List, Tuple
from datetime import datetime, timezone

class ScoringService:
    def calculate_score(self, stats: ProfileStats, repos: List[Repository], bio: str) -> Tuple[int, ScoreBreakdown]:
        repo_count = len(repos)
        if repo_count == 0:
            return 0, ScoreBreakdown(documentation=0, code_structure=0, activity=0, impact=0, technical=0, professionalism=0)

        # 1. Documentation (20%)
        # Proxy: Description presence (easier to check than READMEs for now)
        repos_with_desc = sum(1 for r in repos if r.description)
        doc_score = int((repos_with_desc / repo_count) * 20)
        
        # 2. Code Structure (20%)
        # Placeholder: Assume 15 for now, future: file tree analysis
        struct_score = 15

        # 3. Activity (15%)
        # Based on last_updated in last 90 days
        activity_score = 0
        try:
            # Handle timestamps carefully
            now = datetime.now(timezone.utc)
            # Simple ISO parse (GitHub API returns ISO 8601)
            recent_repos = 0
            for r in repos:
                try:
                    dt = datetime.fromisoformat(r.last_updated.replace("Z", "+00:00"))
                    if (now - dt).days < 90:
                        recent_repos += 1
                except ValueError:
                    continue
                    
            if recent_repos >= 3: activity_score = 15
            elif recent_repos == 2: activity_score = 10
            elif recent_repos == 1: activity_score = 5
        except Exception:
            activity_score = 5 # Fallback

        # 4. Impact (20%)
        # Stars
        impact_score = 0
        total_stars = stats.total_stars
        if total_stars >= 100: impact_score = 20
        elif total_stars >= 50: impact_score = 15
        elif total_stars >= 10: impact_score = 10
        elif total_stars >= 1: impact_score = 5

        # 5. Technical Depth (15%)
        # Language diversity greater than 2
        tech_score = 5
        if len(stats.languages) > 2:
            tech_score = 15
        elif len(stats.languages) > 0:
            tech_score = 10

        # 6. Professionalism (10%)
        prof_score = 0
        if bio: prof_score += 5
        if stats.total_repos > 5: prof_score += 5

        total = doc_score + struct_score + activity_score + impact_score + tech_score + prof_score
        breakdown = ScoreBreakdown(
            documentation=doc_score,
            code_structure=struct_score,
            activity=activity_score,
            impact=impact_score,
            technical=tech_score,
            professionalism=prof_score
        )
        return total, breakdown
