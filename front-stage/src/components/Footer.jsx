import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="flex justify-between items-center text-xs">
            <Link to="/">
                Conditions d'utilisation
            </Link>

            <p>
                Copyright ©{new Date().getFullYear()} - Tous droits réservés
            </p>

            <Link to="/">
                FAQ ?
            </Link>
        </footer>
    )
}

export default Footer