export const targetManager = {
    get: () => parseInt(localStorage.getItem('yearlyTarget')) || 1200,
    set: (value) => localStorage.setItem('yearlyTarget', value)
};