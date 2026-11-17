import os
import re
from PyPDF2 import PdfReader
from docx import Document
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Resume
from .serializers import ResumeSerializer

IT_SKILLS = [
    "python",
    "django",
    "react",
    "mysql",
    "git",
    "javascript",
    "html",
    "css",
    "sql",
    "rest api",
]

NON_IT_SKILLS = [
    "excel",
    "tally",
    "finance",
    "accounting",
    "communication",
    "management",
    "marketing",
    "sales",
    "ms office",
]

def extract_text_from_file(uploaded_file):
    """
    Safely extract plain text from PDF, DOCX, or TXT file.
    """
    filename = uploaded_file.name.lower()
    text = ""

    if filename.endswith(".pdf"):
        reader = PdfReader(uploaded_file)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "

    elif filename.endswith(".docx"):
        doc = Document(uploaded_file)
        for para in doc.paragraphs:
            if para.text:
                text += para.text + " "

    elif filename.endswith(".txt"):
        text = uploaded_file.read().decode("utf-8", errors="ignore")

    else:
        raise ValueError("Unsupported file format. Please upload a PDF, DOCX, or TXT file.")

    return text.strip()


@api_view(['POST'])
def screen_resume(request):
    uploaded_file = request.FILES.get("resume")
    job_type = request.data.get("job_type", "IT")

    if not uploaded_file:
        return Response(
            {"error": "Please select and upload a resume file."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate file size (10MB limit)
    if uploaded_file.size > 10 * 1024 * 1024:
        return Response(
            {"error": "File size exceeds 10MB limit. Please upload a smaller file."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Extract text safely
    try:
        raw_text = extract_text_from_file(uploaded_file)
    except ValueError as ve:
        return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {"error": f"Failed to parse resume: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not raw_text:
        return Response(
            {"error": "Could not extract any readable text from the uploaded document. If it is an image-only scan, please provide a text-based PDF/DOCX."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Normalize job type
    normalized_job_type = "IT" if str(job_type).strip().upper() == "IT" else "NON_IT"
    target_skills = IT_SKILLS if normalized_job_type == "IT" else NON_IT_SKILLS

    matched_skills = []
    missing_skills = []

    # Accurate word-boundary matching to prevent false positives (e.g. 'git' in 'digital')
    for skill in target_skills:
        pattern = rf"(?<![a-zA-Z0-9_]){re.escape(skill.lower())}(?![a-zA-Z0-9_])"
        if re.search(pattern, raw_text.lower()):
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    total_skills = len(target_skills)
    score = round((len(matched_skills) / total_skills) * 100, 1) if total_skills > 0 else 0.0

    # Save to database
    resume_record = Resume.objects.create(
        file_name=uploaded_file.name,
        job_type="IT" if normalized_job_type == "IT" else "Non-IT",
        score=score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        content=raw_text[:5000]
    )

    return Response({
        "id": resume_record.id,
        "file_name": uploaded_file.name,
        "job_type": "IT" if normalized_job_type == "IT" else "Non-IT",
        "score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "total_skills": total_skills
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_history(request):
    """
    Retrieve recently analyzed resumes.
    """
    resumes = Resume.objects.all().order_by('-created_at')[:20]
    serializer = ResumeSerializer(resumes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def clear_history(request):
    """
    Clear all analysis history.
    """
    Resume.objects.all().delete()
    return Response({"message": "History cleared successfully."}, status=status.HTTP_200_OK)
