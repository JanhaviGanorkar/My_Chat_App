from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
   async def connect(self):
    print("Scope URL Route:", self.scope.get("url_route", {}))  # Debugging
    self.user = self.scope.get("user", None)

    if not self.user or self.user.is_anonymous:
        await self.close()
        return

    try:
        self.friend_id = int(self.scope["url_route"]["kwargs"]["friend_id"])
    except KeyError:
        print("❌ friend_id not found in scope['url_route']['kwargs']")
        await self.close()
        return

    self.room_group_name = f"chat_{min(self.user.id, self.friend_id)}_{max(self.user.id, self.friend_id)}"

    await self.channel_layer.group_add(self.room_group_name, self.channel_name)
    await self.accept()


    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["content"]
        sender = self.user.id

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "sender": sender,
                "message": message,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "sender": event["sender"],
            "message": event["message"],
        }))
