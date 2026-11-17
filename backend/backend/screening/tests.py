import io
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from .models import Resume

class ScreeningAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_missing_file_returns_400(self):
        response = self.client.post('/api/screen/', {'job_type': 'IT'})
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)

    def test_unsupported_file_type_returns_400(self):
        file = SimpleUploadedFile("test.exe", b"binary content", content_type="application/octet-stream")
        response = self.client.post('/api/screen/', {'resume': file, 'job_type': 'IT'}, format='multipart')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Unsupported file format', response.data['error'])

    def test_text_resume_matching_and_no_false_positives(self):
        # "digital" should NOT trigger "git", but "python" and "react" should be matched.
        content = b"Candidate has strong background in digital media, python programming and react framework."
        file = SimpleUploadedFile("resume.txt", content, content_type="text/plain")
        response = self.client.post('/api/screen/', {'resume': file, 'job_type': 'IT'}, format='multipart')

        self.assertEqual(response.status_code, 200)
        self.assertIn("python", response.data['matched_skills'])
        self.assertIn("react", response.data['matched_skills'])
        self.assertNotIn("git", response.data['matched_skills']) # Verify "digital" did NOT match "git"
        self.assertIn("git", response.data['missing_skills'])
        self.assertGreater(response.data['score'], 0)

        # Ensure saved to DB
        self.assertEqual(Resume.objects.count(), 1)

    def test_get_history(self):
        Resume.objects.create(file_name="test.pdf", job_type="IT", score=50.0)
        response = self.client.get('/api/history/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
