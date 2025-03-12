from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(required=True)  # ✅ Name field added

    class Meta:
        model = User
        fields = ['email', 'name', 'password']  # ✅ Name included in fields

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],  # ✅ Now passing name properly
            password=validated_data["password"]
        )
        return user
