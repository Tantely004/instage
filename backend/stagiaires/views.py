from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
import requests
from django.db.models import Count
from django.db.models.functions import ExtractMonth
from decouple import config # type: ignore

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
                month_index = (12 + task.completed_date.month - today.month

) % 12
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

class DashboardAdminAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Vérifier que l'utilisateur est un admin
            user = request.user
            if user.role not in ['administrator']:
                return Response(
                    {"message": "Accès réservé aux administrateurs"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Compter les utilisateurs par rôle
            interns_count = User.objects.filter(role='intern').count()
            instructors_count = User.objects.filter(role='instructor').count()
            admins_count = User.objects.filter(role__in=['administrator']).count()

            # Compter les documents
            # Rapports : Compter les documents liés aux rapports soumis
            reports_count = Report.objects.filter(status='submitted').count()
            # Attestations : Estimation basée sur les stages terminés (is_finished=True)
            attestations_count = Internship.objects.filter(is_finished=True).count()

            # Statistiques de stage : Compter les stages par mois (basé sur start_date)
            current_year = datetime.now().year  # 2025
            stage_counts = (
                Internship.objects
                .filter(start_date__year=current_year)
                .annotate(month=ExtractMonth('start_date'))
                .values('month')
                .annotate(count=Count('id'))
                .order_by('month')
            )

            # Initialiser les données pour chaque mois (0 par défaut)
            months = ["Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Déc"]
            stage_data = [0] * 12  # Liste de 12 zéros pour chaque mois
            for entry in stage_counts:
                month_index = entry['month'] - 1  # Mois de 1 à 12 -> index de 0 à 11
                stage_data[month_index] = entry['count']

            stage_statistics = {
                "labels": months,
                "data": stage_data
            }

            # Répartition par niveau : Compter les stagiaires par niveau
            level_counts = (
                Intern.objects
                .values('level')
                .annotate(count=Count('user_id'))
                .order_by('level')
            )

            level_labels = []
            level_data = []
            for entry in level_counts:
                level_labels.append(entry['level'])
                level_data.append(entry['count'])

            # Si aucun niveau n'est trouvé, fournir des valeurs par défaut
            if not level_labels:
                level_labels = ["Licence", "Master"]
                level_data = [0, 0]

            level_distribution = {
                "labels": level_labels,
                "data": level_data
            }

            response_data = {
                "users": {
                    "interns": interns_count,
                    "instructors": instructors_count,
                    "admins": admins_count
                },
                "documents": {
                    "reports": reports_count,
                    "attestations": attestations_count
                },
                "stage_statistics": stage_statistics,
                "level_distribution": level_distribution
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProfileInternAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Récupérer l'utilisateur connecté
            user = request.user
            if user.role != 'intern':
                return Response(
                    {"message": "Accès réservé aux stagiaires"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Récupérer le profil Intern associé
            intern = Intern.objects.get(user=user)
            intern_data = InternSerializer(intern).data

            # Récupérer les données de l'utilisateur
            user_data = UserSerializer(user).data

            # Récupérer l'internship associé (s'il existe)
            try:
                internship = Internship.objects.get(intern=intern)
                internship_data = InternshipSerializer(internship).data
            except Internship.DoesNotExist:
                internship_data = None

            # Combiner les données
            profile_data = {
                "user": user_data,
                "intern": intern_data,
                "internship": internship_data,
            }

            return Response(profile_data, status=status.HTTP_200_OK)
        except Intern.DoesNotExist:
            return Response(
                {"message": "Profil stagiaire non trouvé"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
User = get_user_model()

class ToolbarDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            user_data = UserSerializer(user).data
            return Response(user_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GenerationThemeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Récupérer le prompt et le contenu des fichiers depuis la requête
            prompt_text = request.data.get('prompt', '')
            file_content = request.data.get('file_content', '')

            if not prompt_text:
                return Response(
                    {"message": "Le prompt est requis."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Construire le prompt complet
            full_prompt = f"""
                Générez des thèmes de stage adaptés en fonction des informations suivantes :
                Prompt utilisateur : {prompt_text}
                Contenu des fichiers (CV ou autres) : {file_content}
                Proposez 2 à 3 thèmes avec un titre et une description au format suivant :
                ### Titre 1
                Description 1
                ### Titre 2
                Description 2
                ### Titre 3
                Description 3
            """

            # Récupérer la clé API depuis .env
            api_key = config('GEMINI_API_KEY')
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}"

            # Envoyer la requête à Gemini API
            response = requests.post(
                url,
                json={
                    "contents": [
                        {
                            "parts": [
                                {"text": full_prompt}
                            ]
                        }
                    ]
                },
                headers={
                    "Content-Type": "application/json"
                }
            )

            # Vérifier si la requête a réussi
            if response.status_code != 200:
                return Response(
                    {"message": "Erreur lors de la communication avec Gemini API."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Extraire la réponse
            response_data = response.json()
            generated_text = response_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')

            # Parser les thèmes générés
            themes = []
            lines = generated_text.split('\n')
            current_title = None
            current_description = []

            for line in lines:
                line = line.strip()
                if line.startswith('### '):
                    if current_title and current_description:
                        themes.append({
                            "id": len(themes) + 1,
                            "title": current_title,
                            "description": ' '.join(current_description).strip()
                        })
                    current_title = line.replace('### ', '').strip()
                    current_description = []
                elif line and current_title:
                    current_description.append(line)

            # Ajouter le dernier thème si existe
            if current_title and current_description:
                themes.append({
                    "id": len(themes) + 1,
                    "title": current_title,
                    "description": ' '.join(current_description).strip()
                })

            return Response(
                {"themes": themes},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"message": f"Erreur lors de la génération des thèmes : {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class CreatePlanningAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            if user.role != 'intern':
                return Response(
                    {"message": "Accès réservé aux stagiaires."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Récupérer le profil Intern
            try:
                intern = Intern.objects.get(user=user)
            except Intern.DoesNotExist:
                return Response(
                    {"message": "Profil stagiaire introuvable."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Récupérer l'Internship associé
            try:
                internship = Internship.objects.get(intern=intern, status='progressing')
            except Internship.DoesNotExist:
                return Response(
                    {"message": "Aucun stage en cours trouvé."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Récupérer ou créer le Project associé
            project, created = Project.objects.get_or_create(
                internship=internship,
                defaults={'title': request.data.get('title', 'Projet par défaut')}
            )

            # Créer le Planning
            planning_data = {
                'title': request.data.get('title'),
                'project': project,
                'start_date': request.data.get('start_date'),
                'end_date': request.data.get('end_date'),
            }

            planning = Planning.objects.create(**planning_data)

            # Créer les Tasks
            tasks_data = request.data.get('tasks', [])
            for task_data in tasks_data:
                if task_data.get('title'):  # S'assurer que la tâche a un titre
                    Task.objects.create(
                        title=task_data.get('title'),
                        description=task_data.get('detail', ''),
                        priority=task_data.get('priority', 'medium').upper(),  # Adapter au modèle Task
                        status=task_data.get('status', 'open').upper(),  # Adapter au modèle Task
                        start_date=task_data.get('start_date'),
                        end_date=task_data.get('end_date'),
                    )

            return Response(
                {"message": "Chronogramme et tâches enregistrés avec succès."},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )