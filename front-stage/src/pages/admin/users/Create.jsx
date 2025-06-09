import { useState } from "react"
import { motion } from "framer-motion"
import { BreadCrumb } from 'primereact/breadcrumb'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Dropdown } from 'primereact/dropdown'
import { useNavigate } from "react-router-dom"
import Tesseract from "tesseract.js"
import mammoth from "mammoth"
import { getDocument } from "pdfjs-dist"
import axios from "axios"

const CreateUser = () => {
    const navigate = useNavigate()
    const [selectedRole, setSelectedRole] = useState('')
    const [selectedLevel, setSelectedLevel] = useState(null)
    const [formData, setFormData] = useState({
        identifier: '',
        mail: '',
        name: '',
        firstname: '',
        contact: '',
        password: '',
        etablishment: '',
        sector: '',
        level: '',
        management: '',
        department: '',
        position: ''
    })
    const [files, setFiles] = useState([])

    const roles = [
        { name: 'Stagiaire', value: 'intern' },
        { name: 'Encadreur', value: 'supervisor' },
        { name: 'Administrateur', value: 'administrator' },
    ]

    const levels = [
        { name: 'Licence 1' },
        { name: 'Licence 2' },
        { name: 'Licence 3' },
        { name: 'Master 1' },
        { name: 'Master 2' },
    ]

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
            label: 'Utilisateurs',
            command: () => navigate('/admin/users')
        },
        { 
            label: 'Ajouter',
            command: () => navigate('/admin/users/create')
        }, 
    ]
    const home = { icon: 'pi pi-home' }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const fileHandlers = {
        async handleTxt(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = (e) => resolve(e.target.result)
                reader.onerror = (error) => reject(error)
                reader.readAsText(file)
            })
        },
        async handleDocx(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                    const arrayBuffer = e.target.result
                    mammoth.extractRawText({ arrayBuffer })
                        .then((result) => resolve(result.value))
                        .catch((error) => reject(error))
                }
                reader.onerror = (error) => reject(error)
                reader.readAsArrayBuffer(file)
            })
        },
        async handlePdf(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = async (e) => {
                    const arrayBuffer = e.target.result
                    const pdf = await getDocument({ data: arrayBuffer }).promise
                    let text = ""
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i)
                        const content = await page.getTextContent()
                        text += content.items.map((item) => item.str).join(" ")
                    }
                    resolve(text)
                }
                reader.onerror = (error) => reject(error)
                reader.readAsArrayBuffer(file)
            })
        },
        async handleImage(file) {
            return new Promise((resolve, reject) => {
                Tesseract.recognize(file, 'fra', { logger: (info) => console.log(info) })
                    .then((result) => resolve(result.data.text))
                    .catch((error) => reject(error))
            })
        },
    }

    const fillFieldsFromText = (text) => {
        const lines = text.split('\n').filter(line => line.trim())
        const data = {
            identifier: '',
            mail: '',
            name: '',
            firstname: '',
            contact: '',
            password: '',
            role: '',
            etablishment: '',
            sector: '',
            level: '',
            management: '',
            department: '',
            position: ''
        }

        lines.forEach(line => {
            const trimmedLine = line.trim().toLowerCase()
            if (!trimmedLine) return

            const regexMap = {
                identifier: /^(?:identifiant|identifier):\s*(.+)$/i,
                mail: /^(?:email|adresse e-mail):\s*(.+)$/i,
                name: /^(?:nom):\s*(.+)$/i,
                firstname: /^(?:prénom|prénoms):\s*(.+)$/i,
                contact: /^(?:contact|téléphone):\s*(.+)$/i,
                password: /^(?:mot de passe|password):\s*(.+)$/i,
                role: /^(?:rôle|role):\s*(stagiaire|encadreur|administrateur)/i,
                etablishment: /^(?:établissement):\s*(.+)$/i,
                sector: /^(?:secteur|parcours):\s*(.+)$/i,
                level: /^(?:niveau):\s*(licence 1|licence 2|licence 3|master 1|master 2)/i,
                management: /^(?:direction|management):\s*(.+)$/i,
                department: /^(?:département):\s*(.+)$/i,
                position: /^(?:poste|position):\s*(.+)$/i
            }

            Object.keys(regexMap).forEach(key => {
                const match = trimmedLine.match(regexMap[key])
                if (match) {
                    if (key === 'role') {
                        const roleValue = match[1].toLowerCase()
                        data[key] = roles.find(r => r.name.toLowerCase() === roleValue)?.value || ''
                    } else if (key === 'level' && data.role === 'intern') {
                        const levelValue = match[1].trim()
                        const levelObj = levels.find(l => l.name.toLowerCase() === levelValue.toLowerCase())
                        if (levelObj) {
                            data[key] = levelValue
                            setSelectedLevel(levelObj)
                        }
                    } else {
                        data[key] = match[1].trim()
                    }
                }
            })
        })

        setFormData(prev => ({ ...prev, ...data }))
        setSelectedRole(data.role)
    }

    const handleFileUpload = async (event) => {
        const selectedFiles = Array.from(event.target.files || event.dataTransfer.files)
        for (const file of selectedFiles) {
            const match = file.name.match(/\.([a-zA-Z0-9]+)$/)
            const extension = match ? match[1].toLowerCase() : null
            let textContent

            try {
                switch (extension) {
                    case 'txt': textContent = await fileHandlers.handleTxt(file); break
                    case 'docx': textContent = await fileHandlers.handleDocx(file); break
                    case 'pdf': textContent = await fileHandlers.handlePdf(file); break
                    case 'jpg':
                    case 'png': textContent = await fileHandlers.handleImage(file); break
                    default: continue
                }

                fillFieldsFromText(textContent)
                setFiles(prevFiles => [...prevFiles, file])
            } catch (error) {
                console.error(`Erreur lors de l'analyse de ${file.name}:`, error)
            }
        }
    }

    const handleDragOver = (event) => event.preventDefault()
    const handleDrop = (event) => {
        event.preventDefault()
        handleFileUpload(event)
    }

    const handleSubmit = async () => {
        const payload = {
            identifier: formData.identifier,
            mail: formData.mail,
            name: formData.name,
            firstname: formData.firstname,
            contact: formData.contact,
            password: formData.password,
            role: selectedRole,
            etablishment: selectedRole === 'intern' ? formData.etablishment : formData.management || '',
            sector: selectedRole === 'intern' ? formData.sector : formData.department || '',
            level: selectedLevel ? selectedLevel.name : '',
            management: selectedRole !== 'intern' ? formData.management : '',
            department: selectedRole !== 'intern' ? formData.department : '',
            position: selectedRole !== 'intern' ? formData.position : ''
        }

        try {
            console.log('Payload envoyé:', payload);
            const response = await axios.post('http://127.0.0.1:8000/api/users/create/', payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Réponse du serveur:', response.data);
            navigate('/admin/users');
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error.response ? error.response.data : error.message);
        }
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
            <div>
                <BreadCrumb 
                    model={items} 
                    home={home}
                    className="!font-semibold !text-sm !bg-transparent !border-0 !p-0"
                    pt={{ label: { className: '!text-indigo-500' } }}
                />
            </div>

            <form className="mt-10" onSubmit={(e) => e.preventDefault()}>
                <section>
                    <div className="flex justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-indigo-500">
                                Ajouter un utilisateur
                            </h1>
                            <p className="mt-3 w-[70%]">
                                Veuillez remplir le formulaire ci-dessous pour les informations de l'utilisateur en fonction de son rôle
                            </p>
                        </div>

                        <Button
                            icon="pi pi-upload"
                            label="Télécharger un fichier"
                            className="!text-sm !font-poppins !h-11"
                            onClick={() => document.getElementById('fileInput').click()}
                        />
                        <input
                            id="fileInput"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        />
                    </div>
                </section>

                <h3 className="mt-8 font-semibold text-gray-700">
                    Informations personnelles
                </h3>

                <section className="mt-6 bg-gray-50 shadow grid grid-cols-2 gap-8 items-center p-8 rounded-lg">
                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-user text-indigo-400 mr-3"/> Nom
                        </label>
                        <InputText 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            size="small"
                            className="!font-poppins"
                        />
                    </div>

                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-user text-indigo-400 mr-3"/> Prénoms
                        </label>
                        <InputText 
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            size="small"
                            className="!font-poppins"
                        />
                    </div>

                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-envelope text-indigo-400 mr-3"/> Adresse e-mail
                        </label>
                        <InputText 
                            name="mail"
                            value={formData.mail}
                            onChange={handleInputChange}
                            type="email"
                            size="small"
                            className="!font-poppins"
                        />
                    </div>

                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-phone text-indigo-400 mr-3"/> Contact
                        </label>
                        <InputText 
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            size="small"
                            className="!font-poppins"
                        />
                    </div>

                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-lock text-indigo-400 mr-3"/> Mot de passe <strong className="text-indigo-400">*</strong>
                        </label>
                        <Password
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="!font-poppins"
                            pt={{ input: "!h-11 !w-[25.5rem]" }}
                        />
                    </div>

                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-user-plus text-indigo-400 mr-3"/> Rôle
                        </label>
                        <Dropdown
                            value={selectedRole}
                            options={roles}
                            optionLabel="name"
                            onChange={(e) => setSelectedRole(e.value)}
                            placeholder="Sélectionner"
                            className="w-full !font-poppins"
                            panelClassName="!font-poppins"
                        />
                    </div>
                </section>

                <h3 className="mt-10 font-semibold text-gray-700">
                    Informations professionnelles
                </h3>

                <section className="mt-6 space-y-9 bg-gray-50 shadow p-8 rounded-lg">
                    <div>
                        <label className="text-gray-600 mr-20">
                            <i className="pi pi-graduation-cap text-indigo-400 mr-3"/> {selectedRole === 'intern' ? 'Établissement' : 'Direction'}
                        </label>
                        <InputText 
                            name={selectedRole === 'intern' ? 'etablishment' : 'management'}
                            value={selectedRole === 'intern' ? formData.etablishment : formData.management}
                            onChange={handleInputChange}
                            size="small"
                            className="!font-poppins w-96"
                        />
                    </div>

                    <div>
                        <label className="text-gray-600 mr-[7.5rem]">
                            <i className="pi pi-briefcase text-indigo-400 mr-3"/> {selectedRole === 'intern' ? 'Parcours' : 'Département'}
                        </label>
                        <InputText 
                            name={selectedRole === 'intern' ? 'sector' : 'department'}
                            value={selectedRole === 'intern' ? formData.sector : formData.department}
                            onChange={handleInputChange}
                            size="small"
                            className="!font-poppins w-96"
                        />
                    </div>

                    <div>
                        <label className="text-gray-600 mr-[8.5rem]">
                            <i className="pi pi-align-center text-indigo-400 mr-3"/> {selectedRole === 'intern' ? 'Niveau' : 'Poste'}
                        </label>
                        {selectedRole === 'intern' ? (
                            <Dropdown 
                                value={selectedLevel}
                                options={levels}
                                optionLabel="name"
                                onChange={(e) => setSelectedLevel(e.value)}
                                placeholder="Sélectionner"
                                className="!font-poppins w-96"
                            />
                        ) : (
                            <InputText 
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                size="small"
                                className="!font-poppins w-96"
                            />
                        )}
                    </div>
                </section>

                <Button 
                    label="Valider"
                    onClick={handleSubmit}
                    className="!h-11 !mt-12 !mb-8 !flex !justify-center !items-center !mx-auto !w-64 !rounded-full"
                />
            </form>
        </motion.div>
    )
}

export default CreateUser