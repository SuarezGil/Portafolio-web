import { Link } from 'react-router-dom'

function NavBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-12 py-4 text-white z-50 w-full">
            <Link to="/" className="text-xl font-semibold tracking-wider hover:text-sky-400 transition">Portafolio 2026</Link>
            <ul className="flex gap-8 text-sm">
                <li><Link to="/about" className="hover:text-sky-400 transition duration-300 cursor-pointer font-medium">Sobre mí</Link></li>
                <li><Link to="/projects" className="hover:text-sky-400 transition duration-300 cursor-pointer font-medium">Proyectos</Link></li>
                <li><Link to="/contact" className="hover:text-sky-400 transition duration-300 cursor-pointer font-medium">Contacto</Link></li>
            </ul>
        </nav>
    )
}
export default NavBar