from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = User.objects.get(identifier=request.data.get('identifier'))
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
                "access": serializer.validated_data['access'],
                "refresh": serializer.validated_data['refresh'],
                "user": {
                    "identifier": user.identifier,
                    "role": role,
                    "name": user.name,
                    "firstname": user.firstname,
                    "contact": user.contact,
                    "image": user.image.url if user.image else None,
                    "cv": user.cv.url if user.cv else None,
                    "detail_role": detail_role
                }
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "Identifiant introuvable"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Utilisateur authentifié via JWT
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