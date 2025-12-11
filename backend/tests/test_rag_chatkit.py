"""Tests for RAG ChatKit endpoints."""
import pytest
import json
from unittest.mock import AsyncMock, MagicMock


class TestRagChatKit:
    """Test cases for RAG ChatKit endpoints."""
    
    @pytest.mark.unit
    @pytest.mark.asyncio
    async def test_rag_chatkit_endpoint_success(self, client, mock_chatkit_server):
        """Test successful RAG ChatKit streaming endpoint."""
        # Mock streaming response
        mock_result = MagicMock()
        mock_result.json = b'{"type": "message", "content": "Test response"}'
        mock_chatkit_server.process.return_value = mock_result
        
        payload = {
            "type": "threads.addUserMessage",
            "params": {
                "threadId": "test-thread",
                "message": "Test message"
            }
        }
        
        response = client.post("/rag-chatkit", json=payload)
        
        assert response.status_code == 200
        mock_chatkit_server.process.assert_called_once()
    
    @pytest.mark.unit
    def test_rag_chatkit_endpoint_no_rag(self, client, monkeypatch):
        """Test RAG ChatKit when RAG is not available."""
        monkeypatch.setattr("src.api.main.RAG_AVAILABLE", False)
        
        response = client.post("/rag-chatkit", json={"type": "test"})
        
        assert response.status_code == 200  # Returns error in response body
        data = response.json()
        assert data["error"] == "RAG workflow not available"
    
    @pytest.mark.unit
    @pytest.mark.asyncio
    async def test_rag_chatkit_state_success(self, client, mock_chatkit_server):
        """Test getting RAG chat state."""
        mock_state = {
            "thread_id": "test-thread",
            "current_agent": "project_agent",
            "context": {"project_id": 1},
            "agents": ["classification", "project", "knowledge"],
            "events": [],
            "guardrails": []
        }
        mock_chatkit_server.snapshot.return_value = mock_state
        
        response = client.get("/rag-chatkit/state?thread_id=test-thread")
        
        assert response.status_code == 200
        data = response.json()
        assert data["thread_id"] == "test-thread"
        assert data["current_agent"] == "project_agent"
        
        mock_chatkit_server.snapshot.assert_called_once_with("test-thread", {"request": None})
    
    @pytest.mark.unit
    def test_rag_chatkit_state_missing_thread_id(self, client):
        """Test RAG state endpoint without thread_id."""
        response = client.get("/rag-chatkit/state")
        
        assert response.status_code == 422  # Validation error
    
    @pytest.mark.unit
    @pytest.mark.asyncio
    async def test_rag_chatkit_bootstrap_success(self, client, mock_chatkit_server):
        """Test bootstrapping a new RAG conversation."""
        mock_bootstrap = {
            "thread_id": "new-thread-id",
            "current_agent": "classification",
            "context": {},
            "agents": [
                {
                    "name": "classification",
                    "description": "Classifies user queries",
                    "handoffs": ["project", "knowledge", "strategist"],
                    "tools": []
                }
            ],
            "events": [],
            "guardrails": []
        }
        mock_chatkit_server.snapshot.return_value = mock_bootstrap
        
        response = client.get("/rag-chatkit/bootstrap")
        
        assert response.status_code == 200
        data = response.json()
        assert data["thread_id"] == "new-thread-id"
        assert data["current_agent"] == "classification"
        assert len(data["agents"]) > 0
        
        mock_chatkit_server.snapshot.assert_called_once_with(None, {"request": None})
    
    @pytest.mark.unit
    def test_rag_chatkit_bootstrap_no_rag(self, client, monkeypatch):
        """Test bootstrap when RAG is not available."""
        monkeypatch.setattr("src.api.main.RAG_AVAILABLE", False)
        
        response = client.get("/rag-chatkit/bootstrap")
        
        assert response.status_code == 200
        data = response.json()
        assert data["error"] == "RAG workflow not available"
    
    @pytest.mark.unit
    @pytest.mark.asyncio
    async def test_rag_chatkit_camelcase_conversion(self, client, mock_chatkit_server):
        """Test that camelCase keys are converted to snake_case."""
        mock_chatkit_server.process.return_value = MagicMock(json=b'{"status": "ok"}')
        
        # Send request with camelCase
        payload = {
            "type": "threads.addUserMessage",
            "params": {
                "threadId": "test-thread",
                "messageContent": "Test message",
                "userName": "Test User"
            }
        }
        
        response = client.post("/rag-chatkit", json=payload)
        
        assert response.status_code == 200
        
        # Verify the conversion happened
        call_args = mock_chatkit_server.process.call_args[0][0]
        parsed = json.loads(call_args)
        
        assert parsed["type"] == "threads.add_user_message"
        assert "thread_id" in parsed["params"]
        assert "message_content" in parsed["params"]
        assert "user_name" in parsed["params"]