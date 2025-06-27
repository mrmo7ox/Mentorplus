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
        pass1 = request.data.get("passowrd1", user.email)
        pass2 = request.data.get("passowrd2", user.first_name)
        if not pass1 or not pass2:
            return Response({"error": "Both password fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if pass1 != pass2:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(pass1)
        try:
            user.save()
        except Exception as e:
            return Response({"detail": f"Error updating profile: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
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
    def post(self, request):
        name = request.data.get("name")
        image = request.data.files("image")[0]
        category = request.data.get("category")