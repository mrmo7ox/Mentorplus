from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import status


class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get("username")
        passowrd = request.data.get("passowrd")
        user = authenticate(username=username, passowrd=passowrd)
        if user is not None:
            token , created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)