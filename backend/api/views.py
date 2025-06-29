from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import Group
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from .models import *

class MeUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.email = request.data.get("email", user.email)
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)

        try:
            user.save()
        except Exception as e:
            return Response({"detail": f"Error updating profile: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }, status=status.HTTP_200_OK)


class PassUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_pass = request.data.get("old_password")
        new_pass = request.data.get("new_password")

        if not old_pass or not new_pass:
            return Response({"error": "Both old and new password fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_pass):
            return Response({"error": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_pass)
        try:
            user.save()
        except Exception as e:
            return Response({"detail": f"Error updating password: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        group = user.groups.first()

        return Response({
            "email": user.email,
            "first": user.first_name,
            "last": user.last_name,
            "grp": group.id,
        })

User = get_user_model()

class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        print(email, password)
        user = authenticate(request, email=email, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)



class RegisterAPIView(APIView):
    def post(self, request):
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        email = request.data.get("email")
        grp = request.data.get("grp")
        if(int(grp) > 2 or int(grp) < 1):
            return Response({"error": "Invalid Group Id"}, status=status.HTTP_400_BAD_REQUEST)
        password = request.data.get("password")
        print(first_name, last_name, email , grp, password)
        if not all([first_name, last_name, email, grp, password]):
            return Response({"success": "KO"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password
        )
        grp_id = Group.objects.filter(id=grp)
        user.groups.set(grp_id)
        user.save()
        return Response({"success": "OK"}, status=status.HTTP_201_CREATED)
    

class AddcourseAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        name = request.data.get("name")
        description = request.data.get("description")
        duration = request.data.get("duration")
        category_id = request.data.get("category")
        print(description, name, duration, category_id)
        if request.user.groups.first().id != 2:
            return Response({"error": "You are not authorized to add a course."}, status=status.HTTP_403_FORBIDDEN)

        if not name or not category_id or not description or not duration:
            return Response({"error": "Name, description, duration, and category are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"error": "Category not found."}, status=status.HTTP_400_BAD_REQUEST)

        course = Courses.objects.create(
            name=name,
            description=description,
            duration=duration,
            category=category,
            creator=request.user
        )
        course_data = {
            "id": course.id,
            "name": course.name,
            "description": course.description,
            "duration": course.duration,
            "category": {
                "id": category.id,
                "name": category.name
            }
        }
        return Response(course_data, status=status.HTTP_201_CREATED)
    
class GetMentorCoursesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        print(request)
        mentor_courses = Courses.objects.filter(creator=request.user)
        data = []
        for course in mentor_courses:
            data.append({
                "id": course.id,
                "name": course.name,
                "description": course.description,
                "duration": course.duration,
                "category": {
                    "id": course.category.id,
                    "name": course.category.name
                } if course.category else None,
            })
        return Response(data, status=200)
    
class SubCoursesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only return courses where the user's application is not pending
        applications = Application.objects.filter(user=request.user).exclude(status="pending")
        if not applications.exists():
            return Response({"error": "No courses found"}, status=status.HTTP_404_NOT_FOUND)

        courses_data = []
        for application in applications:
            course = application.course
            courses_data.append({
                "id": course.id,
                "name": course.name,
                "duration": course.duration,
                "description": course.description,
                "category": {
                    "id": course.category.id,
                    "name": course.category.name
                } if course.category else None,
                "creator": {
                    "first_name": course.creator.first_name if course.creator else None,
                    "last_name": course.creator.last_name if course.creator else None,
                    "email": course.creator.email if course.creator else None
                } if hasattr(course, 'creator') and course.creator else None,
            })
        return Response(courses_data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        course_id = request.data.get("course_id")
        if not user or not course_id:
            return Response({"error": "Bad data."}, status=status.HTTP_400_BAD_REQUEST)
        db_course = Courses.objects.filter(id=course_id).first()
        if not db_course:
            return Response({"error": "Bad data."}, status=status.HTTP_400_BAD_REQUEST)
        if Application.objects.filter(user=user, course=db_course).exists():
            return Response({"error": "Already applied."}, status=status.HTTP_400_BAD_REQUEST)
        new_app = Application.objects.create(
            user=user,
            course=db_course
        )
        return Response({"success": "OK"}, status=status.HTTP_201_CREATED)
    
class GetCoursesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Exclude courses where the user has any application
        user = request.user
        applied_course_ids = Application.objects.filter(user=user).values_list('course_id', flat=True)
        mentor_courses = Courses.objects.exclude(id__in=applied_course_ids)
        if not mentor_courses.exists():
            return Response({"error": "courses not found."}, status=status.HTTP_404_NOT_FOUND)

        courses_data = []
        for course in mentor_courses:
            courses_data.append({
                "id": course.id,
                "name": course.name,
                "duration": course.duration,
                "description": course.description,
                "category": {
                    "id": course.category.id,
                    "name": course.category.name
                } if course.category else None,
                "creator": {
                    "first_name": course.creator.first_name if course.creator else None,
                    "last_name": course.creator.last_name if course.creator else None,
                    "email": course.creator.email if course.creator else None
                } if hasattr(course, 'creator') and course.creator else None,
            })

        return Response(courses_data, status=status.HTTP_200_OK)

class CategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        categories = Category.objects.all()
        data = [{"id": cat.id, "name": cat.name} for cat in categories]
        return Response(data)

class StudentApplicationsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        applications = Application.objects.filter(user=request.user).select_related('course')
        data = []
        for app in applications:
            data.append({
                "id": app.id,
                "title": app.course.name,
                "status": app.status,
                "date": app.created_at.strftime('%Y-%m-%d'),
            })
        return Response(data)

class MentorCourseApplicationsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Get all applications for courses created by this mentor with pending status
        mentor_courses = Courses.objects.filter(creator=request.user)
        applications = Application.objects.filter(course__in=mentor_courses, status="pending").select_related('course', 'user')
        data = []
        for app in applications:
            data.append({
                "id": app.id,
                "course": app.course.name,
                "student_email": app.user.email,
                "student_first_name": app.user.first_name,
                "student_last_name": app.user.last_name,
                "status": app.status,
                "date": app.created_at.strftime('%Y-%m-%d'),
            })
        return Response(data)

class MentorApplicationActionAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        app_id = request.data.get('app_id')
        action = request.data.get('action')  # 'approve' or 'reject'
        if action not in ['approve', 'reject']:
            return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            application = Application.objects.get(id=app_id, course__creator=request.user)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found or not authorized.'}, status=status.HTTP_404_NOT_FOUND)
        application.status = 'accepted' if action == 'approve' else 'rejected'
        application.save()
        return Response({'success': f'Application {action}d.'}, status=status.HTTP_200_OK)

class EditCourseAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        course_id = request.data.get("course_id")
        name = request.data.get("name")
        description = request.data.get("description")
        duration = request.data.get("duration")
        category_id = request.data.get("category")
        if not course_id:
            return Response({"error": "Course ID required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            course = Courses.objects.get(id=course_id, creator=request.user)
        except Courses.DoesNotExist:
            return Response({"error": "Course not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)
        if name:
            course.name = name
        if description:
            course.description = description
        if duration:
            course.duration = duration
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                course.category = category
            except Category.DoesNotExist:
                return Response({"error": "Category not found."}, status=status.HTTP_400_BAD_REQUEST)
        course.save()
        return Response({"success": "Course updated."}, status=status.HTTP_200_OK)

class DeleteCourseAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        course_id = request.data.get("course_id")
        if not course_id:
            return Response({"error": "Course ID required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            course = Courses.objects.get(id=course_id, creator=request.user)
        except Courses.DoesNotExist:
            return Response({"error": "Course not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)
        course.delete()
        return Response({"success": "Course deleted."}, status=status.HTTP_200_OK)

class CancelApplicationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        app_id = request.data.get('app_id')
        if not app_id:
            return Response({'error': 'Application ID required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            application = Application.objects.get(id=app_id, user=request.user, status='pending')
        except Application.DoesNotExist:
            return Response({'error': 'Pending application not found or not authorized.'}, status=status.HTTP_404_NOT_FOUND)
        application.delete()
        return Response({'success': 'Application cancelled.'}, status=status.HTTP_200_OK)