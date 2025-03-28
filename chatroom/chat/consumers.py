import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from chat.models import Message
from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs

User = get_user_model()

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_params = parse_qs(scope["query_string"].decode())
        token = query_params.get("token", [None])[0]
        
        try:
            if token:
                access_token = AccessToken(token)
                scope["user"] = await sync_to_async(User.objects.get)(id=access_token["user_id"])
            else:
                scope["user"] = AnonymousUser()
        except Exception as e:
            print(f"Token authentication error: {e}")
            scope["user"] = AnonymousUser()
            
        return await super().__call__(scope, receive, send)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Verify authentication
        if self.scope["user"].is_anonymous:
            await self.close(code=4001)
            return

        # Get friend_id and validate connection
        self.user = self.scope["user"]
        self.friend_id = self.scope["url_route"]["kwargs"].get("friend_id")
        
        if not self.friend_id:
            await self.close(code=4002) 
            return
            
        # Create unique room name using sorted user IDs
        self.room_group_name = f"chat_{min(self.user.id, int(self.friend_id))}_{max(self.user.id, int(self.friend_id))}"
        
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data.get("content", "").strip()
            receiver_id = int(data.get("receiver", 0))

            if not message or not receiver_id:
                return
            
            # Save message to database
            saved_message = await self.save_message(
                sender_id=self.user.id,
                receiver_id=receiver_id,
                content=message
            )

            # Send single message through WebSocket with complete data
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat.message",
                    "message": {
                        "id": saved_message.id,
                        "sender": self.user.id,
                        "receiver": receiver_id,
                        "content": message,
                        "timestamp": saved_message.timestamp.isoformat()
                    }
                }
            )

        except json.JSONDecodeError:
            print("Invalid JSON received")
        except Exception as e:
            print(f"Error processing message: {e}")

    async def chat_message(self, event):
        """Handler for chat.message event"""
        message = event["message"]
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))

    @sync_to_async
    def save_message(self, sender_id, receiver_id, content):
        """Save message to database"""
        message = Message.objects.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content
        )
        return message
