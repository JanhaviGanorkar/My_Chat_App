from rest_framework import serializers
from .models import FriendRequest, Friendship, Profile
from django.contrib.auth import get_user_model
from .models import Message

User = get_user_model() 

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_image', 'bio']

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = "__all__"

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = "__all__"



class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "sender", "receiver", "content", "timestamp", "seen"]