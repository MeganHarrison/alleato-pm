"""
Segment-Level Project Classifier

This module classifies which project(s) a meeting segment is about.
Critical for internal meetings (executive, ops, accounting) where multiple projects are discussed.
"""

from typing import List, Dict, Any, Optional
import json
from openai import OpenAI
import os


class SegmentProjectClassifier:
    """Classifies meeting segments to determine which projects they discuss."""

    def __init__(self, openai_client: Optional[OpenAI] = None):
        self.client = openai_client or OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def classify_segment(
        self,
        segment_title: str,
        segment_summary: str,
        segment_text: str,
        available_projects: List[Dict[str, Any]],
        meeting_title: str = "",
    ) -> Dict[str, Any]:
        """
        Classify which project(s) a segment is about.

        Args:
            segment_title: Title of the segment (e.g., "ASRS coordination discussion")
            segment_summary: Summary bullets from the segmenter
            segment_text: Full text of the segment
            available_projects: List of known projects with {id, name, client, keywords}
            meeting_title: Title of the parent meeting (for context)

        Returns:
            {
                "project_ids": [12, 47],  # Array of project IDs
                "primary_project_id": 12,  # Most relevant project (or null)
                "confidence": 0.85,        # 0-1 confidence score
                "reasoning": "Discusses Hy-Tek ASRS permitting and Goodwill layout",
                "scope": "multi_project" | "single_project" | "company_wide"
            }
        """

        # Build project reference list for the prompt
        project_list = "\n".join([
            f"- ID {p['id']}: {p['name']} ({p.get('client', 'N/A')})"
            for p in available_projects
        ])

        prompt = f"""You are analyzing a segment from a company meeting to determine which project(s) it discusses.

Meeting Title: {meeting_title}
Segment Title: {segment_title}

Segment Summary:
{segment_summary}

Segment Text (first 1000 chars):
{segment_text[:1000]}

Known Projects:
{project_list}

Your task:
1. Identify which project(s) from the list are discussed in this segment
2. Determine if there's a PRIMARY project (one that dominates the discussion)
3. Assess if this is company-wide discussion (no specific project) or project-specific

Return ONLY valid JSON with this structure:
{{
  "project_ids": [<array of project IDs as integers>],
  "primary_project_id": <integer or null>,
  "confidence": <float 0-1>,
  "reasoning": "<brief explanation>",
  "scope": "multi_project" | "single_project" | "company_wide"
}}

Rules:
- If NO specific project is mentioned, return empty project_ids array and scope="company_wide"
- If ONE project dominates, set it as primary_project_id
- If MULTIPLE projects are discussed equally, leave primary_project_id as null
- confidence should be 0.9+ if project names are explicitly mentioned
- confidence should be 0.5-0.8 if inferring from context/keywords
- confidence should be <0.5 if very uncertain (consider scope="company_wide" instead)

Examples:
- "Discussed Hy-Tek ASRS fire sprinkler coordination" → {{"project_ids": [12], "primary_project_id": 12, "scope": "single_project"}}
- "Reviewed permitting across Hy-Tek, Goodwill, Amazon TI" → {{"project_ids": [12, 47, 81], "primary_project_id": null, "scope": "multi_project"}}
- "Discussed company-wide hiring process improvements" → {{"project_ids": [], "primary_project_id": null, "scope": "company_wide"}}
"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a project classification expert. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )

            result = json.loads(response.choices[0].message.content)

            # Validate structure
            required_keys = ["project_ids", "primary_project_id", "confidence", "reasoning", "scope"]
            if not all(k in result for k in required_keys):
                raise ValueError(f"Missing required keys. Got: {result.keys()}")

            # Ensure project_ids is a list of integers
            result["project_ids"] = [int(pid) for pid in result["project_ids"]]

            # Ensure primary_project_id is int or None
            if result["primary_project_id"] is not None:
                result["primary_project_id"] = int(result["primary_project_id"])

            # Ensure confidence is float
            result["confidence"] = float(result["confidence"])

            return result

        except Exception as e:
            # Fallback: return company_wide with low confidence
            return {
                "project_ids": [],
                "primary_project_id": None,
                "confidence": 0.0,
                "reasoning": f"Classification failed: {str(e)}",
                "scope": "company_wide"
            }

    def classify_meeting_category(
        self,
        meeting_title: str,
        participants: List[str],
        project_id: Optional[int] = None
    ) -> str:
        """
        Classify the category of a meeting based on title and context.

        Args:
            meeting_title: Title of the meeting
            participants: List of participant names/emails
            project_id: Existing project_id if already assigned

        Returns:
            One of: "project_specific", "executive_weekly", "operations_weekly",
                    "accounting_weekly", "cross_project"
        """

        title_lower = meeting_title.lower()

        # Check for explicit internal meeting patterns
        if any(pattern in title_lower for pattern in [
            "executive weekly",
            "exec weekly",
            "leadership meeting",
            "executive meeting"
        ]):
            return "executive_weekly"

        if any(pattern in title_lower for pattern in [
            "operations weekly",
            "ops weekly",
            "operations meeting",
            "weekly ops"
        ]):
            return "operations_weekly"

        if any(pattern in title_lower for pattern in [
            "accounting weekly",
            "accounting meeting",
            "weekly accounting"
        ]):
            return "accounting_weekly"

        # If project_id is set, it's likely project-specific
        if project_id is not None and project_id > 0:
            return "project_specific"

        # Check for client/project names in title (heuristic)
        # If title contains typical client markers, likely project-specific
        if any(marker in title_lower for marker in [
            "coordination",
            "kickoff",
            "status",
            "walkthrough",
            "site visit"
        ]):
            return "project_specific"

        # Default to cross_project for ambiguous cases
        return "cross_project"


def get_active_projects_for_classification(supabase_client) -> List[Dict[str, Any]]:
    """
    Fetch active projects from Supabase for use in classification.

    Returns list of projects with structure:
    [
        {
            "id": 12,
            "name": "Hy-Tek ASRS Project",
            "client": "Hy-Tek",
            "keywords": ["ASRS", "Hy-Tek", "warehouse"]
        },
        ...
    ]
    """

    # Query projects table for active projects
    response = supabase_client.table("projects").select(
        "id, name, client, keywords"
    ).execute()

    projects = []
    for row in response.data:
        projects.append({
            "id": row["id"],
            "name": row.get("name", "Unnamed Project"),
            "client": row.get("client", ""),
            "keywords": row.get("keywords", []) if row.get("keywords") else []
        })

    return projects
