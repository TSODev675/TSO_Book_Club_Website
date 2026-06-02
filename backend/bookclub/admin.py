from django.contrib import admin
from .models import Profile, Book, Meeting, Archive, Reflection, Message


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'joined_date']
    list_filter = ['role']
    search_fields = ['user__username', 'user__email']


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'published_date', 'added_by', 'created_at']
    search_fields = ['title', 'author']


@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ['book', 'date', 'facilitator', 'topic', 'created_by']
    list_filter = ['date']
    search_fields = ['book__title', 'topic']


@admin.register(Archive)
class ArchiveAdmin(admin.ModelAdmin):
    list_display = ['meeting', 'created_by', 'created_at']
    search_fields = ['meeting__book__title']


@admin.register(Reflection)
class ReflectionAdmin(admin.ModelAdmin):
    list_display = ['member', 'archive', 'created_at']
    search_fields = ['member__username']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'recipient', 'is_read', 'created_at']
    list_filter = ['is_read']
    search_fields = ['sender__username', 'recipient__username']