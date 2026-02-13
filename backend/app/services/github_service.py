import httpx
from typing import List, Dict, Any
from app.core.config import settings

class GitHubService:
    BASE_URL = "https://api.github.com"
    
    def __init__(self):
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "GitHub-Career-Intelligence-Platform"
        }
        # Using public API (rate limited to 60 requests/hour/IP)
        # No authorization header needed for public access

    async def get_profile(self, username: str) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.BASE_URL}/users/{username}", headers=self.headers)
            if resp.status_code != 200:
                return None
            return resp.json()

    async def get_repos(self, username: str) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            # Fetching up to 100 most recently updated repos
            resp = await client.get(
                f"{self.BASE_URL}/users/{username}/repos?per_page=100&sort=updated",
                headers=self.headers
            )
            if resp.status_code != 200:
                return []
            return resp.json()
            
    async def get_readme(self, owner: str, repo: str) -> str:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{self.BASE_URL}/repos/{owner}/{repo}/readme",
                headers=self.headers
            )
            if resp.status_code == 200:
                return "exists" # Simplified for checking presence
            return ""
