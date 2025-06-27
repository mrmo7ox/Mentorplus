from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import Group
from rest_framework.authtoken.models import Token
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