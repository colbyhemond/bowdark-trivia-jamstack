import { useRouter } from 'next/router'

const Navbar = ({children}) => {

    const router = useRouter()

    const handleLogoClick = () => {
        router.push('/')
    }
    
    return (<>
        <div className="navbar bg-base-300 max-w-screen">
            <a className="btn btn-ghost normal-case text-xl font-typoslab" onClick={handleLogoClick}>Bowdark Trivia</a>
        </div>
    </>)
}

export default Navbar


