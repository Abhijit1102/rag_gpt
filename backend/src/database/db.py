import sqlite3
import time
from langgraph.checkpoint.sqlite import SqliteSaver

MAX_RETRIES = 3
RETRY_INTERVAL = 5

class SingletonCheckpointer:
    """Singleton SQLite connection and LangGraph SqliteSaver"""
    _instance = None

    def __new__(cls, db_path="chatbot.db"):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.db_path = db_path
            cls._instance.conn = None
            cls._instance.checkpointer = None
            cls._instance.is_connected = False
            cls._instance.retry_count = 0
            cls._instance._connect()
        return cls._instance

    def _connect(self):
        while self.retry_count < MAX_RETRIES:
            try:
                self.conn = sqlite3.connect(
                    database=self.db_path,
                    check_same_thread=False
                )
                self.checkpointer = SqliteSaver(self.conn)
                self.is_connected = True
                print(f"✅ SQLite connected and checkpointer initialized at '{self.db_path}'")
                return
            except sqlite3.Error as e:
                self.retry_count += 1
                print(f"❌ SQLite connection error: {e}. Retrying {self.retry_count}/{MAX_RETRIES} ...")
                time.sleep(RETRY_INTERVAL)
        raise ConnectionError(f"Unable to establish SQLite connection to '{self.db_path}'.")

    def disconnect(self):
        if self.conn:
            self.conn.close()
            self.is_connected = False
            print("🔌 SQLite connection closed.")

    def get_status(self):
        return {"is_connected": self.is_connected, "db_path": self.db_path}


# Singleton instance
singleton_checkpointer = SingletonCheckpointer()
checkpointer = singleton_checkpointer.checkpointer  # import this anywhere
get_db_status = singleton_checkpointer.get_status
