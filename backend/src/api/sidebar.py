from fastapi import APIRouter, HTTPException, Body
from src.llm.chatbot_graph import checkpointer, chatbot_graph
from langchain_core.messages import BaseMessage
from typing import Dict, List
from src.logger import logger

router = APIRouter(prefix="/sidebar", tags=["Threads"])

@router.get("/threads", summary="Retrieve all threads with first human message")
async def get_all_threads():
    try:
        logger.info("Fetching all thread IDs with first human message")
        results = []

        # 1️⃣ Collect all unique thread IDs from checkpointer
        all_threads = set()
        for checkpoint in checkpointer.list(None):
            thread_id = checkpoint.config.get("configurable", {}).get("thread_id")
            if thread_id:
                all_threads.add(thread_id)

        # 2️⃣ Fetch first human message for each thread using chatbot_graph
        for thread_id in all_threads:
            try:
                state = chatbot_graph.get_state(config={"configurable": {"thread_id": thread_id}})
                messages: List[BaseMessage] = state.values.get("messages", [])

                # Find first human message
                human_msg = next(
                    (msg.content for msg in messages if getattr(msg, "type", "").lower() == "human"),
                    None
                )

                results.append({
                    "thread_id": thread_id,
                    "first_human_message": human_msg
                })
            except Exception as inner_err:
                logger.error(f"Failed to fetch messages for {thread_id}: {inner_err}")
                results.append({
                    "thread_id": thread_id,
                    "first_human_message": None
                })

        logger.info(f"Returning {len(results)} threads with first messages")
        return results[::-1]  # newest first

    except Exception as e:
        logger.error(f"Failed to retrieve threads: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/get_messages", summary="Retrieve all messages for a thread")
async def get_thread_messages(
    data: Dict = Body(
        ...,
        examples={
            "default": {
                "summary": "Retrieve messages for a thread",
                "description": "Provide a thread_id to get all messages for that thread",
                "value": {"thread_id": "thread_1"}
            }
        }
    )
):
    thread_id = data.get("thread_id")
    if not thread_id:
        logger.warning("get_messages called without thread_id")
        raise HTTPException(status_code=400, detail="thread_id is required")

    try:
        logger.info(f"Fetching messages for thread_id={thread_id}")
        state = chatbot_graph.get_state(config={"configurable": {"thread_id": thread_id}})
        messages = state.values.get("messages", [])

        # Serialize messages
        serialized_messages = [
            {"type": type(msg).__name__, "content": msg.content}
            for msg in messages if isinstance(msg, BaseMessage)
        ]

        logger.info(f"Retrieved {len(serialized_messages)} messages for thread_id={thread_id}")
        return {"thread_id": thread_id, "messages": serialized_messages}

    except Exception as e:
        logger.error(f"Failed to retrieve messages for thread_id={thread_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to retrieve messages: {str(e)}")
