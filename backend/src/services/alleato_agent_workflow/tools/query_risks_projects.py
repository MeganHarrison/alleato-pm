#!/usr/bin/env python3
"""
Query risks, opportunities, and tasks for specific projects from Supabase
"""
import os
from supabase import create_client, Client

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

def query_project_intelligence(project_id: int):
    """Query all risks, opportunities, and tasks for a specific project"""

    print(f"\n{'='*80}")
    print(f"PROJECT INTELLIGENCE FOR PROJECT ID: {project_id}")
    print(f"{'='*80}\n")

    # Get project info
    project = supabase.table('projects').select('*').eq('id', project_id).execute()
    if project.data:
        print(f"Project: {project.data[0]['name']}")
        print(f"{'='*80}\n")

    # Query risks linked to this project via project_ids array
    # Use 'cs' (contains) operator with proper formatting for integer arrays
    print("RISKS:")
    print("-" * 80)
    risks = supabase.table('risks').select('''
        id,
        description,
        category,
        likelihood,
        impact,
        status,
        metadata_id,
        segment_id,
        project_ids,
        document_metadata(title)
    ''').filter('project_ids', 'cs', f'{{{project_id}}}').execute()

    if risks.data:
        for risk in risks.data:
            print(f"• {risk['description']}")
            print(f"  Category: {risk.get('category', 'N/A')} | Likelihood: {risk.get('likelihood', 'N/A')} | Impact: {risk.get('impact', 'N/A')}")
            print(f"  Status: {risk['status']}")
            if risk.get('document_metadata'):
                print(f"  Meeting: {risk['document_metadata']['title']}")
            print(f"  Segment ID: {risk.get('segment_id', 'None')} | Metadata ID: {risk['metadata_id']}")
            print()
    else:
        print("No risks found for this project.\n")

    # Query opportunities
    print("\nOPPORTUNITIES:")
    print("-" * 80)
    opportunities = supabase.table('opportunities').select('''
        id,
        description,
        type,
        status,
        metadata_id,
        segment_id,
        project_ids,
        document_metadata(title)
    ''').filter('project_ids', 'cs', f'{{{project_id}}}').execute()

    if opportunities.data:
        for opp in opportunities.data:
            print(f"• {opp['description']}")
            print(f"  Type: {opp.get('type', 'N/A')} | Status: {opp['status']}")
            if opp.get('document_metadata'):
                print(f"  Meeting: {opp['document_metadata']['title']}")
            print(f"  Segment ID: {opp.get('segment_id', 'None')} | Metadata ID: {opp['metadata_id']}")
            print()
    else:
        print("No opportunities found for this project.\n")

    # Query tasks
    print("\nTASKS:")
    print("-" * 80)
    tasks = supabase.table('tasks').select('''
        id,
        description,
        assignee_name,
        due_date,
        priority,
        status,
        metadata_id,
        segment_id,
        project_ids,
        document_metadata(title)
    ''').filter('project_ids', 'cs', f'{{{project_id}}}').execute()

    if tasks.data:
        for task in tasks.data:
            print(f"• {task['description']}")
            print(f"  Assignee: {task.get('assignee_name', 'Unassigned')} | Due: {task.get('due_date', 'N/A')} | Priority: {task.get('priority', 'N/A')}")
            print(f"  Status: {task['status']}")
            if task.get('document_metadata'):
                print(f"  Meeting: {task['document_metadata']['title']}")
            print(f"  Segment ID: {task.get('segment_id', 'None')} | Metadata ID: {task['metadata_id']}")
            print()
    else:
        print("No tasks found for this project.\n")


def show_data_relationships():
    """Show how data is connected via foreign keys"""
    print(f"\n{'='*80}")
    print("DATA RELATIONSHIP EXPLANATION")
    print(f"{'='*80}\n")

    print("The data hierarchy is:")
    print("  document_metadata (meetings)")
    print("    ↓ has foreign key")
    print("  meeting_segments (semantic sections within meetings)")
    print("    ↓ has foreign keys")
    print("  documents (chunks with embeddings)")
    print("  risks (extracted insights)")
    print("  opportunities (extracted insights)")
    print("  tasks (extracted insights)")
    print("\n")

    print("CURRENT ISSUE:")
    print("• Risks have 'metadata_id' (link to meeting) but segment_id is NULL")
    print("• You can't tell which segment a risk came from by looking at the risks table alone")
    print("• The 'project_ids' array field maps risks to projects")
    print("\n")

    print("SOLUTION FOR PROJECT PAGES:")
    print("• Query risks WHERE project_ids contains your project_id")
    print("• Join with document_metadata to show which meeting it came from")
    print("• Optionally join with meeting_segments if segment_id is populated")
    print("\n")


def list_all_projects_with_counts():
    """List all projects and count their associated risks/opportunities/tasks"""
    print(f"\n{'='*80}")
    print("ALL PROJECTS WITH INTELLIGENCE COUNTS")
    print(f"{'='*80}\n")

    projects = supabase.table('projects').select('id, name').order('name').execute()

    for project in projects.data:
        project_id = project['id']
        name = project['name']

        # Count risks - use filter instead of contains for integer arrays
        risks_count = supabase.table('risks').select('id', count='exact').filter('project_ids', 'cs', f'{{{project_id}}}').execute()

        # Count opportunities
        opps_count = supabase.table('opportunities').select('id', count='exact').filter('project_ids', 'cs', f'{{{project_id}}}').execute()

        # Count tasks
        tasks_count = supabase.table('tasks').select('id', count='exact').filter('project_ids', 'cs', f'{{{project_id}}}').execute()

        total = (risks_count.count or 0) + (opps_count.count or 0) + (tasks_count.count or 0)

        if total > 0:
            print(f"Project {project_id}: {name}")
            print(f"  → Risks: {risks_count.count or 0} | Opportunities: {opps_count.count or 0} | Tasks: {tasks_count.count or 0}")
            print()


if __name__ == "__main__":
    # Show data relationships first
    show_data_relationships()

    # List all projects with counts
    list_all_projects_with_counts()

    # Query specific projects (you can change these IDs)
    # Example: Query project 12 (The Roebling Homes)
    query_project_intelligence(12)

    # You can add more projects here
    # query_project_intelligence(70)
    # query_project_intelligence(43)
