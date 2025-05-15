import dotenv from 'dotenv';

// Завантажуємо змінні середовища
dotenv.config();

// Функція для отримання значення змінної середовища з можливістю встановлення значення за замовчуванням
const getEnvValue = (key: string, defaultValue: string): string => {
    const value = process.env[key];
    // Виводимо попередження, якщо змінна не встановлена в production середовищі
    if (value === undefined && process.env.NODE_ENV === 'production') {
        console.warn(
            `Попередження: змінна середовища ${key} не встановлена, використовуємо значення за замовчуванням`,
        );
    }
    return value !== undefined ? value : defaultValue;
};

// Експортуємо змінні середовища з типізацією та значеннями за замовчуванням
export const NODE_ENV: string = getEnvValue('NODE_ENV', 'development');
export const PORT: number = parseInt(getEnvValue('PORT', '5000'), 10);
export const MONGODB_URI: string = getEnvValue('MONGODB_URI', 'mongodb://localhost:27017/wisents');
