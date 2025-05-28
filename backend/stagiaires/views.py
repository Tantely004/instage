from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.utils import timezone

class LoginAPIView(TokenObtainPairView):
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

class DashboardInternAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'intern':
            return Response({"message": "Accès réservé aux stagiaires."}, status=status.HTTP_403_FORBIDDEN)

        try:
            intern = Intern.objects.get(user=user)
        except Intern.DoesNotExist:
            return Response({"message": "Profil stagiaire introuvable."}, status=status.HTTP_404_NOT_FOUND)

        # 1. daysLeft: Calculer les jours restants pour le stage
        internship = None
        try:
            internship = Internship.objects.get(intern=intern, status='progressing')  # Changé de 'in_progress' à 'progressing'
            days_left = (internship.end_date - timezone.now().date()).days
        except Internship.DoesNotExist:
            days_left = 0

        # 2. documents: Récupérer les documents soumis par le stagiaire (distincts)
        reports = Report.objects.filter(interview__internship__intern=intern).exclude(document__isnull=True)
        document_ids = reports.values_list('document__id', flat=True).distinct()
        documents = Document.objects.filter(id__in=document_ids)
        documents_count = documents.count()

        # 3. toDo: Nombre de tâches en attente
        to_do_count = AssignmentTask.objects.filter(intern=intern, status='pending').count()

        # 4. cumulatedHour: Total des heures de travail entre start_date et aujourd'hui
        if internship:
            work_logs = WorkHoursLog.objects.filter(
                intern=intern,
                date__gte=internship.start_date,
                date__lte=timezone.now().date()
            )
            cumulated_hours = sum(log.hours_worked for log in work_logs)
        else:
            cumulated_hours = 0

        # 5. statistics: Calcul des statistiques réelles
        today = timezone.now().date()
        four_weeks_ago = today - timedelta(days=28)
        twelve_months_ago = today - timedelta(days=365)

        # Statistiques pour toDoCompleted
        completed_tasks = AssignmentTask.objects.filter(
            intern=intern,
            status='completed',
            completed_date__gte=four_weeks_ago
        )
        weekly_tasks = [0] * 4  # 4 dernières semaines
        monthly_tasks = [0] * 12  # 12 derniers mois
        for task in completed_tasks:
            if task.completed_date:
                days_diff = (today - task.completed_date.date()).days
                if days_diff < 7:
                    weekly_tasks[0] += 1
                elif days_diff < 14:
                    weekly_tasks[1] += 1
                elif days_diff < 21:
                    weekly_tasks[2] += 1
                elif days_diff < 28:
                    weekly_tasks[3] += 1
                month_index = (12 + task.completed_date.month - today.month) % 12
                monthly_tasks[month_index] += 1

        # Statistiques pour document
        submitted_reports = Report.objects.filter(
            interview__internship__intern=intern,
            status='submitted',
            submitted_date__gte=four_weeks_ago
        )
        weekly_docs = [0] * 4  # 4 dernières semaines
        monthly_docs = [0] * 12  # 12 derniers mois
        for report in submitted_reports:
            if report.submitted_date:
                days_diff = (today - report.submitted_date.date()).days
                if days_diff < 7:
                    weekly_docs[0] += 1
                elif days_diff < 14:
                    weekly_docs[1] += 1
                elif days_diff < 21:
                    weekly_docs[2] += 1
                elif days_diff < 28:
                    weekly_docs[3] += 1
                month_index = (12 + report.submitted_date.month - today.month) % 12
                monthly_docs[month_index] += 1

        statistics = {
            "toDoCompleted": {
                "weekly": weekly_tasks,
                "monthly": monthly_tasks
            },
            "document": {
                "weekly": weekly_docs,
                "monthly": monthly_docs
            }
        }

        # 6. supervisions: Liste des rapports avec leurs interviews et internships
        reports = Report.objects.filter(interview__internship__intern=intern)
        supervisions = [{"report": ReportSerializer(report).data} for report in reports]

        return Response({
            "daysLeft": days_left,
            "documents": documents_count,
            "toDo": to_do_count,
            "cumulatedHour": cumulated_hours,
            "statistics": statistics,
            "supervisions": supervisions
        }, status=status.HTTP_200_OK)
    
class DashboardInstructorAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()

        # Vérifier le rôle de l'utilisateur
        if user.role != 'instructor':
            return Response(
                {"message": "Accès réservé aux encadreurs."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            instructor = Instructor.objects.get(user=user)
        except Instructor.DoesNotExist:
            return Response(
                {"message": "Profil encadreur introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        # kpi
        # interns: Nombre de stagiaires encadrés
        internships = Internship.objects.filter(instructor=instructor)
        interns_count = internships.values('intern').distinct().count()

        # interview: Nombre d'entrevues prévues aujourd'hui
        interviews_count = Interview.objects.filter(
            internship__instructor=instructor,
            date=today,
            status='planned'
        ).count()

        # toDoCompleted: Nombre total de tâches complétées par tous les stagiaires encadrés
        to_do_completed = AssignmentTask.objects.filter(
            intern__in=internships.values('intern'),
            status='completed'
        ).count()

        # receivedReports: Nombre de rapports soumis aujourd'hui
        received_reports = Report.objects.filter(
            interview__internship__instructor=instructor,
            status='submitted',
            submitted_date__date=today
        ).count()

        kpi = {
            "interns": interns_count,
            "interview": interviews_count,
            "toDoCompleted": to_do_completed,
            "receivedReports": received_reports
        }

        # supervisions: Liste des encadrements (date >= aujourd'hui)
        reports = Report.objects.filter(
            interview__internship__instructor=instructor,
            interview__date__gte=today
        )
        supervisions = [{"report": ReportSerializer(report).data} for report in reports]

        return Response({
            "kpi": kpi,
            "supervisions": supervisions,
        }, status=status.HTTP_200_OK)