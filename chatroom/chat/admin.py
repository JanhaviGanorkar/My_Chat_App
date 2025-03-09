from django.contrib import admin
from .models import FriendRequest, Friendship, Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "bio")  # Fields to show in the admin list view
    search_fields = ("user__username",)  # Allow searching by username

@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ("sender", "receiver", "accepted", "timestamp")
    list_filter = ("accepted",)
    search_fields = ("sender__username", "receiver__username")

@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    list_display = ("user", "friend")
    search_fields = ("user__username", "friend__username")
