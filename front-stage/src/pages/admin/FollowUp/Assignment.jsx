import { useState } from "react"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { BreadCrumb } from "primereact/breadcrumb"
import { TabView, TabPanel } from 'primereact/tabview'
import { Dropdown } from "primereact/dropdown"
import { MultiSelect } from "primereact/multiselect"
import { Button } from "primereact/button"

import imgIntern from "../../../assets/images/fake/intern2.png"
import imgSupervisor from "../../../assets/images/img_profile_supervisor.png"

const AdminAssignment = () => {
    const navigate = useNavigate()
    const [ selectedIntern, setSelectedIntern ] = useState(null)
    const [ selectedSupervisor, setSelectedSupervisor ] = useState(null)
    const [ selectedProject, setSelectedProject ] = useState(null)

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const interns = [
        {
            id: 1,
            lastname: "ANDRIANARIDERA",
            firstname: "Tantely Ny Aina",
            avatar: imgIntern,
        },
        {
            id: 1,
            lastname: "ANDRIANARIDERA",
            firstname: "Tantely Ny Aina",
            avatar: imgIntern,
        },
        {
            id: 1,
            lastname: "ANDRIANARIDERA",
            firstname: "Tantely Ny Aina",
            avatar: imgIntern,
        },
    ]

    const supervisors = [
        {
            id: 1,
            lastname: "ANDRIAMAROSON",
            firstname: "Mirindra Harilala",
            avatar: imgSupervisor,
            position: "Responsable informatique",
        },
        {
            id: 1,
            lastname: "ANDRIAMAROSON",
            firstname: "Mirindra Harilala",
            avatar: imgSupervisor,
            position: "Responsable informatique",
        },
        {
            id: 1,
            lastname: "ANDRIAMAROSON",
            firstname: "Mirindra Harilala",
            avatar: imgSupervisor,
            position: "Responsable informatique",
        },
    ]

    const projects = [
        {
            id: 1,
            title: "Instage",
        },
        {
            id: 1,
            title: "Instage",
        },
        {
            id: 1,
            title: "Instage",
        },
    ]

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

    const internTemplate = (option) => {
        return (
            <div className="flex items-center space-x-2">
                <img src={option.avatar} className='w-8 h-8 rounded-full'/>
                <div>
                    <p>
                        {option.lastname} {option.firstname}
                    </p>
                </div>
            </div>
        )
    }

    const supervisorTemplate = (option) => {
        return (
            <div className="flex items-center space-x-2">
                <img src={option.avatar} className='w-8 h-8 rounded-full'/>
                <div>
                    <p>
                        {option.lastname} {option.firstname}
                    </p>
                    <p className="text-xs">
                        { option.position }
                    </p>
                </div>
            </div>
        )
    }

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
                        <form className="mt-3">
                            <div className="grid grid-cols-2 items-center gap-8">
                                <div className="flex flex-col space-y-3">
                                    <label>
                                        <i className="pi pi-asterisk !text-xs text-indigo-400 mr-3"/>
                                        Sélectionner un stagiaire à etre encadré
                                    </label>
                                    <MultiSelect
                                        value={selectedIntern} 
                                        options={interns} 
                                        onChange={(e) => setSelectedIntern(e.target.value)} 
                                        placeholder="Sélectionner" 
                                        itemTemplate={internTemplate}
                                        className='!font-poppins'
                                        panelClassName='!font-poppins'
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
                                        onChange={(e) => setSelectedSupervisor(e.target.value)} 
                                        placeholder="Sélectionner" 
                                        itemTemplate={supervisorTemplate}
                                        className='!font-poppins'
                                        panelClassName='!font-poppins'
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
                                    onChange={(e) => setSelectedProject(e.target.value)} 
                                    placeholder="Sélectionner le projet" 
                                    className='!font-poppins'
                                    panelClassName='!font-poppins'
                                />
                            </div>

                            <Button 
                                label="Valider"
                                className="!mt-12 !font-poppins !h-10 !flex !justify-end !items-center !w-32 !ml-auto"
                            />
                        </form>
                    </TabPanel>

                    <TabPanel header="Projet">
                        <form className="mt-3">
                            <div className="grid grid-cols-2 items-center gap-8">
                                <div className="flex flex-col space-y-3">
                                    <label>
                                        <i className="pi pi-asterisk !text-xs text-indigo-400 mr-3"/>
                                        Sélectionner un encadreur pour la réalisation de projet
                                    </label>
                                    <Dropdown
                                        value={selectedSupervisor}      
                                        options={supervisors} 
                                        onChange={(e) => setSelectedSupervisor(e.target.value)} 
                                        placeholder="Sélectionner" 
                                        itemTemplate={supervisorTemplate}
                                        className='!font-poppins'
                                        panelClassName='!font-poppins'
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
                                        onChange={(e) => setSelectedProject(e.target.value)} 
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