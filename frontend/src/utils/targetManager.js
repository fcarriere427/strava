export const targetManager = {
    get: () => parseInt(localStorage.getItem('yearlyTarget')) || 1000,
    set: (value) => localStorage.setItem('yearlyTarget', value)
};