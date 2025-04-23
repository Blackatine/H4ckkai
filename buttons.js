document.querySelectorAll('.control-button, .command-button, .send-button').forEach(button => {
    button.addEventListener('click', function(e) {
        let ripple = document.createElement('span');
        ripple.classList.add('button-ripple');
        
        let rect = this.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

document.getElementById('theme-toggle-footer').addEventListener('click', toggleTheme);

// Function to toggle theme
function toggleTheme(event) {
    const target = event.target;
    let newTheme;

    if (target.classList.contains('fa-moon')) {
        newTheme = 'dark-theme';
    } else if (target.classList.contains('fa-sun')) {
        newTheme = 'light-theme';
    } else if (target.classList.contains('fa-desktop')) {
        newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light-theme';
    }

    if (newTheme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
    }
}

// Add keydown event listener
document.addEventListener('keydown', (e) => {
    if (e.key === 't') { // Change 't' to any key you prefer
        toggleTheme({ target: document.querySelector('.fa-moon') }); // Default to moon icon
    }
});

// Create the custom cursor element
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

// Update cursor position on mouse move
document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
}); 