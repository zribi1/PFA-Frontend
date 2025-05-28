
import React, { useEffect } from 'react';
import NavbarEmp from '../components/layout/NavbarEmp';
import Footer from '../components/layout/Footer';

const IndexEmp = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarEmp />
      <main className="flex-grow">
      </main>
      <Footer />
    </div>
  );
};

export default IndexEmp;
