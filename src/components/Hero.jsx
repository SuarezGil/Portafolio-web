import { motion } from 'framer-motion'
import { useState } from 'react'
import cv from '../assets/CURRICULUM IOSEF SUAREZ GIL 2026.pdf'

function Hero() {
    const [open, setOpen] = useState(false)

    

    return (
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">

            {/* Fondos decorativos */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/20 blur-3xl rounded-full" />

            {/* HERO */}
            <div className="text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-sky-400 text-5xl md:text-6xl font-bold"
                >
                    Hola, soy <span className="text-sky-400">Iosef</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-xl md:text-2xl text-gray-300 mt-2"
                >
                    Graduado de 6to Perito en Informática
                </motion.p>

                <div className="flex gap-4 mt-6 justify-center flex-wrap">

                    {/* CV */}
                    <motion.a
                        href={cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="border border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-black transition px-6 py-2 rounded-lg"
                    >
                        Ver Curriculum
                    </motion.a>

                    {/* CONTACTO */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        className="border border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-black transition px-6 py-2 rounded-lg"
                        onClick={() => setOpen(true)}
                    >
                        Contacto
                    </motion.button>
                </div>
            </div>
            

            {/* MODAL CONTACTO */}
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                >
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

                    <div className="bg-[#0f172a] border border-sky-500/30 p-6 rounded-xl w-[90%] max-w-md text-white relative">

                        {/* Botón cerrar */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl text-sky-400 font-bold mb-4">
                            Contacto
                        </h2>

                        <div className="space-y-3 text-gray-300">

                            <p>
                                <span className="text-sky-400 font-semibold">Nombre:</span><br />
                                Iosef Suárez Gil
                            </p>

                            <p>
                                <span className="text-sky-400 font-semibold">Teléfono:</span><br />
                                +502 5317-0347
                            </p>

                            <p>
                                <span className="text-sky-400 font-semibold">Correo:</span><br />
                                iossg8@gmail.com
                            </p>

                            <p>
                                <span className="text-sky-400 font-semibold">Ubicación:</span><br />
                                Guatemala
                            </p>

                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="mt-6 w-full border border-sky-400 text-sky-400 py-2 rounded hover:bg-sky-400 hover:text-black transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
                </motion.div>
            )}

        </section>
    )
}

export default Hero