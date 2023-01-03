import Navbar from "./Navbar"

const Layout = ({children, title}) => {
    
    return (<>
        <Navbar/>
        <div className='max-w-screen h-full min-h-[90vh] flex justify-center pt-12'>
            <div className='prose flex flex-col gap-1 items-center px-2'>
                <h1 className="text-center">{title}</h1>
                {children}
            </div>
        </div>
    </>)
}

export default Layout