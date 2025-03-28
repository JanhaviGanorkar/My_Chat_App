from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from .consumers import ChatConsumer, TokenAuthMiddleware

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<friend_id>\d+)/$", ChatConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "websocket": TokenAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})