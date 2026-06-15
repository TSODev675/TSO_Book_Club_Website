from typing import Any
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ProfileViewSet, BookViewSet,
    MeetingViewSet, ArchiveViewSet, ReflectionViewSet, MessageViewSet
)

router: Any = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'books', BookViewSet, basename='book')
router.register(r'meetings', MeetingViewSet, basename='meeting')
router.register(r'archives', ArchiveViewSet, basename='archive')
router.register(r'reflections', ReflectionViewSet, basename='reflection')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = router.urls