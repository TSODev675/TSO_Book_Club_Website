from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Book, Meeting, Archive, Reflection, Message


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'role', 'joined_date']
        read_only_fields = ['joined_date']


class BookSerializer(serializers.ModelSerializer):
    added_by = UserSerializer(read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'published_date', 'description', 'added_by', 'created_at']
        read_only_fields = ['added_by', 'created_at']


class MeetingSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(), source='book', write_only=True
    )
    facilitator = UserSerializer(read_only=True)
    facilitator_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='facilitator', write_only=True, required=False
    )
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Meeting
        fields = [
            'id', 'book', 'book_id', 'date', 'topic',
            'facilitator', 'facilitator_id', 'teams_link',
            'created_by', 'created_at'
        ]
        read_only_fields = ['created_by', 'created_at']


class ReflectionSerializer(serializers.ModelSerializer):
    member = UserSerializer(read_only=True)

    class Meta:
        model = Reflection
        fields = ['id', 'archive', 'member', 'content', 'created_at']
        read_only_fields = ['member', 'created_at']


class ArchiveSerializer(serializers.ModelSerializer):
    meeting = MeetingSerializer(read_only=True)
    meeting_id = serializers.PrimaryKeyRelatedField(
        queryset=Meeting.objects.all(), source='meeting', write_only=True
    )
    created_by = UserSerializer(read_only=True)
    reflections = ReflectionSerializer(many=True, read_only=True)

    class Meta:
        model = Archive
        fields = [
            'id', 'meeting', 'meeting_id', 'description',
            'video_link', 'created_by', 'created_at', 'reflections'
        ]
        read_only_fields = ['created_by', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    recipient_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='recipient', write_only=True
    )

    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'recipient_id', 'content', 'is_read', 'created_at']
        read_only_fields = ['sender', 'is_read', 'created_at']