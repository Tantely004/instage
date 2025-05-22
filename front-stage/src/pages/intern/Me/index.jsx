/* eslint-disable no-unused-vars */
import { motion } from "framer-motion"

import imgIntern from "../../../assets/images/img_profile_intern.jpg"
import { Divider } from "primereact/divider"

const MyInternship = () => {
    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
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
                        <img src={imgIntern} className="w-36 rounded-lg" />
                        <h3 className="font-bold mt-6 text-2xl">
                            Tantely Ny Aina
                        </h3>
                    </div>

                    <div className="mt-8">
                        <h4 className="mt-6 flex justify-between items-center">
                            <span className="font-semibold text-lg text-indigo-500">
                                <i className="pi pi-angle-down mr-2"/> Détails
                            </span>
                            <i
                                className="pi pi-pencil text-black/70 cursor-pointer hover:text-indigo-500"
                                title="Éditer"
                            />
                        </h4>

                        <div className="mt-4">
                            <div className="grid grid-cols-[35%_65%] gap-4">
                                <h4 className="text-black/60">
                                    Domaine
                                </h4>
                                <p>
                                    Informatique
                                </p>
                            </div>
                            <div className="mt-3 grid grid-cols-[35%_65%] gap-4">
                                <h4 className="text-black/60">
                                    Période
                                </h4>
                                <p>
                                    02/03/2025 - 02/06/2025
                                </p>
                            </div>
                            <div className="mt-3 grid grid-cols-[35%_65%] gap-4">
                                <h4 className="text-black/60">
                                    Durée
                                </h4>
                                <p>
                                    3 mois
                                </p>
                            </div>
                            <div className="mt-3 grid grid-cols-[35%_65%] gap-4">
                                <h4 className="text-black/60">
                                    Type
                                </h4>
                                <p>
                                    Stage d'embauche
                                </p>
                            </div>
                        </div>

                        <Divider className="border border-gray-300" />
                    </div>

                    <div className="mt-8">
                        <h4 className="mt-6 flex justify-between items-center">
                            <span className="font-semibold text-lg text-indigo-500">
                                <i className="pi pi-angle-down mr-2"/> Notes
                            </span>
                            <i
                                className="pi pi-pencil text-black/70 cursor-pointer hover:text-indigo-500"
                                title="Éditer"
                            />
                        </h4>

                        <p className="mt-3">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore similique numquam, corporis ex aut provident, laboriosam at neque dolores aliquid commodi asperiores eos, debitis excepturi recusandae itaque voluptatum odio suscipit!
                        </p>

                        <Divider className="border border-gray-300" />
                    </div>
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-6">
                    <div className="col-span-1">
                        .
                    </div>

                    <div className="col-span-1 bg-indigo-400 text-white p-6 rounded-lg">
                        <h3 className="text-center">
                            Restez en contact avec votre <br />
                            <span className="font-bold text-2xl">
                                encadreur professionnel
                            </span>
                        </h3>
                    </div>

                    <div className="col-span-2">
                        .
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default MyInternship