"""Tests for document ingestion endpoints."""
import pytest
from unittest.mock import MagicMock


class TestIngestion:
    """Test cases for ingestion endpoints."""
    
    @pytest.mark.unit
    def test_ingest_fireflies_success(
        self, client, mock_fireflies_pipeline, sample_ingest_request
    ):
        """Test successful Fireflies transcript ingestion."""
        response = client.post("/api/ingest/fireflies", json=sample_ingest_request)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "result" in data
        assert data["result"]["status"] == "success"
        assert data["result"]["documents_created"] == 1
        assert data["result"]["chunks_created"] == 10
        assert data["result"]["tasks_created"] == 5
        assert data["result"]["insights_created"] == 3
        
        # Verify pipeline was called with correct parameters
        mock_fireflies_pipeline.ingest_file.assert_called_once_with(
            "/path/to/fireflies/transcript.json",
            project_id=1,
            dry_run=True
        )
    
    @pytest.mark.unit
    def test_ingest_fireflies_no_project_id(self, client, mock_fireflies_pipeline):
        """Test ingestion without project ID."""
        request_data = {
            "path": "/path/to/transcript.json",
            "dry_run": False
        }
        
        response = client.post("/api/ingest/fireflies", json=request_data)
        
        assert response.status_code == 200
        
        # Verify pipeline was called with None for project_id
        mock_fireflies_pipeline.ingest_file.assert_called_once_with(
            "/path/to/transcript.json",
            project_id=None,
            dry_run=False
        )
    
    @pytest.mark.unit
    def test_ingest_fireflies_error_handling(self, client, mock_fireflies_pipeline):
        """Test ingestion error handling."""
        # Mock pipeline to raise an exception
        mock_fireflies_pipeline.ingest_file.side_effect = Exception("File not found")
        
        response = client.post(
            "/api/ingest/fireflies",
            json={"path": "/invalid/path.json", "dry_run": True}
        )
        
        # The current implementation doesn't handle exceptions, so it will raise 500
        assert response.status_code == 500
    
    @pytest.mark.unit
    def test_ingest_fireflies_dry_run(self, client, mock_fireflies_pipeline):
        """Test dry run mode for ingestion."""
        # Mock dry run result
        dry_run_result = MagicMock()
        dry_run_result.__dict__ = {
            "status": "dry_run",
            "documents_created": 0,
            "chunks_created": 0,
            "tasks_created": 0,
            "insights_created": 0,
            "preview": {
                "meeting_title": "Test Meeting",
                "duration": 3600,
                "attendees": ["User1", "User2"]
            }
        }
        mock_fireflies_pipeline.ingest_file.return_value = dry_run_result
        
        response = client.post(
            "/api/ingest/fireflies",
            json={
                "path": "/path/to/transcript.json",
                "project_id": 1,
                "dry_run": True
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["result"]["status"] == "dry_run"
        assert "preview" in data["result"]
        assert data["result"]["documents_created"] == 0