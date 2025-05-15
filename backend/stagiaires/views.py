from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import User, Intern, Instructor, Administrator
from .serializers import UserSerializer, InternSerializer, InstructorSerializer, AdministratorSerializer


class LoginAPIView(APIView):
    def post(self, request):
        identifier = request.data.get('identifier')
        password = request.data.get('password')

        try:
            user = User.objects.get(identifier=identifier)
            if check_password(password, user.password):
                return Response({"message": "Connexion réussie"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"message": "Identifiant introuvable"}, status=status.HTTP_404_NOT_FOUND)


class UserDetailAPIView(APIView):
    def get(self, request):
        identifier = request.query_params.get('identifier')

        try:
            user = User.objects.get(identifier=identifier)
            user_data = UserSerializer(user).data
            role = user.role

            detail_role = None
            if role == 'intern':
                try:
                    intern = Intern.objects.get(user=user)
                    detail_role = InternSerializer(intern).data
                except Intern.DoesNotExist:
                    detail_role = {"message": "Le détail du rôle 'intern' est introuvable."}

            elif role == 'instructor':
                try:
                    instructor = Instructor.objects.get(user=user)
                    detail_role = InstructorSerializer(instructor).data
                except Instructor.DoesNotExist:
                    detail_role = {"message": "Le détail du rôle 'instructor' est introuvable."}

            elif role == 'administrator':
                try:
                    admin = Administrator.objects.get(user=user)
                    detail_role = AdministratorSerializer(admin).data
                except Administrator.DoesNotExist:
                    detail_role = {"message": "Le détail du rôle 'administrator' est introuvable."}

            return Response({
                "identifier": user.identifier,
                "role": role,
                "name": user.name,
                "firstname": user.firstname,
                "contact": user.contact,
                "image": user.image.url if user.image else None,
                "cv": user.cv.url if user.cv else None,
                "detail_role": detail_role
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"message": "Utilisateur introuvable"}, status=status.HTTP_404_NOT_FOUND)
