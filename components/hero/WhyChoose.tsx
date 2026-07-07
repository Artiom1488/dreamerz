

const WhyChoose = () => {
    return(
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-8 lg:gap-10 lg:px-16">
            <h1 className="font-sans text-3xl font-bold text-black sm:text-4xl lg:text-5xl">
                Why Choose Us
            </h1>
            <div className="w-full max-w-4xl overflow-hidden shadow-2xl sm:max-w-5xl">
                <div className="relative aspect-video w-full">
                    <iframe 
                        className="absolute inset-0 h-full w-full"
                        src="https://www.youtube.com/embed/b1FmT-p5BKI?si=AFo7x04jUlYe086X" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" 
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    )
}

export default WhyChoose;