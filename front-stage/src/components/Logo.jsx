import logo from "../assets/images/logo.png"

const Logo = () => {
    return(
        <div>
            <img 
                src={logo}
                alt="Logo InStage"
                className="w-36"
            />
        </div>
    )
}

export default Logo