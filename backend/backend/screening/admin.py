from django.contrib import admin
from .models import Resume

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('id', 'file_name', 'job_type', 'score', 'created_at')
    list_filter = ('job_type', 'created_at')
    search_fields = ('file_name', 'content')
