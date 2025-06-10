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
from rest_framework import generics
from django.db.models import F
from decouple import config # type: ignore
import logging
User = get_user_model()

class LoginAPIView(TokenObtainPairView): #Vue pour le Login
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

class UserDetailAPIView(APIView): #Vue de récupération des données utilisateur
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

class DashboardInternAPIView(APIView):  # Vue de récupération et traitement des données du DashboardIntern
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

        # 3. toDo: Nombre de tâches avec status 'open'
        to_do_count = Task.objects.filter(status='open').count()  # Changé de AssignmentTask à Task

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

        # Statistiques pour toDoCompleted (tâches terminées)
        completed_tasks = Task.objects.filter(
            status='completed',
            end_date__gte=four_weeks_ago
        )
        weekly_tasks = [0] * 4  # 4 dernières semaines
        monthly_tasks = [0] * 12  # 12 derniers mois
        for task in completed_tasks:
            if task.end_date:
                days_diff = (today - task.end_date).days
                if days_diff < 7:
                    weekly_tasks[0] += 1
                elif days_diff < 14:
                    weekly_tasks[1] += 1
                elif days_diff < 21:
                    weekly_tasks[2] += 1
                elif days_diff < 28:
                    weekly_tasks[3] += 1
                month_index = (12 + task.end_date.month - today.month) % 12
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

        # KPI
        try:
            internships = Internship.objects.filter(instructor=instructor)
            interns_count = internships.values('intern').distinct().count()

            interviews_count = Interview.objects.filter(
                internship__instructor=instructor,
                date=today,
                status='planned'
            ).count()

            # Corriger la requête pour utiliser task__status
            to_do_completed = AssignmentTask.objects.filter(
                intern__in=internships.values('intern'),
                task__status='completed'
            ).count()

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
        except Exception as e:
            return Response(
                {"message": "Erreur lors du calcul des KPI."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Supervisions
        try:
            reports = Report.objects.filter(
                interview__internship__instructor=instructor,
                interview__date__gte=today
            ).prefetch_related('interview__internship__intern__user')
            supervisions = [{"report": ReportSerializer(report).data} for report in reports]
        except Exception as e:
            return Response(
                {"message": "Erreur lors de la récupération des supervisions."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            "kpi": kpi,
            "supervisions": supervisions,
        }, status=status.HTTP_200_OK)

class DashboardAdminAPIView(APIView): #Vue de récupération et traitement des données du DashboardAdmin
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

class ProfileInternAPIView(APIView): #Vue de récupération et traitement des données de ProfileIntern
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

class ProfileSupervisorAPIView(APIView): #Vue de récupération et traitement des données de ProfileSupervisor
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Récupérer l'utilisateur connecté
            user = request.user
            if user.role != 'instructor':
                return Response(
                    {"message": "Accès réservé aux encadrants"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Récupérer le profil Instructor associé
            instructor = Instructor.objects.get(user=user)
            instructor_data = InstructorSerializer(instructor).data

            # Récupérer les données de l'utilisateur
            user_data = UserSerializer(user).data

            # Combiner les données
            profile_data = {
                "user": user_data,
                "instructor": instructor_data,
            }

            return Response(profile_data, status=status.HTTP_200_OK)
        except Instructor.DoesNotExist:
            return Response(
                {"message": "Profil d'encadrant non trouvé"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ToolbarDetailAPIView(APIView): #Vue de récupération et traitement des données du Toolbar
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

class GenerationThemeAPIView(APIView): #Vue de récupération et traitement des données de l'API Gemini
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
        
class CreatePlanningAPIView(APIView): #Vue d'enregistrement d'un planning (chronogramme) dans la base de données
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

class TaskCalendarAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        today = timezone.now().date()
        events = []

        # Tâches uniquement pour les interns
        if user.role == 'intern':
            try:
                intern = Internship.objects.filter(intern__user=user).first()
                if intern:
                    tasks = Task.objects.all().order_by('start_date')
                    for task in tasks:
                        current_date = task.start_date
                        while current_date <= task.end_date if task.end_date else current_date <= today:
                            events.append({
                                'id': f'task_{task.id}_{current_date.isoformat()}',
                                'title': task.title,
                                'start': current_date.isoformat(),
                                'end': (current_date + timedelta(days=1)).isoformat(),
                                'extendedProps': {
                                    'description': task.description or '',
                                    'priority': task.priority,
                                    'status': task.status,
                                    'progression': task.progression,
                                    'type': 'task',
                                }
                            })
                            current_date += timedelta(days=1)

                    interviews = Interview.objects.filter(internship=intern)
                    for interview in interviews:
                        events.append({
                            'id': f'interview_{interview.id}',
                            'title': f'Entrevue avec {interview.internship.instructor.user.name}',
                            'start': interview.date.isoformat(),
                            'end': (interview.date + timedelta(days=1)).isoformat(),
                            'extendedProps': {
                                'time': interview.time.isoformat(),
                                'room': interview.room,
                                'status': interview.status,
                                'type': 'interview',
                            }
                        })
            except Exception as e:
                print(f"Erreur pour intern {user.identifier}: {e}")

        elif user.role == 'instructor':
            try:
                instructor = Instructor.objects.get(user=user)
                internships = Internship.objects.filter(instructor=instructor)
                for internship in internships:
                    interviews = Interview.objects.filter(internship=internship)
                    for interview in interviews:
                        events.append({
                            'id': f'interview_{interview.id}',
                            'title': f'Entrevue avec {internship.intern.user.name}',
                            'start': interview.date.isoformat(),
                            'end': (interview.date + timedelta(days=1)).isoformat(),
                            'extendedProps': {
                                'time': interview.time.isoformat(),
                                'room': interview.room,
                                'status': interview.status,
                                'type': 'interview',
                                'intern_id': internship.intern.user.identifier,
                            }
                        })
            except Exception as e:
                print(f"Erreur pour instructor {user.identifier}: {e}")

        elif user.role == 'administrator':
            try:
                interviews = Interview.objects.all()
                for interview in interviews:
                    events.append({
                        'id': f'interview_{interview.id}',
                        'title': f'Entrevue: {interview.internship.instructor.user.name} avec {interview.internship.intern.user.name}',
                        'start': interview.date.isoformat(),
                        'end': (interview.date + timedelta(days=1)).isoformat(),
                        'extendedProps': {
                            'time': interview.time.isoformat(),
                            'room': interview.room,
                            'status': interview.status,
                            'type': 'interview',
                            'instructor_id': interview.internship.instructor.user.identifier,
                            'intern_id': interview.internship.intern.user.identifier,
                        }
                    })
            except Exception as e:
                print(f"Erreur pour admin: {e}")

        return Response(events)

class TaskListAPIView(APIView):  # Vue de récupération et affichage des tâches dans la page KanBan Intern
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Récupérer l'utilisateur connecté
        user = request.user
        if user.role != 'intern':
            return Response({"message": "Accès réservé aux stagiaires."}, status=status.HTTP_403_FORBIDDEN)

        try:
            # Récupérer le profil Intern de l'utilisateur connecté
            intern = Intern.objects.get(user=user)
        except Intern.DoesNotExist:
            return Response({"message": "Profil stagiaire introuvable."}, status=status.HTTP_404_NOT_FOUND)

        # Récupérer les tâches assignées à cet intern via AssignmentTask
        assigned_tasks = AssignmentTask.objects.filter(intern=intern).select_related('task')
        tasks = [assignment.task for assignment in assigned_tasks]

        # Mapper les statuts de la base de données aux statuts de l'interface
        status_mapping = {
            'open': 'no',
            'progressing': 'pending',
            'completed': 'achieved',
            'cancelled': 'reported'
        }

        # Préparer les données pour l'interface
        task_data = [
            {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'status': status_mapping.get(task.status, 'no'),  # Utiliser le mapping
                'users': {
                    'id': user.id,
                    'lastname': user.name,
                    'firstname': user.firstname,
                    'avatar': user.image.url if user.image else '/path/to/default-avatar.png'  # Ajuster selon ton modèle
                },
                'start_date': task.start_date.strftime('%d %b %Y'),
                'end_date': task.end_date.strftime('%d %b %Y') if task.end_date else None,
                'priority': task.priority,
                'attachments': [],  # Placeholder, à remplir si des pièces jointes sont gérées
                'updated_at': 'Aujourd\'hui'  # Placeholder, à ajuster avec une logique réelle
            }
            for task in tasks
        ]

        return Response(task_data, status=status.HTTP_200_OK)
    
class TaskUpdateAPIView(APIView): #Vue de traitement des données du KanBan pour les changements de status en temps réel
    permission_classes = [IsAuthenticated]

    def patch(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"message": "Tâche non trouvée"}, status=status.HTTP_404_NOT_FOUND)

        status_reverse_mapping = {
            'no': 'open',
            'pending': 'progressing',
            'achieved': 'completed',
            'reported': 'cancelled'
        }
        
        new_status = request.data.get('status')
        if new_status not in status_reverse_mapping:
            return Response({"message": "Statut invalide"}, status=status.HTTP_400_BAD_REQUEST)

        task.status = status_reverse_mapping[new_status]
        task.save()
        
        # Retourner les données mises à jour avec le statut mappé
        updated_task = {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'status': new_status,  # Retourner le statut de l'interface
            'users': {
                'id': 1,
                'lastname': 'Doe',
                'firstname': 'John',
                'avatar': '/path/to/avatar.png'
            },
            'start_date': task.start_date.strftime('%d %b %Y'),
            'end_date': task.end_date.strftime('%d %b %Y') if task.end_date else None,
            'priority': task.priority,
            'attachments': [],
            'updated_at': 'Aujourd\'hui'
        }
        
        return Response(updated_task, status=status.HTTP_200_OK)

class InternshipDetailAPIView(APIView): #Vue de récupération et affichage des informations pour intern/me
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Récupérer l'utilisateur connecté et son profil Intern
            user = request.user
            intern = Intern.objects.get(user=user)

            # Récupérer l'internship actif de l'intern
            internship = Internship.objects.filter(intern=intern, status='progressing').first()
            if not internship:
                return Response({"message": "Aucun stage en cours trouvé"}, status=status.HTTP_404_NOT_FOUND)

            # Récupérer l'instructeur associé
            instructor = internship.instructor
            instructor_data = {
                "full_name": f"{instructor.user.name} {instructor.user.firstname}",
                "management": f"{instructor.management}",
                "position": instructor.position
            }

            # Calculer la durée du stage
            start_date = internship.start_date
            end_date = internship.end_date
            delta = end_date - start_date
            total_days = delta.days
            months = total_days // 30  # Approximation d'un mois = 30 jours
            remaining_days = total_days % 30
            duration = f"{months} mois"
            if remaining_days > 0:
                duration += f" et {remaining_days} jours"

            # Traduire le type de stage
            internship_type = "Stage académique" if internship.type == "academic" else "Stage d'embauche"

            # Récupérer le projet actuel
            project = Project.objects.filter(internship=internship).first()
            project_data = {
                "title": project.title if project else "Instage",
                "progress": 43,  # Placeholder, à remplacer par une logique réelle si nécessaire
                "created_at": "31/05/2025",  # Placeholder, à ajuster
                "total_tasks": 5  # Placeholder, à ajuster
            }

            # Préparer la réponse
            data = {
                "intern": {
                    "full_name": f"{user.name} {user.firstname}",
                    "domain": intern.sector,
                    "period": f"{start_date.strftime('%d/%m/%Y')} - {end_date.strftime('%d/%m/%Y')}",
                    "duration": duration,
                    "type": internship_type,
                    "avatar": user.image.url if user.image else None
                },
                "instructor": instructor_data,
                "collaborators": [],  # Vide car aucun collaborateur dans la base
                "project": project_data
            }
            return Response(data, status=status.HTTP_200_OK)
        except Intern.DoesNotExist:
            return Response({"message": "Profil d'intern non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserListAPIView(APIView): #Vue de récupération et affichage des utilisateurs dans l'interface Admin
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Vérifier que l'utilisateur est un administrateur
            user = request.user
            if user.role != 'administrator':
                return Response(
                    {"message": "Accès réservé aux administrateurs"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Récupérer tous les utilisateurs et leurs profils spécifiques
            users_data = {
                "interns": [],
                "supervisors": [],
                "admins": []
            }

            # Récupérer les stagiaires
            interns = Intern.objects.all()
            for intern in interns:
                user_data = UserSerializer(intern.user).data
                intern_data = InternSerializer(intern).data
                users_data["interns"].append({
                    "id": user_data.get("identifier", ""),
                    "lastname": user_data.get("name", ""),
                    "firstname": user_data.get("firstname", ""),
                    "avatar": user_data.get("image", ""),
                    "email": user_data.get("mail", ""),
                    "etablishment": intern_data.get("etablishment", ""),
                    "domain": intern_data.get("sector", ""),
                    "level": intern_data.get("level", ""),
                })

            # Récupérer les encadrants
            instructors = Instructor.objects.all()
            for instructor in instructors:
                user_data = UserSerializer(instructor.user).data
                instructor_data = InstructorSerializer(instructor).data
                users_data["supervisors"].append({
                    "id": user_data.get("identifier", ""),
                    "lastname": user_data.get("name", ""),
                    "firstname": user_data.get("firstname", ""),
                    "avatar": user_data.get("image", ""),
                    "email": user_data.get("mail", ""),
                    "management": instructor_data.get("management", ""),
                    "department": instructor_data.get("department", ""),
                    "position": instructor_data.get("position", ""),
                })

            # Récupérer les administrateurs
            administrators = Administrator.objects.all()
            for admin in administrators:
                user_data = UserSerializer(admin.user).data
                admin_data = AdministratorSerializer(admin).data
                users_data["admins"].append({
                    "id": user_data.get("identifier", ""),
                    "lastname": user_data.get("name", ""),
                    "firstname": user_data.get("firstname", ""),
                    "avatar": user_data.get("image", ""),
                    "email": user_data.get("mail", ""),
                    "management": admin_data.get("management", ""),
                    "department": admin_data.get("department", ""),
                    "position": admin_data.get("position", ""),
                })

            return Response(users_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CreateUserAPIView(APIView): #V
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            if user.role != 'administrator':
                return Response(
                    {"message": "Accès réservé aux administrateurs."},
                    status=status.HTTP_403_FORBIDDEN
                )

            user_data = {
                'identifier': request.data.get('identifier'),
                'mail': request.data.get('mail'),
                'name': request.data.get('name'),
                'firstname': request.data.get('firstname'),
                'contact': request.data.get('contact'),
                'password': request.data.get('password'),
                'role': request.data.get('role'),
            }

            required_fields = ['identifier', 'mail', 'name', 'firstname', 'contact', 'password', 'role']
            if not all(field in request.data for field in required_fields):
                return Response(
                    {"message": "Tous les champs obligatoires doivent être remplis."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = User.objects.create_user(**user_data)

            if user_data['role'] == 'intern':
                Intern.objects.create(
                    user=user,
                    etablishment=request.data.get('etablishment', ''),
                    sector=request.data.get('sector', ''),
                    level=request.data.get('level', '')
                )
            elif user_data['role'] == 'supervisor':
                Instructor.objects.create(
                    user=user,
                    management=request.data.get('management', ''),
                    department=request.data.get('department', ''),
                    position=request.data.get('position', '')
                )
            elif user_data['role'] == 'administrator':
                Administrator.objects.create(
                    user=user,
                    management=request.data.get('management', ''),
                    department=request.data.get('department', ''),
                    position=request.data.get('position', '')
                )

            return Response(
                {"message": "Utilisateur créé avec succès."},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class FollowUpAdminAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if request.user.role != 'administrator':
            return Response({"error": "Accès refusé. Seuls les administrateurs peuvent accéder à cette page."}, status=403)

        today = timezone.now().date()  # 2025-06-09
        interns_data = []
        projects_data = []
        reports_data = []

        # Données des stagiaires
        internships = Internship.objects.select_related('intern__user', 'instructor__user').all()
        for internship in internships:
            if not internship.intern:  # Vérification si intern est None
                continue
            intern_user = internship.intern.user
            instructor_user = internship.instructor.user
            days_left = max(0, (internship.end_date - today).days)
            assigned_tasks = AssignmentTask.objects.filter(intern=internship.intern).select_related('task')
            total_progress = sum(task.task.progression for task in assigned_tasks if task.task.progression is not None) / max(1, assigned_tasks.count()) if assigned_tasks.exists() else 0

            interns_data.append({
                'idIntern': intern_user.identifier,
                'lastname': intern_user.name,
                'firstname': intern_user.firstname,
                'daysLeft': days_left,
                'project': internship.theme,
                'supervisor': f"{instructor_user.name} {instructor_user.firstname}",
                'progress': int(total_progress),  # Progression moyenne des tâches assignées
            })

        # Données des projets
        projects = Project.objects.select_related('internship').all()
        for project in projects:
            if not project.internship or not project.internship.intern:  # Vérification de l'internship et de son intern
                continue
            assigned_tasks = AssignmentTask.objects.filter(intern=project.internship.intern).select_related('task')
            progress = sum(task.task.progression for task in assigned_tasks if task.task.progression is not None) / max(1, assigned_tasks.count()) if assigned_tasks.exists() else 0
            projects_data.append({
                'id': project.id,
                'title': project.title,
                'progress': int(progress),
            })

        # Données des rapports
        reports = Report.objects.select_related('interview__internship__intern__user', 'interview__internship__instructor__user', 'document').all()
        for report in reports:
            if not report.interview or not report.interview.internship or not report.interview.internship.intern:
                continue
            intern_user = report.interview.internship.intern.user
            instructor_user = report.interview.internship.instructor.user
            reports_data.append({
                'id': report.id,
                'title': report.title,
                'document': report.document.name if report.document else None,
                'date': report.date.isoformat(),
                'intern': f"{intern_user.name} {intern_user.firstname}",
                'receiver': f"{instructor_user.name} {instructor_user.firstname}",
                'submitted_date': report.submitted_date.isoformat() if report.submitted_date else None,
            })

        return Response({
            'interns': interns_data,
            'projects': projects_data,
            'reports': reports_data,
        })

logger = logging.getLogger(__name__)

class ProjectTaskListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        logger.info(f"Utilisateur connecté: {request.user.name}, Rôle: {request.user.role}")
        allowed_roles = ['administrator', 'instructor']
        if request.user.role not in allowed_roles:
            logger.warning(f"Accès refusé pour {request.user.name} (rôle: {request.user.role})")
            return Response({"message": "Accès réservé aux administrateurs et instructeurs."}, status=status.HTTP_403_FORBIDDEN)

        try:
            project = Project.objects.get(id=project_id)
            internship = project.internship
            intern = internship.intern
            assigned_tasks = AssignmentTask.objects.filter(intern=intern).select_related('task')
            tasks = [assignment.task for assignment in assigned_tasks]
        except (Project.DoesNotExist, Internship.DoesNotExist, Intern.DoesNotExist):
            return Response({"message": "Projet ou stagiaire non trouvé."}, status=status.HTTP_404_NOT_FOUND)

        status_mapping = {
            'open': 'no',
            'progressing': 'pending',
            'completed': 'achieved',
            'cancelled': 'reported'
        }

        task_data = [
            {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'status': status_mapping.get(task.status, 'no'),
                'users': {
                    'id': intern.user.id,
                    'lastname': intern.user.name,
                    'firstname': intern.user.firstname,
                    'avatar': intern.user.image.url if intern.user.image else '/path/to/default-avatar.png'
                },
                'start_date': task.start_date.strftime('%d %b %Y'),
                'end_date': task.end_date.strftime('%d %b %Y') if task.end_date else None,
                'priority': task.priority,
                'attachments': [],
                'updated_at': 'Aujourd\'hui'
            }
            for task in tasks
        ]

        return Response(task_data, status=status.HTTP_200_OK)

logger = logging.getLogger(__name__)

class FollowUpSupervisorAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        logger.info(f"Utilisateur connecté: {request.user.name}, Rôle: {request.user.role}")
        allowed_roles = ['instructor', 'administrator']
        if request.user.role not in allowed_roles:
            logger.warning(f"Accès refusé pour {request.user.name} (rôle: {request.user.role})")
            return Response({"message": "Accès réservé aux instructeurs et administrateurs."}, status=403)

        today = timezone.now().date()  # 2025-06-10
        interns_data = []
        projects_data = []
        reports_data = []

        # Données des stagiaires supervisés par l'instructeur
        internships = Internship.objects.filter(instructor__user=request.user).select_related('intern__user', 'instructor__user')
        for internship in internships:
            days_left = max(0, (internship.end_date - today).days)
            assigned_tasks = internship.intern.assignmenttask_set.select_related('task')
            total_progress = sum(task.task.progression for task in assigned_tasks if task.task.progression is not None) / max(1, assigned_tasks.count()) if assigned_tasks.exists() else 0

            interns_data.append({
                'idIntern': internship.intern.user.identifier,
                'lastname': internship.intern.user.name,
                'firstname': internship.intern.user.firstname,
                'daysLeft': days_left,
                'project': internship.theme,
                'progress': int(total_progress),
            })

        # Données des projets supervisés
        projects = Project.objects.filter(internship__instructor__user=request.user).distinct()
        for project in projects:
            assigned_tasks = project.internship.intern.assignmenttask_set.select_related('task')
            progress = sum(task.task.progression for task in assigned_tasks if task.task.progression is not None) / max(1, assigned_tasks.count()) if assigned_tasks.exists() else 0
            projects_data.append({
                'id': project.id,
                'title': project.title,
                'progress': int(progress),
            })

        # Données des rapports
        reports = Report.objects.filter(interview__internship__instructor__user=request.user).select_related('interview__internship__intern__user', 'document')
        for report in reports:
            intern_user = report.interview.internship.intern.user
            reports_data.append({
                'id': report.id,
                'title': report.title,
                'document': report.document.name if report.document else None,
                'date': report.date.isoformat(),
                'intern': f"{intern_user.name} {intern_user.firstname}",
            })

        return Response({
            'interns': interns_data,
            'projects': projects_data,
            'reports': reports_data,
        })