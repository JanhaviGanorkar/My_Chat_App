from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("id", "email", "name", "is_staff", "is_active")  # ✅ Admin Panel m jo fields dikhani hai
    list_filter = ("is_staff", "is_active")
    fieldsets = (
        (None, {"fields": ("email", "name", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "name", "password1", "password2", "is_staff", "is_active")}
        ),
    )
    search_fields = ("email", "name")
    ordering = ("email",)

admin.site.register(CustomUser, CustomUserAdmin)  # ✅ Register Custom User
