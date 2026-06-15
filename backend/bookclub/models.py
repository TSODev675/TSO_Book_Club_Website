from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    joined_date = models.DateField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} — {self.role}"

    def is_admin(self):
        return self.role == 'admin'

    def is_member(self):
        return self.role == 'member'


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    published_date = models.DateField()
    description = models.TextField(blank=True)
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='books_added')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']


class Meeting(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='meetings')
    date = models.DateTimeField()
    topic = models.CharField(max_length=300, blank=True)
    facilitator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='facilitated_meetings')
    teams_link = models.URLField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='meetings_created')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.book.title} — {self.date.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['-date']


class Archive(models.Model):
    meeting = models.OneToOneField(Meeting, on_delete=models.CASCADE, related_name='archive')
    description = models.TextField()
    video_link = models.URLField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='archives_created')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Archive — {self.meeting}"

    class Meta:
        ordering = ['-created_at']


class Reflection(models.Model):
    archive = models.ForeignKey(Archive, on_delete=models.CASCADE, related_name='reflections')
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reflections')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.member.username} on {self.archive}"

    class Meta:
        ordering = ['created_at']


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} → {self.recipient.username}"

    class Meta:
        ordering = ['created_at']