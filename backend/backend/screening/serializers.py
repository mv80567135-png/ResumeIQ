from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = Resume
        fields = [
            'id',
            'file_name',
            'job_type',
            'score',
            'matched_skills',
            'missing_skills',
            'created_at',
        ]
