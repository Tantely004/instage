// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

import imgIntern from "../../assets/images/fake/intern2.png"

const ProfileIntern = () => {
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
            <div className="relative bg-indigo-400 text-white h-40 rounded-t-lg">
                <p className="font-bold text-2xl text-white flex justify-end items-center text-end pt-10 ml-auto mr-12 w-[28rem]">
                    Consultez ici votre profil et modifiez vos informations personnelles
                </p>
                <img 
                    src={imgIntern}
                    className="w-40 h-40 rounded-full absolute -bottom-16 left-1/8 border-6 border-white"
                />
            </div>

            <div className="mt-20 px-36 flex justify-between">
                <div>
                    <h2 className="font-semibold text-2xl">
                        Tantely Ny Aina
                    </h2>
                    <p className="text-gray-600 mt-2">
                        <span className="mr-3">
                            #
                        </span>
                        STA22356987
                    </p>
                    <p className="text-gray-600">
                        <i className="pi pi-graduation-cap mt-2 mr-3"/>
                        Université ESMIA - Mahamasina
                    </p>
                </div>

                <div>
                    <i 
                        className="pi pi-ellipsis-v cursor-pointer hover:text-indigo-400"
                        title="Options"
                    />
                </div>
            </div>

            <hr className="border-b border-gray-200 mt-6 mb-12"/>

            <form className="grid grid-cols-2 gap-8">
                <section>
                    <h3 className="text-indigo-500 font-semibold text-xl">
                        Informations personnelles
                    </h3>

                    <div className="bg-white shadow rounded p-6">
                        
                    </div>
                </section>

                <section>
                    <h3 className="text-indigo-500 font-semibold text-xl">
                        Mot de passe et sécurité
                    </h3>
                </section>
            </form>

        </motion.div>
    )
}

export default ProfileIntern