from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.contrib.auth.models import User
from .models import FriendRequest, Friendship

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        sender = self.scope["user"].username

        # Send message to WebSocket group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender,
            },
        )

    async def chat_message(self, event):
        message = event["message"]
        sender = event["sender"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message, "sender": sender}))

    async def friend_request_notification(self, event):
        sender = event["sender"]

        # Send friend request notification to user
        await self.send(text_data=json.dumps({"type": "friend_request", "sender": sender}))
