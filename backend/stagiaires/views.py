from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import User, Intern, Framer, Administrator
from .serializers import UserSerializer, InternSerializer, FramerSerializer, AdministratorSerializer

class LoginAPIView(APIView):
    def post(self, request):
        identifier = request.data.get('identifier')
        password = request.data.get('password')

        try:
            user = User.objects.get(identifier=identifier)
            if check_password(password, user.password):
                return Response({"message": "connexion réussie"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"message": "identifiant introuvable"}, status=status.HTTP_404_NOT_FOUND)


class UserDetailAPIView(APIView):
    def get(self, request):
        identifier = request.query_params.get('identifier')  # identifier en paramètre de requête

        try:
            user = User.objects.get(identifier=identifier)
            user_data = UserSerializer(user).data
            role = user.role

            detail_role = None
            if role == 'intern':
                intern = Intern.objects.get(identifier=identifier)
                detail_role = InternSerializer(intern).data
            elif role == 'framer':
                framer = Framer.objects.get(identifier=identifier)
                detail_role = FramerSerializer(framer).data
            elif role == 'administrator':
                admin = Administrator.objects.get(identifier=identifier)
                detail_role = AdministratorSerializer(admin).data

            return Response({
                "identifier": user.identifier,
                "role": role,
                "name": user.name,
                "firstname": user.firstname,
                "contact": user.contact,
                "image": user.image.url if user.image else None,
                "detail_role": detail_role
            })

        except User.DoesNotExist:
            return Response({"message": "Utilisateur introuvable"}, status=status.HTTP_404_NOT_FOUND)
