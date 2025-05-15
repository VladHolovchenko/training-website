import { Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "Зубр"
interface IWisent {
    name: string; // Ім'я зубра
    age: number; // Вік зубра у роках
    height: number; // Висота зубра в сантиметрах
    weight: number; // Вага зубра в кілограмах
    hornLength: number; // Довжина рогів в сантиметрах
    gender: 'male' | 'female'; // Стать зубра: 'male' - самець, 'female' - самка
    description?: string; // Опис зубра (необов'язкове поле)
    dateAdded: Date; // Дата додавання запису до бази даних
}

// Схема MongoDB для моделі "Зубр"
const wisentSchema = new Schema<IWisent>({
    name: {
        type: String,
        required: true, // Поле є обов'язковим
    },
    age: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    height: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    weight: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    hornLength: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    gender: {
        type: String,
        required: true, // Поле є обов'язковим
        enum: ['male', 'female'], // Допустимі значення: 'male' або 'female'
    },
    description: String, // Необов'язкове текстове поле
    dateAdded: {
        type: Date,
        default: Date.now, // Значення за замовчуванням - поточна дата і час
    },
});

// Створення моделі Mongoose на основі схеми
export const Wisent = model<IWisent>('Wisent', wisentSchema);
export type { IWisent }; // Експортуємо інтерфейс для використання в інших файлах
