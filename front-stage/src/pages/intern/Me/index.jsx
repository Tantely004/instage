/* eslint-disable no-unused-vars */
import { Divider } from "primereact/divider"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

import imgIntern from "../../../assets/images/img_profile_intern.jpg"
import imgSupervisor from "../../../assets/images/img_profile_supervisor.png"

const MyInternship = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        intern: {},
        instructor: {},
        collaborators: [],
        project: {}
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("access_token")
                const response = await axios.get("http://localhost:8000/api/internship/detail/", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setData(response.data)
                setLoading(false)
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const folderTemplate = () => {
        return <i className="pi pi-folder" />
    }

    const progressTemplate = (project) => {
        return <span>{project.progress}%</span>
    }

    const taskTemplate = (project) => {
        return <span>{project.totalTasks} tâches</span>
    }

    if (loading) {
        return <div></div>
    }

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="px-16 mb-16"
        >
            <section className="grid grid-cols-3 gap-8">
                <div className="col-span-1 bg-gray-50 rounded-lg shadow border border-gray-200 p-6">
                    <div>
                        <img
                            src={data.intern.avatar || imgIntern}
                            className="w-36 rounded-lg"
                            alt={`${data.intern.full_name}`}
                        />
                        <h3 className="font-bold mt-6 text-2xl">{data.intern.full_name}</h3>
                    </div>

                    <div className="mt-8">
                        <h4 className="mt-6 flex justify-between items-center">
                            <span className="font-semibold text-lg text-indigo-500">
                                <i className="pi pi-angle-down mr-2" /> Détails
                            </span>
                            <i
                                className="pi pi-pencil text-black/70 cursor-pointer hover:text-indigo-500"
                                title="Éditer"
                            />
                        </h4>

                        <div className="mt-4">
                            <div className="grid grid-cols-[35%_65%] gap-4">
                                <h4 className="text-black/60">Domaine</h4>
                                <p>{data.intern.domain}</p>
                            </div>
                            <div className="mt-3 grid grid-cols-[35%_65%] gap-4">
                                <h4 className="text-black/60">Période</h4>
                                <p>{data.intern.period}</p>
                            </div>
                            <div className="mt-3 grid grid-cols-[35%_65%] gap-4">
                                <h4 className="text-black/60">Durée</h4>
                                <p>{data.intern.duration}</p>
                            </div>
                            <div className="mt-3 grid grid-cols-[35%_65%] gap-4">
                                <h4 className="text-black/60">Type</h4>
                                <p>{data.intern.type}</p>
                            </div>
                        </div>

                        <Divider className="border border-gray-300" />
                    </div>

                    <div className="mt-8">
                        <h4 className="mt-6 flex justify-between items-center">
                            <span className="font-semibold text-lg text-indigo-500">
                                <i className="pi pi-angle-down mr-2" /> Notes
                            </span>
                            <i
                                className="pi pi-pencil text-black/70 cursor-pointer hover:text-indigo-500"
                                title="Éditer"
                            />
                        </h4>
                        {/* Section vide comme demandé */}
                        <p className="mt-3">Il faut vérifier la liste des tâches à faire.</p>

                        <Divider className="border border-gray-300" />
                    </div>
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-6">
                    <div className="col-span-1 h-80 shadow p-6 rounded-lg">
                        <h3 className="text-indigo-400 font-semibold text-xl">Vos collaborateurs</h3>
                        <div className="mt-3 space-y-3">
                            {/* Vide car aucun collaborateur dans la base */}
                        </div>
                    </div>

                    <div className="col-span-1 h-80 bg-indigo-400 text-white p-6 rounded-lg">
                        <h3 className="text-center">
                            Restez en contact avec votre <br />
                            <span className="font-bold text-2xl">encadreur professionnel</span>
                        </h3>

                        <div className="mt-6 flex space-x-4 items-center">
                            <img src={imgSupervisor} className="w-16 h-16 rounded-full" />
                            <div className="flex flex-col space-y-1">
                                <h5 className="font-bold">{data.instructor.full_name}</h5>
                                <p>
                                    <i className="pi pi-building-columns mr-2" />{" "}
                                    {data.instructor.management}
                                </p>
                                <p>
                                    <i className="pi pi-briefcase mr-2" /> {data.instructor.position}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center items-center gap-20">
                            <a
                                href="tel:+2613242546789"
                                className="flex flex-col items-center hover:scale-105 transform transition-all duration-200"
                            >
                                <i className="pi pi-phone p-4 rounded-full bg-gray-700" />
                                <p className="text-center text-sm font-medium mt-2">Appeler</p>
                            </a>
                            <a
                                href="mailto:example@email.com"
                                className="flex flex-col items-center hover:scale-105 transform transition-all duration-200"
                            >
                                <i className="pi pi-envelope p-4 rounded-full bg-gray-700" />
                                <p className="text-center text-sm font-medium mt-2">Envoyer un email</p>
                            </a>
                        </div>
                    </div>

                    <div className="col-span-2 -mt-20">
                        <h3 className="flex justify-between items-center">
                            <span className="text-indigo-400 font-semibold text-xl">
                                Votre projet actuel
                            </span>
                            <i
                                className="pi pi-ellipsis-v cursor-pointer hover:text-indigo-400"
                                title="Options"
                            />
                        </h3>
                        <p className="mt-4">
                            Retrouvez ici les tâches liées au projet qui vous a été assigné.
                        </p>

                        <div className="mt-4">
                            <DataTable
                                value={[data.project]}
                                onRowClick={() => navigate("project")}
                                className="!cursor-pointer"
                            >
                                <Column body={folderTemplate} />
                                <Column field="title" />
                                <Column body={progressTemplate} />
                                <Column field="created_at" />
                                <Column body={taskTemplate} />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default MyInternship