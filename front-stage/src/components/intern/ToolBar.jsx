import Logo from '../Logo'
import imgProfile from '../../assets/images/img-main.png'

const Toolbar = () => {
    return (
        <header className="mt-4 h-20 flex justify-between px-16 items-center w-full">
            <div>
                <Logo />
            </div>
            
            <div className="flex space-x-4 items-center">
                <img 
                    src={imgProfile} 
                    alt="Profile user" 
                    className='w-12 h-12 rounded-full border-1 border-gray-200 cursor-pointer'
                    title='Votre profil'
                />
            </div>
        </header>
    )
}

export default Toolbar