from typing import Annotated, Sequence, Literal, TypedDict
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from langgraph.graph.message import add_messages

from src.database.Qudrant_client import qdrant_manager  
from src.llm.qdrant_retriever import retriever 
from langchain.tools.retriever import create_retriever_tool
from src.config import config
from src.database.db import checkpointer   

qdrant_manager.create_collection()

retriever_tool = create_retriever_tool(
    retriever,
    name="QdrantRetrieverTool",
    description="Retrieve relevant documents from the vector database if needed."
)
tools = [retriever_tool]

class AgentState(TypedDict):
    messages: Annotated[Sequence[HumanMessage], add_messages]

def agent_node(state: AgentState):
    messages = state["messages"]
    llm = ChatOpenAI(model=config.OPENAI_MODEL, api_key=config.OPENAI_API_KEY)
    llm = llm.bind_tools(tools)
    response = llm.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState) -> Literal["tools", END]:
    messages = state["messages"]
    last_message = messages[-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

workflow = StateGraph(AgentState)
workflow.add_node("agent", agent_node)
workflow.add_node("tools", ToolNode(tools))
workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
workflow.add_edge("tools", "agent")

chatbot_graph = workflow.compile(checkpointer=checkpointer)
