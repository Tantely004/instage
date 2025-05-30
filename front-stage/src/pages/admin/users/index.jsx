import { useRef } from "react"
import { useNavigate } from "react-router-dom"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { Button } from "primereact/button"
import { TabView, TabPanel } from 'primereact/tabview'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { TieredMenu } from "primereact/tieredmenu"

import imgIntern from "../../../assets/images/fake/intern1.png"
import imgSupervisor from "../../../assets/images/fake/intern2.png"
import imgAdmin from "../../../assets/images/img_profile_supervisor.png"

const Users = () => {
    const userMenus = useRef(null)
    const navigate = useNavigate()

    const userItems = [
        {
            label: 'Voir le profil',
            icon: 'pi pi-eye',
        },
        {
            label: 'Retirer le compte',
            icon: 'pi pi-ban',
        },
    ]

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const interns = [
        {
            id: "STA2052060",
            lastname: "Doe",
            firstname: "John",
            avatar: imgIntern,
            email: "johndoe@gmail.com",
            etablishment: "ITU",
            domain: "Informatique",
            level: "Licence 3",
        },
        {
            id: "STA2052060",
            lastname: "Doe",
            firstname: "John",
            avatar: imgIntern,
            email: "johndoe@gmail.com",
            etablishment: "ITU",
            domain: "Informatique",
            level: "Licence 3",
        },
        {
            id: "STA2052060",
            lastname: "Doe",
            firstname: "John",
            avatar: imgIntern,
            email: "johndoe@gmail.com",
            etablishment: "ITU",
            domain: "Informatique",
            level: "Licence 3",
        },
        {
            id: "STA2052060",
            lastname: "Doe",
            firstname: "John",
            avatar: imgIntern,
            email: "johndoe@gmail.com",
            etablishment: "ITU",
            domain: "Informatique",
            level: "Licence 3",
        },
        {
            id: "STA2052060",
            lastname: "Doe",
            firstname: "John",
            avatar: imgIntern,
            email: "johndoe@gmail.com",
            etablishment: "ITU",
            domain: "Informatique",
            level: "Licence 3",
        },
    ]

    const admins = [
        {
            id: "ADM202547",
            lastname: "Hugh",
            firstname: "Geoffroy",
            avatar: imgAdmin,
            email: "hughgeoffroy@gmail.com",
            management: "Finances",
            department: "IT & support",
            position: "Responsable informatique",
        },
        {
            id: "ADM202547",
            lastname: "Hugh",
            firstname: "Geoffroy",
            avatar: imgAdmin,
            email: "hughgeoffroy@gmail.com",
            management: "Finances",
            department: "IT & support",
            position: "Responsable informatique",
        },
        {
            id: "ADM202547",
            lastname: "Hugh",
            firstname: "Geoffroy",
            avatar: imgAdmin,
            email: "hughgeoffroy@gmail.com",
            management: "Finances",
            department: "IT & support",
            position: "Responsable informatique",
        },
        {
            id: "ADM202547",
            lastname: "Hugh",
            firstname: "Geoffroy",
            avatar: imgAdmin,
            email: "hughgeoffroy@gmail.com",
            management: "Finances",
            department: "IT & support",
            position: "Responsable informatique",
        },
    ]

    const supervisors = [
        {
            id: "ENC455522",
            lastname: "Emilie",
            firstname: "Jane",
            avatar: imgSupervisor,
            email: "emiliejane@gmail.com",
            management: "Finances",
            department: "IT & support",
            position: "Responsable informatique",
        },
        {
            id: "ENC455522",
            lastname: "Emilie",
            firstname: "Jane",
            avatar: imgSupervisor,
            email: "emiliejane@gmail.com",
            management: "Finances",
            department: "IT & support",
            position: "Responsable informatique",
        },
        {
            id: "ENC455522",
            lastname: "Emilie",
            firstname: "Jane",
            avatar: imgSupervisor,
            email: "emiliejane@gmail.com",
            management: "Finances",
            department: "IT & support",
            position: "Responsable informatique",
        },
        {
            id: "ENC455522",
            lastname: "Emilie",
            firstname: "Jane",
            avatar: imgSupervisor,
            email: "emiliejane@gmail.com",
            management: "Finances",
            department: "IT & support",
            position: "Responsable informatique",
        },
        {
            id: "ENC455522",
            lastname: "Emilie",
            firstname: "Jane",
            avatar: imgSupervisor,
            email: "emiliejane@gmail.com",
            management: "Finances",
            department: "IT & support",
            position: "Responsable informatique",
        },
    ]

    const idTemplate = (intern) => {
        return (
            <span>
                #{intern.id}
            </span>
        )
    }

    const nameTemplate = (intern) => {
        return (
            <div className="flex items-center space-x-2">
                <img 
                    src={intern.avatar}
                    className="w-10 h-10 rounded-full"
                />
                <p>
                    {intern.lastname} {intern.firstname}
                </p>
            </div>
        )
    }

    const actionTemplate = () => {
        return (
            <div className="flex justify-center items-center">
                <i 
                    className="pi pi-ellipsis-h cursor-pointer hover:text-indigo-400"
                    onClick={(e) => userMenus.current.toggle(e)}
                />

                <TieredMenu 
                    model={userItems}
                    ref={userMenus}
                    popup
                    className="!font-poppins"
                />
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
            className={`mb-12 w-[75.5vw]`}
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-indigo-400">
                        Utilisateurs
                    </h1>
                    <p className="mt-2">
                        Retrouvez ici la liste des utilisateurs actuels
                    </p>
                </div>
                <Button
                    icon="pi pi-plus" 
                    label="Ajouter"
                    className="!text-sm !py-2 !font-poppins"
                    onClick={() => navigate('/admin/users/create')}
                />
            </div>

            <section className="mt-6">
                <TabView>
                    <TabPanel 
                        header="Stagiaire"
                        headerClassName="!font-poppins"
                        contentClassName="!font-poppins"
                    >
                        <DataTable 
                            value={interns} 
                            className="!font-poppins"
                            paginator 
                            rows={5} 
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        >
                            <Column
                                header="ID" 
                                body={idTemplate}
                            />
                            <Column
                                header="Nom" 
                                body={nameTemplate}
                            />
                            <Column
                                field="email"
                                header="Email" 
                            />
                            <Column
                                field="etablishment"
                                header="Établissement" 
                            />
                            <Column
                                field="domain"
                                header="Parcours" 
                            />
                            <Column
                                field="level"
                                header="Niveau" 
                            />
                            <Column
                                header="Action"
                                body={(rowData) => actionTemplate(rowData)}
                            />
                        </DataTable>
                    </TabPanel>

                    <TabPanel 
                        header="Encadreur"
                        headerClassName="!font-poppins"
                        contentClassName="!font-poppins"
                    >
                        <DataTable 
                            value={supervisors} 
                            className="!font-poppins"
                            paginator 
                            rows={5} 
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        >
                            <Column
                                header="ID" 
                                body={idTemplate}
                            />
                            <Column
                                header="Nom" 
                                body={nameTemplate}
                            />
                            <Column
                                field="email"
                                header="Email" 
                            />
                            <Column
                                field="management"
                                header="Direction" 
                            />
                            <Column
                                field="department"
                                header="Département" 
                            />
                            <Column
                                field="position"
                                header="Poste" 
                            />
                            <Column
                                header="Action"
                                body={(rowData) => actionTemplate(rowData)}
                            />
                        </DataTable>
                    </TabPanel>

                    <TabPanel 
                        header="Administrateur"
                        headerClassName="!font-poppins"
                        contentClassName="!font-poppins"
                    >
                        <DataTable 
                            value={admins} 
                            className="!font-poppins"
                            paginator 
                            rows={5} 
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        >
                            <Column
                                header="ID" 
                                body={idTemplate}
                            />
                            <Column
                                header="Nom" 
                                body={nameTemplate}
                            />
                            <Column
                                field="email"
                                header="Email" 
                            />
                            <Column
                                field="management"
                                header="Direction" 
                            />
                            <Column
                                field="department"
                                header="Département" 
                            />
                            <Column
                                field="position"
                                header="Poste" 
                            />
                            <Column
                                header="Action"
                                body={(rowData) => actionTemplate(rowData)}
                            />
                        </DataTable>
                    </TabPanel>
                </TabView>
            </section>
        </motion.div>
    )
}

export default Users