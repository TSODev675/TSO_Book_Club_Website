from rest_framework.permissions import AllowAny
from rest_framework import viewsets, permissions, serializers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Profile, Book, Meeting, Archive, Reflection, Message
from .serializers import (
    UserSerializer, ProfileSerializer, BookSerializer, RegisterSerializer,
    MeetingSerializer, ArchiveSerializer, ReflectionSerializer, MessageSerializer,
    ChangePasswordSerializer, EmptySerializer
)
from .emails import send_confirmation_email
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter


# --- Permissions ---

class IsAdminRole(permissions.BasePermission):
    """Allow access only to users with admin role."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'profile') and
            request.user.profile.is_admin()
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow access to the owner of the object or admin."""
    def has_object_permission(self, request, view, obj):
        if hasattr(request.user, 'profile') and request.user.profile.is_admin():
            return True
        owner_fields = ['user', 'member', 'sender', 'added_by', 'created_by']
        for field in owner_fields:
            if hasattr(obj, field) and getattr(obj, field) == request.user:
                return True
        return False


# --- ViewSets ---

class RegisterViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_confirmation_email(user)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'detail': 'Registration successful. Please check your email to confirm your account.',
        }, status=status.HTTP_201_CREATED)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().select_related('profile')
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [permissions.IsAuthenticated(), IsAdminRole()]
        if self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        if self.action == 'destroy':
            return [permissions.IsAuthenticated(), IsAdminRole()]
        return [permissions.IsAuthenticated()]


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all().select_related('user')
    serializer_class = ProfileSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        if self.action == 'list':
            return [permissions.IsAuthenticated(), IsAdminRole()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """Return the current user's profile."""
        profile = request.user.profile
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().select_related('added_by')
    serializer_class = BookSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all().select_related('book', 'facilitator', 'created_by')
    serializer_class = MeetingSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='upcoming')
    def upcoming(self, request):
        """Return upcoming meetings ordered by date."""
        from django.utils import timezone
        qs = self.queryset.filter(date__gte=timezone.now())
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ArchiveViewSet(viewsets.ModelViewSet):
    queryset = Archive.objects.all().select_related('meeting', 'created_by').prefetch_related('reflections')
    serializer_class = ArchiveSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ReflectionViewSet(viewsets.ModelViewSet):
    queryset = Reflection.objects.all().select_related('member', 'archive')
    serializer_class = ReflectionSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(member=self.request.user)

    def get_queryset(self):
        """Optionally filter reflections by archive."""
        qs = super().get_queryset()
        archive_id = self.request.query_params.get('archive')
        if archive_id:
            qs = qs.filter(archive_id=archive_id)
        return qs


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Users only see their own sent/received messages."""
        user = self.request.user
        return Message.objects.filter(
            sender=user
        ).union(
            Message.objects.filter(recipient=user)
        ).order_by('created_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=False, methods=['get'], url_path='inbox')
    def inbox(self, request):
        """Return messages received by the current user."""
        qs = Message.objects.filter(recipient=request.user).order_by('created_at')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='read')
    def mark_read(self, request, pk=None):
        """Mark a message as read."""
        message = self.get_object()
        if message.recipient != request.user:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        message.is_read = True
        message.save()
        return Response({'status': 'message marked as read'})
    
class VerifyEmailViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = EmptySerializer

    @extend_schema(
        parameters=[
            OpenApiParameter('uidb64', OpenApiTypes.STR, OpenApiParameter.PATH),
            OpenApiParameter('token', OpenApiTypes.STR, OpenApiParameter.PATH),
        ],
        responses=EmptySerializer,
    )
    @action(detail=False, methods=['get'], url_path='verify-email/(?P<uidb64>[^/.]+)/(?P<token>[^/.]+)')
    def verify_email(self, request, uidb64=None, token=None):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
           
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
            
            return Response({'detail': 'Invalid link.'}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            profile = user.profile
            if profile.is_verified:
                return Response({'detail': 'Account already verified.'}, status=status.HTTP_200_OK)
            profile.is_verified = True
            profile.save()
            return Response({'detail': 'Email verified successfully. You can now log in.'}, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid or expired link.'}, status=status.HTTP_400_BAD_REQUEST)
        
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.profile.is_verified:
            raise serializers.ValidationError(
                {'detail': 'Please verify your email before logging in.'}
            )
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ChangePasswordViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response(
            {'detail': 'Password changed successfully.'},
            status=status.HTTP_200_OK
        )
