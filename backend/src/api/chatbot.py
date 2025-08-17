from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage
from src.utils import generate_thread_id

from src.llm.chatbot_graph import chatbot_graph
from src.models import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        thread_id = req.thread_id or generate_thread_id()

        result = chatbot_graph.invoke(
            {"messages": [HumanMessage(content=req.message)]},
            config={"configurable": {"thread_id": thread_id}}
        )

        reply = result["messages"][-1].content
        return ChatResponse(reply=reply, thread_id=thread_id) 
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


