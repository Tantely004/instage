import { useState, useEffect, useRef } from 'react';
import { Button } from "primereact/button";
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { ScrollPanel } from 'primereact/scrollpanel';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import * as pdfjsLib from 'pdfjs-dist'; // Import de pdf.js

import student from "../../assets/images/student.png";
import useReport from '../../composables/useReport';

const DashboardIntern = () => {
    const [themeDialog, setThemeDialog] = useState(false);
    const [loadingDialog, setLoadingDialog] = useState(false);
    const [resultsDialog, setResultsDialog] = useState(false);
    const [generatedThemes, setGeneratedThemes] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [promptText, setPromptText] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    };

    const pageTransition = { duration: 0.5 };

    const { fetchDashboardData, dashboardData, loading, error } = useReport();
    const [selectedPeriod, setSelectedPeriod] = useState('weekly');
    const periods = [
        { name: 'Hebdomadaire', value: 'weekly' },
        { name: 'Mensuel', value: 'monthly' },
    ];

    // Fonction pour extraire le texte d'un PDF avec pdf.js
    const extractTextFromPDF = async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(' ') + '\n';
            }
            return text;
        } catch (error) {
            console.error('Erreur lors de l\'extraction du texte du PDF:', error);
            return '';
        }
    };

    // Fonction pour générer les thèmes via l'API Django
    const generateThemes = async () => {
        try {
            setThemeDialog(false);
            setLoadingDialog(true);
            setGeneratedThemes([]);
            setSelectedTheme(null);

            // Extraire le texte des fichiers PDF
            const fileContents = await Promise.all(
                uploadedFiles.map(file => extractTextFromPDF(file))
            );
            const combinedFileContent = fileContents.join('\n');

            // Récupérer le token JWT depuis le localStorage
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('Utilisateur non authentifié. Veuillez vous connecter.');
            }

            // Appeler l'API Django
            const response = await fetch('http://localhost:8000/api/generationtheme/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    prompt: promptText,
                    file_content: combinedFileContent,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la génération des thèmes.');
            }

            const data = await response.json();
            setGeneratedThemes(data.themes || []);
            setLoadingDialog(false);
            setResultsDialog(true);
            setPromptText('');
            setUploadedFiles([]);
        } catch (error) {
            setLoadingDialog(false);
            alert(error.message);
        }
    };

    const handleGenerate = () => {
        if (promptText.trim()) {
            generateThemes();
        }
    };

    const handleSelectTheme = (theme) => {
        setSelectedTheme(theme);
    };

    const handleValidateTheme = () => {
        if (selectedTheme) {
            setResultsDialog(false);
        }
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => {
            const extension = file.name.split('.').pop().toLowerCase();
            const isValidType = ['pdf', 'doc', 'docx'].includes(extension);
            const isValidSize = file.size <= 10000000;
            return isValidType && isValidSize;
        });

        if (validFiles.length < files.length) {
            alert('Certains fichiers ont été ignorés : seuls les fichiers .pdf, .doc, .docx de moins de 10 Mo sont acceptés.');
        }

        setUploadedFiles(prev => [...prev, ...validFiles]);
        event.target.value = null;
    };

    const handleRemoveFile = (file) => {
        setUploadedFiles(prev => prev.filter(f => f !== file));
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (dashboardData && dashboardData.statistics) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            const labels = selectedPeriod === 'weekly'
                ? ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
                : ['Mois 1', 'Mois 2', 'Mois 3', 'Mois 4', 'Mois 5', 'Mois 6', 'Mois 7', 'Mois 8', 'Mois 9', 'Mois 10', 'Mois 11', 'Mois 12'];

            const data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Tâches réalisées',
                        backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
                        borderColor: documentStyle.getPropertyValue('--indigo-400'),
                        data: dashboardData.statistics.toDoCompleted[selectedPeriod],
                    },
                    {
                        label: 'Documents soumis',
                        backgroundColor: documentStyle.getPropertyValue('--gray-500'),
                        borderColor: documentStyle.getPropertyValue('--gray-500'),
                        data: dashboardData.statistics.document[selectedPeriod],
                    },
                ],
            };

            const options = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        labels: {
                            fontColor: textColor,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500,
                            },
                        },
                        grid: {
                            display: false,
                            drawBorder: false,
                        },
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false,
                        },
                    },
                },
            };

            setChartData(data);
            setChartOptions(options);
        }
    }, [dashboardData, selectedPeriod]);

    if (loading) {
        return <div></div>;
    }

    if (error) {
        return <div className="text-red-600 text-center">{error}</div>;
    }

    if (!dashboardData) {
        return <div></div>;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const today = new Date();

    const upcomingSupervisions = dashboardData.supervisions.filter((supervision) => {
        const interview = supervision.report.interview;
        const interviewDateTime = new Date(`${interview.date}T${interview.time}`);
        return interviewDateTime >= today;
    });

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="px-16 mb-16"
        >
            <div className="grid grid-cols-2 gap-8 items-center">
                <section className="col-span-1 flex justify-between items-center bg-gray-50 px-8 py-6 shadow border border-gray-100 rounded-lg">
                    <div>
                        <h1 className="text-2xl font-bold text-indigo-400">
                            Bonjour, {user.firstname} {user.name} !
                        </h1>
                        <h2 className="font-bold mt-6">
                            Valorisez votre travail
                        </h2>
                        <p className="mt-2 mb-4">
                            Donnez une direction claire à votre stage avec un thème adapté
                        </p>

                        <Button
                            label="Générer un thème"
                            onClick={() => setThemeDialog(true)}
                        />

                        <Dialog
                            visible={themeDialog}
                            header="Génerer votre thème"
                            headerClassName='!font-poppins !text-indigo-500'
                            onHide={() => {if (!themeDialog) return; setThemeDialog(false)}}
                            className='!w-[55rem] !h-[75vh] !font-poppins'
                        >
                            <section className='grid grid-cols-3 gap-8'>
                                <div className='col-span-2'>
                                    <InputTextarea 
                                        placeholder="Entrez votre prompt ici, de préférence au moins 500 mots pour de meilleurs résultats. Assurez également d'inclure les mots clés relatifs à votre projet/stage"
                                        className='!w-full !text-sm !font-poppins'
                                        rows={12}
                                        value={promptText}
                                        onChange={(e) => setPromptText(e.target.value)}
                                    />
                                </div>

                                <div className='flex flex-col'>
                                    <div className='flex justify-between items-center mb-4'>
                                        <h4 className="font-semibold text-lg text-gray-500">
                                            <i className="pi pi-paperclip mr-2"/> Pièces jointes
                                        </h4>
                                        <i 
                                            className='pi pi-plus cursor-pointer text-indigo-400'
                                            title="Ajouter"
                                            onClick={triggerFileInput}
                                        />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept=".pdf,.doc,.docx"
                                            multiple
                                            style={{ display: 'none' }}
                                            onChange={handleFileUpload}
                                        />
                                    </div>

                                    <ScrollPanel style={{height: 'calc(100% - 2rem)'}}>
                                        {uploadedFiles.length > 0 ? (
                                            <div className='space-y-2'>
                                                {uploadedFiles.map((file, index) => (
                                                    <div key={index} className='flex justify-between items-center bg-gray-100 p-2 rounded-md'>
                                                        <span className='text-sm text-gray-600'>{file.name}</span>
                                                        <i 
                                                            className='pi pi-times cursor-pointer text-indigo-400'
                                                            title="Supprimer"
                                                            onClick={() => handleRemoveFile(file)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mt-8 text-center font-poppins text-sm text-gray-400">
                                                Aucun fichier pour le moment
                                            </p>
                                        )}
                                    </ScrollPanel>
                                </div>
                            </section>

                            <section className='mt-10 flex justify-between items-center'>
                                <Button
                                    icon="pi pi-question-circle"
                                    label='Comment ça fonctionne'
                                    className='!border-none !bg-transparent !font-poppins !text-xs !text-indigo-500 !p-0'
                                />

                                <Button
                                    icon="pi pi-sparkles" 
                                    label='Générer'
                                    className='!h-10'
                                    onClick={handleGenerate}
                                    disabled={!promptText.trim()}
                                />
                            </section>
                        </Dialog>

                        <Dialog
                            visible={loadingDialog}
                            header="Génération en cours"
                            headerClassName='!font-poppins !text-indigo-500'
                            onHide={() => {}}
                            className='!w-[30rem] !h-[20rem] !font-poppins'
                            closable={false}
                        >
                            <div className='flex flex-col items-center justify-center h-full'>
                                <ProgressSpinner style={{width: '50px', height: '50px'}} />
                                <p className='mt-4 text-gray-500'>Génération des thèmes en cours...</p>
                            </div>
                        </Dialog>

                        <Dialog
                            visible={resultsDialog}
                            header="Thèmes proposés"
                            headerClassName='!font-poppins !text-indigo-500'
                            onHide={() => {if (!resultsDialog) return; setResultsDialog(false)}}
                            className='!w-[55rem] !h-[75vh] !font-poppins'
                        >
                            <ScrollPanel style={{height: 'calc(100% - 8rem)'}}>
                                <div className='space-y-4 p-4'>
                                    {generatedThemes.map(theme => (
                                        <Card
                                            key={theme.id}
                                            className={`!font-poppins cursor-pointer transition-shadow ${selectedTheme?.id === theme.id ? 'border-2 border-indigo-400 shadow-md' : 'border border-gray-200 hover:shadow-md'}`}
                                            onClick={() => handleSelectTheme(theme)}
                                        >
                                            <h5 className='font-semibold text-indigo-500'>{theme.title}</h5>
                                            <p className='text-sm text-gray-600 mt-2'>{theme.description}</p>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollPanel>

                            <section className='mt-6 flex justify-between items-center p-4'>
                                <Button
                                    icon="pi pi-undo"
                                    label='Régénérer'
                                    className='!h-10'
                                    onClick={handleGenerate}
                                    disabled={!promptText.trim()}
                                />
                                <Button
                                    icon="pi pi-check"
                                    label='Valider'
                                    className='!h-10'
                                    disabled={!selectedTheme}
                                    onClick={handleValidateTheme}
                                />
                            </section>
                        </Dialog>
                    </div>

                    <div className="">
                        <img src={student} width={300} alt="Student" />
                    </div>
                </section>

                <section className="col-span-1 grid grid-cols-2 gap-4 items-center">
                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-calendar text-xl" />
                        <div>
                            <h5 className="text-sm">Jours restants</h5>
                            <p className="text-4xl font-bold">{dashboardData.daysLeft}</p>
                        </div>
                    </div>

                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-file text-xl" />
                        <div>
                            <h5 className="text-sm">Documents soumis</h5>
                            <p className="text-4xl font-bold">{dashboardData.documents}</p>
                        </div>
                    </div>

                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-briefcase text-xl" />
                        <div>
                            <h5 className="text-sm">Tâches à réaliser</h5>
                            <p className="text-4xl font-bold">{dashboardData.toDo}</p>
                        </div>
                    </div>

                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-clock text-xl" />
                        <div>
                            <h5 className="text-sm">Heures cumulées</h5>
                            <p className="text-4xl font-bold">{dashboardData.cumulatedHour}</p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8">
                <section className="col-span-2 bg-gray-50 shadow rounded-md flex flex-col space-y-10 p-8">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">
                            Rapports de tâches réalisées - Documents soumis
                        </h3>

                        <Dropdown
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.value)}
                            options={periods}
                            optionLabel="name"
                            placeholder={periods[0].name}
                            className="h-12"
                        />
                    </div>

                    <Chart
                        type="bar"
                        data={chartData}
                        options={chartOptions}
                        className="h-80"
                    />
                </section>

                <section className="col-span-1 bg-gray-50 shadow rounded-md p-8">
                    <h4 className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-indigo-500">
                            Prochains supervisions
                        </span>
                        <i className="pi pi-ellipsis-v cursor-pointer" title="Options" />
                    </h4>

                    <div className="mt-6 space-y-6">
                        {upcomingSupervisions.length > 0 ? (
                            upcomingSupervisions.map((supervision) => {
                                const report = supervision.report;
                                const interview = report.interview;
                                return (
                                    <div
                                        key={report.id}
                                        className="bg-white cursor-pointer border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex space-x-3 items-center text-sm font-medium text-gray-700">
                                                <span>📅</span>
                                                <div className="flex flex-col">
                                                    <span>{interview.date}</span>
                                                    <span>{interview.time}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                                                Porte {interview.room}
                                            </span>
                                        </div>

                                        <ul className="mt-4 list-disc list-inside text-sm text-gray-600">
                                            {interview.subjects.map((subject, index) => (
                                                <li key={index} className="mb-2">{subject}</li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-sm">
                                Aucune supervision à venir.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default DashboardIntern;