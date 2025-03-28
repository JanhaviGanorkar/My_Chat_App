from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from .models import FriendRequest, Friendship, Profile
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework import serializers, viewsets 
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import render
from .serializers import ProfileSerializer
from .serializers import MessageSerializer
from rest_framework import status  
from django.db.models import Q  # Add this import
from django.apps import apps  
from chat.models import FriendRequest, Friendship, Profile
from chat.serializers import ProfileSerializer, MessageSerializer
from .models import Message

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def friend_profile(request, friendId):
    user_profile = get_object_or_404(User, id=friendId)
    profile = getattr(user_profile, 'profile', None)
    friend_request_sent = FriendRequest.objects.filter(
        sender=request.user, receiver=user_profile).exists()
    friend_request_received = FriendRequest.objects.filter(
        sender=user_profile, receiver=request.user).exists()

    return JsonResponse({
        "user_profile": {
            "id": user_profile.id,
            "name": user_profile.name,
            "email": user_profile.email,
            "profilePic": profile.profile_image.url if profile and profile.profile_image else None,
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_request(request, receiver_id):
    sender = request.user
    receiver = get_object_or_404(User, id=receiver_id)

    if sender == receiver:
        return JsonResponse({"error": "You cannot send a friend request to yourself"}, status=400)

    if FriendRequest.objects.filter(sender=sender, receiver=receiver).exists():
        return JsonResponse({"error": "Friend request already sent"}, status=400)

    FriendRequest.objects.create(sender=sender, receiver=receiver)


    return JsonResponse({"message": "Friend request sent successfully"})

# @login_required
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_friend_request(request, request_id):
    friend_request = get_object_or_404(FriendRequest, id=request_id, receiver=request.user)
    
    # ✅ Check if already accepted
    if friend_request.accepted:
        return JsonResponse({"error": "Friend request already accepted"}, status=400)
    
    # ✅ Accept the request
    friend_request.accepted = True
    friend_request.save()

    # ✅ Create a two-way friendship
    Friendship.objects.create(user=friend_request.sender, friend=friend_request.receiver)
    Friendship.objects.create(user=friend_request.receiver, friend=friend_request.sender)

    return JsonResponse({"message": "Friend request accepted"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_friends(request):
    friends = Friendship.objects.filter(user=request.user).values("friend__id", "friend__name", "friend__email")
    return Response({"friends": list(friends)})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_friend_requests(request):
    friend_requests = FriendRequest.objects.filter(receiver=request.user, accepted=False).values(
        "id", "sender__id", "sender__name", "sender__email"
    )
    return Response({"friend_requests": list(friend_requests)})


@login_required
def home(request):
    return JsonResponse({"message": "Welcome to the home page"})

@login_required

def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    return JsonResponse({"user_id": request.user.id})

@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])  # For handling image uploads
def user_profile(request, user_id):
    profile = get_object_or_404(Profile, user__id=user_id)

    if request.method in ['PUT', 'PATCH']:
        if request.user.id != user_id:
            return Response({"error": "You can only edit your own profile."}, status=status.HTTP_403_FORBIDDEN)

        # Handle Image Upload Correctly
        data = request.data.copy()
        if 'profile_image' in request.FILES:
            data['profile_image'] = request.FILES['profile_image']

        serializer = ProfileSerializer(profile, data=data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        "id": profile.user.id,
        "user": profile.user.name,  
        # "user": profile.user.get_full_name() or profile.user.username,  # Safe name handling
        "email": profile.user.email,
        "profile_image": getattr(profile.profile_image, 'url', None),  # Safe image URL handling
        "bio": profile.bio,
        "is_self": request.user.id == user_id  # Checking if logged-in user owns the profile
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.GET.get('query', '')
    if query:
        users = User.objects.filter(
            Q(name__icontains=query) | Q(email__icontains=query)
        ).exclude(id=request.user.id).values('id', 'name', 'email')
        return JsonResponse({"users": list(users)})
    return JsonResponse({"users": []})



class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by("-timestamp")
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the sender to the logged-in user
        serializer.save(sender=self.request.user)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_messages(request):
    """Fetch chat history between authenticated user and a friend"""
    friend_id = request.GET.get("friend_id")

    if not friend_id:
        return Response({"error": "friend_id is required"}, status=400)

    user = request.user

    messages = Message.objects.filter(
        (Q(sender=user, receiver_id=friend_id) | Q(sender_id=friend_id, receiver=user))
    ).order_by("timestamp")  # ✅ Fetch messages in ascending order

    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)
