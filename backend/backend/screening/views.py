# from rest_framework.decorators import api_view
# from rest_framework.response import Response

# REQUIRED_SKILLS = [
#     "python",
#     "django",
#     "react",
#     "mysql",
#     "git",
#     "javascript"
# ]

# @api_view(['POST'])
# def screen_resume(request):

#     resume_text = request.data.get('resume', '').lower()

#     matched = []

#     for skill in REQUIRED_SKILLS:
#         if skill in resume_text:
#             matched.append(skill)

#     score = round(
#         (len(matched) / len(REQUIRED_SKILLS)) * 100,
#         2
#     )

#     return Response({
#         "score": score,
#         "matched_skills": matched
#     })




from PyPDF2 import PdfReader
from rest_framework.decorators import api_view
from rest_framework.response import Response

IT_SKILLS = [
    "python",
    "django",
    "react",
    "mysql",
    "git",
    "AI & ML"
]

NON_IT_SKILLS = [
    "excel",
    "tally",
    "finance",
    "accounting",
    "communication"
]

@api_view(['POST'])
def screen_resume(request):

    uploaded_file = request.FILES.get("resume")
    job_type = request.data.get("job_type")

    reader = PdfReader(uploaded_file)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text.lower()

    skills = IT_SKILLS if job_type == "IT" else NON_IT_SKILLS

    matched_skills = []

    for skill in skills:
        if skill in text:
            matched_skills.append(skill)

    score = round(
        (len(matched_skills) / len(skills)) * 100,
        2
    )

    return Response({
        "job_type": job_type,
        "score": score,
        "matched_skills": matched_skills
    })