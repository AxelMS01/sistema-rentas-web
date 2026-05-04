import { Link } from "react-router-dom";

function NavbarMobileLink({ route, icon, label, isActive, onClick }) {
    return (
        <div className={`flex w-full flex-row gap-2 items-center ${isActive}`}>
            {icon}

            <Link to={route} onClick={onClick} className={`text-decoration-none ${isActive} w-full small font-normal`}>
                {label}
            </Link>
        </div>
    );
};

export default NavbarMobileLink;