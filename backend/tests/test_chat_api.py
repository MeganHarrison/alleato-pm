"""Tests for chat API endpoints."""
import pytest
from unittest.mock import MagicMock, AsyncMock
import json


class TestChatAPI:
    """Test cases for chat endpoints."""
    
    @pytest.mark.unit
    def test_chat_endpoint_success(self, client, mock_supabase_store, sample_chat_request):
        """Test successful chat API call."""
        # Mock search results
        mock_supabase_store.search_chunks_by_keyword.return_value = [
            {
                "document_id": "doc-1",
                "chunk_index": 0,
                "text": "This is a test chunk about project risks.",
                "metadata": {"source": "meeting"}
            }
        ]
        mock_supabase_store.list_tasks.return_value = [
            {"id": "task-1", "title": "Mitigate risk A", "status": "open"}
        ]
        mock_supabase_store.list_insights.return_value = [
            {"id": "insight-1", "type": "risk", "summary": "Budget overrun risk"}
        ]
        mock_supabase_store.get_project.return_value = {
            "id": 1,
            "name": "Test Project",
            "meeting_count": 10,
            "open_tasks": 5
        }
        
        response = client.post("/api/chat", json=sample_chat_request)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "reply" in data
        assert "sources" in data
        assert "tasks" in data
        assert "insights" in data
        
        # Check that appropriate methods were called
        mock_supabase_store.search_chunks_by_keyword.assert_called()
        mock_supabase_store.list_tasks.assert_called_with(project_id=1, status="open", limit=5)
        mock_supabase_store.list_insights.assert_called_with(project_id=1, limit=5)
    
    @pytest.mark.unit
    def test_chat_endpoint_empty_message(self, client):
        """Test chat API with empty message."""
        response = client.post("/api/chat", json={"message": ""})
        
        assert response.status_code == 422
        data = response.json()
        assert data["detail"] == "Message cannot be empty"
    
    @pytest.mark.unit
    def test_chat_endpoint_no_results(self, client, mock_supabase_store):
        """Test chat API when no results are found."""
        # All searches return empty
        mock_supabase_store.search_chunks_by_keyword.return_value = []
        mock_supabase_store.fetch_recent_chunks.return_value = []
        mock_supabase_store.list_tasks.return_value = []
        mock_supabase_store.list_insights.return_value = []
        mock_supabase_store.get_project.return_value = None
        
        response = client.post("/api/chat", json={"message": "Find something"})
        
        assert response.status_code == 200
        data = response.json()
        
        assert "No relevant transcripts or tasks were found" in data["reply"]
        assert data["sources"] == []
        assert data["tasks"] == []
        assert data["insights"] == []
    
    @pytest.mark.unit
    @pytest.mark.asyncio
    async def test_rag_chat_simple_success(self, client, mock_runner, sample_rag_chat_request):
        """Test simple RAG chat endpoint."""
        # Mock agent response
        mock_item = MagicMock()
        mock_item.agent = MagicMock(name="test_agent")
        mock_runner.run_sync.return_value.new_items = [mock_item]
        
        # Mock the text extraction
        with pytest.mock.patch("src.api.main.ItemHelpers") as mock_helpers:
            mock_helpers.text_message_output.return_value = "This is the agent's response."
            
            response = client.post("/api/rag-chat-simple", json=sample_rag_chat_request)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "response" in data
        assert "retrieved" in data
        assert data["response"] == "This is the agent's response."
    
    @pytest.mark.unit
    def test_rag_chat_simple_empty_message(self, client):
        """Test RAG chat with empty message."""
        response = client.post("/api/rag-chat-simple", json={"message": "  "})
        
        assert response.status_code == 422
        data = response.json()
        assert data["detail"] == "Message cannot be empty"
    
    @pytest.mark.unit
    def test_rag_chat_simple_no_rag_available(self, client, monkeypatch):
        """Test RAG chat when RAG workflow is not available."""
        # Simulate RAG not being available
        monkeypatch.setattr("src.api.main.RAG_AVAILABLE", False)
        
        response = client.post("/api/rag-chat-simple", json={"message": "Test"})
        
        assert response.status_code == 503
        data = response.json()
        assert data["detail"] == "RAG workflow not available"