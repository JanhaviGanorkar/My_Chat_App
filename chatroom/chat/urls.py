from django.urls import path
from . import views
from .views import profile_view, user_profile
from rest_framework_simplejwt.views import TokenObtainPairView


urlpatterns = [
    path("", views.home, name="home"),
    #  path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('user-profile/<int:user_id>/', views.user_profile, name='user-profile'),
    path("profile/<str:username>/", views.profile_view, name="profile"),
    path("chat/<str:room_name>/", views.room, name="room"),
    path("friends/", views.friends_page, name="friends_page"),
    path("friends/send/<int:receiver_id>/", views.send_friend_request, name="send-friend-request"),
    path("friends/accept/<int:request_id>/", views.accept_friend_request, name="accept-friend-request"),
    path("friends/requests/", views.list_friend_requests, name="list-friend-requests"),
    path("friends/list/", views.list_friends, name="list-friends"),
]
