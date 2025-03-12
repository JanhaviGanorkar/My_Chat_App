from django.db import models
from django.conf import settings  # ✅ Correct way to reference Custom User Model
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profile_pics/', default='default.jpg')  # ✅ Renamed from `image`
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user}'s Profile" 
# Signal to auto-create a profile when a user is created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

class FriendRequest(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="sent_requests", on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="received_requests", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    def accept(self):
        self.accepted = True
        self.save()
        Friendship.objects.create(user=self.sender, friend=self.receiver)
        Friendship.objects.create(user=self.receiver, friend=self.sender)

    def __str__(self):
        return f"{self.sender} -> {self.receiver} ({'Accepted' if self.accepted else 'Pending'})"

class Friendship(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="friends", on_delete=models.CASCADE)
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="friend_of", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} is friends with {self.friend}"
