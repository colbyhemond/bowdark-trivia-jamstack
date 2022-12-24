import Navbar from "./Navbar"

const Layout = ({children}) => {
    
    return (<>
        <Navbar/>
        <div className='w-screen h-full min-h-[90vh] flex justify-center items-center'>
            <div className='prose flex flex-col gap-1 items-center justify-center'>
                {children}
            </div>
        </div>
    </>)
}

export default Layout