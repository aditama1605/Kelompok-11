import NavbarHome from '../NavbarHome';
import NavbarPasien from '../NavbarPasien';
import NavbarTerapis from '../NavbarTerapis';

const Navbar = ({ role }) => {
  if (role === 'pasien') return <NavbarPasien />;
  if (role === 'terapis') return <NavbarTerapis />;
  return <NavbarHome />;
};

export default Navbar;