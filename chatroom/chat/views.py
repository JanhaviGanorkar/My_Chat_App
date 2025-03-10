from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from .models import FriendRequest, Friendship
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import render

User = get_user_model()

@login_required
def user_profile(request, user_id):
    user = get_object_or_404(User, id=user_id)
    return JsonResponse({
        "id": user.id,
        "name": user.name,  
        "email": user.email,
        "profile": user.profile.id if hasattr(user, 'profile') else None
    })

@login_required
def profile_view(request, name):  # ✅ Fixed (changed username → name)
    user_profile = get_object_or_404(User, name=name)  # ✅ Fixed (changed username → name)
    profile = user_profile.profile if hasattr(user_profile, 'profile') else None
    friend_request_sent = FriendRequest.objects.filter(sender=request.user, receiver=user_profile).exists()
    friend_request_received = FriendRequest.objects.filter(sender=user_profile, receiver=request.user).exists()

    return JsonResponse({
        "user_profile": {
            "id": user_profile.id,
            "name": user_profile.name,  # ✅ Fixed
            "email": user_profile.email,
        },
        "profile": profile.id if profile else None,
        "friend_request_sent": friend_request_sent,
        "friend_request_received": friend_request_received,
    })

@login_required
def friends_page(request):
    friends = Friendship.objects.filter(user=request.user).values("friend__id", "friend__name", "friend__email")  # ✅ Fixed
    friend_requests = FriendRequest.objects.filter(receiver=request.user, accepted=False).values("id", "sender__name", "sender__email")  # ✅ Fixed

    return JsonResponse({
        "friends": list(friends),
        "friend_requests": list(friend_requests)
    })

@login_required
def send_friend_request(request, receiver_id):
    sender = request.user
    receiver = get_object_or_404(User, id=receiver_id)

    if sender == receiver:
        return JsonResponse({"error": "You cannot send a friend request to yourself"}, status=400)

    if FriendRequest.objects.filter(sender=sender, receiver=receiver).exists():
        return JsonResponse({"error": "Friend request already sent"}, status=400)

    FriendRequest.objects.create(sender=sender, receiver=receiver)

    # Send WebSocket notification
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{receiver.email}",  # ✅ Fixed (changed username → email)
        {
            "type": "friend_request_notification",
            "sender": sender.email,  # ✅ Fixed
        },
    )

    return JsonResponse({"message": "Friend request sent successfully"})

@login_required
def accept_friend_request(request, request_id):
    friend_request = get_object_or_404(FriendRequest, id=request_id, receiver=request.user)
    friend_request.accept()
    return JsonResponse({"message": "Friend request accepted"})

@login_required
def list_friend_requests(request):
    received_requests = FriendRequest.objects.filter(receiver=request.user).values("id", "sender__name", "sender__email")  # ✅ Fixed
    return JsonResponse({"friend_requests": list(received_requests)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_friends(request):
    friends = Friendship.objects.filter(user=request.user).values("friend__id", "friend__name", "friend__email")  # ✅ Fixed
    return Response({"friends": list(friends)})

@login_required
def home(request):
    return JsonResponse({"message": "Welcome to the home page"})

@login_required

def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})