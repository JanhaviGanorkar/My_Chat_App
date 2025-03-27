import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from chat.models import Message

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get("user", None)
        if not self.user or self.user.is_anonymous:
            await self.close()
            return

        self.friend_id = int(self.scope["url_route"]["kwargs"].get("friend_id", 0))
        self.room_group_name = f"chat_{min(self.user.id, self.friend_id)}_{max(self.user.id, self.friend_id)}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get("message", "")
        sender_id = self.user.id
        receiver_id = data.get("receiver")

        if not message_text.strip():
            return

        # ✅ Save message asynchronously to database
        await self.save_message(sender_id, receiver_id, message_text)

        # ✅ Broadcast the message to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "sender": sender_id,
                "message": message_text,
            }
        )

    async def chat_message(self, event):
        """Send the message to WebSocket clients"""
        await self.send(text_data=json.dumps({
            "sender": event["sender"],
            "message": event["message"],
        }))

    @sync_to_async
    def save_message(self, sender_id, receiver_id, message_text):
        """Save message to database"""
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        Message.objects.create(sender=sender, receiver=receiver, content=message_text)
