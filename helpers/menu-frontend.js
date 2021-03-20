// Devolveremos el menú en todos los sitios donde devolvemos el token: login, googleSignin y renewToken
const getMenuFrontEnd = (role) => {
    const menu = [
        {
          title: 'Dashboard',
          icon: 'mdi mdi-gauge',
          elements: [
            { title: 'Main', url: 'dashboard' },
            { title: 'Gráfica 1', url: 'grafica1' },
            { title: 'Progress', url: 'progress' },
            { title: 'Promesas', url: 'promesas' },
            { title: 'rxJS', url: 'rxjs' },
          ]
        },
        {
          title: 'Mantenimiento',
          icon: 'mdi mdi-folder-lock-open',
          elements: [
            // { title: 'Usuarios', url: 'usuarios' },
            { title: 'Hospitales', url: 'hospitales' },
            { title: 'Médicos', url: 'medicos' },
          ]
        }
    ];
    if (role === "ADMIN_ROLE") {
        menu[1].elements.unshift({ title: 'Usuarios', url: 'usuarios' });
    }
    return menu;
};

module.exports = {
    getMenuFrontEnd
};