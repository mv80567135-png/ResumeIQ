from django.db import models
from django.utils import timezone

class Resume(models.Model):
    file_name = models.CharField(max_length=255, blank=True, default='')
    job_type = models.CharField(max_length=50, default='IT')
    score = models.FloatField(default=0.0)
    matched_skills = models.JSONField(default=list, blank=True)
    missing_skills = models.JSONField(default=list, blank=True)
    content = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.file_name or 'Resume'} ({self.job_type}) - {self.score}%"
