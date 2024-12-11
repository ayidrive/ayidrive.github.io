function closeForm(){
    const contactForm = document.getElementById('contactForm');
    contactForm.style.display = 'none';
}
function konekte(){
    const enskri = document.getElementById('signup-form')
    const konekte = document.getElementById('login-form')
    enskri.style.display = 'none';
    konekte.style.display = 'block';
}

function enskri(){
    const enskri = document.getElementById('signup-form')
    const konekte = document.getElementById('login-form')
    enskri.style.display = 'block';
    konekte.style.display = 'none';
}