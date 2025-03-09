from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.contrib.auth import get_user_model  # ✅ Use get_user_model() instead of User
from .models import FriendRequest, Friendship
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

User = get_user_model()  # ✅ Get the correct user model dynamically

def user_profile(request, user_id):
    user = get_object_or_404(User, id=user_id)  # ✅ Now using CustomUser
    return render(request, 'user_profile.html', {'user': user})


@login_required
def profile_view(request, username):
    user_profile = get_object_or_404(User, username=username)
    profile = user_profile.profile
    friend_request_sent = FriendRequest.objects.filter(sender=request.user, receiver=user_profile).exists()
    friend_request_received = FriendRequest.objects.filter(sender=user_profile, receiver=request.user).exists()

    return render(request, "profile.html", {
        "user_profile": user_profile,
        "profile": profile,
        "friend_request_sent": friend_request_sent,
        "friend_request_received": friend_request_received,
    })


@login_required
def friends_page(request):
    print("Current User:", request.user)
    print("Authenticated:", request.user.is_authenticated)

    friends = Friendship.objects.filter(user=request.user)
    friend_requests = FriendRequest.objects.filter(receiver=request.user, accepted=False)

    print("Friend Requests in View:", friend_requests)  # Debugging

    return render(request, "friends.html", {"friends": friends, "friend_requests": friend_requests})

def send_friend_request(request, receiver_id):
    sender = request.user
    receiver = get_object_or_404(User, id=receiver_id)  # ✅ Now using CustomUser

    if sender == receiver:
        return JsonResponse({"error": "You cannot send a friend request to yourself"}, status=400)

    if FriendRequest.objects.filter(sender=sender, receiver=receiver).exists():
        return JsonResponse({"error": "Friend request already sent"}, status=400)

    FriendRequest.objects.create(sender=sender, receiver=receiver)

    # Send WebSocket notification
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{receiver.username}",
        {
            "type": "friend_request_notification",
            "sender": sender.username,
        },
    )

    return JsonResponse({"message": "Friend request sent successfully"})

def accept_friend_request(request, request_id):
    friend_request = get_object_or_404(FriendRequest, id=request_id, receiver=request.user)
    friend_request.accept()
    return JsonResponse({"message": "Friend request accepted"})

def list_friend_requests(request):
    received_requests = FriendRequest.objects.filter(receiver=request.user).values("id", "sender__username")
    return JsonResponse({"friend_requests": list(received_requests)})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_friends(request):
    friends = Friendship.objects.filter(user=request.user).values("friend__username")
    return Response({"friends": list(friends)})

def home(request):
    return render(request, "home.html")

def room(request, room_name):
    return render(request, "room.html", {"room_name": room_name})
