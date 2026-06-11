import Foto from '../assets/yo.jpg'
import { motion } from 'framer-motion'
export const About = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-20 gap-10 relative">

            <div className="max-w-5xl w-full bg-white/5 backdrop-blur-md rounded-2xl p-10 shadow-2xl border border-white/10">
                <motion.h2
                    initial={{ opacity: -1, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-sky-400 text-5xl md:text-6xl font-bold text-4xl text-center text-blue-400 font-bold mb-10"

                >
                        Sobre mí
                
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-10 items-center">

                    {/* TEXTO */}
                    <div className="text-gray-300 text-lg leading-relaxed">
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="mt-4 text-gray-300"
                        >
                                Mi nombre es Iosef Suárez Gil y soy un desarrollador web,
                                me especializo en el desarrollo frontend y backend usando
                                React, Node.js, Express y MongoDB.
                                Me gusta trabajar en proyectos que me permitan aprender y crecer como desarrollador,
                                y siempre estoy buscando nuevos desafíos para mejorar mis habilidades.
                                Llevo varios años realizando proyectos escolares y personales
                            
                            <br />

                                Me apasiona crear experiencias digitales atractivas, modernas y funcionales para
                                los usuarios, y siempre estoy buscando nuevas formas de mejorar mis habilidades
                                y aprender nuevas tecnologias para seguir creciendo como desarrollador
                           
                        </motion.p>
                    </div>

                    {/* IMAGEN */}
                    <div className="flex justify-center">
                            <motion.img
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1 }}
                            src={Foto}
                            className="w-56 h-56 rounded-full object-cover border-4 border-blue-400 shadow-xl 
                            hover:scale-105 transition duration-300"/>
                    </div>

                </div>
            </div>


            <div className="max-w-5xl w-full bg-white/5 backdrop-blur-md rounded-2xl py-10 p-10 shadow-2xl border border-white/10">
                <h2 className="text-4xl text-center text-blue-400 font-bold mb-10">
                    Tecnologías
                </h2>
                {/* tu contenido de tecnologías aquí */}
                <p className="text-gray-300">
                    React, Node.js, Express, MongoDB, JavaScript, HTML, CSS, Tailwind CSS, Git, GitHub
                </p>
            </div>
            {/* Blob decorativo — siempre al final y con pointer-events-none */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />


        </div>
    )
}
