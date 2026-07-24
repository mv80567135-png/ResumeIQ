from django.db import models

class Resume(models.Model):
    content = models.TextField()

    def __str__(self):
        return f"Resume {self.id}"
