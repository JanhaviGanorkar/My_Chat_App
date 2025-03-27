from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter
from chat.views import MessageViewSet

# Create API router
router = DefaultRouter()
router.register(r'messages', MessageViewSet)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("chat.urls")),
    path("authentication/", include("authentication.urls")),
    
    # ✅ Include your API routes
    path("api/", include(router.urls)),  
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
