"""ChatKitServer subclass for the SPP3 dossier agent."""

from collections.abc import AsyncIterator
from typing import Any

from agents import Runner
from chatkit.agents import AgentContext, ThreadItemConverter, stream_agent_response
from chatkit.server import ChatKitServer
from chatkit.types import ThreadMetadata, ThreadStreamEvent, UserMessageItem

from .agent import dossier_agent
from .store import MemoryStore


class DossierChatKitServer(ChatKitServer[dict[str, Any]]):
    def __init__(self, store: MemoryStore) -> None:
        super().__init__(store=store)
        self._converter = ThreadItemConverter()

    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem | None,
        context: dict[str, Any],
    ) -> AsyncIterator[ThreadStreamEvent]:
        agent_context = AgentContext(
            thread=thread,
            store=self.store,
            request_context=context,
        )

        items_page = await self.store.load_thread_items(
            thread.id, after=None, limit=100, order="asc", context=context,
        )
        input_items = await self._converter.to_agent_input(items_page.data)

        result = Runner.run_streamed(
            dossier_agent, input=input_items, context=agent_context, max_turns=12
        )

        async for event in stream_agent_response(agent_context, result):
            yield event
