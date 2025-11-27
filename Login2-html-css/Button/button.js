let boton = document.querySelector('a');
boton.addEventListener('mousemove', e =>{
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX * 2.5- rect.left;
    boton.style.setProperty('--x', x + 'deg'); 
})