    import React, { useState, useEffect, useRef } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Phone, Menu, X, UserCircle, LogOut } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const NavbarEmp = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (profileRef.current && !profileRef.current.contains(e.target)) {
            setProfileOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const toggleProfileMenu = () => setProfileOpen(!profileOpen);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        isScrolled ? "bg-white bg-opacity-90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
        )}>
        <div className="container mx-auto px-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 animate-fade-in">
            <img src="/images/LogoIIT.png" width="60px" alt="Logo IIT" />
            <span className="font-bold text-lg text-brand-blue">
                Institut International de Technologie
            </span>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-6">
            {["Accueil", "Mes Demandes d'avances", "Mes Demandes Congés", "Messageries"].map((item) => (
                <Link
                key={item}
                to={item === 'Accueil' ? '/myEmpAccount' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="font-medium hover:text-brand-yellow transition-colors text-brand-blue"
                >
                {item}
                </Link>
            ))}
            </nav>

            {/* Profile Dropdown (Desktop) */}
            <div className="relative hidden md:block" ref={profileRef}>
            <button onClick={toggleProfileMenu} className="flex items-center gap-2 text-brand-blue">
                <UserCircle className="w-7 h-7" />
            </button>

            {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-4 z-50">
                <p className="font-semibold text-gray-800">{user?.prenom} {user?.nom}</p>
                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                <button
                    onClick={handleLogout}
                    className="mt-4 w-full flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
                </div>
            )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
            className="md:hidden text-brand-blue z-50"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            >
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> :
                <Menu className={cn("w-6 h-6", isScrolled ? "text-brand-blue" : "text-white")} />}
            </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-brand-blue bg-opacity-95 backdrop-blur-md z-40">
            <div className="flex flex-col h-full justify-center items-center">
                <nav className="flex flex-col items-center space-y-6">
                {["Accueil", "Demandes d'avances", "Demandes Congés", "Messageries"].map((item) => (
                    <Link
                    key={item}
                    to={item === 'Accueil' ? '/myEmpAccount' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white font-semibold text-xl hover:text-brand-yellow transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    >
                    {item}
                    </Link>
                ))}
                <hr className="border-t border-white w-3/4 my-4" />
                <div className="text-white text-center text-sm">
                    {user?.prenom} {user?.nom}<br />
                    <span className="text-xs text-gray-300">{user?.email}</span>
                </div>
                <button
                    onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                    }}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 flex items-center gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
                </nav>
            </div>
            </div>
        )}
        </header>
    );
    };

    export default NavbarEmp;
