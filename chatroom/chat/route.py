from django.urls import re_path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", ChatConsumer.as_asgi()),
    # re_path(r'ws/chat/(?P<friend_id>\d+)/$', ChatConsumer.as_asgi()),
    
]
