import { useState, useEffect } from "react"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { BreadCrumb } from "primereact/breadcrumb"
import { TabView, TabPanel } from 'primereact/tabview'
import { Dropdown } from "primereact/dropdown"
import { MultiSelect } from "primereact/multiselect"
import { Button } from "primereact/button"
import axios from 'axios'

import imgIntern from "../../../assets/images/fake/intern2.png"
import imgSupervisor from "../../../assets/images/img_profile_supervisor.png"

const AdminAssignment = () => {
    const navigate = useNavigate()
    const [selectedIntern, setSelectedIntern] = useState([]) // Tableau pour MultiSelect
    const [selectedSupervisor, setSelectedSupervisor] = useState(null)
    const [selectedProject, setSelectedProject] = useState(null)
    const [interns, setInterns] = useState([])
    const [supervisors, setSupervisors] = useState([])
    const [projects, setProjects] = useState([])

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const items = [
        { 
            label: 'Suivi',
            command: () => navigate('/admin/follow-up')
        },
        { 
            label: 'Assigner',
            command: () => navigate('/admin/follow-up/assign')
        }, 
    ]
    const home = { 
        icon: 'pi pi-arrow-left', 
        command: () => navigate('/admin/follow-up')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    console.error('Aucun token trouvé dans localStorage');
                    return;
                }
                const response = await axios.get('http://127.0.0.1:8000/api/assignment-project/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInterns(response.data.interns || []);
                setSupervisors(response.data.supervisors || []);
                setProjects(response.data.projects || []);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error.response ? error.response.data : error.message);
            }
        };
        fetchData();
    }, []);

    const internTemplate = (option) => {
        return (
            <div className="flex items-center space-x-2">
                <img src={option.avatar || imgIntern} className='w-8 h-8 rounded-full'/>
                <div>
                    <p>{option.lastname} {option.firstname}</p>
                </div>
            </div>
        )
    }

    const supervisorTemplate = (option) => {
        return (
            <div className="flex items-center space-x-2">
                <img src={option.avatar || imgSupervisor} className='w-8 h-8 rounded-full'/>
                <div>
                    <p>{option.lastname} {option.firstname}</p>
                    <p className="text-xs">{option.position}</p>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                console.error('Aucun token trouvé');
                return;
            }
            // Prendre le premier stagiaire sélectionné
            const intern = selectedIntern.length > 0 ? selectedIntern[0] : null;
            if (!intern || !selectedSupervisor || !selectedProject) {
                alert('Veuillez sélectionner un stagiaire, un encadreur et un projet.');
                return;
            }
            await axios.post('http://127.0.0.1:8000/api/assignment-project/', {
                intern_id: intern.id,  // user_id de l'intern
                instructor_id: selectedSupervisor.id,  // user_id de l'instructor
                project_id: selectedProject.id,  // id du project
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Assignation créée avec succès');
            setSelectedIntern([]);
            setSelectedSupervisor(null);
            setSelectedProject(null);
        } catch (error) {
            console.error('Erreur lors de la soumission:', error.response ? error.response.data : error.message);
            alert('Erreur lors de la création de l\'assignation: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition} 
            className={`mb-12 max-w-[82vw]`}
        >
            <div>
                <BreadCrumb 
                    model={items} 
                    home={home}
                    className="!font-semibold !text-sm !bg-transparent !border-0 !p-0"
                    pt={{
                        label: { className: '!text-indigo-500' },
                    }}
                />
            </div>

            <h1 className="mt-6 text-indigo-400 font-bold text-xl">
                Assigner
            </h1>

            <section className="mt-6">
                <TabView className="!font-poppins">
                    <TabPanel 
                        header="Stagiaire"
                        className="!font-poppins"
                    >
                        <form onSubmit={handleSubmit} className="mt-3">
                            <div className="grid grid-cols-2 items-center gap-8">
                                <div className="flex flex-col space-y-3">
                                    <label>
                                        <i className="pi pi-asterisk !text-xs text-indigo-400 mr-3"/>
                                        Sélectionner un stagiaire à etre encadré
                                    </label>
                                    <MultiSelect
                                        value={selectedIntern} 
                                        options={interns} 
                                        onChange={(e) => setSelectedIntern(e.value || [])} 
                                        placeholder="Sélectionner" 
                                        itemTemplate={internTemplate}
                                        className='!font-poppins'
                                        panelClassName='!font-poppins'
                                        optionLabel="lastname"
                                        maxSelectedLabels={1}
                                    />
                                </div>
                                
                                <div className="flex flex-col space-y-3">
                                    <label>
                                        <i className="pi pi-asterisk !text-xs text-indigo-400 mr-3"/>
                                        Sélectionner l'encadreur pour le suivi du/des stagiaire(s)
                                    </label>
                                    <Dropdown
                                        value={selectedSupervisor} 
                                        options={supervisors} 
                                        onChange={(e) => setSelectedSupervisor(e.value)} 
                                        placeholder="Sélectionner" 
                                        itemTemplate={supervisorTemplate}
                                        className='!font-poppins'
                                        panelClassName='!font-poppins'
                                        optionLabel="lastname"
                                    />
                                </div>
                            </div>

                            <div className="mt-12 grid grid-cols-2 items-center gap-8">
                                <p className="text-sm ">
                                    <i className="pi pi-info-circle mr-2"/>
                                    Compte tenu du statut du stagiaire, l’encadreur professionnel désigné devra assurer un accompagnement régulier tout au long de la période de stage. Il sera amené à guider le stagiaire dans la réalisation du projet :
                                </p>

                                <Dropdown
                                    value={selectedProject} 
                                    options={projects}
                                    optionLabel="title" 
                                    onChange={(e) => setSelectedProject(e.value)} 
                                    placeholder="Sélectionner le projet" 
                                    className='!font-poppins'
                                    panelClassName='!font-poppins'
                                />
                            </div>

                            <Button 
                                type="submit"
                                label="Valider"
                                className="!mt-12 !font-poppins !h-10 !flex !justify-end !items-center !w-32 !ml-auto"
                            />
                        </form>
                    </TabPanel>

                    <TabPanel header="Projet">
                        <form onSubmit={handleSubmit} className="mt-3">
                            <div className="grid grid-cols-2 items-center gap-8">
                                <div className="flex flex-col space-y-3">
                                    <label>
                                        <i className="pi pi-asterisk !text-xs text-indigo-400 mr-3"/>
                                        Sélectionner un encadreur pour la réalisation de projet
                                    </label>
                                    <Dropdown
                                        value={selectedSupervisor}      
                                        options={supervisors} 
                                        onChange={(e) => setSelectedSupervisor(e.value)} 
                                        placeholder="Sélectionner" 
                                        itemTemplate={supervisorTemplate}
                                        className='!font-poppins'
                                        panelClassName='!font-poppins'
                                        optionLabel="lastname"
                                    />
                                </div>

                                <div className="flex flex-col space-y-3">
                                    <label>
                                        <i className="pi pi-asterisk !text-xs text-indigo-400 mr-3"/>
                                        Sélectionner le projet à assigner
                                    </label>
                                    <Dropdown
                                        value={selectedProject} 
                                        options={projects}
                                        optionLabel="title" 
                                        onChange={(e) => setSelectedProject(e.value)} 
                                        placeholder="Sélectionner le projet" 
                                        className='!font-poppins'
                                        panelClassName='!font-poppins'
                                    />
                                </div>

                                <p className="text-sm col-span-2">
                                    <i className="pi pi-info-circle mr-2"/>
                                    Dans le cadre de ses responsabilités, l’encadreur professionnel sera assigné à ce projet avec pour mission d’accompagner activement le stagiaire dans sa mise en œuvre. Il devra veiller à la bonne compréhension des objectifs du projet, encadrer les livrables attendus, et superviser les différentes étapes jusqu’à la finalisation
                                </p>
                            </div>

                            <Button 
                                type="submit"
                                label="Valider"
                                className="!mt-12 !font-poppins !h-10 !flex !justify-end !items-center !w-32 !ml-auto"
                            />
                        </form>
                    </TabPanel>
                </TabView>
            </section>
        </motion.div>
    )
}

export default AdminAssignment