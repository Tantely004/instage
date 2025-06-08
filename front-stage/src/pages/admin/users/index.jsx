import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TieredMenu } from "primereact/tieredmenu";
import axios from "axios";

import imgIntern from "../../../assets/images/fake/intern1.png";

const Users = () => {
    const userMenus = useRef(null);
    const navigate = useNavigate();
    const [usersData, setUsersData] = useState({
        interns: [],
        supervisors: [],
        admins: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) throw new Error("Aucun token trouvé");

                const response = await axios.get("http://localhost:8000/api/users/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setUsersData(response.data);
                } else {
                    console.error("Erreur lors de la récupération des utilisateurs");
                }
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const userItems = [
        {
            label: "Voir le profil",
            icon: "pi pi-eye",
            command: () => navigate("/admin/user/profile"), // À ajuster selon la logique de profil
        },
        {
            label: "Retirer le compte",
            icon: "pi pi-ban",
        },
    ];

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    };

    const pageTransition = {
        duration: 0.5,
    };

    const idTemplate = (user) => {
        return <span>#{user.id}</span>;
    };

    const nameTemplate = (user) => {
        return (
            <div className="flex items-center space-x-2">
                <img
                    src={user.avatar || imgIntern} // Utilise une image par défaut si avatar est absent
                    className="w-10 h-10 rounded-full"
                    alt={`${user.lastname} ${user.firstname}`}
                />
                <p>
                    {user.lastname} {user.firstname}
                </p>
            </div>
        );
    };

    // eslint-disable-next-line no-unused-vars
    const actionTemplate = (rowData) => {
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
        );
    };

    if (loading) {
        return <div></div>;
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
                    <h1 className="text-2xl font-semibold text-indigo-400">Utilisateurs</h1>
                    <p className="mt-2">Retrouvez ici la liste des utilisateurs actuels</p>
                </div>
                <Button
                    icon="pi pi-plus"
                    label="Ajouter"
                    className="!text-sm !py-2 !font-poppins"
                    onClick={() => navigate("/admin/users/create")}
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
                            value={usersData.interns}
                            className="!font-poppins"
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        >
                            <Column header="ID" body={idTemplate} />
                            <Column header="Nom" body={nameTemplate} />
                            <Column field="email" header="Email" />
                            <Column field="etablishment" header="Établissement" />
                            <Column field="domain" header="Parcours" />
                            <Column field="level" header="Niveau" />
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
                            value={usersData.supervisors}
                            className="!font-poppins"
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        >
                            <Column header="ID" body={idTemplate} />
                            <Column header="Nom" body={nameTemplate} />
                            <Column field="email" header="Email" />
                            <Column field="management" header="Direction" />
                            <Column field="department" header="Département" />
                            <Column field="position" header="Poste" />
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
                            value={usersData.admins}
                            className="!font-poppins"
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        >
                            <Column header="ID" body={idTemplate} />
                            <Column header="Nom" body={nameTemplate} />
                            <Column field="email" header="Email" />
                            <Column field="management" header="Direction" />
                            <Column field="department" header="Département" />
                            <Column field="position" header="Poste" />
                            <Column
                                header="Action"
                                body={(rowData) => actionTemplate(rowData)}
                            />
                        </DataTable>
                    </TabPanel>
                </TabView>
            </section>
        </motion.div>
    );
};

export default Users;