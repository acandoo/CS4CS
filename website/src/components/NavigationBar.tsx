import { createSignal, onMount, onCleanup } from 'solid-js'

export default () => {
    const [isVisible, setIsVisible] = createSignal(true)
    const [lastScrollY, setLastScrollY] = createSignal(0)
    const [isAtTop, setIsAtTop] = createSignal(true)

    const handleScroll = () => {
        const currentScrollY = window.scrollY

        // Hide/show navbar based on scroll direction
        if (currentScrollY > lastScrollY() && currentScrollY > 100) {
            setIsVisible(false)
        } else {
            setIsVisible(true)
        }

        // Check if we're at the top
        setIsAtTop(currentScrollY < 50)
        setLastScrollY(currentScrollY)
    }

    onMount(() =>
        window.addEventListener('scroll', handleScroll, { passive: true })
    )

    onCleanup(() => window.removeEventListener('scroll', handleScroll))

    return (
        <nav
            class={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
                isVisible()
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-full opacity-0'
            } ${
                isAtTop()
                    ? 'bg-white/70 backdrop-blur-md shadow-lg'
                    : 'bg-white/90 backdrop-blur-lg shadow-xl'
            }`}
            style={{
                width: 'min(90vw, 600px)',
                'border-radius': '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
        >
            <div class="px-6 py-3">
                <div class="flex items-center justify-between">
                    {/* Logo */}
                    <div class="flex items-center space-x-2">
                        <span class="font-semibold text-gray-800">acandoo</span>
                    </div>

                    {/* Navigation Links */}
                    <div class="hidden md:flex items-center space-x-8">
                        <a
                            href="/"
                            class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                        >
                            Home
                        </a>
                        <a
                            href="/about/"
                            class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                        >
                            About
                        </a>
                        <a
                            href="/blog/"
                            class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                        >
                            Blog
                        </a>
                        <a
                            href="#contact"
                            class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    )
}
